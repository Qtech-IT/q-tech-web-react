import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/Alert';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/UI/Dialog';
import { Label } from '@/Components/UI/Label';
import { Textarea } from '@/Components/UI/Textarea';
import { useForm as useInertiaForm } from '@/Hooks/useForm';
import { useTranslations } from '@/Hooks/useTranslations';
import { FORMAT_EXTENSION_MAP } from '@/Utils/constants';
import {
    AlertCircle,
    Download,
    FileText,
    HardDrive,
    Loader2,
    Upload,
    X
} from 'lucide-react';
import React, { useState } from 'react';


interface ImportDialogProps {
    open: boolean;
    onClose: () => void;
    distributionHub: any;
    month: number;
    year: number;
    isReimport: boolean;
    modelProperty: Record<string, any>;
    importFormat?: string;
    demoFiles?: { csv?: string; exel?: string };
    postUrl?: string
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


export default function ImportDialog({
    open,
    onClose,
    distributionHub,
    month,
    year,
    isReimport,
    modelProperty,
    importFormat = 'CSV',
    demoFiles = {},
    postUrl
}: ImportDialogProps) {
    const { t } = useTranslations();
    const { loading: isSubmitting, submit } = useInertiaForm();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [force, setForce] = useState(false);
    const [reimportReason, setReimportReason] = useState('');

    function formatSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }


    const handleClose = () => {
        setSelectedFile(null);
        setFileErrors([]);
        setForce(false);
        setReimportReason('');
        onClose();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type !== 'dragleave');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) validateFile(e.dataTransfer.files[0]);
    };

    const validateFile = (file: File) => {
        setFileErrors([]);
        const ext = file.name.split('.').pop()?.toLowerCase();


        const formatKey = importFormat.toLowerCase().trim();
        const validExts = FORMAT_EXTENSION_MAP[formatKey]
            ?? importFormat.toLowerCase().split(',').map(f => f.trim());

        if (!validExts.includes(ext || '')) {
            setFileErrors([`Invalid format. Accepted: ${importFormat}`]);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setFileErrors(['File size exceeds 10MB limit']);
            return;
        }
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setFileErrors(['Please select a file']);
            return;
        }
        if (isReimport && force && !reimportReason.trim()) {
            setFileErrors(['Please provide a reason for re-importing']);
            return;
        }

        try {
            let data = await submit({
                method: 'POST',
                url: postUrl ?? '',
                data: {
                    file: selectedFile,
                    month,
                    year,
                    force: (isReimport || force) ? 1 : 0,
                    reimport_reason: reimportReason,
                },
            });
            handleClose();
        } catch (error: any) {

            const msg = error?.message ?? '';
            if (msg.includes('month_exists') || msg.includes('already exist')) {
                setForce(true);
            } else {
                setFileErrors([msg || t('Import failed.')]);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {isReimport ? t('Re-import') : t('Import')}
                    </DialogTitle>
                    <DialogDescription>
                        {MONTHS[month - 1]} {year}
                        {isReimport && (
                            <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300 text-xs">
                                {t('Will overwrite existing data')}
                            </Badge>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-1">

                    {/* Demo download */}
                    {(demoFiles.csv || demoFiles?.exel!) && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                            <Download className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="text-xs text-blue-800 dark:text-blue-300 flex-1">
                                {t('Download demo file to see the required format')}
                            </span>
                            <div className="flex gap-2">
                                {demoFiles.csv && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs"
                                        onClick={() => { window.location.href = demoFiles.csv!; }}
                                    >
                                        {t('CSV')}
                                    </Button>
                                )}
                                {demoFiles?.exel && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs"
                                        onClick={() => { window.location.href = demoFiles?.exel!; }}
                                    >
                                        {t('Excel')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Drop zone */}
                    <label
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`block p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                            }`}
                    >
                        <input
                            type="file"
                            onChange={e => e.target.files?.[0] && validateFile(e.target.files[0])}
                            accept={importFormat === 'CSV' ? '.csv' : '.xlsx,.xls'}

                            className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-200 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-800'
                                }`}>
                                <Upload className={`w-5 h-5 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
                            </div>
                            <p className="text-sm font-medium">{t('Drag & drop or click to browse')}</p>
                            <Badge variant="secondary" className="text-xs">{importFormat}</Badge>
                        </div>
                    </label>

                    {/* File preview */}
                    {selectedFile && (
                        <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                            <HardDrive className="w-3 h-3" />
                                            {formatSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedFile(null); setFileErrors([]); }}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Force re-import section — shown after conflict or when re-importing */}
                    {(isReimport || force) && (
                        <div className={`space-y-2 p-3 rounded-lg border ${force
                            ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
                            : 'border-muted bg-muted/30'
                            }`}>
                            {force && (
                                <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                                    ⚠️ {t('Off days for this month already exist. Uploading will overwrite all existing data.')}
                                </p>
                            )}
                            <div className="space-y-1.5">
                                <Label className="text-xs">
                                    {t('Reason for re-import')} <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    placeholder={t('Provide a reason for overwriting existing data...')}
                                    value={reimportReason}
                                    onChange={e => setReimportReason(e.target.value)}
                                    rows={2}
                                    className="text-sm resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* File errors */}
                    {fileErrors.length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('Error')}</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    {fileErrors.map((err, i) => (
                                        <li key={i} className="text-xs">{err}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isSubmitting || ((isReimport || force) && !reimportReason.trim())}
                        variant={force ? 'destructive' : 'default'}
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {force ? t('Force Import') : isReimport ? t('Re-import') : t('Import')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}