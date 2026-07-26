import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/Components/UI/Button'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/Components/UI/Form'
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { User, Camera, CheckCircle, Info } from 'lucide-react'
import { onAccountUpdate } from '@/Controllers/Backend/ProfileController'
import { ButtonLoader } from '@/Components/UI/ButtonLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Alert, AlertDescription } from '@/Components/UI/Alert'
import { Badge } from '@/Components/UI/Badge'
import { useTranslations } from '@/Hooks/useTranslations'
import { User as SystemUser } from '@/Types/User'
import { useProfileUpdateConfig } from '@/Config/useProfileUpdateConfig'
import { DynamicFormInput } from '@/Components/Core/DynamicCrud/DynamicFormInput'
import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper'
import { usePage } from '@inertiajs/react'
import { OtpVerificationModal } from '@/Components/Feature/Backend/Profile/OtpVerificationModal'

const accountFormSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email('Enter valid email'),
  phone: z.string().optional(),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, "Must be a file")
    .optional()
})

export function ProfileForm({user,routePrefix}:{user:SystemUser,routePrefix:string}) {


  const {flash} = usePage().props as any;


  const [showOtpModal, setShowOtpModal] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')


  useEffect(() => {
    if (flash?.data?.show_otp_modal && flash?.data?.pending_email) {
      setShowOtpModal(true)
      setPendingEmail(flash?.data?.pending_email)
    }
  }, [flash])



  const [imagePreview, setImagePreview] = useState(user?.img_url || null)
  
  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const {t}            = useTranslations();

  const config         = useProfileUpdateConfig();

  const imageFields    = config?.form?.fields.filter((f :any) => f.section === 'image');
  const basicFields    = config?.form?.fields.filter((f :any) => f.section === 'basic');

  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      username: user?.username || '',
      phone: user?.phone || '',
      image: null
    }
  })



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <User className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
           {t('Profile Settings')}
        </h1>
        <div className="flex gap-2 ml-auto">
          <Badge variant="outline" className="text-xs">
             {t('Account Management')}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => onAccountUpdate(e ,user,submit ,routePrefix))} className='space-y-6'>

          {/* Profile Overview */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                   {t('Account Information')}
                </p>
                <p className="text-sm">
                    {t('Update your personal information and profile settings. Changes will be reflected across your account')}
                </p>

              </div>
            </AlertDescription>
          </Alert>

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-500" />
                <CardTitle>
                    {t('Profile Picture')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>


                {imageFields?.map((field : any) => (
                    <FormField
                      key={field.name}
                      control={form.control as any}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"
                            required={field.required}
                          >
                            {field.icon}
                            {t(field.label)}
                
                          </FormLabel>
                          <FormControl>
                            <DynamicFormInput
                              field={field}
                              value={formField.value}
                              onChange={(val) => {
                                formField.onChange(val);
                                if (val && val instanceof File) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setImagePreview(reader.result as string);
                                  reader.readAsDataURL(val);
                                }
                              }}
                              error={(form.formState.errors as any)[field.name]?.message}
                              disabled={isSubmitting}
                              previewImgUrl={field?.previewImgDbKey ? (user as any)[field.previewImgDbKey] : null}
    
                            />

                          </FormControl>
                          {field.description && (
                            <FormDescription>{t(field.description)}</FormDescription>
                          )}
                          <FormMessage />
                          {serverErrors?.[field.name] && (
                            <p className="text-sm font-medium text-destructive">
                              {serverErrors[field.name]}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                ))}

            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                <CardTitle>
                   {t('Personal Information')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {basicFields?.map((field : any , index : number) => (
                                        
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


          {/* Submit Button */}
          <Button disabled={isSubmitting} type='submit'>
            <ButtonLoader isSubmitting={isSubmitting} />
          </Button>

        </form>
      </Form>

       {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={pendingEmail}
        routePrefix={routePrefix}
      />
    </div>
  )
}
