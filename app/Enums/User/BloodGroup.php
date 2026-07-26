<?php

namespace App\Enums\User;

use App\Enums\EnumTrait;

enum BloodGroup: string
{
	use EnumTrait;

	case A_POSITIVE  = 'A+';
	case A_NEGATIVE  = 'A-';
	case B_POSITIVE  = 'B+';
	case B_NEGATIVE  = 'B-';
	case AB_POSITIVE = 'AB+';
	case AB_NEGATIVE = 'AB-';
	case O_POSITIVE  = 'O+';
	case O_NEGATIVE  = 'O-';

	/**
	 * Human-readable label
	 */
	public function label(): string
	{
		return match ($this) {
			self::A_POSITIVE  => 'A+ (Positive)',
			self::A_NEGATIVE  => 'A- (Negative)',
			self::B_POSITIVE  => 'B+ (Positive)',
			self::B_NEGATIVE  => 'B- (Negative)',
			self::AB_POSITIVE => 'AB+ (Positive)',
			self::AB_NEGATIVE => 'AB- (Negative)',
			self::O_POSITIVE  => 'O+ (Positive)',
			self::O_NEGATIVE  => 'O- (Negative)'
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
}
