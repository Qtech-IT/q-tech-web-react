<?php

namespace App\Traits\Common;

use App\Enums\Common\PaginationType;
use App\Enums\Common\QueryFormat;
use App\Enums\Common\Status;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use function PHPUnit\Framework\isNumeric;

/**
 * Trait Filterable
 *
 * Provides reusable query scopes for:
 * - Soft-deleted (recycled) records
 * - Search and filter (including relational)
 * - Date range filtering
 * - Fetching results as collection or paginated
 */
trait Filterable
{
	/**
	 * Scope to get only soft-deleted records when 'is_trash' exists in request.
	 *
	 * @param Builder $q
	 * @return Builder
	 */
	public function scopeRecycle(Builder $q): Builder
	{
		return $q->when(
		    request()->has('is_trash'),
		    fn (Builder $query): Builder => $query->onlyTrashed()
		);
	}

	/**
	 * Summary of scopeActive
	 * @param \Illuminate\Database\Eloquent\Builder $q
	 * @return Builder
	 */
	public function scopeActive(Builder $q): Builder
	{
		return $q->where('status', Status::ACTIVE);
	}

	/**
	 * Summary of scopeInActive
	 * @param \Illuminate\Database\Eloquent\Builder $q
	 * @return Builder
	 */
	public function scopeInactive(Builder $q): Builder
	{
		return $q->where('status', Status::INACTIVE);
	}

	/**
	 * Scope to apply search filters on model attributes or relational columns.
	 *
	 * @param Builder $query
	 * @param array $params Columns or relations to search
	 * @param bool $like Use LIKE pattern or exact match
	 * @return Builder
	 */
	public function scopeSearch(Builder $query, array $params, bool $like = true): Builder
	{
		$search = request()->input('search');

		if (!$search) {
			return $query;
		}

		$searchValue = $like ? "%$search%" : $search;

		return $query->where(function (Builder $q) use ($params, $searchValue) {
			foreach ($params as $param) {
				if (strpos($param, ':') !== false) {
					$this->searchRelationalData($q, $param, $searchValue);
				} else {
					$q->orWhere($param, 'LIKE', $searchValue);
				}
			}
		});
	}

	/**
	 * Scope to filter model attributes or relational data based on request inputs.
	 *
	 * @param Builder $query
	 * @param array $params Filterable columns or relations
	 * @return Builder
	 */
	public function scopeFilter(Builder $query, array $params, string $separator = ','): Builder
	{
		$filters = array_keys(request()->all());

		foreach ($params as $param) {
			if (strpos($param, ':') !== false) {
				$this->filterRelationalData($query, $param, $filters, $separator);
			} elseif (in_array($param, $filters) && request()->input($param) !== null) {
				$value = request()->input($param);

				if (is_string($value) && str_contains($value, $separator)) {
					$value = string_to_array($value, $separator);
				}

				$query->when(
				    is_array($value),
				    fn (Builder $q) => $q->whereIn($param, $value),
				    fn (Builder $q) => $q->where($param, $value)
				);
			}
		}

		return $query;
	}

	/**
	 * Apply multiple boolean filters from request dynamically.
	 *
	 * @param Builder $query
	 * @param array $fields Key = request field, Value = actual column (optional)
	 * @param array $nullableColumns Columns that need null/not null check instead of boolean
	 * @param string $separator Separator for multiple values (default '|')
	 * @return Builder
	 */
	public function scopeBooleanFilters(
	    Builder $query,
	    array $fields,
	    array $nullableColumns = ['email_verified_at'],
	    string $separator = '|'
	): Builder {
		foreach ($fields as $requestField => $column) {
			$column ??= $requestField;

			if (isNumeric($requestField)) {
				$requestField = $column;
			}

			if (!request()->filled($requestField)) {
				continue;
			}

			$values = array_map(
			    fn ($v) => filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
			    string_to_array(request()->input($requestField), $separator)
			);

			if (empty($values)) {
				continue;
			}

			$query->where(function ($q) use ($values, $column, $nullableColumns) {
				if (in_array($column, $nullableColumns, true)) {
					if (in_array(true, $values, true)) {
						$q->orWhereNotNull($column);
					}
					if (in_array(false, $values, true)) {
						$q->orWhereNull($column);
					}
				} else {
					if (in_array(true, $values, true)) {
						$q->orWhere($column, true);
					}
					if (in_array(false, $values, true)) {
						$q->orWhere($column, false);
					}
				}
			});
		}

		return $query;
	}

