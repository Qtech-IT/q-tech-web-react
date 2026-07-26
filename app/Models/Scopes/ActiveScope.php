<?php

namespace App\Models\Scopes;

use App\Enums\Common\Status;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): Builder{
        return $builder->where("status", Status::ACTIVE);
    }
}
