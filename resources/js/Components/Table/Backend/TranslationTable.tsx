import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/UI/Table';
import {
  Card,
  CardContent,
} from '@/Components/UI/Card';
import { FileText } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import EmptyTableState from '@/Components/UI/EmptyTableState';

import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { handleTransaltionSave } from '@/Controllers/Backend/LanguageController';
import { useTranslations } from '@/Hooks/useTranslations';
import CustomPagination from '@/Components/Feature/Backend/Language/CustomPagination';
import TranslationRow from './TranslationRow';
import { usePermission } from '@/Hooks/usePermission';

const ITEMS_PER_PAGE = 50;

interface TranslationTableProps {
  translations: Record<string, string>;
  searchTerm: string;
  languageCode: string;
  routePrefix:string;
}

const TranslationTable: React.FC<TranslationTableProps> = ({
  translations,
  searchTerm,
  languageCode,
  routePrefix
}) => {

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();
  const {t} = useTranslations()

  const {can} = usePermission()

  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>(translations);
  const [currentPage, setCurrentPage]               = useState<number>(1);

  useEffect(() => {
    setEditedTranslations(translations);
  }, [translations]);

  const filteredTranslations = Object.entries(editedTranslations).filter(
    ([key, value]: [string, string]) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        key.toLowerCase().includes(searchLower) ||
        value.toLowerCase().includes(searchLower)
      );
    }
  );

  const totalItems: number = filteredTranslations.length;
  const totalPages: number = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTranslations = filteredTranslations.slice(
                                    startIndex,
                                    startIndex + ITEMS_PER_PAGE
                                );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (key: string, value: string): void => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (filteredTranslations.length === 0) {
    return (
      <EmptyTableState
        icon={FileText}
        title={t("No translations found")}
        description={
          searchTerm
            ? t('No translations match your search criteria.')
            : t('No translation keys available.')
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="px-6 py-3">
                     {t('ID')}
                  </TableHead>
                  <TableHead className="px-6 py-3">
                     {t('Key')}
                  </TableHead>
                  <TableHead className="px-6 py-3">
                     {t('Value')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTranslations.map(
                  ([key, value]: [string, string], index: number) => (
                    <TranslationRow
                      key={key}
                      translationKey={key}
                      value={value}
                      index={startIndex + index}
                      onChange={handleChange}
                    />
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {
         can('language.translate') && (

             <div className="flex justify-end">
                <Button
                    onClick={() =>
                        handleTransaltionSave(submit, editedTranslations, languageCode , routePrefix)
                    }
                    disabled={isSubmitting}
                    >
                    <ButtonLoader isSubmitting={isSubmitting} />
                </Button>
            </div>

         )
      }
     

    </div>
  );
};

export default TranslationTable;
