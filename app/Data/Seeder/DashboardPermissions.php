<?php

namespace App\Data\Seeder;

class DashboardPermissions
{
    /**
     * Summary of getAll
     * @return array
     */
    public static function getAll(): array
    {
        return  [
             'dashboard' => [
                'label'       => ('Dashboard'),
                'description' => ('Dashboard overview & analytics'),
                'permissions' => [
                    'dashboard' => [
                        'label'       => ('Dashboard Access'),
                        'permissions' => [
                            'view' => ('View Dashboard')
                        ]
                    ]
                ]
            ],
        ];
    }
}
