import { usePermission } from '@/Hooks/usePermission';
import { useTranslations } from '@/Hooks/useTranslations';
import React from 'react';

export function withPermission(permission: string) {
  return function <P extends object>(Wrapped: React.ComponentType<P>) {
    return function ComponentWithPermission(props: P) {
      const { can } = usePermission();

      const {t}     = useTranslations();

      if (!can(permission)) {
        return (
          <div className="p-6 text-red-600 font-semibold">
            {t('Unauthorized — You do not have permission to access this page')}
          </div>
        );
      }

      return <Wrapped {...props} />;
    };
  };
}
