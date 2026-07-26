import * as LucideIcons from 'lucide-react';
import * as RadixIcons from '@radix-ui/react-icons';
import React from 'react';
import type { DynamicIconProps, IconLibrary } from '@/Types';

/**
 * Type guard to check if a value is a valid React component
 */
function isValidReactComponent(
  value: any
): value is React.ComponentType<{ className?: string }> {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && '$$typeof' in value)
  );
}

/**
 * Renders a dynamic icon from Lucide or Radix icon libraries
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  iconLibrary = 'lucide',
  className = 'w-4 h-4',
}) => {
  if (!iconName) return null;

  try {
    if (iconLibrary === 'lucide') {
      const Icon = (LucideIcons as any)[iconName];
      return Icon && isValidReactComponent(Icon) ? (
        <Icon className={className} />
      ) : null;
    } else if (iconLibrary === 'radix') {
      const Icon = (RadixIcons as any)[iconName];
      return Icon && isValidReactComponent(Icon) ? (
        <Icon className={className} />
      ) : null;
    }
  } catch (error) {
    return null;
  }

  return null;
};

/**
 * Gets the icon component without rendering
 */
export function getIconComponent(
  iconName: string,
  iconLibrary: IconLibrary = 'lucide'
): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;

  try {
    if (iconLibrary === 'lucide') {
      const Icon = (LucideIcons as any)[iconName];
      return Icon && isValidReactComponent(Icon) ? Icon : null;
    } else if (iconLibrary === 'radix') {
      const Icon = (RadixIcons as any)[iconName];
      return Icon && isValidReactComponent(Icon) ? Icon : null;
    }
  } catch (error) {
    return null;
  }

  return null;
}