'use client';

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  HardDrive,
  Import,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

import CommonLayoutHeader from '@/Components/Feature/Backend/CommonLayoutHeader';
import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/Card';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import { MainLayout } from '@/Layouts/User/MainLayout';
import { FORMAT_EXTENSION_MAP } from '@/Utils/constants';

interface CrudImportModuleProps {
  title?: string;
  importFormat?: string;
  demoFiles?: {
    csv?: string;
    exel?: string;
  };
  onSubmit?: (file: File) => Promise<{ success?: boolean; errors?: Record<string, any> }>;
  [key: string]: any;
}

export default function CrudImportModule({
  config,
  title,
  importFormat,
  demoFiles = {},
  modelProperty,
  onSubmit = async () => ({}),
}: CrudImportModuleProps) {



  const routePrefix = modelProperty?.routePrefix || 'backend.location-trees';

  const { loading: isSubmitting, errors: serverErrors, submit } = useInertiaForm()

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type !== 'dragleave');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const validateFile = (file: File) => {

    setErrors([]);
    setSuccess('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    const safeImportFormat = importFormat?.toLowerCase().trim() || '';
    const formatKey = safeImportFormat;

    const validExts = FORMAT_EXTENSION_MAP[formatKey]
      ?? safeImportFormat.split(',').map(f => f.trim());

    if (!validExts?.includes(ext || '')) {
      setErrors([`Invalid format. Accepted: ${importFormat}`]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(['File size exceeds 10MB limit']);
      return;
    }

    setSelectedFile(file);
  };

  const downloadDemo = (format: 'csv' | 'exel') => {


    const url = demoFiles[format];
    if (!url) return;

    window.location.href = url;
  };

  const handleSubmit = async () => {

    if (!selectedFile) {
      setErrors(['Please select a file']);
      return;
    }

    try {
      await submit({
        method: 'POST',
        url: route(`${routePrefix}.import`),
        data: {
          file: selectedFile
        },
      })
    } catch (error) {
    }

  };

  const formatSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };


  const { t } = useTranslations();
  const breadcrumbItems = config?.breadcrumbs?.import || [];



  return (

    <MainLayout title={title!}>

      <CommonLayoutHeader
        variant="inner"
        breadcrumbItems={breadcrumbItems}
        title={t("Import")}
        description={`${t('Upload a')} ${importFormat} ${t('file to import your data. Download a demo file to understand the required format')}`}
        icon={Import}
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl">
            {t('Import Files')}
          </CardTitle>
          <CardDescription>
            {t('Select and upload your data file following the provided format')}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="space-y-8">
            {/* Demo Files Section */}
            <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />

                <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                  {t('Download Demo Files')}
                </h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {demoFiles.csv && (
                  <Button variant="outline" size="sm" onClick={() => downloadDemo('csv')}>
                    <Download className="w-3 h-3 mr-2" />
                    {t('CSV Demo')}
                  </Button>
                )}
                {demoFiles.exel && (
                  <Button variant="outline" size="sm" onClick={() => downloadDemo('exel')}>
                    <Download className="w-3 h-3 mr-2" />
                    {t(' Excel Demo')}
                  </Button>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <label
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`block p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all ${dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-slate-300 dark:border-slate-600'
                }`}
            >
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && validateFile(e.target.files[0])}
                accept={importFormat === 'CSV' ? '.csv' : '.xlsx,.xls'}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${dragActive ? 'bg-blue-200 dark:bg-blue-900/40' : 'bg-slate-200 dark:bg-slate-800'}`}>
                  <Upload className={`w-6 h-6 ${dragActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'}`} />
                </div>
                <p className="text-sm font-semibold mb-1">
                  {t('Drag and drop your file here')}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  {t('or click to browse')}
                </p>
                <Badge variant="secondary">{importFormat} </Badge>
              </div>
            </label>

            {/* File Preview */}
            {selectedFile && (
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{selectedFile.type || 'File'}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {t('File Size')}
                    </p>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      {formatSize(selectedFile.size)}
                    </p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {t('Format')}
                    </p>
                    <p className="text-sm font-semibold uppercase">{selectedFile.name.split('.').pop()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>
                  {t('Success')}
                </AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("Import Errors")} ({errors.length})</AlertTitle>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSubmit} disabled={!selectedFile || isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? 'Importing...' : 'Import File'}
              </Button>
              {selectedFile && (
                <Button variant="outline" onClick={() => { setSelectedFile(null); setErrors([]); setSuccess(''); }}>
                  {t("Clear")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>{t('Note')}:</strong>  {t('Ensure your file matches the demo format exactly. Each row will be validated and errors will be reported if found.')}
          </p>
        </div>
      </Card>


    </MainLayout>


  );
}