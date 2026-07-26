import { useTranslations } from '@/Hooks/useTranslations';
import { Lock} from 'lucide-react';
import { z } from 'zod';

export function usePasswordUpdateConfig({passwordLength}:{passwordLength :any}): any{


  const {t} = useTranslations()

  return {


    form: {
        fields: [
           
            // Password
            {
                name: 'password',
                label: t('New Password'),
                type: 'password',
                placeholder: t('Enter new password...'),
                description: t(`Password must be at least ${passwordLength} characters long. Use a combination of letters, numbers, and special characters for better security.`),
                required: true,
                icon: <Lock className="h-4 w-4" />,
                validation: z.string().min(passwordLength, `Password must be at least ${passwordLength} characters`),
                section: 'security',
            },

            // Confirm Password
            {
                name: 'password_confirmation',
                label: t('Confirm Password'),
                type: 'password',
                placeholder: t('Confirm password...'),
                description: t('Re-enter your password to confirm'),
                required: true,
                icon: <Lock className="h-4 w-4" />,
                validation: z.string().min(passwordLength, 'Confirmation must match password'),
                section: 'security',
            },
        ],
    }


  }
}
