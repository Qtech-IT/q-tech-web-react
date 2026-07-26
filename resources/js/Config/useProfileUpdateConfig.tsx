import { useTranslations } from '@/Hooks/useTranslations';
import {  Camera, Lock, Mail,  Phone, Upload, User } from 'lucide-react';
import { z } from 'zod';

export function useProfileUpdateConfig(): any{

  const {t} = useTranslations()

  return {

    form: {
        fields: [
           
            {
                name: 'image',
                label: t('Profile Image'),
                type: 'file',
                description: t('Upload a profile picture'),
                required: false,
                icon:  <Camera className="w-4 h-4" />,
                validation: z.any().optional(),
                accept: 'image/*',
                preview: true,
                gridColumn: 'span 2',
                section: 'image',
                previewImgDbKey:'img_url'
            },

             // Username
            {
                name: 'username',
                label: t('Username'),
                type: 'text',
                placeholder: t('Enter username...'),
                description: t('Unique username for login'),
                required: true,
                icon: <User className="h-4 w-4" />,
                validation: z.string().min(3, 'Username is required').max(50),
                section: 'basic',
            },

            {
                name: 'name',
                label: t('Full Name'),
                type: 'text',
                placeholder: t('Enter full name...'),
                description: t('Your display name that will appear throughout the application'),
                required: true,
                icon: <User className="h-4 w-4" />,
                validation: z.string().min(1, 'Name is required').max(191),
                section: 'basic',
            },

            {
                name: 'email',
                label: t('Email Address'),
                type: 'email',
                placeholder: t('Enter email address...'),
                description: t('Primary email address for account notifications and login'),
                required: true,
                icon: <Mail className="h-4 w-4" />,
                validation: z.string().email({ message: 'Invalid email' }).max(191),
                section: 'basic',
            },

            {
                name: 'phone',
                label: t('Phone Number'),
                type: 'tel',
                placeholder: t('Enter phone number...'),
                description: t('Optional phone number for account security and contact purposes'),
                required: true,
                icon: <Phone className="h-4 w-4" />,
                validation: z.string().min(5, 'Phone number is required').max(20),
                section: 'basic',
            },


        ],
    }


  }
}
