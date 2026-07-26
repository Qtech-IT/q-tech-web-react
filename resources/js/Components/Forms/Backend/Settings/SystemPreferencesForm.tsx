import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, Code, Database, AlertTriangle, CheckCircle } from 'lucide-react';

import { Button } from '@/Components/UI/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/Components/UI/Form';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { onSettingsUpdate, toggleDebugMode } from '@/Controllers/Backend/SettingsController';
import { Card, CardContent } from '@/Components/UI/Card';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Switch } from '@/Components/UI/Switch';
import { Badge } from '@/Components/UI/Badge';
import { useTranslations } from '@/Hooks/useTranslations';

interface SystemSetting {
  key: string;
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  categoryColor: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  warningDescription?: string;
  infoDescription?: string;
  type?: 'warning' | 'info';
  color?: string;
  activeColor?: string;
  badge?: {
    active: string;
    inactive: string;
    variant: string;
  };
}

interface SystemPreferencesProps {
  props: {
    app_debug?: boolean;
    database_notification?: 'active' | 'inactive';
    user_registration?: 'active' | 'inactive';
    email_verification?: 'active' | 'inactive';
  };
}

const systemPreferencesSchema = z.object({
  site_settings: z.object({
    app_debug: z.boolean(),
    database_notification: z.boolean(),
    user_registration: z.boolean(),
    email_verification: z.boolean(),
  }),
});

export const SystemPreferencesForm: React.FC<SystemPreferencesProps> = ({ props }) => {
  const { t } = useTranslations();

  const systemSettings: SystemSetting[] = [
    {
      key: 'app_debug',
      category: t('Development & Debugging'),
      categoryIcon: Code,
      categoryColor: 'text-orange-500',
      icon: Code,
      title: t('App Debug Mode'),
      description: t('Enable detailed error reporting and debugging information for development'),
      warningDescription: t('Debug mode exposes sensitive information. Never enable in production.'),
      type: 'warning',
      color: 'text-red-500',
      activeColor: 'border-red-200 bg-red-50 dark:bg-red-950',
      badge: { active: 'Debug On', inactive: 'Debug Off', variant: 'destructive' },
    }
  ];

  const { app_debug, database_notification } = props;

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm();

  const form = useForm({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: {
      site_settings: {
        app_debug: app_debug ?? false,
        database_notification: database_notification === 'active',
      },
    },
  });

  const watchedValues = form.watch('site_settings');

  const getStatusBadge = (setting: SystemSetting, isActive: boolean) => {
    if (!setting.badge) return null;
    const badgeText = isActive ? setting.badge.active : setting.badge.inactive;
    const variant = isActive ? 'default' : 'secondary';

    return (
      <Badge variant={variant} className="text-xs">
        {badgeText}
      </Badge>
    );
  };

  const renderSettingCard = (setting: SystemSetting) => {
    const isActive = watchedValues[setting.key as keyof typeof watchedValues];
    const IconComponent = setting.icon;

    return (
      <Card
        key={setting.key}
        className={`transition-all duration-200 ${isActive ? setting.activeColor : ''}`}
      >
        <CardContent className="p-6">
          <FormField
            control={form.control as any}
            name={`site_settings.${setting.key}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${setting.color}`} />
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      {setting.title}
                      {getStatusBadge(setting, Boolean(isActive))}
                    </FormLabel>
                  </div>

                  <FormDescription className="text-sm text-muted-foreground">
                    {setting.description}
                  </FormDescription>

                  {isActive && setting.warningDescription && (
                    <Alert className="mt-3 border-orange-200 bg-orange-50 dark:bg-orange-950">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-sm">
                        <strong>{t('Warning')}:</strong> {setting.warningDescription}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isActive && setting.infoDescription && setting.key !== 'app_debug' && (
                    <Alert className="mt-3 border-blue-200 bg-blue-50 dark:bg-blue-950">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription className="text-sm">{setting.infoDescription}</AlertDescription>
                    </Alert>
                  )}

                  {!isActive && setting.infoDescription && (
                    <div className="p-3 mt-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-muted-foreground">{setting.infoDescription}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (setting.key === 'app_debug') toggleDebugMode(submit);
                        field.onChange(checked);
                      }}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  };

  // Group settings by category
  const groupedSettings = systemSettings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category]!.push(setting);
      return acc;
    },
    {} as Record<string, SystemSetting[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">{t('System Preferences')}</h1>
        <Badge variant="outline" className="ml-auto">
          {Object.values(watchedValues).filter(Boolean).length} of {systemSettings.length} {t('Active')}
        </Badge>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSettingsUpdate(data, submit))}
          className="space-y-6"
        >
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Settings className="w-4 h-4" />
            <AlertDescription>
              {t(
                'These settings control core system functionality. Changes will take effect immediately after saving.'
              )}
            </AlertDescription>
          </Alert>

          {/* Dynamic Categories */}
          {Object.entries(groupedSettings).map(([category, settings]) => {
            const firstSetting = settings[0];
            const CategoryIcon = firstSetting!.categoryIcon;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CategoryIcon className={`w-5 h-5 ${firstSetting!.categoryColor}`} />
                  <h2 className="text-lg font-semibold">{category}</h2>
                </div>
                <div className="space-y-4">
                  {settings.map((setting) => renderSettingCard(setting))}
                </div>
              </div>
            );
          })}

          {watchedValues.app_debug && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>{t('Production Warning')}:</strong>{' '}
                {t(
                  'Debug mode is currently enabled. This should be disabled in production environments to prevent security vulnerabilities.'
                )}
              </AlertDescription>
            </Alert>
          )}

        </form>
      </Form>
    </div>
  );
};