import Breadcrumb from '@/Components/UI/Breadcrumb';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import {  Globe, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { useTranslations } from '@/Hooks/useTranslations';

interface Action {
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: string;
  size?: string;
  className?: string;
}

interface BadgeItem {
  label: string;
  variant?: string;
}

interface CommonLayoutHeaderProps {
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  variant?: 'index' | 'inner';
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  backUrl?: string | null;
  badges?: BadgeItem[];
  primaryAction?: Action | null;
  secondaryActions?: Action[];
}

// Helper to normalize badge variant
const normalizeBadgeVariant = (variant?: string) => {
  if (variant === 'default' || variant === 'destructive' || variant === 'outline' || variant === 'secondary') {
    return variant;
  }
  return 'outline';
};

const normalizeButtonSize = (size?: string) => {
  if (size === 'icon' || size === 'default' || size === 'sm' || size === 'lg') {
    return size;
  }
  return 'default';
};

export const CommonLayoutHeader: React.FC<CommonLayoutHeaderProps> = ({
  breadcrumbItems,
  variant = 'index',
  title,
  description,
  icon: Icon = Globe,
  backUrl = null,
  badges = [],
  primaryAction = null,
  secondaryActions = [],
}) => {

  const {t} = useTranslations();

  if (variant === 'inner') {
    return (
      <div className="p-8 border shadow-sm rounded-2xl bg-card">
        <div className="space-y-6">
          {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              {backUrl && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowLeft
                    className="w-4 h-4 transition-colors cursor-pointer hover:text-foreground"
                    onClick={() => router.visit(backUrl)}
                  />
                  <span>
                     {t('Back to previous page')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 shadow-sm bg-primary rounded-xl text-primary-foreground">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>

              
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  variant={normalizeBadgeVariant(primaryAction.variant)}
                  className={primaryAction.className || ''}
                >
                  {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
                  {primaryAction.label}
                </Button>
              )}

              {secondaryActions.length > 0 && (
                <div className="flex gap-2">
                  {secondaryActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.onClick}
                      variant={normalizeBadgeVariant(action.variant)}
                      size={normalizeButtonSize(action.size)}

                      className={action.className || ''}
                    >
                      {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {badges.length > 0 && (
                <div className="flex items-center gap-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={normalizeBadgeVariant(badge.variant)}
                      className="text-xs"
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Index variant (default)
  return (
    <div className="p-8 border shadow-sm rounded-2xl bg-card">
      <div className="space-y-6">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 shadow-sm bg-primary rounded-xl text-primary-foreground">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                variant={normalizeBadgeVariant(primaryAction.variant)}
                
                className={`lg:flex-shrink-0 ${primaryAction.className || ''}`}
              >
                {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
                {primaryAction.label}
              </Button>
            )}

            {secondaryActions.length > 0 && (
              <div className="flex gap-2">
                {secondaryActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant={normalizeBadgeVariant(action.variant)}
                    size={normalizeButtonSize(action.size)}

                    className={`lg:flex-shrink-0 ${action.className || ''}`}
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={normalizeBadgeVariant(badge.variant)}
                    className="text-xs"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonLayoutHeader;
