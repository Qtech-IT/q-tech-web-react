import React from 'react';
import { Card, CardContent} from '@/Components/UI/Card';
import { OnboardingProps } from '@/Types/User';
import { Head } from '@inertiajs/react';
import WelcomeStep from './Steps/WelcomeStep';
import { useTranslations } from '@/Hooks/useTranslations';
import SystemSetupStepForm from '@/Components/Forms/Onboarding/SystemSetupStepForm';
import SuperAdminSetupStepForm from '@/Components/Forms/Onboarding/SuperAdminSetupStepForm';

const OnboardingWrapper: React.FC<OnboardingProps> = ({ title, step:stepName, systemName}) => {

    const {t} = useTranslations();
    const  onboardingSteps = [
                                {
                                    step : 'business_setup',
                                    component : SystemSetupStepForm
                                },

                                {
                                    step : 'account_setup',
                                    component : SuperAdminSetupStepForm
                                }
                             ];

    const onboardingStep = onboardingSteps?.find(onboardingStep => onboardingStep.step == stepName);
    const  StepToRender  = onboardingStep?.component ?? WelcomeStep ;
    

    return (
        <>
           <Head title={title}/>
            <div className="min-h-screen bg-slate-50">

               {
                    StepToRender ? (
                        <StepToRender systemName={systemName}/>
                    ) : (
                        <div className="flex h-screen items-center justify-center">
                            <Card className="w-full max-w-md">
                                <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                                    <p className="text-slate-600">
                                        {t('Step not found')}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default OnboardingWrapper;
