
import  { useState, useRef } from 'react'
import { z } from 'zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Settings, Eye, Code } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs'
import { SafePreview } from '@/Components/UI/SafePreview'

import { MainLayout } from '@/Layouts/User/MainLayout'
import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader'
import { useTranslations } from '@/Hooks/useTranslations'
import TemplateKeysSidebar from '@/Components/Feature/Backend/NotificationTemplate/TemplateKeysSidebar'
import { generatePreview } from '@/Controllers/Backend/NotificationTemplateController'
import GlobalTemplateForm from '@/Components/Forms/Backend/NotificationTemplate/GlobalTemplateForm'

/* =====================
   Schema & Types
===================== */

const globalTemplateSchema = z.object({
  site_settings: z.object({
    default_mail_template: z.string().min(1),

  }),
})

type GlobalTemplateFormValues = z.infer<typeof globalTemplateSchema>

type Props = {
  title: string
  default_mail_template?: string
  default_push_template?: string
  default_template_codes: Record<string, string>
}


export function GlobalTemplateWrapper({
    title,
    default_mail_template,
    default_push_template,
    default_template_codes
}: Props) {

    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
    
    const mailEditorRef = useRef<any>(null)
 

    const form: UseFormReturn<GlobalTemplateFormValues> = useForm({
    resolver: zodResolver(globalTemplateSchema),
    defaultValues: {
        site_settings: {
         default_mail_template: default_mail_template ?? ''
        },
    },
    })

    const previewMailTemplate = form.watch(
    'site_settings.default_mail_template'
    )

    
    const {t} = useTranslations();
  
    return (
        <MainLayout title={title}>
            <CommonLayoutHeader
                variant="inner"
                breadcrumbItems={[
                                    { label: t("Dashboard"), href: route("backend.dashboard") },
                                    { label: t("Gloabl Template") }
                                ]}
                title={t('Global Template Settings')}
                description={
                    t('Configure global templates that will be used as base layouts for all notifications')
                }
                icon={Settings}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="space-y-6 lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab as any}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="edit" className="flex gap-2">
                            <Code className="w-4 h-4" />
                                {t('Edit Templates')}
                            </TabsTrigger>

                            <TabsTrigger value="preview" className="flex gap-2">
                            <Eye className="w-4 h-4" />
                                {t('Preview')}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="edit" className="mt-2">
                            <GlobalTemplateForm
                                form={form}
                                mailEditorRef={mailEditorRef}
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="mt-2 space-y-4">
                            {/* Mail Preview */}
                            <Card>
                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                <Settings className="w-5 h-5" />
                                    {t('Global Mail Template Preview')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SafePreview
                                    html={generatePreview(
                                        previewMailTemplate,
                                        default_template_codes
                                    )}
                                className="p-4 border rounded-md"
                                />
                            </CardContent>
                            </Card>

                        </TabsContent>
                    </Tabs>
                </div>

                <TemplateKeysSidebar
                    templateKeys={default_template_codes}
                    editorRef={mailEditorRef}
                />
                
            </div>
        </MainLayout>
    );
}
