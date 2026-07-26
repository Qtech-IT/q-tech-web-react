import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/Dialog';
import type { CrudConfig } from '@/Types/crud';

interface DynamicDialogProps {
  config: CrudConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  item?: any;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string>;
  backendData?: Record<string, any>;
}

export function DynamicDialog({
  config,
  open,
  onOpenChange,
  mode,
  item
}: DynamicDialogProps) {

  const ComponentFormToRender = config?.formComponent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto"
       onInteractOutside={(e) => e.preventDefault()}
       onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {
            config?.form?.title &&
            (
             <DialogTitle>{config?.form?.title![mode]}</DialogTitle>
            )
          }
        
          {config?.form!?.description?.[mode] && (
            <DialogDescription>
              {config.form!.description[mode]}
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

