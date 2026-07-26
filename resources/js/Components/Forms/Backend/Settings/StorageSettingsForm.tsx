import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Loader2, Info } from 'lucide-react';

import { Button } from '@/Components/UI/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/Components/UI/Form';
import { Input } from '@/Components/UI/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { onSettingsUpdate } from '@/Controllers/Backend/SettingsController';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Alert, AlertDescription } from '@/Components/UI/Alert';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import Checkbox from '@/Components/UI/Checkbox';
import { useTranslations } from '@/Hooks/useTranslations';
import { DynamicInputWrapper } from '@/Components/Core/DynamicCrud/DynamicInputWrapper';
import { useSettingsConfig } from '@/Config/useSettingsConfig';

interface FTPConfig {
  host?: string;
  port?: string;
  user_name?: string;
  password?: string;
  root?: string;
}

interface S3Config {
  s3_key?: string;
  s3_secret?: string;
  s3_region?: string;
  s3_bucket?: string;
}

interface SiteSettings {
  storage: 'local' | 's3' | 'ftp';
  ftp_configuration?: FTPConfig;
  s3_configuration?: S3Config;
  mime_types?: string[];
  max_file_size?: string;
  max_file_upload?: string;
}

interface StorageSettingsProps {
  props: {
    storage?: 'local' | 's3' | 'ftp';
    aws_config?: S3Config;
    ftp_config?: FTPConfig;
    max_file_size?: string;
    mime_types?: string[];
    max_file_upload?: string;
  };
}

const storageSettingsSchema : any = z
  .object({
    site_settings: z.object({
      storage: z.string(),
      ftp_configuration: z
        .object({
          host: z.string().optional(),
          port: z.string().optional(),
          user_name: z.string().optional(),
          password: z.string().optional(),
          root: z.string().optional(),
        })
        .optional(),
      s3_configuration: z
        .object({
          s3_key: z.string().optional(),
          s3_secret: z.string().optional(),
          s3_region: z.string().optional(),
          s3_bucket: z.string().optional(),
        })
        .optional(),
      mime_types: z.array(z.string()).optional(),
      max_file_size: z.string().optional(),
      max_file_upload: z.string().optional(),
    }),
  })
  .refine((data) => {
    if (data.site_settings.storage === 'ftp') {
      const ftp = data.site_settings.ftp_configuration;
      return ftp?.host && ftp?.port && ftp?.user_name && ftp?.password;
    }
    return true;
  }, {
    message: 'FTP settings are required when FTP is selected',
    path: ['site_settings', 'ftp_configuration', 'host'],
  })
  .refine((data) => {
    if (data.site_settings.storage === 's3') {
      const s3 = data.site_settings.s3_configuration;
      return s3?.s3_key && s3?.s3_secret && s3?.s3_region && s3?.s3_bucket;
    }
    return true;
  }, {
    message: 'S3 settings are required when S3 is selected',
    path: ['site_settings', 's3_configuration', 's3_key'],
  });

export const StorageSettingsForm: React.FC<StorageSettingsProps> = ({ props }) => {
  const {
    storage,
    aws_config: awsConfig,
    ftp_config: ftpConfig,
    max_file_size: maxFileSize,
    mime_types: mimeTypes,
    max_file_upload: maxFileUpload,
  } = props;

  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(mimeTypes || []);
  const { loading: isSubmitting, errors:serverErrors, submit } = useInertiaForm();

  const form = useForm<{ site_settings: SiteSettings }>({
    resolver: zodResolver(storageSettingsSchema),
    defaultValues: {
      site_settings: {
        storage: storage || 'local',
        ftp_configuration: {
          host: ftpConfig?.host || '',
          port: ftpConfig?.port || '21',
          user_name: ftpConfig?.user_name || '',
          password: ftpConfig?.password || '',
          root: ftpConfig?.root || '/',
        },
        s3_configuration: {
          s3_key: awsConfig?.s3_key || '',
          s3_secret: awsConfig?.s3_secret || '',
          s3_region: awsConfig?.s3_region || 'us-east-1',
          s3_bucket: awsConfig?.s3_bucket || '',
        },
        mime_types: mimeTypes || ['jpg', 'png', 'pdf'],
        max_file_size: maxFileSize || '10',
        max_file_upload: maxFileUpload || '5',
      },
    },
  });

  const watchStorageType = form.watch('site_settings.storage');
  const {t}              = useTranslations();


  const storageTypes = [
    {
      label:t('Local Storage'),
      value:'local'
    },
    {
      label:t('Amazon S3'),
      value:'s3'
    },
    {
      label:t('FTP Server'),
      value:'ftp'
    }
  ];

  const config = useSettingsConfig();


  const ftpFormFields = config?.form?.ftp_fields || [];

  const awsFormFields = config?.form?.aws_fields || [];



  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSettingsUpdate(data, submit))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
               {t('Storage Configuration')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Storage Type Selection */}



            <FormField
              control={form.control as any}
              name="site_settings.storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('Storage Type')}
                  </FormLabel>

                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select storage type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>

                      {
                        storageTypes?.map((type , index) => {
                          return (
                             <SelectItem key={index} value={type?.value}>
                                {type?.label}
                             </SelectItem>
                          )
                        })
                      }

                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FTP Settings */}
            {watchStorageType === 'ftp' && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">
                     {t('FTP Configuration')}
                  </CardTitle>
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                        {t(' Make sure your FTP server supports passive mode and has proper firewall configuration for file transfers.')}
                    </AlertDescription>
                  </Alert>
                </CardHeader>
                <CardContent className="space-y-4">


                      {ftpFormFields?.map((field :any , index :any) => (
                                        
                        <DynamicInputWrapper
                          key={field.name || index} 
                          field ={field}
                          form ={form}
                          isSubmitting ={isSubmitting}
                          serverErrors ={serverErrors}
                        />

                      ))}



                  {/* <div className="grid grid-cols-2 gap-4">

                    <FormField
                      control={form.control}
                      name="site_settings.ftp_configuration.host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Host</FormLabel>
                          <FormControl>
                            <Input placeholder="ftp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="site_settings.ftp_configuration.port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="21" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="site_settings.ftp_configuration.user_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="your-username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site_settings.ftp_configuration.password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="your-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="site_settings.ftp_configuration.root"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Root Directory</FormLabel>
                        <FormControl>
                          <Input placeholder="/" {...field} />
                        </FormControl>
                        <FormDescription>The root directory path on the FTP server</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}


                </CardContent>
              </Card>
            )}

            {/* S3 Settings */}
            {watchStorageType === 's3' && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">
                      {t('Amazon S3 Configuration')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">


                      {awsFormFields?.map((field :any , index :any) => (
                                        
                        <DynamicInputWrapper
                          key={field.name || index} 
                          field ={field}
                          form ={form}
                          isSubmitting ={isSubmitting}
                          serverErrors ={serverErrors}
                        />

                      ))}
{/* 
                  <div className="grid grid-cols-2 gap-4">

                    <FormField
                      control={form.control}
                      name="site_settings.s3_configuration.s3_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Key ID</FormLabel>
                          <FormControl>
                            <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site_settings.s3_configuration.s3_secret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Access Key</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="site_settings.s3_configuration.s3_region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <Input placeholder="us-east-1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site_settings.s3_configuration.s3_bucket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bucket Name</FormLabel>
                          <FormControl>
                            <Input placeholder="my-app-bucket" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Button disabled={isSubmitting} type="submit">
          <ButtonLoader isSubmitting={isSubmitting} />
        </Button>
      </form>
    </Form>
  );
};
