<?php

namespace Database\Seeders;

use App\Data\Seeder\Languages;
use App\Enums\Settings\SettingKey;
use App\Enums\System\CacheKey;
use App\Http\Services\Backend\LanguageService;
use App\Models\AppSetting;
use App\Models\Language;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
           $settings = [
                            SettingKey::COMPANY_NAME->value     => 'TradeHub',
                            SettingKey::COMPANY_EMAIL->value    => 'tradehub@gmail.com',
                            SettingKey::COMPANY_PHONE->value    => '01572443',
                            SettingKey::DEFAULT_CURRENCY->value => 'USD',
                            SettingKey::CURRENCY_SYMBOL->value  => '$',
                        ];

            $now  = Carbon::now();
            $data = collect($settings)
                            ->map(fn ($value, $slug) => [
                                'slug'          => $slug,
                                'title'         => key_to_value($slug),
                                'setting_value' => $value,
                                'updated_at'    => $now,
                                'created_at'    => $now
                            ])->values()
                              ->all();

            AppSetting::upsert(
                $data,
                ['slug'],
                ['title', 'setting_value', 'updated_at']
            );

            Cache::forget(CacheKey::DEFAULT_SETTINGS->value);

            #SAVE SUPERADMIN ACCOUNT

            try {
                $data = [
                    'username' => 'superadmin',
                    'email'    => 'superadmin@gmail.com',
                    'name'     => 'Demo',
                    'phone'    => '016234124',
                    'password' => '123123123',
                ];
                DB::transaction(function() use($data){
                    #RUN ROLE PERMISSION SEEDER TO CREATE SUPERADMIN ROLE
                    Artisan::call('db:seed', [
                        '--class' => PermissionSeeder::class,
                        '--force' => true
                    ]);

                    Artisan::call('db:seed', [
                        '--class' => RoleSeeder::class,
                        '--force' => true
                    ]);

                    #RUN LANGUAGE SEEDER
                    Artisan::call('db:seed', [
                        '--class' => LanguageSeeder::class,
                        '--force' => true
                    ]);

                    #RUN LANGUAGE SEEDER
                    Artisan::call('db:seed', [
                        '--class' => NotificationTemplateSeeder::class,
                        '--force' => true
                    ]);

                    /***
                     * ######### CREATE SUPERADMIN
                     */

                    $user = User::firstOrCreate([
                        'username' => Arr::get($data, 'username'),
                        'email'    => Arr::get($data, 'email')
                    ], [
                        'name'            => Arr::get($data, 'name'),
                        'phone'           => Arr::get($data, 'phone'),
                        'password'        => Arr::get($data, 'password'),
                        'is_admin'        => true,
                        'is_kyc_verified' => true
                    ]);

                    $superadminRole = Role::where('is_super_admin', true)->first();

                    if (!$superadminRole) {
                        throw new \Exception(translate('Role superadmin does not exist. Run seeder first.'));
                    }

                    $user->assignRole($superadminRole);
                });
            } catch (\Exception $ex) {
                throw new \Exception(translate($ex->getMessage()));
            }
    }
}
