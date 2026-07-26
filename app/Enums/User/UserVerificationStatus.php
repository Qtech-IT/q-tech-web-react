<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum UserVerificationStatus: string
{
	use EnumTrait;

	case PROCESSING = 'processing';
	case REJECTED   = 'rejected';
	case APPROVED   = 'approved';

	/**
	 * Human-readable label
	 */
	public function label(): string
	{
		return match ($this) {
			self::PROCESSING => 'Processing',
			self::REJECTED   => 'Rejected',
			self::APPROVED   => 'Approved',
		};
	}

	/**
	 * Raw enum values
	 */
	public static function getValues(): array
	{
		return array_map(
			fn (self $case) => $case->value,
			self::cases()
		);
	}

	/**
	 * Get enum values except processing
	 */
	public static function getValuesExceptProcessing(): array
	{
		return array_map(
			fn (self $case) => $case->value,
			array_filter(
				self::cases(),
				fn (self $case) => $case !== self::PROCESSING
			)
		);
	}
}
