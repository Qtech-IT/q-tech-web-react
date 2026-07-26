<?php

namespace App\Policies;

use App\Models\User;

class LanguagePolicy
{
	public function viewAny(User $user): bool
	{
		return $user->hasPermissionTo('language.view');
	}

	public function view(User $user): bool
	{
		return $user->hasPermissionTo('language.view');
	}

	public function create(User $user): bool
	{
		return $user->hasPermissionTo('language.create');
	}

	public function update(User $user): bool
	{
		return $user->hasPermissionTo('language.edit');
	}

	public function delete(User $user): bool
	{
		return $user->hasPermissionTo('language.delete');
	}

	public function translate(User $user): bool
	{
		return $user->hasPermissionTo('language.translate');
	}
}
