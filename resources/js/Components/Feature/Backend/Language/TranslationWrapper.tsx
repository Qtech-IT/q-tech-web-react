
import { useState, useEffect } from 'react';
import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';

import {
  Languages
} from 'lucide-react';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { router } from '@inertiajs/react';

import { useTranslations } from '@/Hooks/useTranslations';
import CommonSimpleSearchBox from '../CommonSimpleSearchBox';
import CommonLayoutHeader from '../CommonLayoutHeader';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { TranslationProps } from '@/Types/User/setting';
import { BreadcrumbProps } from '@/Types';
import TranslationTable from '@/Components/Table/Backend/TranslationTable';
import LanguageInfoCard from './LanguageInfoCard';

export function TranslationWrapper(props:TranslationProps) {

  const {title , language , translationData , modelProperty} = props;
  const routePrefix = modelProperty?.routePrefix;
  const {t} = useTranslations();
  const { loading: isSubmitting, submit } = useInertiaForm();
  const [searchTerm, setSearchTerm]       = useState('');
  const [translations, setTranslations]   = useState(translationData);
  const [hasChanges, setHasChanges]       = useState(false);
  const [originalTranslations]            = useState(translationData);

  const breadcrumbItems : BreadcrumbProps = [
    { label: t('Dashboard'), href: t('backend.dashboard')},
    { label: t('Languages'), href:route(`${routePrefix}.index`) },
    { label: `${language.data.name} Translation`, href: null }
  ];

  const handleSearch  = (searchValue : any) => {
    setSearchTerm(searchValue);
  };

  const handleTranslationsChange = (newTranslations : any) => {
    setTranslations(newTranslations);
    const hasAnyChanges = Object.keys(newTranslations).some(key =>
      newTranslations[key] !== originalTranslations[key]
    );
    setHasChanges(hasAnyChanges);
  };

    const handleSaveAll = () => {};

    const handleBackToLanguages = () => {
        if (hasChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            router.visit(route(`${routePrefix}.index`));
        }
        } else {
        router.visit(route(`${routePrefix}.index`));
        }
    };

    const stats = {
        total: Object.keys(translations).length,
        language: language.data.name
    };

    // Show warning when leaving page with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e : any) => {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);


    return (
        <MainLayout title={title}>

            <CommonLayoutHeader
                variant="inner"
                breadcrumbItems={breadcrumbItems}
                title={`${language.data.name} Translation`}
                description={t("Manage translations for this language")}
                icon={Languages}
            />

            <LanguageInfoCard
                language={language.data}
                totalKeys={Object.keys(translations).length}
            />

            <CommonSimpleSearchBox
                title={t('Search Translations')}
                description={t('Search and filter translation keys and values')}
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                placeholder={t("Search translation keys or values...")}
            />

            <div className="space-y-6">
                <TranslationTable
                    translations={translations}
                    searchTerm={searchTerm}
                    languageCode={language.data.code}
                    routePrefix={routePrefix}
                />
            </div>


            {hasChanges && (
                <div className="fixed z-50 bottom-6 right-6 md:hidden">
                    <Button
                        onClick={handleSaveAll}
                        disabled={isSubmitting}
                        className="bg-green-600 rounded-full shadow-lg h-14 w-14 hover:bg-green-700"
                    >
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={t('Save')}
                            loaderText={t('Saving....')}
                        />
                    </Button>
                </div>
            )}

        </MainLayout>
    );
}
