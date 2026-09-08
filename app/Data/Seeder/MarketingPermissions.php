<?php

namespace App\Data\Seeder;

class MarketingPermissions
{
    /**
     * @return array{marketing: array}
     */
    public static function getAll(): array
    {
        return [
            'marketing' => [
                'label' => ('Marketing'),
                'description' => ('Contact enquiries and newsletter subscribers'),
                'permissions' => [
                    'contact-submission' => [
                        'label' => ('Contact Enquiries'),
                        'permissions' => [
                            'view' => ('View Enquiries'),
                            'edit' => ('Update Enquiry Status'),
                            'delete' => ('Delete Enquiries'),
                            // Sending a templated reply is its own action —
                            // often the person who triages is not the person
                            // allowed to email a prospect from a company inbox.
                            'reply' => ('Send Templated Reply'),
                            'export' => ('Export Enquiries'),
                        ],
                    ],

                    'subscriber' => [
                        'label' => ('Newsletter Subscribers'),
                        'permissions' => [
                            'view' => ('View Subscribers'),
                            'edit' => ('Update Subscriber Status'),
                            'delete' => ('Delete Subscribers'),
                            'mail' => ('Send Bulk Mail'),
                            'export' => ('Export Subscribers'),
                        ],
                    ],
                ],
            ],
        ];
    }
}
