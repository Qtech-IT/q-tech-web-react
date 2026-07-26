import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent } from '@/Components/UI/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu';
import EmptyTableState from '@/Components/UI/EmptyTableState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/UI/Table';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import {
  CheckCircle,
  Circle,
  Edit,
  Globe,
  Languages,
  MoreHorizontal,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import React from 'react';

import { handleLanguageStautsUpdate, handleSetDefaultLanguage } from '@/Controllers/Backend/LanguageController';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import { router, usePage } from '@inertiajs/react';

/* -------------------- Types -------------------- */

export interface Language {
  id: any;
  name: string;
  code: string;
  direction: 'ltr' | 'rtl';
  status: 'active' | 'inactive';
  is_default: boolean;
  is_deleteable: boolean;
  created_at?: string;

}

interface TableActionsProps {
  language: Language;
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
  currentLangCode?: string;
  routePrefix: string
}

interface LanguagesTableProps {
  languages: Language[];
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
  routePrefix: any
}

/* -------------------- Actions Menu -------------------- */

const TableActions: React.FC<TableActionsProps> = ({
  language,
  onEdit,
  onDelete,
  currentLangCode = 'en',
  routePrefix
}) => {
  const { submit } = useInertiaForm();
  const { t } = useTranslations();
  const { can } = usePermission()


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1 rounded-md">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {t('Actions')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />


        {
          can('language.edit')
          &&
          (
            <DropdownMenuItem
              onClick={() => onEdit(language)}
              className="text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
            >
              <Edit className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />
              {t('Edit Language')}
            </DropdownMenuItem>
          )
        }



        {(!language.is_default && currentLangCode !== language.code && can('language.edit')) && (

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Circle className="w-4 h-4 mr-2" />
              {t('Change Status')}
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuItem
                disabled={language.status === 'active'}
                onClick={() =>
                  handleLanguageStautsUpdate(language, 'active', submit, routePrefix)
                }
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                {t('Active')}
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={language.status === 'inactive'}
                onClick={() =>
                  handleLanguageStautsUpdate(language, 'inactive', submit, routePrefix)
                }
              >
                <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                {t('Inactive')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

        )}

        {
          can('language.translate')
          && (

            <DropdownMenuItem
              onClick={() =>
                router.visit(route(`${routePrefix}.translation`, { code: language.code }))
              }
            >
              <Languages className="w-4 h-4 mr-2" />
              {t('Translations')}
            </DropdownMenuItem>
          )
        }

        {(!language.is_default && can('language.edit')) && (
          <DropdownMenuItem
            onClick={() => handleSetDefaultLanguage(language, submit, routePrefix)}
          >
            <Star className="w-4 h-4 mr-2 text-yellow-600" />
            {t('Set as Default')}
          </DropdownMenuItem>
        )}



        {(language?.is_deleteable && can('language.delete')) && (
          <>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem
              onClick={() => onDelete(language)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('Delete Language')}
            </DropdownMenuItem>
          </>
        )}


      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* -------------------- Badges -------------------- */

const StatusBadge: React.FC<{ status: Language['status'] }> = ({ status }) => (
  <Badge variant={status === 'active' ? 'default' : 'secondary'}
    className={`${status === 'active'
      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700"
      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-600"}
                    
                    `}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

const DefaultBadge: React.FC<{ isDefault: boolean }> = ({ isDefault }) =>
  isDefault ? (
    <Badge variant="outline" className="text-xs">
      <Star className="w-3 h-3 mr-1" />
      Default
    </Badge>
  ) : null;

const DirectionBadge: React.FC<{ direction: Language['direction'] }> = ({
  direction,
}) => (
  <Badge variant="outline" className="text-xs">
    {direction.toUpperCase()}
  </Badge>
);

/* -------------------- Table -------------------- */

interface PageProps {
  language_settings?: {
    current_language?: string;
  };
}

export const LanguagesTable: React.FC<LanguagesTableProps> = ({
  languages = [],
  onEdit,
  onDelete,
  routePrefix
}) => {

  const { props }: any = usePage();
  const currentLangCode = props?.language_settings?.current_language;
  const { t } = useTranslations();


  if (!languages.length) {
    return (
      <EmptyTableState
        icon={Globe}
        title={t("No languages found")}
        description={t("No languages configured yet.")}
      />
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>

              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                {t('Language')}
              </TableHead>

              <TableHead>
                {t('Code')}
              </TableHead>

              <TableHead>
                {t('Direction')}
              </TableHead>

              <TableHead>
                {t("Status")}
              </TableHead>

              <TableHead>
                {
                  t('Created')
                }
              </TableHead>
              <TableHead className="text-center">
                {t('Actions')}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {languages.map((language, index) => (
              <TableRow key={language.id}>

                <TableCell className="px-6 py-4  text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {language.name}
                    <DefaultBadge isDefault={language.is_default} />
                  </div>
                </TableCell>

                <TableCell>
                  <code className="text-xs">{language.code}</code>
                </TableCell>

                <TableCell>
                  <DirectionBadge direction={language.direction} />
                </TableCell>

                <TableCell>
                  <StatusBadge status={language.status} />
                </TableCell>

                <TableCell>{language.created_at}</TableCell>

                <TableCell className="text-center">

                  {

                    <TableActions
                      language={language}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      currentLangCode={currentLangCode}
                      routePrefix={routePrefix}
                    />

                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LanguagesTable;
