import { useState } from "react"
import { Button } from "@/Components/UI/Button"
import { TwoFaDialog } from "./TwoFaDialog"
import { handle2faDisable, handleRegenerate2faCodes } from "@/Controllers/Backend/ProfileController"
import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { Loader2 } from "lucide-react"
import { User } from "@/Types/User"
import { useTranslations } from "@/Hooks/useTranslations"
import { RecoveryCodesSection } from "./RecoveryCodesSection"

export default function TwoFAConfig({user,setupData, routePrefix} : {user:User , setupData:any ,routePrefix:string}) {

  const [open, setOpen] = useState(false)

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()
  const { loading: isLoading, submit:disableFn }                = useInertiaForm()
  
  const qrCodeUrl     = setupData?.qr_code;
  const recoveryCodes = user?.recovery_codes || [];
  const {t}           = useTranslations();

  return (

        <>
            <div className="max-w-xl">
                <div className="space-y-4">
                    {!user?.two_factor_enabled ? (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                        {t("Protect your account by enabling two factor authentication. You will be asked for a secure token in addition to your password")}
                        </p>
                        <Button onClick={()=>setOpen(true)}>
                            {t('Enable')}
                        </Button>
                    </div>
                    ) : (
                    <div className="space-y-6">

                        <p className="text-sm text-muted-foreground">
                            {
                                t('You have enabled two factor authentication. Scan the QR code below with your authenticator app, and store your recovery codes securely.')
                            }
                        </p>

                        <div className="flex justify-center">
                           <img src={qrCodeUrl} alt="QR Code" className="rounded-lg" />
                        </div>

    
                        <RecoveryCodesSection
                            recoveryCodes={recoveryCodes} 
                            t={t} 
                        />

                        <div className="flex gap-3">
                            <Button disabled={isSubmitting}  type="button" variant="outline" onClick={() => handleRegenerate2faCodes(submit ,routePrefix)}>
                                {isSubmitting && <Loader2 className='animate-spin' />}
                                {t('Regenerate Recovery Codes')}
                            </Button>
                            <Button  onClick={() => handle2faDisable(disableFn , routePrefix)} disabled={isLoading} type="button" variant="destructive" >
                                {isLoading && <Loader2 className='animate-spin' />}
                                {t('Disable')}
                            </Button>
                        </div>

                    </div>
                    )}
                </div>
            </div>

            <TwoFaDialog
                open={open}
                onOpenChange={setOpen}
                qrCodeUrl={setupData?.qr_code}
                routePrefix={routePrefix}
            />
        </>
   )
}
