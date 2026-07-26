import {
    Camera,
    Clock,
    Crown,
    Pencil,
    Shield,
    ShieldOff,
    UserCheck,
    UserIcon,
    Users,
    UserX
} from 'lucide-react';

import UserSaveForm from '@/Components/Forms/Backend/User/UserSaveForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import React from 'react';
import z from 'zod';

export function useSystemUserConfig(props: CrudPageProps): CrudConfig {

    const { t } = useTranslations();

    const modelProperty = props?.modelProperty;
    const advanceFilterOptions = props?.advanceFilterOptions || [];
    const routePrefix = modelProperty?.routePrefix;

    const { can } = usePermission();


    const baseBreadcrumbs = [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Users'), href: route(`${routePrefix}.index`) },
    ];



    return {

        formComponent: UserSaveForm,
        fetchToggle: true,
        form: {
            title: {
                create: t('Create User'),
                edit: t('Edit User'),
            },
            description: {
                create: t('Add a new user to the system'),
                edit: t('Update user information'),
            },
            submitButtonText: {
                create: t('Create User'),
                edit: t('Update User'),
            },

            fields: [
                {
                    name: 'name',
                    label: t('Name'),
                    type: 'text',
                    placeholder: t('Enter full name'),
                    required: true,
                    section: 'basic',
                    gridColumn: 'span 3'
                },
                {
                    name: 'username',
                    label: t('Username'),
                    type: 'text',
                    placeholder: t('Enter username'),
                    required: true,
                    section: 'basic',
                    gridColumn: 'span 3',
                    description: t('Username for login access'),

                },
                {
                    name: 'email',
                    label: t('Email Address'),
                    type: 'email',
                    placeholder: t('user@example.com'),
                    required: true,
                    description: t('Email for login and notifications'),
                    section: 'basic',
                    gridColumn: 'span 1',

                },
                {
                    name: 'phone',
                    label: t('Phone Number'),
                    type: 'phone',
                    placeholder: t('+1234567890'),
                    validation: z.string().optional(),
                    description: t('Contact phone number'),
                    section: 'basic',
                    gridColumn: 'span 1'

                },
                {
                    name: 'password',
                    label: t('Password'),
                    type: 'password',
                    placeholder: t('Enter password'),
                    required: true,
                    validation: z.string().min(6, t('Password must be at least 6 characters')).optional(),
                    description: t('Leave blank to keep current password (when editing)'),
                    section: 'basic',
                },


                {
                    name: 'status',
                    label: t('Status'),
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                    ],
                    section: 'basic',
                },
                {
                    name: 'is_kyc_verified',
                    label: t('KYC Verified'),
                    type: 'select',
                    required: true,
                    options: [
                        { value: 1, label: 'Yes' },
                        { value: 0, label: 'No' },
                    ],
                    section: 'basic',
                },

                {
                    name: 'image',
                    label: t('Profile Image'),
                    type: 'file',
                    description: t('Upload a profile picture'),
                    required: false,
                    icon: <Camera className="w-4 h-4" />,
                    validation: z.any().optional(),
                    accept: 'image/*',
                    preview: true,
                    gridColumn: 'span 2',
                    section: 'image',
                    previewImgDbKey: 'img_url'
                },

                // Address Section
                {
                    name: 'address.country',
                    label: t('Country'),
                    type: 'text',
                    placeholder: t('Enter country'),
                    gridColumn: 'span 3',
                    section: 'address',
                    description: t('Country name'),

                },
                {
                    name: 'address.street',
                    label: t('Street Address'),
                    type: 'text',
                    placeholder: t('Enter street address'),
                    gridColumn: 'span 3',
                    section: 'address',
                    description: t('Street address or building number'),

                },
                {
                    name: 'address.city',
                    label: t('City'),
                    type: 'text',
                    placeholder: t('Enter city'),
                    description: t('City name'),
                    section: 'address',
                    gridColumn: 'span 1'


                },
                {
                    name: 'address.state',
                    label: t('State/Province'),
                    type: 'text',
                    placeholder: t('Enter state'),
                    description: t('State or province'),
                    section: 'address'
                },
                {
                    name: 'address.postal_code',
                    label: t('Postal Code'),
                    type: 'text',
                    placeholder: t('Enter postal code'),
                    description: t('ZIP or postal code'),
                    section: 'address'
                }

            ],
        },
        formValidationRules: {
            name: z.string().min(1, 'Name is required').max(191),
            username: z.string().min(1, 'Username is required').max(191),
            email: z.string().email({ message: 'Invalid email' }).max(191),
            phone: z.string().optional(),
            password: z.string().optional(),
            status: z.string().min(1, 'Status is required').max(191),
            is_kyc_verified: z.any(),

            address: z.object({
                country: z.string().optional(),
                street: z.string().optional(),
                city: z.string().optional(),
                state: z.string().optional(),
                postal_code: z.string().optional(),
            }).optional(),
            image: z.any().optional()
        },
        resource: 'user',
        resourcePlural: 'users',
        title: t('Users'),
        description: t('Manage user accounts and permissions'),

        routes: {
            index: `${routePrefix}.index`,
            create: `${routePrefix}.create`,
            edit: `${routePrefix}.edit`,
            store: `${routePrefix}.store`,
            update: `${routePrefix}.update`,
            destroy: `${routePrefix}.destroy`,
            bulkAction: `${routePrefix}.bulk.action`,
            // updateStatus: `${routePrefix}.update.status`,
        },

        formDisplayMode: 'page',
        viewDisplayMode: 'page',
        statusType: 'binary',

        breadcrumbs: {
            index: [
                { label: t('Dashboard'), href: route('backend.dashboard') },
                { label: t('Users'), href: null, active: true },
            ],
            create: [
                ...baseBreadcrumbs,
                { label: t('Create'), href: null, active: true },
            ],
            update: [
                ...baseBreadcrumbs,
                { label: t('Update'), href: null, active: true },
            ],
        },

        table: {
            selectable: true,
            searchable: true,
            serializable: true,
            searchPlaceholder: t('Search users by name, email, phone...'),
            sortable: true,
            defaultSort: 'created_at',
            defaultSortDirection: 'desc',
            emptyMessage: t('No users available. Create your first user to get started.'),
            emptyMessageIcon: Users,

            bulkActions: [

                {
                    key: 'active',
                    permission: 'system-user.edit',
                },
                {
                    key: 'inactive',
                    permission: 'system-user.edit',
                }
            ],


            columns: [
                {
                    key: 'name',
                    label: t('User'),
                    sortable: true,
                    filterable: true,
                    priority: 0,
                    renderType: 'avatar',
                    defaultIcon: UserIcon,
                },
                {
                    key: 'username',
                    label: t('Username'),
                    sortable: false,
                    priority: 2,
                },
                {
                    key: 'email',
                    label: t('Contact'),
                    sortable: false,
                    filterable: true,
                    priority: 1,
                    render: (row: any) => (
                        <div className="space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">{row.email}</div>
                            {row.phone && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">{row.phone}</div>
                            )}
                        </div>
                    ),
                },


                {
                    key: 'winner_info',
                    label: t('Winner'),
                    sortable: false,
                    priority: 2,
                    render: (row: any) => {

                        const openWinnerModal = () => {
                            window.dispatchEvent(
                                new CustomEvent('open-winner-modal', {
                                    detail: {
                                        user_id: row.id,
                                        is_winner: row.is_winner,
                                        win_until: row.row_win_until,
                                    }
                                })
                            );
                        };

                        return (
                            <div className="flex items-center gap-2">

                                {/* STATUS */}
                                {row.is_winner ? (
                                    <div className="flex flex-col">
                                        <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                                            <Crown className="w-3 h-3" />
                                            {t('Winner')}
                                        </span>

                                        {row.win_until && (
                                            <span className="text-[12px] text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {row.win_until}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        {t('Not a Winner')}
                                    </span>
                                )}

                                {/* EDIT BUTTON */}

                                {
                                    can('system-user.edit') && (
                                        <button
                                            onClick={openWinnerModal}
                                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <Pencil className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )
                                }


                            </div>
                        );
                    }
                },

                {
                    key: 'kyc_verified',
                    label: t('KYC'),
                    sortable: false,
                    filterable: false,
                    priority: 2,
                    render: (row: any) => {
                        return (
                            <div className="flex flex-col gap-1">

                                <div className="flex items-center gap-1">
                                    {row.is_kyc_verified ? (
                                        <>
                                            <Shield className="w-3 h-3 text-blue-600" />
                                            <span className="text-xs text-blue-600">
                                                {t('Verified')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldOff className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">
                                                {t('Not Verified')}
                                            </span>
                                        </>
                                    )}
                                </div>

                            </div>
                        );
                    },
                },


                {
                    key: 'status',
                    label: 'Status',
                    render: (row: any) => {

                        const openStatusModal = () => {
                            window.dispatchEvent(
                                new CustomEvent('open-status-modal', {
                                    detail: {
                                        user_id: row.id,
                                        status: row.status,
                                    }
                                })
                            );
                        };

                        return (
                            <div className="flex items-center gap-2">

                                <StatusBadge status={row.status} />

                                {can('system-user.edit') && (
                                    <button
                                        onClick={openStatusModal}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                        title="Update Status"
                                    >
                                        <Pencil className="w-4 h-4 text-gray-600" />
                                    </button>
                                )}
                            </div>
                        );
                    },
                },

                {
                    key: 'creator',
                    label: t('Audit Info'),
                    sortable: false,
                    filterable: true,
                    priority: 1,
                    render: (row: any) => (
                        <div className="flex flex-col space-y-1.5">
                            {/* Created By */}
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                                <span className="text-gray-500 dark:text-gray-400">{t('Created By')}:</span>
                                <span>{row?.createdBy?.name ?? 'N/A'}</span>
                            </div>

                            {/* Updated By */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                <span className="text-gray-500 dark:text-gray-400">{t('Updated By')}:</span>
                                <span>{row?.updatedBy?.name ?? 'N/A'}</span>
                            </div>
                        </div>
                    ),
                },


                {
                    key: 'created_at',
                    label: t('Created at'),
                    sortable: true,
                    priority: 4,
                    renderType: 'date',
                },
            ],


        },

        stats: [
            {
                key: 'total',
                title: 'Total Users',
                icon: Users,
                iconColor: 'text-blue-600',
                iconBgColor: 'bg-blue-100 dark:bg-blue-900',
                description: 'All registered users'
            },
            {
                key: 'active',
                title: 'Active',
                icon: UserCheck,
                iconColor: 'text-green-600',
                iconBgColor: 'bg-green-100 dark:bg-green-900',
                description: 'Active users'

            },
            {
                key: 'inactive',
                title: 'Inactive',
                icon: UserX,
                iconColor: 'text-red-600',
                iconBgColor: 'bg-red-100 dark:bg-red-900',
                description: 'Inactive users'

            },
        ],


        filters: {
            searchFields: ['name', 'email', 'phone'],
            filterFields: advanceFilterOptions,
        },

        permissions: {
            actions: {
                create: 'system-user.create',
                edit: 'system-user.edit',
                view: 'system-user.view',
                delete: 'system-user.delete',
            },
        },

        actionConstraints: {
            delete: [
                {
                    field: 'is_owner',
                    checkValue: true,
                    message: 'Cannot delete owner account',
                },
                {
                    field: 'orders_count',
                    message: 'Cannot delete user with existing orders',
                },
            ],
            bulkDelete: [
                {
                    field: 'is_owner',
                    checkValue: true,
                    message: 'Cannot delete owner account',
                },
            ],
        },

        destroyDialogConfig: {

            title: t(`Delete user`),
            description: t(`Are you sure you want to delete this user? This action cannot be undone.`),
            itemName: {
                label: t('User Name'),
                key: 'name',
                render: (name: string) => name
            },

            itemType: 'User',
            warningMessage: t(`Deleting this user will permanently remove their account and all associated data.`),
            showWarningAlert: true,
            showItemDetails: true,
            itemDisplayFields: [
                {
                    label: t(`User Name`),
                    key: 'name',
                    className: 'font-semibold text-gray-900 dark:text-gray-100'
                },
                {
                    label: t('Email'),
                    key: 'email',
                    render: (email: string) => React.createElement(
                        'code',
                        {
                            className: 'px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        },
                        email
                    )
                },
                {
                    label: t('Status'),
                    key: 'status',
                    render: (status: string) => React.createElement(
                        'span',
                        {
                            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`
                        },
                        status
                    )
                },
                {
                    label: t('Created'),
                    key: 'created_at',
                    className: 'text-gray-600 dark:text-gray-400'
                }
            ]
        },

        labels: {
            singular: 'User',
            plural: 'Users',
            key: 'user',
        },

        saveAlertInfo: {
            title: t('User Account Configuration'),
            description: t('Fill in the details below to save the user account. All fields marked as required must be completed.'),
        }
    }
};

