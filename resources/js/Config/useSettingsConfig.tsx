import { useTranslations } from '@/Hooks/useTranslations';
import { LockIcon, Mail, Mailbox, MailCheckIcon, MapPin, Server, Shield, User } from 'lucide-react';
import { z } from 'zod';

export function useSettingsConfig(timeZones = [], dateFormats = [], timeFormats = []): any {

    const { t } = useTranslations()

    return {

        form: {

            ftp_fields: [
                {
                    name: 'site_settings.ftp_configuration.host',
                    label: t('Host'),
                    type: 'text',
                    placeholder: t('ftp.example.com'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Host is required').max(191),
                },
                {
                    name: 'site_settings.ftp_configuration.port',
                    label: t('Port'),
                    type: 'number',
                    placeholder: t('21'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string(),
                },
                {
                    name: 'site_settings.ftp_configuration.user_name',
                    label: t('Username'),
                    type: 'text',
                    placeholder: t('your-username'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Username is required').max(191),
                },
                {
                    name: 'site_settings.ftp_configuration.password',
                    label: t('Password'),
                    type: 'password',
                    placeholder: t('your-password'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Password is required').max(191),
                },
                {
                    name: 'site_settings.ftp_configuration.root',
                    label: t('Root Directory'),
                    type: 'text',
                    placeholder: t('/'),
                    required: false,
                    gridColumn: 'span 2',
                    description: t('The root directory path on the FTP server'),
                    validation: z.string().optional(),
                }
            ],
            aws_fields: [
                {
                    name: 'site_settings.s3_configuration.s3_key',
                    label: t('Access Key ID'),
                    type: 'text',
                    placeholder: t('AKIAIOSFODNN7EXAMPLE'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Access Key ID is required').max(191),
                },
                {
                    name: 'site_settings.s3_configuration.s3_secret',
                    label: t('Secret Access Key'),
                    type: 'password',
                    placeholder: t('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Secret Access Key is required').max(191),
                },
                {
                    name: 'site_settings.s3_configuration.s3_region',
                    label: t('Region'),
                    type: 'text',
                    placeholder: t('us-east-1'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Region is required').max(191),
                },
                {
                    name: 'site_settings.s3_configuration.s3_bucket',
                    label: t('Bucket Name'),
                    type: 'text',
                    placeholder: t('my-app-bucket'),
                    required: true,
                    gridColumn: 'span 1',
                    validation: z.string().min(1, 'Bucket Name is required').max(191),
                },
            ],
            general_settings_fields: [

                // Company Name
                {
                    name: 'site_settings.company_name',
                    label: t('Company Name'),
                    type: 'text',
                    placeholder: t('Enter company name...'),
                    required: true,
                    description: t('The name of your website or application that will appear in titles and headers'),
                    section: 'basic',
                },

                // Company Email
                {
                    name: 'site_settings.company_email',
                    label: t('Company Email'),
                    type: 'email',
                    placeholder: t('Enter company email...'),
                    required: true,
                    description: t('The name of your website or application that will appear in titles and headers'),
                    section: 'contact',
                },

                // Company Phone
                {
                    name: 'site_settings.company_phone',
                    label: 'Company Phone',
                    type: 'text',
                    placeholder: t('Enter company phone...'),
                    required: false,
                    gridColumn: 'span 2',
                    section: 'contact',
                    description: t('Primary contact phone number for customer support and inquiries')
                },



                {
                    name: 'site_settings.copy_right_text',
                    label: t('Copy right text'),
                    type: 'text',
                    placeholder: `{company_name} ` + t('All rights reserved'),
                    description: t(`Copyright notice that will appear in the footer and legal pages. Use`) + ' {company_name} ' + t('as a variable to auto-fill your company name'),
                    required: true,
                    gridColumn: 'span 2',
                    section: 'basic',
                },

                {
                    name: 'site_settings.pagination_number',
                    label: t('Data per page'),
                    type: 'number',
                    placeholder: t('10'),
                    description: t(`Default number of items to display per page in data tables and lists (1-1000)`),
                    required: true,
                    gridColumn: 'span 2',
                    min: 5,
                    max: 1000,
                    step: 'any',
                    section: 'basic',
                },



                // Full Address
                {
                    name: 'site_settings.address.full_address',
                    label: 'Full Address',
                    type: 'text',
                    placeholder: t('Enter full address...'),
                    description: t('Complete address'),
                    required: true,
                    icon: <MapPin className="h-4 w-4" />,
                    validation: z.string().min(1, 'Full address is required'),
                    gridColumn: 'span 2',
                    section: 'address',
                },

                // City
                {
                    name: 'site_settings.address.city',
                    label: 'City',
                    type: 'text',
                    placeholder: t('Enter city...'),
                    description: t('City name'),
                    required: false,
                    icon: <MapPin className="h-4 w-4" />,
                    validation: z.string().optional(),
                    gridColumn: 'span 1',
                    section: 'address',
                },

                // Postal Code
                {
                    name: 'site_settings.address.postal_code',
                    label: 'Postal Code',
                    type: 'text',
                    placeholder: t('Enter postal code...'),
                    description: t('Postal or ZIP code'),
                    required: false,
                    icon: <Mailbox className="h-4 w-4" />,
                    validation: z.string().optional(),
                    gridColumn: 'span 1',
                    section: 'address',
                },


                {
                    name: 'site_settings.timezone',
                    label: t('Time Zone'),
                    type: 'select',
                    placeholder: t('Select time zone'),
                    description: t(`Default timezone for displaying dates and times throughout the application`),
                    required: true,
                    options: timeZones || [],
                    gridColumn: 'span 2',
                    section: 'date_time',
                },

                {
                    name: 'site_settings.date_format',
                    label: t('Date Format'),
                    type: 'select',
                    placeholder: t('Select date format'),
                    description: t(`How dates will be displayed across the application interface`),
                    required: true,
                    options: dateFormats || [],
                    gridColumn: 'span 2',
                    section: 'date_time',
                },

                {
                    name: 'site_settings.time_format',
                    label: t('Time Format'),
                    type: 'select',
                    placeholder: t('Select time format'),
                    description: t(`How times will be displayed across the application interface`),
                    required: true,
                    options: timeFormats || [],
                    gridColumn: 'span 2',
                    section: 'date_time',
                },



            ],
            smtp_mail_configuration: [
                {
                    name: 'mail_mailer',
                    label: t('Mail Driver'),
                    type: 'text',
                    placeholder: t('Enter mail driver...'),
                    required: true,
                    description: t('The mail driver to use for sending emails'),
                    icon: <Server className="w-4 h-4" />,
                    section: 'basic',
                },
                {
                    name: 'mail_host',
                    label: t('Mail Host'),
                    type: 'text',
                    icon: <MailCheckIcon className="w-4 h-4" />,
                    placeholder: t('e.g., smtp.gmail.com, smtp.mailtrap.io'),
                    required: true,
                    description: t('SMTP server hostname or IP address'),
                    section: 'basic',
                },

                {
                    name: 'mail_port',
                    label: t('Mail Port'),
                    type: 'number',
                    placeholder: t('e.g., 587, 465, 2525'),
                    icon: <Server className="w-4 h-4" />,
                    required: true,
                    min: 1,
                    description: t('Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)'),
                    section: 'basic',
                },


                {
                    name: 'mail_username',
                    label: t('Username'),
                    type: 'text',
                    placeholder: t('SMTP username'),
                    icon: <User className="w-4 h-4" />,
                    required: true,
                    description: t('Your SMTP username (often your email address)'),
                    section: 'authentication'
                },

                {
                    name: 'mail_password',
                    label: t('Password'),
                    type: 'password-input',
                    placeholder: t('SMTP password or app password'),
                    icon: <LockIcon className="w-4 h-4" />,
                    description: t('Your SMTP password (use app-specific password for Gmail)'),
                    section: 'authentication',
                    required: true,
                },

                {
                    name: 'encryption',
                    label: t('Encryption'),
                    type: 'select',
                    icon: <Shield className="w-4 h-4" />,
                    options: [
                        {
                            value: 'tls',
                            label: 'TLS'
                        },
                        {
                            value: 'ssl',
                            label: 'SSL'
                        },
                        {
                            value: 'none',
                            label: 'None'
                        },
                    ],
                    section: 'authentication',
                    required: true,
                },


                {
                    name: 'mail_form_address',
                    label: t('From Email Address'),
                    type: 'email',
                    placeholder: t('e.g., noreply@example.com'),
                    icon: <Mail className="w-4 h-4" />,
                    description: t('Email address that will appear as the sender in outgoing emails'),
                    section: 'mail_form_section',
                    required: true,
                },


            ]
        }
    }
}
