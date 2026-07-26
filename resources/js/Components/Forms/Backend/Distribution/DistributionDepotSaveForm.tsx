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
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


export const DistributionDepotSaveForm: React.FC<CrudPageProps> = (props) => {

  let { config, item: depot = null, lastLocationTree, locationRoutePrefix } = props;

  const isUpdate = !!depot;
  depot = depot?.data || {};

  const depotSchema = z.object(config?.formValidationRules);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    contact: false,
    address: false,
    coordinates: false,
    locations: false,
  });

  // Lazy loading states for locations
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationPage, setLocationPage] = useState(1);
  const [locationHasMore, setLocationHasMore] = useState(true);

  const basicFields = config?.form?.fields.filter((f: any) => f.section === 'basic');
  const contactFields = config?.form?.fields.filter((f: any) => f.section === 'contact');
  const addressFields = config?.form?.fields.filter((f: any) => f.section === 'address');
  const coordinateFields = config?.form?.fields.filter((f: any) => f.section === 'coordinates');
  const locationFields = config?.form?.fields.filter((f: any) => f.section === 'locations');

  type DistributionDepotFormType = z.infer<typeof depotSchema>;

  const form = useForm<DistributionDepotFormType>({
    resolver: zodResolver(depotSchema),
    defaultValues: {
      name: depot?.name || '',
      code: depot?.code || '',
      status: depot?.status || 'active',
      contact_person: depot?.contact_person || '',
      contact_phone: depot?.contact_phone || '',
      contact_email: depot?.contact_email || '',
      address_line_1: depot?.address_line_1 || '',
      address_line_2: depot?.address_line_2 || '',
      city: depot?.city || '',
      state: depot?.state || '',
      postal_code: depot?.postal_code || '',
      latitude: depot?.latitude || '',
      longitude: depot?.longitude || '',
    },
  });

  useEffect(() => {
    if (depot && isUpdate) {
      form.reset({
        name: depot?.name || '',
        code: depot?.code || '',
        status: depot?.status || 'active',
        contact_person: depot?.contact_person || '',
        contact_phone: depot?.contact_phone || '',
        contact_email: depot?.contact_email || '',
        address_line_1: depot?.address_line_1 || '',
        address_line_2: depot?.address_line_2 || '',
        city: depot?.city || '',
        state: depot?.state || '',
        postal_code: depot?.postal_code || '',
        latitude: depot?.latitude || '',
        longitude: depot?.longitude || '',
      });

      // Pre-populate selected locations
      if (depot?.locations) {
        const selectedLocations = depot?.locations?.map((loc: any) => ({
          value: loc.id.toString(),
          label: loc.name,
        }));
        setLocationOptions(selectedLocations);
      }
    }
  }, [depot, isUpdate, form]);



  const loadLocations = async (search = '', append = false) => {
    if (locationLoading) return;

    setLocationLoading(true);

    // lastLocationTree  , locationRoutePrefix
    try {
      const response = await axios.get(route(`${locationRoutePrefix}.search`, { location_tree_id: lastLocationTree?.id }), {
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
    loadLocations(search, false);
  };

  const handleLocationScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && locationHasMore && !locationLoading) {
      loadLocations(locationSearch, true);
    }
  };

  const { create, update, isSubmitting, errors: serverErrors } = useCrudManager({
    config,
    onSuccess: (action) => {
      if (action === 'create') {
        form.reset({
          name: '',
          code: '',
          status: 'active',
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
      }
    },
  });

  const onSubmit = (data: DistributionDepotFormType) => {
    isUpdate ? update(depot?.uuid, data) : create(data);
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
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'contact':
        return <Phone className="w-5 h-5 text-purple-500" />;
      case 'address':
        return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'coordinates':
        return <Navigation className="w-5 h-5 text-green-500" />;
      case 'locations':
        return <Map className="w-5 h-5 text-indigo-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderFieldsForSection = (fields: any[], section: string) => {
    if (!fields?.length) return null;

    const formData = form.getValues();
    const visibleFields = fields.filter((f) => (f.conditional ? f.conditional(formData) : true));

    if (visibleFields.length === 0) return null;

    // Override options for location field with lazy-loaded data
    const processedFields = visibleFields.map((field) => {
      if (field.name === 'location_tree_item_ids') {
        return {
          ...field,
          options: locationOptions,
          onSearch: handleLocationSearch,
          onScroll: handleLocationScroll,
          loading: locationLoading,
          searchable: true,
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
                {section === 'basic' ? t('Basic Information') :
                  section === 'contact' ? t('Contact Information') :
                    section === 'address' ? t('Address Information') :
                      section === 'coordinates' ? t('Geographic Coordinates') :
                        section === 'locations' ? t('Location Assignment') :
                          section}
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

        {/* CONTACT INFORMATION SECTION */}
        {renderFieldsForSection(contactFields, 'contact')}

        {/* ADDRESS INFORMATION SECTION */}
        {renderFieldsForSection(addressFields, 'address')}

        {/* COORDINATES SECTION */}
        {renderFieldsForSection(coordinateFields, 'coordinates')}

        {/* LOCATION ASSIGNMENT SECTION */}
        {renderFieldsForSection(locationFields, 'locations')}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            <ButtonLoader
              isSubmitting={isSubmitting}
              btnText={isUpdate ? t('Update Depot') : t('Create Depot')}
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
            {t('Back to Depots')}
          </Button>
        </div>
      </form>
    </Form>

  );
};

export default DistributionDepotSaveForm;