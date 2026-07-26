import { MainLayout } from "@/Layouts/User/MainLayout";
import CommonLayoutHeader from "../CommonLayoutHeader";
import { BreadcrumbProps } from "@/Types";
import { useTranslations } from "@/Hooks/useTranslations";
import { Globe, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getDeleteDialogConfig, handleDeleteLanguage, setLanguageFilterData } from "@/Controllers/Backend/LanguageController";
import CommonSimpleSearchBox from "../CommonSimpleSearchBox";
import { LanguageProps } from "@/Types/User/setting";
import { DeleteDialog } from "@/Components/Core/DynamicCrud/Dialog/DeleteDialog";
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import LanguagesTable from "@/Components/Table/Backend/LanguagesTable";
import { LanguageDialog } from "./LanguageDialog";
import { usePermission } from "@/Hooks/usePermission";


interface Language {
  id: number;
  name: string;
  code: string;
 [key: string]: any;
}

export function LanguageWrapper(props:LanguageProps) {

    const {t}   = useTranslations();
    const {can} = usePermission()
    const { title , data : languages,langCodes, modelProperty} = props;
    const routePrefix = modelProperty?.routePrefix;

    const breadcrumbItems : BreadcrumbProps = [
        { label: t('Dashboard'), href: route('backend.dashboard')},
        { label: t('Languages'), href: null }
    ];


    const [searchTerm, setSearchTerm] = useState<string>('');

    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

    const [activeFilters, setActiveFilters]         = useState<Record<string, any>>({});
    const [filteredLanguages, setFilteredLanguages] = useState<Language[]>(
                                                        languages?.data || []
                                                        );
    
      // Dialog states
      const [showAddDialog, setShowAddDialog]       = useState<boolean>(false);
      const [showEditDialog, setShowEditDialog]     = useState<boolean>(false);
      const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
      const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    
      useEffect(() => {
        setLanguageFilterData(
          languages,
          searchTerm,
          activeFilters,
          setFilteredLanguages
        );
      }, [searchTerm, activeFilters, languages]);
    
      const handleSearch = (value: string) => {
        setSearchTerm(value);
      };
    
      const handleAddLanguage = () => {
        setSelectedLanguage(null);
        setShowAddDialog(true);
      };
    
      const handleEditLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setShowEditDialog(true);
      };
    
      const handleDelete = (language: Language) => {
        setSelectedLanguage(language);
        setShowDeleteDialog(true);
      };

      const handleClose = () => {
        setShowDeleteDialog(false);
      }

      const deleteLanguage = (id: any)=> {
        handleDeleteLanguage(id,submit ,handleClose , routePrefix)
      }
    
      const deleteDialogConfig = getDeleteDialogConfig(
        languages,
        selectedLanguage
      );

    
    return (
        <MainLayout title={title}>

            <CommonLayoutHeader
                variant="index"
                breadcrumbItems={breadcrumbItems}
                title={t("Languages")}
                description={t("Manage system languages and localization settings")}
                primaryAction={
                 can('language.create') ? {
                      label: t('Add Language'),
                      icon: Plus,
                      onClick: handleAddLanguage,
                      variant: 'default'
                  }: null
              }
            />

            <CommonSimpleSearchBox
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                placeholder="Search languages by name or code..."
            />

           <div className="space-y-6">
                <LanguagesTable
                    languages={filteredLanguages as any}
                    onEdit={handleEditLanguage}
                    onDelete={handleDelete}
                    routePrefix={routePrefix}
                />
            </div>
    
            <LanguageDialog
              open={showAddDialog || showEditDialog}
              onOpenChange={showAddDialog ? setShowAddDialog : setShowEditDialog}
              mode={showAddDialog ? 'create' : 'edit'}
              language={selectedLanguage as any}
              langCodes={langCodes}
              routePrefix={routePrefix}
            />

            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                item={selectedLanguage as any}
                config={deleteDialogConfig as any}
                onDelete={deleteLanguage}
                isSubmitting={isSubmitting}
            />

        </MainLayout>
    );
}
