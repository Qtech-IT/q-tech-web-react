import {  MainContainer } from '@/Layouts/User/MainContainer'
import BaseLayout from '@/Layouts/User/BaseLayout'
import { AuthenticatedLayout } from '@/Layouts/User/AuthenticatedLayout'
import { Head, usePage } from '@inertiajs/react'
import { SidebarNav } from '@/Components/Feature/Backend/Profile/SidebarNav'
import { profileNavItems } from '@/Utils/constants'
import { Separator } from '@/Components/UI/Separator'
import { ContentSection } from '@/Components/Feature/Backend/Profile/ContentSection'
import TwoFAConfig from "@/Components/Feature/Backend/Profile/TwoFAConfig"
import { BrowserSessions } from '@/Components/Feature/Backend/Profile/BrowserSessions'
import { ProfileProps, User } from '@/Types/User'
import { useTranslations } from '@/Hooks/useTranslations'
import { ProfileForm } from '@/Components/Forms/Backend/Profile/ProfileForm'
import { PasswordForm } from '@/Components/Forms/Backend/Profile/PasswordForm'
import { CrudPageProps } from '@/Types/crud'

const ProfileWrapper: React.FC<ProfileProps> = ({ title, component, modelProperty,sessions,setupData }) => {


    const {t}          = useTranslations();
    const routePrefix  =  modelProperty?.routePrefix ;

    const componentMap = {
        ProfileForm: {
            description: t("This is how others will see you on the site."),
            component: ProfileForm,
        },
        PasswordForm: {
            description: t("Update your account’s password."),
            component: PasswordForm,
        },
        TwoFAConfig: {
            description: t("Add an extra layer of security using 2FA."),
            component: TwoFAConfig,
        },
        BrowserSessions: {
            description: t("Manage and log out of your active browser sessions."),
            component: BrowserSessions,
        }
    }


    const { props ,url }    = usePage<CrudPageProps>();
    const user :User        = props?.auth?.user;
    const passwordLength    = Number(props.site_theme_settings?.minimum_password_length) || 6;


    type ComponentKey = keyof typeof componentMap;

    const resolvedComponentKey = (component as ComponentKey) in componentMap
                                            ? (component as ComponentKey)
                                            : null;

    const componentInfo = resolvedComponentKey
                                        ? componentMap[resolvedComponentKey]
                                        : null;

    const ComponentToRender = componentInfo?.component ?? null;
    const description       = componentInfo?.description ?? '';

    return (
        <BaseLayout>
            <AuthenticatedLayout>
                <Head title={title}/>
                    <MainContainer fixed>
                        <div className='space-y-0.5'>
                            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                                {t('profile')}
                            </h1>
                            <p className='text-muted-foreground'>
                                {t("manage_your_account_and_set_preferences")}
                            </p>
                        </div>
                        <Separator className='my-4 lg:my-6' />
                            <div className='flex flex-col flex-1 space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
                            <aside className='top-0 lg:sticky lg:w-1/5'>
                                <SidebarNav items={profileNavItems} url={url} title={title}/>
                            </aside>

                            <div className='flex w-full p-1 overflow-y-hidden'>
                                {
                                    ComponentToRender
                                        ?
                                            <ContentSection
                                                title={title}
                                                desc={description}>

                                                <ComponentToRender
                                                    user={user}
                                                    sessions={sessions || []}
                                                    setupData={setupData}
                                                    passwordLength={passwordLength}
                                                    routePrefix={routePrefix!}
                                                />

                                            </ContentSection>

                                        :<p>
                                            {t("Component not found!!")}
                                        </p>
                                }
                            </div>
                        </div>
                    </MainContainer>
            </AuthenticatedLayout>
        </BaseLayout>
    )
}

export default ProfileWrapper;