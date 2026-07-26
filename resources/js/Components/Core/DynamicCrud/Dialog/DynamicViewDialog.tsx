import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import type { CrudConfig } from '@/Types/crud';

interface DynamicViewDialogProps {
  config: CrudConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string>;
  size?: string;
}

export function DynamicViewDialog({
  config,
  open,
  onOpenChange,
  item,
  size = 'lg'
}: DynamicViewDialogProps) {


  const sizeClasses: Record<string, string> = {
    sm: 'max-w-[500px]',
    md: 'max-w-[700px]',
    lg: 'max-w-[900px]',
    xl: 'max-w-[1100px]',
    '2xl': 'max-w-[1300px]'
  };

  if (!item) return null;

  const ComponentFormToRender = config?.viewDialogConfig?.viewComponent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent
        className={`w-full max-w-[95vw] ${sizeClasses[size]} max-h-[90vh] flex flex-col overflow-hidden`}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {
            config?.viewDialogConfig?.title &&
            (
              <DialogTitle>{config?.viewDialogConfig?.title}</DialogTitle>
            )
          }

          {config?.viewDialogConfig?.description && (
            <DialogDescription>
              {config.viewDialogConfig!.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ComponentFormToRender
          config={config}
          item={item || {}}
          onOpenChange={onOpenChange}
        />

      </DialogContent>
    </Dialog>
  );
}

