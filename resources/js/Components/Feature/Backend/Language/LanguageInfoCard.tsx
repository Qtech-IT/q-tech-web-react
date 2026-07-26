import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Globe, Star } from 'lucide-react';
import { useTranslations } from '@/Hooks/useTranslations';

/* =====================
   Types
===================== */

type LanguageDirection = 'ltr' | 'rtl';

interface Language {
  name: string;
  code: string;
  direction: LanguageDirection;
  is_default: boolean;
}

interface DefaultBadgeProps {
  isDefault: boolean;
}

interface DirectionBadgeProps {
  direction: LanguageDirection;
}

interface LanguageInfoCardProps {
  language: Language;
  totalKeys: number;
}

/* =====================
   Components
===================== */

const DefaultBadge: React.FC<DefaultBadgeProps> = ({ isDefault }) => {
  if (!isDefault) return null;

  return (
    <Badge
      variant="outline"
      className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:border-yellow-600 dark:bg-yellow-900/20"
    >
      <Star className="w-3 h-3 mr-1" />
      Default
    </Badge>
  );
};

const DirectionBadge: React.FC<DirectionBadgeProps> = ({ direction }) => {
  const isRTL = direction === 'rtl';
 
  return (
    <Badge
      variant="outline"
      className={
        isRTL
          ? 'text-purple-700 border-purple-300 bg-purple-50 dark:text-purple-300 dark:border-purple-600 dark:bg-purple-900/20'
          : 'text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-300 dark:border-blue-600 dark:bg-blue-900/20'
      }
    >
      {direction.toUpperCase()}
    </Badge>
  );
};

const LanguageInfoCard: React.FC<LanguageInfoCardProps> = ({
  language,
  totalKeys,
}) => {

  const {t} = useTranslations();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <CardTitle>
             {t('Language Information')}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
               {t('Language')}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">{language.name}</span>
              <DefaultBadge isDefault={language.is_default} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
               {t('Code')}
            </label>
            <div className="mt-1">
              <code className="px-2 py-1 text-sm rounded bg-muted">
                {language.code}
              </code>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
               {t('Direction')}
            </label>
            <div className="mt-1">
              <DirectionBadge direction={language.direction} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
               {t('Total Keys')}
            </label>
            <div className="mt-1 font-medium">
              {totalKeys} {t('translations')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageInfoCard;
