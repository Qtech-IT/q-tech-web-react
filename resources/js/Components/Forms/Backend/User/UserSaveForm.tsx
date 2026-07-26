
import { DynamicFormInput } from '@/Components/Core/DynamicCrud/DynamicFormInput';
import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { UserType } from '@/Types/User/user';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Save,
  Upload,
  User
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


export const UserSaveForm: React.FC<CrudPageProps> = (props) => {

  let {
    config,
    item: user = null,

  } = props;


  const isUpdate = !!user;
  user = user?.data || {};
  const role = (user && user?.roles) ? user?.roles?.at(0) : null;

  const userSchema = z.object(config?.formValidationRules);

  const [expandedAddress, setExpandedAddress] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);
  const previousTypeRef = useRef<string | null>(null);

  // Location Tree State

  const imageFields = config?.form?.fields.filter((f: any) => f.section === 'image');
  const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
  const addressFields = config?.form?.fields.filter((f: any) => f.section === 'address');


  // Initialize currentUserType from user data on mount
  useEffect(() => {
    if (user?.type) {
      setCurrentUserType(user.type);
      previousTypeRef.current = user.type;
    }
  }, []);

  // Load user's location tree data when editing
  useEffect(() => {
    if (isUpdate && user?.id && user?.type === 'default') {
      loadUserLocationTree();
    }
  }, [isUpdate, user?.id]);

  const loadUserLocationTree = async () => { };

  type UserFormType = z.infer<typeof userSchema>;

  const page = usePage();


  const defaultValuesObj = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    username: user?.username || '',
    status: user?.status || 'active',
    role_id: role ? role?.id.toString() : '',
    password: '',
    address: {
      country: user?.address?.country || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postal_code: user?.address?.postal_code || '',
    },
    image: null,
    is_kyc_verified: user?.is_kyc_verified ? 1 : 0,
  }

  const mergedDefaults = {
    ...defaultValuesObj
  };

  const form = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: mergedDefaults,
  });


  useEffect(() => {
    if (user && isUpdate) {
      form.reset(mergedDefaults);
    }
  }, [user, isUpdate]);


  const {
    create,
    update,
    isSubmitting,
    errors: serverErrors
  } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset({
          name: '',
          email: '',
          username: '',
          phone: '',
          password: '',
          role_id: '',
          status: 'active',

          address: {
            country: '',
            street: '',
            city: '',
            state: '',
            postal_code: '',
          },
          image: null,
        });
        document.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(input => {
          if (input) input.value = '';
        });
        form.clearErrors();

      }
    },
  });

  const onSubmit = (data: UserType) => {
    // Get the actual location_item_ids from form
    // Add location tree data to submission
    const submissionData = {
      ...data,
    };

    isUpdate ? update(user?.uuid, submissionData) : create(submissionData);
  };

  const { t } = useTranslations();



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <CardTitle>{t('Basic Information')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {basicFields?.map((field: any, index: number) => (
                <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                  <DynamicInputWrapper
                    field={field}
                    form={form}
                    isSubmitting={isSubmitting}
                    serverErrors={serverErrors}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedAddress(!expandedAddress)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <CardTitle>{t('Address Information')}</CardTitle>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${expandedAddress ? 'rotate-180' : ''}`}
              />
            </div>
          </CardHeader>
          {expandedAddress && (
            <CardContent className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addressFields?.map((field: any, index: number) => (
                  <div key={field.name || index} className={getGridColSpan(field.gridColumn)}>
                    <DynamicInputWrapper
                      field={field}
                      form={form}
                      isSubmitting={isSubmitting}
                      serverErrors={serverErrors}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-500" />
              <CardTitle>{t('Profile Image')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageFields?.map((field: any) => (
                <div key={field.name} className={getGridColSpan(field.gridColumn)}>
                  <FormField
                    control={form.control as any}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2" required={field.required}>
                          {field.icon}
                          {t(field.label)}
                        </FormLabel>
                        <FormControl>
                          <DynamicFormInput
                            field={field}
                            value={formField.value}
                            onChange={(val: any) => {
                              formField.onChange(val);
                              if (val && val instanceof File) {
                                const reader = new FileReader();
                              }
                            }}
                            error={(form.formState.errors as any)[field.name]?.message}
                            disabled={isSubmitting}
                            previewImgUrl={field?.previewImgDbKey ? (user as any)[field.previewImgDbKey] : null}
                          />
                        </FormControl>
                        {field.description && (
                          <FormDescription>{t(field.description)}</FormDescription>
                        )}
                        <FormMessage />
                        {serverErrors?.[field.name] && (
                          <p className="text-sm font-medium text-destructive">
                            {serverErrors[field.name]}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? 'Update User' : 'Create User'}
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

export default UserSaveForm;