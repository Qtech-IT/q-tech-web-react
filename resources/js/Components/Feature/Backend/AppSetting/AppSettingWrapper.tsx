
import { AppearanceForm } from '@/Components/Forms/Backend/Settings/AppearanceForm';
import { CurrencySettingsForm } from '@/Components/Forms/Backend/Settings/CurrencySettingsForm';
import { GeneralSettingsForm } from '@/Components/Forms/Backend/Settings/GeneralSettingsForm';
import { LogoForm } from '@/Components/Forms/Backend/Settings/LogoForm';
import { SecuritySettingsForm } from '@/Components/Forms/Backend/Settings/SecuritySettingsForm';
import { StorageSettingsForm } from '@/Components/Forms/Backend/Settings/StorageSettingsForm';
import { SystemPreferencesForm } from '@/Components/Forms/Backend/Settings/SystemPreferencesForm';
import { SupportSettingsForm } from '@/Components/Forms/SupportSettingsFormTest';
import { Separator } from '@/Components/UI/Separator';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { settingsNavItems } from '@/Utils/constants';
import { usePage } from '@inertiajs/react';
import { ContentSection } from '../Profile/ContentSection';
import { SidebarNav } from '../Profile/SidebarNav';

export function AppSettingWrapper() {


    const { t } = useTranslations();

    const settingsComponentMap: any = {


        GeneralSettingsForm: {
            title: t("General Settings"),
            description: t("Configure basic site information, timezone, and display preferences."),
            component: GeneralSettingsForm,
        },

        SupportSettingsForm: {
            title: t("Support Settings"),
            description: t("Configure support options, FAQs, and contact information."),
            component: SupportSettingsForm,
        },



        StorageSettingsForm: {
            title: t("Storage Settings"),
            description: t("Manage file storage options, cloud integrations, and upload preferences."),
            component: StorageSettingsForm,
        },

        LogoForm: {
            title: t("Logo & Branding"),
            description: t("Upload and manage your site logo, favicon, and branding assets."),
            component: LogoForm,
        },
        AppearanceForm: {
            title: "Appearance Settings",
            description: "Customize the visual appearance, themes, and UI preferences of your application.",
            component: AppearanceForm,
        },

        SecuritySettingsForm: {
            title: t("Security Center"),
            description: t("Manage authentication, access controls, and security policies."),
            component: SecuritySettingsForm,
        },


        SystemPreferencesForm: {
            title: t("System Config"),
            description: t("Configure system-wide preferences, performance settings, and environment variables."),
            component: SystemPreferencesForm,
        },


        CurrencySettingsForm: {
            title: t("Currency Settings"),
            description: t("Configure default currency, exchange rates, and manage multi-currency options for your system."),
            component: CurrencySettingsForm,
        },

    }

    const { props, url } = usePage();
    const component: any = props?.component;
    const title: any = props?.title;
    const componentInfo = settingsComponentMap[component!] || null
    const ComponentToRender = componentInfo?.component
    const description = componentInfo?.description


    return (
        <MainLayout title={title}>
            <div className='space-y-0.5'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    {t('App Settings')}
                </h1>
                <p className='text-muted-foreground'>
                    {t("Manage your system settings and set preferences.")}
                </p>
            </div>
            <Separator className='my-4 lg:my-6' />

            <div className="flex flex-col flex-1 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">

                <aside className="top-0 lg:sticky lg:w-1/5">
                    <SidebarNav items={settingsNavItems} url={url} title={title} />
                </aside>

                <div className="flex w-full p-1">
                    <div className="w-full max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                        {
                            ComponentToRender ? (
                                <ContentSection
                                    title={title}
                                    desc={description}
                                >
                                    <ComponentToRender props={props} />
                                </ContentSection>
                            ) : (
                                <p>
                                    {t("Component not found")}
                                </p>
                            )
                        }
                    </div>
                </div>

            </div>

        </MainLayout>
    );
}