	/**
	 * Scope to filter by date range for a given column.
	 *
	 * @param Builder $query
	 * @param string $column
	 * @return Builder
	 */
	public function scopeDate(Builder $query, string $column = 'created_at'): Builder
	{
		$dateRangeString = request()->input('date_range');

		// @dd($dateRangeString);

		if (!$dateRangeString) {
			return $query;
		}

		try {
			if (str_contains($dateRangeString, ' - ')) {
				[$from, $to] = explode(' - ', $dateRangeString);
				$startDate   = Carbon::createFromFormat('m/d/Y', trim($from))->startOfDay();
				$endDate     = Carbon::createFromFormat('m/d/Y', trim($to))->endOfDay();

				return $query->whereBetween($column, [$startDate, $endDate]);
			}
		} catch (\Throwable $th) {
		}

		return $query;
	}

	/**
	 * Scope to fetch results as either a collection or paginated response.
	 *
	 * @param Builder|null $query
	 * @return Collection|LengthAwarePaginator|CursorPaginator
	 */
	public function scopeFetch(?Builder $query = null, bool $isCollectionView = false, ?string $paginationType = null): Collection|LengthAwarePaginator|CursorPaginator
	{
		$query = $query ?? $this->newQuery();
		return $this->fetchResults(query: $query, isCollectionView:$isCollectionView, paginationType: $paginationType);
	}

	/**
	 * Fetch query results either as collection or paginated.
	 *
	 * @param Builder $query
	 * @param string $paramKey Request query key to determine fetch type
	 * @param string $expectedValue Value that triggers collection fetch
	 * @param int|null $perPage Number of items per page (uses paginateNumber() if null)
	 * @param string $paginationType Type of pagination: 'paginate' (default) or 'cursor'
	 * @return Collection|LengthAwarePaginator|CursorPaginator
	 */
	private function fetchResults(
	    Builder $query,
	    string $paramKey = 'format',
	    ?int $perPage = null,
	    ?string $paginationType = null,
	    ?bool $isCollectionView = false,
	): Collection|LengthAwarePaginator|CursorPaginator {
		$isCollection = request()->query($paramKey, QueryFormat::PAGINATED->value) === QueryFormat::COLLECTION->value || $isCollectionView ;

		if ($isCollection) {
			return $query->get();
		}

		$perPage = $perPage ?? paginateNumber();

		return match ($paginationType) {
			PaginationType::CURSOR->value => $query->cursorPaginate($perPage)->appends(request()->all()),
			default                       => $query->paginate($perPage)->appends(request()->all()),
		};
	}

	/**
	 * Search relational data for a given relation and columns.
	 *
	 * @param Builder $query
	 * @param string $relations Relation:columns format
	 * @param string $search
	 * @return Builder
	 */
	private function searchRelationalData(Builder $query, string $relations, string $search): Builder
	{
		[$relation, $columns] = explode(':', $relations);
		foreach (explode(',', $columns) as $column) {
			$query->orWhereHas($relation, fn (Builder $q) => $q->where($column, 'like', $search));
		}
		return $query;
	}

	/**
	 * Summary of filterRelationalData
	 * @param Builder $query
	 * @param string $relations
	 * @param array $filters
	 * @param string $separator
	 * @return Builder
	 */
	private function filterRelationalData(Builder $query, string $relations, array $filters, string $separator = ','): Builder
	{
		[$relation, $columns] = explode(':', $relations);

		foreach (explode(',', $columns) as $column) {
			$value = request()->input($relation);

			if (is_string($value) && str_contains($value, $separator)) {
				$value = string_to_array($value, $separator);
			}

			if (in_array($relation, $filters) && request()->input($relation) !== null) {
				$query
				  ->whereHas($relation, fn (Builder $q): Builder => $q->when(
				      is_array($value),
				      fn (Builder $q): Builder => $q->whereIn($column, $value),
				      fn (Builder $q): Builder => $q->where($column, $value)
				  ));
			}
		}
		return $query;
	}

	/**
	 * Apply sorting to the query.
	 *
	 * @param Builder $query
	 * @param string|null $column Optional column to sort by. If null, use request()->input('sort_by') or default.
	 * @param string|null $direction Optional direction. If null, use request()->input('sort_direction') or default.
	 * @return Builder
	 */
	public function scopeSortDefault(Builder $query, ?string $column = null, ?string $direction = null): Builder
	{
		// Use passed column or request or default
		$sortBy = $column ?? request()->input('sort_by', 'created_at');

		// Use passed direction or request or default
		$sortDirection = strtolower(request()->input('sort_direction', $direction));

		// Validate direction
		if (!in_array($sortDirection, ['asc', 'desc'])) {
			$sortDirection = 'desc';
		}

		return $query->orderBy($sortBy, $sortDirection);
	}
}
