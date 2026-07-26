import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { Input } from '@/Components/UI/Input';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Minus,
  Save,
  Search,
  Shield
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const RoleSaveForm: React.FC<CrudPageProps> = (props: any) => {

  const { config, item: role = null } = props;
  const isUpdate = !!role;
  const roleData = role?.data || {};
  const permissions: any = props?.permissions || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    roleData?.permissions?.map((p: any) => p.id) || []
  );

  const roleSchema = z.object(config?.formValidationRules || {});
  type RoleFormType = z.infer<typeof roleSchema>;

  const form = useForm<RoleFormType>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: roleData?.name || '',
      display_name: roleData?.display_name || '',
      description: roleData?.description || '',
      order_index: roleData?.order_index || 1,
      status: roleData?.status || 'active',
      type: roleData?.type || 'default',
      permissions: selectedPermissions,
    },
  });

  const { t } = useTranslations();
  const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset();
        setSelectedPermissions([]);
      }
    },
  });

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;

    const query = searchQuery.toLowerCase();
    const filtered: any[] = [];

    permissions.forEach((group: any) => {
      if (group.display_name.toLowerCase().includes(query)) {
        filtered.push(group);
        return;
      }

      const filteredChildren: Record<string, any> = {};
      Object.entries(group.children || {}).forEach(([key, subGroup]: [string, any]) => {
        if (subGroup.display_name.toLowerCase().includes(query)) {
          filteredChildren[key] = subGroup;
          return;
        }

        if (subGroup.children) {
          const filteredSubChildren: Record<string, any> = {};
          Object.entries(subGroup.children).forEach(([subKey, perm]: [string, any]) => {
            if (
              perm.display_name.toLowerCase().includes(query) ||
              perm.name.toLowerCase().includes(query)
            ) {
              filteredSubChildren[subKey] = perm;
            }
          });

          if (Object.keys(filteredSubChildren).length > 0) {
            filteredChildren[key] = {
              ...subGroup,
              children: filteredSubChildren,
            };
          }
        }
      });

      if (Object.keys(filteredChildren).length > 0) {
        filtered.push({
          ...group,
          children: filteredChildren,
        });
      }
    });

    return filtered;
  }, [permissions, searchQuery]);




  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Get all permissions from a group
  const getGroupPermissions = (group: any): number[] => {
    const perms: number[] = [];
    Object.values(group.children || {}).forEach((subGroup: any) => {
      Object.values(subGroup.children || {}).forEach((perm: any) => {
        if (perm.id) perms.push(perm.id);
      });
    });
    return perms;
  };

  // Get all permissions from a sub-group
  const getSubGroupPermissions = (subGroup: any): number[] => {
    const perms: number[] = [];
    Object.values(subGroup.children || {}).forEach((perm: any) => {
      if (perm.id) perms.push(perm.id);
    });
    return perms;
  };

  // Check states
  const isGroupFullyChecked = (group: any) => {
    const perms = getGroupPermissions(group);
    return perms.length > 0 && perms.every((p) => selectedPermissions.includes(p));
  };

  const isGroupPartiallyChecked = (group: any) => {
    const perms = getGroupPermissions(group);
    return (
      perms.some((p) => selectedPermissions.includes(p)) &&
      !perms.every((p) => selectedPermissions.includes(p))
    );
  };

  const isSubGroupFullyChecked = (subGroup: any) => {
    const perms = getSubGroupPermissions(subGroup);
    return perms.length > 0 && perms.every((p) => selectedPermissions.includes(p));
  };

  const isSubGroupPartiallyChecked = (subGroup: any) => {
    const perms = getSubGroupPermissions(subGroup);
    return (
      perms.some((p) => selectedPermissions.includes(p)) &&
      !perms.every((p) => selectedPermissions.includes(p))
    );
  };

  // Toggle functions
  const toggleGroupPermissions = (group: any) => {
    const perms = getGroupPermissions(group);
    const isFullyChecked = isGroupFullyChecked(group);

    let updated = [...selectedPermissions];
    if (isFullyChecked) {
      updated = updated.filter((p) => !perms.includes(p));
    } else {
      updated = [...new Set([...updated, ...perms])];
    }
    setSelectedPermissions(updated);
    form.setValue('permissions', updated as any);
  };

  const toggleSubGroupPermissions = (subGroup: any) => {
    const perms = getSubGroupPermissions(subGroup);
    const isFullyChecked = isSubGroupFullyChecked(subGroup);

    let updated = [...selectedPermissions];
    if (isFullyChecked) {
      updated = updated.filter((p) => !perms.includes(p));
    } else {
      updated = [...new Set([...updated, ...perms])];
    }
    setSelectedPermissions(updated);
    form.setValue('permissions', updated as any);
  };

  const togglePermission = (permId: number) => {
    let updated = [...selectedPermissions];
    if (updated.includes(permId)) {
      updated = updated.filter((id) => id !== permId);
    } else {
      updated = [...updated, permId];
    }
    setSelectedPermissions(updated);
    form.setValue('permissions', updated as any);
  };

  const onSubmit = (data: RoleFormType) => {
    const formDataWithPermissions = {
      ...data,
      permissions: selectedPermissions,
    };
    isUpdate ? update(roleData?.id, formDataWithPermissions) : create(formDataWithPermissions);
  };


  const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
  const gridFields = config?.form?.fields.filter((f: any) => f.section === 'grid');



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <CardTitle>{t('Basic Information')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {basicFields?.map((field: any, index: Number) => (

              <DynamicInputWrapper
                key={field.name || index}
                field={field}
                form={form}
                isSubmitting={isSubmitting}
                serverErrors={serverErrors}
              />

            ))}


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {gridFields?.map((field: any, index: Number) => (

                <DynamicInputWrapper
                  key={field.name || index}
                  field={field}
                  form={form}
                  isSubmitting={isSubmitting}
                  serverErrors={serverErrors}
                />

              ))}

            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <CardTitle>{t('Permissions')}</CardTitle>
                <Badge className="ml-auto">
                  {selectedPermissions.length} {t('selected')}
                </Badge>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('Search permissions by name or group...')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPermissions?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('No permissions found')}
                </p>
              ) : (
                filteredPermissions?.map((group: any) => {
                  const isExpanded = expandedGroups[group.display_name];
                  const isFullyChecked = isGroupFullyChecked(group);
                  const isPartiallyChecked = isGroupPartiallyChecked(group);

                  return (
                    <div key={group.id} className="border rounded-lg overflow-hidden">
                      {/* Group Header */}
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          {/* Group Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleGroupPermissions(group)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isFullyChecked
                              ? 'bg-blue-500 border-blue-500'
                              : isPartiallyChecked
                                ? 'bg-blue-200 border-blue-400'
                                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                              }`}
                          >
                            {isFullyChecked && <Check className="w-3.5 h-3.5 text-white" />}
                            {isPartiallyChecked && <Minus className="w-3.5 h-3.5 text-blue-600" />}
                          </button>

                          {/* Group Title */}
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.display_name)}
                            className="flex-1 flex items-center justify-between hover:opacity-75 transition-opacity text-left"
                          >
                            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {group.display_name}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="bg-white dark:bg-slate-800 p-4 border-t space-y-4">
                          {Object.entries(group.children || {}).map(([subKey, subGroup]: [string, any]) => {
                            const subFullyChecked = isSubGroupFullyChecked(subGroup);
                            const subPartiallyChecked = isSubGroupPartiallyChecked(subGroup);

                            return (
                              <div key={subKey}>
                                {/* Sub-group Header */}
                                <div className="flex items-center gap-3 mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                  {/* Sub-group Checkbox */}
                                  <button
                                    type="button"
                                    onClick={() => toggleSubGroupPermissions(subGroup)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${subFullyChecked
                                      ? 'bg-blue-500 border-blue-500'
                                      : subPartiallyChecked
                                        ? 'bg-blue-200 border-blue-400'
                                        : 'border-slate-300 dark:border-slate-500 hover:border-slate-400'
                                      }`}
                                  >
                                    {subFullyChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                    {subPartiallyChecked && <Minus className="w-3.5 h-3.5 text-blue-600" />}
                                  </button>

                                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">
                                    {subGroup.display_name}
                                  </h4>
                                </div>

                                {/* Individual Permissions - Square Shape */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ml-2">
                                  {Object.entries(subGroup.children || {}).map(([permKey, perm]: [string, any]) => {
                                    const isChecked = selectedPermissions.includes(perm.id);

                                    return (
                                      <button
                                        key={permKey}
                                        type="button"
                                        onClick={() => togglePermission(perm.id)}
                                        className={`p-3 border-2 rounded text-left transition-all ${isChecked
                                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                          }`}
                                      >
                                        <div className="flex items-start gap-2">
                                          {isChecked && (
                                            <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                          )}
                                          <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                                              {perm.display_name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                              {perm.name}
                                            </p>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {serverErrors?.permissions && (
              <p className="text-sm font-medium text-destructive mt-4">
                {serverErrors.permissions}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? 'Update Role' : 'Create Role'}
              loaderText={isUpdate ? 'Updating...' : 'Creating...'}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() => router.visit(route(config.routes.index))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('Back')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleSaveForm;