import { Button } from '@/Components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { insertKeyAtCursor } from '@/Controllers/Backend/NotificationTemplateController';
import { useTranslations } from '@/Hooks/useTranslations';
import { handleCopyKey } from '@/Utils/helpers';
import { Code, Copy, Key } from 'lucide-react';

export const TemplateKeysSidebar = ({ templateKeys, editorRef }: { templateKeys: any, editorRef: any }) => {

    const { t } = useTranslations();

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Key className="w-4 h-4" />
                        {t('Template Keys')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('Click to insert or copy template keys')}
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.entries(templateKeys).map(([key, description]) => (
                        <div
                            key={key}
                            className="p-3 transition-colors border rounded-lg group hover:bg-muted/50"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded ">
                                            {`{{${key}}}`}
                                        </code>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {description as any}
                                    </p>
                                </div>
                                <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="w-6 h-6"
                                        onClick={() => insertKeyAtCursor(editorRef, key)}
                                        title="Insert at cursor">
                                        <Code className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="w-6 h-6"
                                        onClick={() => handleCopyKey(`{{${key}}}`)}
                                        title="Copy to clipboard">
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {Object.keys(templateKeys).length === 0 && (
                        <div className="py-6 text-center text-muted-foreground">
                            <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                                {t('No template keys available')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

};

export default TemplateKeysSidebar;
