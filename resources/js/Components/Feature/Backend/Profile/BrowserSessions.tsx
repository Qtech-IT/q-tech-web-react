import { Button } from "@/Components/UI/Button"
import { ButtonLoader } from "@/Components/UI/ButtonLoader"
import { Separator } from "@/Components/UI/Separator"
import { handleLogoutOtherBrowser } from "@/Controllers/Backend/AuthController"
import { useForm } from "@/Hooks/useForm"
import { useTranslations } from "@/Hooks/useTranslations"
import { Laptop, Loader2, Monitor, Smartphone, Tablet } from "lucide-react"

export  function BrowserSessions({sessions}: {sessions: any[]}) {

 const { loading: isSubmitting, errors: serverErrors, submit } = useForm()

 const {t} = useTranslations();

 const getDeviceIcon = (device : string) => {

        switch (device?.toLowerCase()) {
        case 'phone':
        case 'mobile':
            return <Smartphone className="w-5 h-5 text-muted-foreground" />
        case 'tablet':
            return <Tablet className="w-5 h-5 text-muted-foreground" />
        case 'desktop':
            return <Monitor className="w-5 h-5 text-muted-foreground" />
        default:
            return <Laptop className="w-5 h-5 text-muted-foreground" />
        }
  }

   const formatSessionInfo = (session:any) => {
        const platform = session?.platform! || 'Unknown OS'
        const browser = session?.browser! || 'Unknown Browser'
        return `${platform} - ${browser}`
   }

  const formatLastActivity = (session :any) => {
    if (session.is_current) {
      return <span className="font-medium text-green-600">
         {t('This device')}
      </span>
    }
    return `${t('Last active')} ${session.last_activity}`
  }


 return (
    <div className="max-w-2xl">

      <div className="space-y-4">

        {sessions?.map((session :any, index : number) => (
            <div key={session?.id}>
                <div className="flex items-center gap-3">
                     {getDeviceIcon(session.device)}
                    <div className="flex flex-col">
                        <span className="text-sm font-medium"> {formatSessionInfo(session)}</span>
                        <span className="text-xs text-muted-foreground">
                          {session.ip_address} — {formatLastActivity(session)}
                        </span>
                    </div>
                </div>
               {index < sessions.length - 1 && <Separator  className="mt-4" />}
            </div>
        ))}

        <div className="pt-4">
          <Button  type='button' onClick={()=>handleLogoutOtherBrowser(submit)} disabled={!sessions || sessions.length <= 1 || isSubmitting } variant="default">

             <ButtonLoader 
              isSubmitting={isSubmitting}
              btnText={t('Logout Other Browser Sessions')}
              loaderText={t('Processing....')}
              
             />
          </Button>
        </div>
      </div>
    </div>
  )

}
