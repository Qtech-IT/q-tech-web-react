import { HotToaster } from "@/Components/UI/HotToast";
import { SafeImage } from "@/Components/UI/SafeImage";
import { useTranslations } from "@/Hooks/useTranslations";
import { ToastProvider } from "@/Providers/ToastProvider";
import { getLogoBykey } from "@/Utils/helpers";
import { usePage } from "@inertiajs/react";

export default function GuestLayout(props: any) {

  const { children, title = "Login", isAdminRoute = true } = props;

  const { props: sharedProps } = usePage();
  const companyLogo = getLogoBykey(sharedProps?.logos, 'company_logo');
  const { t } = useTranslations();

  return (
    <ToastProvider>
      <div className="min-h-screen w-full overflow-x-hidden bg-background flex items-start sm:items-center justify-center p-3 xs:p-4 sm:p-6">
        <div className="w-full max-w-xl my-auto">
          <div className="bg-card rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 space-y-5 sm:space-y-6 border">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-2xl p-3 shadow-lg">
                  <SafeImage
                    src={companyLogo}
                    alt={t('Company logo')}
                    className="w-10 h-10 text-primary-foreground"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('Welcome back! Please sign in to continue')}
                </p>
              </div>
            </div>

            {children}
          </div>
        </div>
        <HotToaster />
      </div>
    </ToastProvider>
  );
}