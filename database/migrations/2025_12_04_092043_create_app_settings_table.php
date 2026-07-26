<?php

use App\Enums\Common\Status;
use App\Enums\Settings\InputEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('app_settings', function (Blueprint $table) {
			$table->id();
			$table->string('title', 191)->unique();
			$table->string('slug', 191)->unique();
			$table->unsignedBigInteger('parent_id')->nullable()->index();
			$table->integer('order_index')->default(0);
			$table->string('description')->nullable();
			$table->enum('input_type', InputEnum::getValues())->nullable();
			$table->text('default_value')->nullable();
			$table->text('input_options')->nullable();
			$table->text('setting_value')->nullable();
			$table->enum('status', Status::getValues())
						  ->default(Status::ACTIVE);

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('app_settings');
	}
};
