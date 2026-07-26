import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useCrudManager } from '@/Hooks/useCrudManager';
import { useTranslations } from '@/Hooks/useTranslations';
import { CrudPageProps } from '@/Types/crud';
import { getGridColSpan } from '@/Utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Map,
  MapPin,
  Navigation,
  Phone,
  Save,
  Settings,
  Warehouse,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const DistributionHubSaveForm: React.FC<CrudPageProps> = (props) => {

  let { config, item: hub = null, locationTreeDependencyInputs = [], lastLocationTreeLevel, locationRoutePrefix } = props;


  const isUpdate = !!hub;
  hub = hub?.data || {};

  const hubSchema = z.object(config?.formValidationRules);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    depot: true,
    locations: true,
    contact: false,
    address: false,
    coordinates: false,
  });

  // Lazy loading states for LOCATIONS (single select)
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationPage, setLocationPage] = useState(1);
  const [locationHasMore, setLocationHasMore] = useState(true);

  // Location tree dependency states
  const [locationStates, setLocationStates] = useState<Record<string, any>>(() => {
    const initialState: Record<string, any> = {};
    locationTreeDependencyInputs.forEach((input: any) => {
      initialState[input.key] = {
        options: input.options || [],
        loading: false,
        search: '',
        page: 1,
        hasMore: true,
        selectedValue: null,
      };
    });
    return initialState;
  });

  const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
  const depotFields = config?.form?.fields.filter((f: any) => f.section === 'depot');
  const locationFields = config?.form?.fields.filter((f: any) => f.section === 'locations');
  const contactFields = config?.form?.fields.filter((f: any) => f.section === 'contact');
  const addressFields = config?.form?.fields.filter((f: any) => f.section === 'address');
  const coordinateFields = config?.form?.fields.filter((f: any) => f.section === 'coordinates');

  type DistributionHubFormType = z.infer<typeof hubSchema>;

  const form = useForm<DistributionHubFormType>({
    resolver: zodResolver(hubSchema),
    defaultValues: {
      name: hub?.name || '',
      code: hub?.code || '',
      hub_type: hub?.hub_type || '',
      status: hub?.status || 'active',
      distribution_depot_id: hub?.distributionDepot?.id?.toString() || '',
      location_tree_item_id: hub?.locationTreeItem?.id?.toString() || '',
      contact_person: hub?.contact_person || '',
      contact_phone: hub?.contact_phone || '',
      contact_email: hub?.contact_email || '',
      address_line_1: hub?.address_line_1 || '',
      address_line_2: hub?.address_line_2 || '',
      city: hub?.city || '',
      state: hub?.state || '',
      postal_code: hub?.postal_code || '',
      latitude: hub?.latitude || '',
      longitude: hub?.longitude || '',
    },
  });

  // Watch form values for dependency handling
  const watchedValues = form.watch();

  // Load locations on mount
  useEffect(() => {
    loadLocations();
  }, []);

  // Load locations function (SINGLE SELECT)
  const loadLocations = async (search = '', append = false) => {
    if (locationLoading) return;

    setLocationLoading(true);
    try {
      const response = await axios.get(route(`${locationRoutePrefix}.search`, {
        location_tree_id: lastLocationTreeLevel?.id,
        exclude_location: true,
        ignored_hub_id: isUpdate ? hub?.id : null
      }), {
        params: {
          search: search,
          page: append ? locationPage + 1 : 1,
        },
      });

      const newOptions = response.data?.data?.data || [];

      if (append) {
        setLocationOptions((prev) => [...prev, ...newOptions]);
        setLocationPage((prev) => prev + 1);
      } else {
        setLocationOptions(newOptions);
        setLocationPage(1);
      }

      setLocationHasMore(newOptions.length >= 10);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationSearch = (search: string) => {
    setLocationSearch(search);
    setLocationPage(1);
    loadLocations(search, false);
  };

  const handleLocationScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && locationHasMore && !locationLoading) {
      loadLocations(locationSearch, true);
    }
  };

  // Pre-populate on edit
  useEffect(() => {
    if (hub && isUpdate) {
      form.reset({
        name: hub?.name || '',
        code: hub?.code || '',
        hub_type: hub?.hub_type || '',
        status: hub?.status || 'active',
        distribution_depot_id: hub?.distributionDepot?.id?.toString() || '',
        location_tree_item_id: hub?.locationTreeItem?.id?.toString() || '',
        contact_person: hub?.contact_person || '',
        contact_phone: hub?.contact_phone || '',
        contact_email: hub?.contact_email || '',
        address_line_1: hub?.address_line_1 || '',
        address_line_2: hub?.address_line_2 || '',
        city: hub?.city || '',
        state: hub?.state || '',
        postal_code: hub?.postal_code || '',
        latitude: hub?.latitude || '',
        longitude: hub?.longitude || '',
      });

      // Pre-populate selected location
      if (hub?.locationTreeItem) {
        setLocationOptions([
          {
            value: hub.locationTreeItem.id.toString(),
            label: hub.locationTreeItem.name,
          },
        ]);
      }
    }
  }, [hub, isUpdate, form]);

  const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset({
          name: '',
          code: '',
          hub_type: '',
          status: 'active',
          distribution_depot_id: '',
          location_tree_item_id: '',
          contact_person: '',
          contact_phone: '',
          contact_email: '',
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          postal_code: '',
          latitude: '',
          longitude: '',
        });
        form.clearErrors();
        setLocationOptions([]);
        loadLocations();
      }
    },
  });

  const onSubmit = (data: DistributionHubFormType) => {
    isUpdate ? update(hub?.uuid, data) : create(data);
  };

  const { t } = useTranslations();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'basic':
        return <Warehouse className="w-5 h-5 text-purple-500" />;
      case 'depot':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'locations':
        return <Map className="w-5 h-5 text-indigo-500" />;
      case 'contact':
        return <Phone className="w-5 h-5 text-pink-500" />;
      case 'address':
        return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'coordinates':
        return <Navigation className="w-5 h-5 text-green-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderFieldsForSection = (fields: any[], section: string) => {
    if (!fields?.length) return null;

    const formData = form.getValues();
    const visibleFields = fields.filter((f) => (f.conditional ? f.conditional(formData) : true));

    if (visibleFields.length === 0) return null;

    // Process fields to inject lazy load data
    const processedFields = visibleFields.map((field) => {
      // Handle location_tree_item_id field (SINGLE SELECT with lazy load)
      if (field.name === 'location_tree_item_id') {
        return {
          ...field,
          options: locationOptions,
          onSearch: handleLocationSearch,
          onScroll: handleLocationScroll,
          loading: locationLoading,
          searchable: true,
          lazyLoad: true,
        };
      }

      // Handle location tree dependency fields
      const locationState = locationStates[field.name];
      if (locationState) {
        return {
          ...field,
          options: locationState.options,
          loading: locationState.loading,
        };
      }

      return field;
    });

    return (
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSectionIcon(section)}
              <CardTitle className="text-base capitalize">
                {section === 'basic'
                  ? t('Basic Information')
                  : section === 'depot'
                    ? t('Depot Assignment')
                    : section === 'locations'
                      ? t('Location Assignment')
                      : section === 'contact'
                        ? t('Contact Information')
                        : section === 'address'
                          ? t('Address Information')
                          : section === 'coordinates'
                            ? t('Geographic Coordinates')
                            : section}
              </CardTitle>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''
                }`}
            />
          </div>
        </CardHeader>
        {expandedSections[section] && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedFields.map((field: any, index: number) => (
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
    );
  };

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* BASIC INFORMATION SECTION */}
        {renderFieldsForSection(basicFields, 'basic')}

        {/* DEPOT ASSIGNMENT SECTION */}
        {renderFieldsForSection(depotFields, 'depot')}

        {/* LOCATION ASSIGNMENT SECTION */}
        {renderFieldsForSection(locationFields, 'locations')}

        {/* CONTACT INFORMATION SECTION */}
        {renderFieldsForSection(contactFields, 'contact')}

        {/* ADDRESS INFORMATION SECTION */}
        {renderFieldsForSection(addressFields, 'address')}

        {/* COORDINATES SECTION */}
        {renderFieldsForSection(coordinateFields, 'coordinates')}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t px-6 -mx-6">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? t('Update Hub') : t('Create Hub')}
              loaderText={isUpdate ? t('Updating...') : t('Creating...')}
              icon={<Save className="w-4 h-4" />}
            />
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() =>
              router.visit(route(config.routes.index, config?.routeParams?.index || null))
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('Back to Hubs')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DistributionHubSaveForm;