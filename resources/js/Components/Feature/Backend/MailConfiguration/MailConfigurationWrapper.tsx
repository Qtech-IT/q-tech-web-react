
import { z } from 'zod'

import { Lock, Mail, Send, Server, Settings} from 'lucide-react'
import { MainLayout } from '@/Layouts/User/MainLayout'
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader'
import { useTranslations } from '@/Hooks/useTranslations'
import CommonSaveAlert from '../CommonSaveAleart'
import { MailConfigurationProps } from '@/Types/User/setting'
import {
  Form
} from '@/Components/UI/Form'
import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useForm , UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/Card'
import { TestMailDialog } from './TestMailDialog'
import { useState } from 'react'
import { useSettingsConfig } from '@/Config/useSettingsConfig'
import DynamicInputWrapper from '@/Components/Core/DynamicCrud/DynamicInputWrapper'


export function MailConfigurationWrapper({
    title,
    modelProperty,
    mailConfiguration
}: MailConfigurationProps) {

    
    const mailConfigurationSchema = z.object({
            mail_mailer: z.string()
                            .min(1, "Mail mailer is required"),

            mail_host: z.string().min(1, "Mail host is required")
                            .max(255, "Mail host must not exceed 255 characters"),
            encryption: z.enum(['tls', 'ssl', 'none']),
            mail_port: z.coerce.number()
                            .min(1, "Mail port is required"),

            mail_username: z.string()
                            .min(1, "Mail username is required")
                            .max(255, "Mail username must not exceed 255 characters"),

            mail_password: z.string()
                            .min(1, "Mail password is required")
                            .max(255, "Mail password must not exceed 255 characters"),

            mail_form_address: z.string()
                            .email("Invalid email address")
                            .max(255, "Email must not exceed 255 characters")
    });

    const [testDialogOpen, setTestDialogOpen] = useState    (false)


    type MailConfigurationFormValues = z.infer<typeof mailConfigurationSchema>
    

    const {t} = useTranslations();

    const { loading: isSubmitting, errors:serverErrors, submit: submitFn } = useInertiaForm()

    let routePrefix = modelProperty?.routePrefix;
        
    const form: UseFormReturn<MailConfigurationFormValues> = useForm({
        resolver: zodResolver(mailConfigurationSchema),
        defaultValues: {
            mail_mailer:  mailConfiguration?.mail_mailer || 'smtp',
            mail_host:   mailConfiguration?.mail_host || 'sandbox.smtp.mailtrap.io',
            mail_port:  mailConfiguration?.mail_port || 2525 ,
            mail_username:  mailConfiguration?.mail_username || "@@@@@@",
            mail_password:   mailConfiguration?.mail_password || "****",
            mail_form_address:  mailConfiguration?.mail_form_address || "noreply@gmail.com",
            encryption:mailConfiguration?.encryption || 'tls'
        },
    })

    const onSubmit = async(data:any) => {
        try {
            await submitFn({
                method: 'POST',
                url: route(`${routePrefix}.store`),
                data: data,
            })
        } catch (error) {
        }
    }



    const config = useSettingsConfig();


    const smtpConfigurationForm =  config?.form?.smtp_mail_configuration || [];


    const basicFields           = smtpConfigurationForm?.filter((f:any) => f.section === 'basic');

    const authenticationFields  = smtpConfigurationForm.filter((f:any) => f.section === 'authentication');

    const mailFormFileds        = smtpConfigurationForm.filter((f:any) => f.section === 'mail_form_section');


    
  
    return (
        <MainLayout title={title}>

            <CommonLayoutHeader
                variant="inner"
                breadcrumbItems={[
                                    { label: t("Dashboard"), href: route("backend.dashboard") },
                                    { label: t("SMTP Mail Configuration") }
                                ]}
                title={t('SMTP Configuration')}
                description={
                   t('Configure email delivery settings, SMTP credentials, and sender information for outgoing mails')
                }
                icon={Mail}
            />

            <CommonSaveAlert
                title={t('Save Changes')}
                description={t('Make sure all information is correct before submitting the form')}
            />
                        
            <div>
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Server Configuration */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Server className="w-5 h-5 text-blue-500" />
                                    <CardTitle>{t('Server Configuration')}</CardTitle>
                                </div>
                                <CardDescription>
                                {t('Configure your mail server connection settings')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               
                                {basicFields?.map((field :any, index :Number) => (   
                                    <DynamicInputWrapper
                                        key={field.name || index} 
                                        field ={field}
                                        form ={form}
                                        isSubmitting ={isSubmitting}
                                        serverErrors ={serverErrors}
                                    />
                                ))}
                               
                            </CardContent>
                        </Card>

                        {/* Authentication */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-500" />
                                <CardTitle>{t('Authentication')}</CardTitle>
                                </div>
                                <CardDescription>
                                {t('SMTP authentication credentials')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {authenticationFields?.map((field :any, index :Number) => (   
                                    <DynamicInputWrapper
                                        key={field.name || index} 
                                        field ={field}
                                        form ={form}
                                        isSubmitting ={isSubmitting}
                                        serverErrors ={serverErrors}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* From Address */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-green-500" />
                                <CardTitle>{t('Sender Information')}</CardTitle>
                                </div>
                                <CardDescription>
                                {t('Default sender email address for outgoing emails')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               
                                {mailFormFileds?.map((field :any, index :Number) => (   
                                    <DynamicInputWrapper
                                        key={field.name || index} 
                                        field ={field}
                                        form ={form}
                                        isSubmitting ={isSubmitting}
                                        serverErrors ={serverErrors}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTestDialogOpen(true)}
                                disabled={!mailConfiguration || isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {t('Test Configuration')}
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                <ButtonLoader
                                    isSubmitting={isSubmitting}
                                    btnText={t('Save Configuration')}
                                    loaderText={t('Saving...')}
                                    icon={<Settings className="w-4 h-4" />}
                                />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            <TestMailDialog
                open={testDialogOpen}
                onOpenChange={setTestDialogOpen}
                routePrefix={routePrefix}
            />


        </MainLayout>
    );
}
