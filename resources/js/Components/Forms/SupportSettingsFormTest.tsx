import { Button } from '@/Components/UI/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/UI/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Input } from '@/Components/UI/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/UI/Select'
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { ExternalLink, HeadphonesIcon, Info, Link, PlusCircle, Trash2 } from 'lucide-react'

const SUPPORT_CHANNELS = [
    { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/1234567890' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourusername' },
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
    { value: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourhandle' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel' },
    { value: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourinvite' },
    { value: 'skype', label: 'Skype', placeholder: 'skype:yourusername?chat' },
    { value: 'viber', label: 'Viber', placeholder: 'viber://chat?number=1234567890' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
    { value: 'email', label: 'Email', placeholder: 'mailto:support@yoursite.com' },
    { value: 'website', label: 'Website', placeholder: 'https://yourwebsite.com/support' },
    { value: 'phone', label: 'Phone', placeholder: 'tel:+1234567890' },
    { value: 'live_chat', label: 'Live Chat', placeholder: 'https://yoursite.com/chat' },
    { value: 'other', label: 'Other', placeholder: 'https://...' },
]

const CHANNEL_ICON: Record<string, string> = {
    whatsapp: '💬',
    telegram: '✈️',
    facebook: '📘',
    instagram: '📸',
    twitter: '🐦',
    linkedin: '💼',
    youtube: '▶️',
    discord: '🎮',
    skype: '📹',
    viber: '📳',
    tiktok: '🎵',
    email: '📧',
    website: '🌐',
    phone: '📞',
    live_chat: '💡',
    other: '🔗',
}

// ── Nested under site_settings — same pattern as GeneralSettingsForm ──────────

const supportSettingsSchema = z.object({
    site_settings: z.object({
        support_links: z.array(
            z.object({
                channel: z.string().min(1, 'Channel is required'),
                link: z.string().min(1, 'Link is required').url('Enter a valid URL'),
            })
        ),
    }),
})

type SupportSettingsValues = z.infer<typeof supportSettingsSchema>

export function SupportSettingsForm({ props }: { props: any }) {


    const { t } = useTranslations()
    const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

    const rawLinks: Array<{ channel: string; link: string }> = props?.support_links ?? []

    const form = useForm<SupportSettingsValues>({
        resolver: zodResolver(supportSettingsSchema),
        defaultValues: {
            site_settings: {
                support_links: rawLinks.length > 0
                    ? rawLinks
                    : [{ channel: '', link: '' }],
            },
        },
    })

    const links = form.watch('site_settings.support_links')

    const addLink = () => {
        form.setValue('site_settings.support_links', [...links, { channel: '', link: '' }])
    }

    const removeLink = (index: number) => {
        const updated = links.filter((_, i) => i !== index)
        form.setValue(
            'site_settings.support_links',
            updated.length > 0 ? updated : [{ channel: '', link: '' }]
        )
    }

    const getPlaceholder = (channelValue: string) =>
        SUPPORT_CHANNELS.find(c => c.value === channelValue)?.placeholder ?? 'https://...'

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-2 mb-6">
                <HeadphonesIcon className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">{t('Support Settings')}</h1>
                <div className="flex gap-2 ml-auto">
                    <Badge variant="outline" className="text-xs">
                        {t('Support Configuration')}
                    </Badge>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((e) => onSettingsUpdate(e, submit))}
                    className="space-y-6"
                >

                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                            <div className="space-y-2">
                                <p className="font-medium">{t('Support Channel Configuration')}</p>
                                <p className="text-sm">
                                    {t('Add your support channels and their links. These will be displayed to users across your application so they can reach out for help.')}
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5 text-blue-500" />
                                    <CardTitle>{t('Support Channels & Links')}</CardTitle>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addLink}
                                    className="flex items-center gap-1"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    {t('Add Channel')}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {links.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30 relative group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-lg shrink-0 mt-6">
                                        {CHANNEL_ICON[item.channel] ?? '🔗'}
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <FormField
                                            control={form.control as any}
                                            name={`site_settings.support_links.${index}.channel`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('Channel')}</FormLabel>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t('Select a channel')} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {SUPPORT_CHANNELS.map(ch => (
                                                                <SelectItem key={ch.value} value={ch.value}>
                                                                    <span className="flex items-center gap-2">
                                                                        <span>{CHANNEL_ICON[ch.value]}</span>
                                                                        <span>{ch.label}</span>
                                                                    </span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                    {serverErrors?.[`site_settings.support_links.${index}.channel`] && (
                                                        <p className="text-sm text-destructive">
                                                            {serverErrors[`site_settings.support_links.${index}.channel`]}
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control as any}
                                            name={`site_settings.support_links.${index}.link`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('Link / URL')}</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <Input
                                                                {...field}
                                                                disabled={isSubmitting}
                                                                placeholder={getPlaceholder(item.channel)}
                                                                className="pl-9"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                    {serverErrors?.[`site_settings.support_links.${index}.link`] && (
                                                        <p className="text-sm text-destructive">
                                                            {serverErrors[`site_settings.support_links.${index}.link`]}
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeLink(index)}
                                        disabled={isSubmitting || links.length === 1}
                                        className="shrink-0 mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        title={t('Remove')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {links.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <HeadphonesIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p>{t('No support channels added yet.')}</p>
                                    <Button type="button" variant="outline" className="mt-3" onClick={addLink}>
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                        {t('Add your first channel')}
                                    </Button>
                                </div>
                            )}

                            {links.length > 0 && (
                                <Button
                                    type="button"
                                    className="w-full border-dashed"
                                    onClick={addLink}
                                    disabled={isSubmitting}
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    {t('Add Another Channel')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Button disabled={isSubmitting} type="submit">
                        <ButtonLoader isSubmitting={isSubmitting} />
                    </Button>

                </form>
            </Form>
        </div>
    )
}