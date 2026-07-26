<?php

use App\Enums\Notifications\NotificationChannel;
use App\Enums\Notifications\NotificationLogStatus;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('gateway_id')->nullable()->index();
            $table->string('receiver_model')->index()
                                                    ->nullable();

            $table->unsignedBigInteger('receiver_id')->index()
                                                    ->nullable();

            $table->longText('custom_data')->nullable();
            $table->longText('message');
            $table->longText('gateway_response')->nullable();

            $table->enum('status',NotificationLogStatus::getValues())->index();
            $table->enum('channel',NotificationChannel::getValues())->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_logs');
    }
};
