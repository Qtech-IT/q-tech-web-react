import {
    Newspaper
} from 'lucide-react';

import { DynamicForm } from '@/Components/Core/DynamicCrud/DynamicForm';
import StatusBadge from '@/Components/UI/StatusBadge';
import { useTranslations } from '@/Hooks/useTranslations';
import type { CrudConfig, CrudPageProps } from '@/Types/crud';
import { limitText } from '@/Utils/helpers';
import z from 'zod';

export function usePageConfig(props: CrudPageProps): CrudConfig {

    const { t } = useTranslations();

    const modelProperty = props?.modelProperty;
    const advanceFilterOptions = props?.advanceFilterOptions || [];
    const routePrefix = modelProperty?.routePrefix;


    const baseBreadcrumbs = [
        { label: t('Dashboard'), href: route('backend.dashboard') },
        { label: t('Pages'), href: route(`${routePrefix}.index`) },
    ];

    return {

        formComponent: DynamicForm,
        fetchToggle: true,
        form: {
            title: {
                create: t('Create Page'),
                edit: t('Edit Page'),
            },
            description: {
                create: t('Add a new Page to the system'),
                edit: t('Update Page information'),
            },
            submitButtonText: {
                create: t('Create Page'),
                edit: t('Update Page'),
            },

            fields: [
                {
                    name: 'title',
                    label: t('Title'),
                    type: 'text',
                    required: true,
                    section: 'basic',
                    validation: z.string().min(1, 'Title is required').max(191),
                    gridColumn: 'span 3'
                },
                {
                    name: 'content',
                    label: t('Content'),
                    type: 'richtext',
                    required: true,
                    section: 'basic',
                    validation: z.string().min(1, 'Content is required'),
                    gridColumn: 'span 3'
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
                    validation: z.string().min(1, 'Status is required'),
                    gridColumn: 'span 3'
                }
            ],
        },

        formValidationRules: {


        },

        resource: 'Page',
        resourcePlural: 'Pages',
        title: t('Pages'),
        description: t('Manage Page accounts and permissions'),

        routes: {
            index: `${routePrefix}.index`,
            create: `${routePrefix}.create`,
            edit: `${routePrefix}.edit`,
            store: `${routePrefix}.store`,
            update: `${routePrefix}.update`,
            destroy: `${routePrefix}.destroy`,
        },

        formDisplayMode: 'modal',
        viewDisplayMode: 'modal',
        statusType: 'binary',

        breadcrumbs: {
            index: [
                { label: t('Dashboard'), href: route('backend.dashboard') },
                { label: t('Pages'), href: null, active: true },
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
            searchPlaceholder: t('Search Pages by title ...'),
            sortable: true,
            defaultSort: 'created_at',
            defaultSortDirection: 'desc',
            emptyMessage: t('No Pages available. Create your first Page to get started.'),
            emptyMessageIcon: Newspaper,

            columns: [
                {
                    key: 'title',
                    label: t('Title'),
                    sortable: false,
                    filterable: true,
                    priority: 0,
                    render: (row: any) => (
                        <div className="text-sm text-gray-900 dark:text-gray-100">{limitText(row.title, 20)}</div>
                    )

                },

                {
                    key: 'status',
                    label: 'Status',
                    sortable: false,
                    filterable: false,
                    priority: 3,
                    render: (row: any) => {

                        return (
                            <>
                                <div className='mt-1.5'>
                                    <StatusBadge status={row.status} />
                                </div>
                            </>
                        );
                    },
                },

                {
                    key: 'created_at',
                    label: t('Created at'),
                    sortable: false,
                    priority: 4,
                    renderType: 'date',
                },
            ],

        },


        filters: {
            searchFields: ['title'],
            filterFields: advanceFilterOptions,
        },

        permissions: {
            actions: {
                create: 'policy-page.create',
                edit: 'policy-page.edit',
                view: 'policy-page.view',
                delete: 'policy-page.delete',
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
                    message: 'Cannot delete Page with existing orders',
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

            title: t(`Delete Page`),
            description: t(`Are you sure you want to delete this Page? This action cannot be undone.`),

        },

        labels: {
            singular: 'Page',
            plural: 'Pages',
            key: 'Page',
        },

        saveAlertInfo: {
            title: t('Page Account Configuration'),
            description: t('Fill in the details below to save the Page account. All fields marked as required must be completed.'),
        }
    }
};

