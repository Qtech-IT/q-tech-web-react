import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { cn } from '@/Utils/helpers'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useForm as useInertiaForm } from '@/Hooks/useForm'
import { usePermission } from '@/Hooks/usePermission'
import { SubmitFunction } from '@/Types'

interface Language {
  code: string
  name?: string
}

interface LanguageSettings {
  available_languages?: { data?: Language[] }
  current_language?: string
}

interface LanguageSwitchProps {
  languageSettings?: LanguageSettings
}

export function LanguageSwitch({ languageSettings }: LanguageSwitchProps) {

  let { available_languages, current_language: dbLanguage } = languageSettings || {};
  const languages: Language[] = available_languages?.data || [];


  const [language, setLanguage] = useState<string | undefined>(dbLanguage)

  const { loading: isSubmitting, submit } = useInertiaForm()

  const { can } = usePermission()

  const handleLanguageChange = async (submit: SubmitFunction, lang: any, setLanguage: any) => {

    try {
      await submit({
        method: 'POST',
        url: route('backend.settings.switch.language'),
        data: {
          id: lang.id,
        }
      });

      setLanguage(lang?.code);

    } catch (error) {
    }
  }

  useEffect(() => {
    if (dbLanguage) {
      setLanguage(dbLanguage)
    }
  }, [dbLanguage])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='px-3 scale-95 rounded-full'>
          <span className='text-sm font-semibold uppercase'>
            {language || 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>

      {
        can('language.edit') &&
        (
          <DropdownMenuContent align='end'>
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}

                onClick={() => handleLanguageChange(submit, lang, setLanguage)}
              >
                {lang.code.toUpperCase()}
                <Check
                  size={14}
                  className={cn('ms-auto', language !== lang.code && 'hidden')}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )
      }



    </DropdownMenu>
  )
}
