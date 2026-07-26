import { Button } from "@/Components/UI/Button";
import { useTranslations } from "@/Hooks/useTranslations";
import { router } from "@inertiajs/react";
import { ArrowRight, User } from "lucide-react";

const WelcomeStep = ({systemName}:any) => {

    const {t} = useTranslations();

    return (
        <>
            <div className="mx-auto h-screen max-w-3xl px-4">

                <div className="flex h-full flex-col items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-slate-100">
                       <User className="h-16 w-16 text-slate-600" />
                    </div>
                    <div className="mt-8 text-center">
                    <h2 className="text-4xl font-bold text-slate-900">
                        {t('Welcome to')} {systemName} {t('System')}
                    </h2>
                    <p className="mt-4 max-w-xl text-center text-xl text-slate-600">
                        {t('This setup screen will guide you step by step to configure the system for your organization.')}
                    </p>
                    <Button
                        className="mt-10"
                        onClick={() => router.visit(route('onboarding.index',{step:'business_setup'}))}
                    >
                        {t("Let's Start")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                </div>

            </div>
        </>
    )

}
export default  WelcomeStep;