<?php

namespace Database\Seeders;

use App\Constants\DefaultSettings;
use App\Enums\Common\Status;
use App\Enums\Settings\SettingKey;
use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

            //  $settings =  collect(DefaultSettings::get())
            //                 ->except(AppSetting::pluck('key')->toArray())
            //                 ->map(fn(mixed $value , string $key):array =>
            //                     array(
            //                             'slug'         => $key,
            //                             'value'       => $value,
            //                             'status'      => Status::ACTIVE,
            //                             'is_default'  => 1,
            //                             'created_at'  => now(),
            //                     )
            //                 )->values()
            //                  ->all();

            // if (!empty($settings)) {
            //     AppSetting::insert($settings);
            //     optimize_clear();
            // }
    }
}
