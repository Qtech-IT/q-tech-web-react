import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardContent } from '@/Components/UI/Card';
import { useTranslations } from '@/Hooks/useTranslations';
import { CheckCircle, Circle, X } from 'lucide-react';
import * as React from 'react';

type BulkActionsCardProps = {
  selectedItems: any[];
  onOpenBulkDialog: () => void;
  onClearSelection: () => void;
};

export const BulkActionsCard: React.FC<BulkActionsCardProps> = ({
  selectedItems,
  onOpenBulkDialog,
  onClearSelection,
}) => {
  if (!selectedItems || selectedItems?.length === 0) return null;
  const { t } = useTranslations();

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Left: selected count */}
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <Badge variant="secondary" className="text-sm font-medium shrink-0">
              {selectedItems.length} {t('Items selected')}
            </Badge>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={onOpenBulkDialog}
              variant="outline"
              className="flex-1 sm:flex-none sm:min-w-[140px] gap-2"
            >
              <Circle className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('Bulk Actions')}</span>
            </Button>

            {/* Full label on sm+, icon-only on mobile */}
            <Button
              variant="ghost"
              onClick={onClearSelection}
              className="flex-1 sm:flex-none gap-2"
            >
              <X className="w-4 h-4 shrink-0 sm:hidden" />
              <span className="hidden sm:inline">{t('Cancel Selection')}</span>
              <span className="sm:hidden">{t('Cancel')}</span>
            </Button>

          </div>

        </div>
      </CardContent>
    </Card>
  );
};