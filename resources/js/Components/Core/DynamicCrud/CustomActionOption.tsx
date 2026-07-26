import { router } from '@inertiajs/react';
import { Badge } from '@/Components/UI/Badge';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@/Components/UI/DropdownMenu';
import { useTranslations } from '@/Hooks/useTranslations';
import { CustomActionOption, CustomActionSubmenuProps, RouteAction } from '@/Types/crud';
import { usePermission } from '@/Hooks/usePermission';


export function CustomActionSubmenu({ config, item }: CustomActionSubmenuProps) {
  
  const handleStateAction = (option: CustomActionOption) => {
    if (!config.route || !config.fieldKey) return;

    let url = route(config.route);

     if (config.queryParams) {
      const params      = config.queryParams(item);
      const queryString = new URLSearchParams(params).toString();
      url               = `${url}?${queryString}`;
    }
    
    router.post(
      url,
      {
        [config.fieldKey]: option.value,
      },
      {
        preserveState : true,
        preserveScroll : true,
        onSuccess: () => {
        },
      }
    );
  };

  const handleRouteAction = (action: RouteAction) => {

    let url;

    if (action.routeParams) {
      const params = action.routeParams(item);
      url = route(action.route, params);
    } else {
      url = route(action.route);
    }

    
    if (action.queryParams) {
      const params      = action.queryParams(item);
      const queryString = new URLSearchParams(params).toString();
      url               = `${url}?${queryString}`;
    }

    
    if (action.target === '_blank') {
      window.open(url, '_blank');
    } else {
      router.visit(url);
    }
  };

  const TitleIcon   = config.icon;
  const isRouteType = config.type === 'route';
  const actionsList = isRouteType ? config.actions : config.options;

  const {can, isSuperAdmin} = usePermission();
  const { t }               = useTranslations();


  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <TitleIcon className="w-4 h-4 mr-2" />
        {config.title}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {actionsList?.map((action: any) => {
          const Icon       =  action.icon;
          const isDisabled = !isRouteType && action.disabled ? action.disabled(item) : false;
          const isCurrent  = !isRouteType && action.isCurrent ? action.isCurrent(item) : false;


          if (typeof action.visible === 'function' && !action.visible(item)) {
            return null;
          }

          if(action.permission){

            const hasPermission = action?.permission === 'superadmin_check'
                                      ? isSuperAdmin
                                      : can(action.permission);

            if (!hasPermission) return null;

          }
          

          return (
            <DropdownMenuItem
              key={action.key}
              onClick={() => 
                isRouteType 
                  ? handleRouteAction(action as RouteAction)
                  : handleStateAction(action as CustomActionOption)
              }
              disabled={isDisabled}
              className="text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
            >
              <Icon className={`w-4 h-4 mr-2 ${action.iconColor || 'text-gray-500'}`} />
              {action.label}
              {isCurrent && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {t('Current')}
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
