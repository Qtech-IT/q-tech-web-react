import { Button } from '@/Components/UI/Button'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { PasswordInput } from '@/Components/UI/PasswordInput'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from "zod"



export function RegisterForm(passwordLength: any) {
    const { t } = useTranslations()


    const formSchema = z.object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Valid email required"),
        password: z.string().min(passwordLength.passwordLength, `Password must be at least ${passwordLength.passwordLength} characters`),
        password_confirmation: z.string(),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    })

    const { loading: isSubmitting, submit } = useInertiaForm()

    const onSubmit = (data: any) => {
        submit({ url: route('register.store'), data })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">

                <FormField
                    control={form.control as any}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>{t('Username')}</FormLabel>
                            <FormControl>
                                <Input placeholder="john" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>{t('Email')}</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>{t('Password')}</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>{t('Confirm Password')}</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={isSubmitting}>
                    <ButtonLoader
                        isSubmitting={isSubmitting}
                        btnText={t("Register")}
                        loaderText={t("Creating account...")}
                        icon={<UserPlus className="w-4 h-4" />}
                    />
                </Button>



            </form>
        </Form>
    )
}