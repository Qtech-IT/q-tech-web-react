import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

import type { CrudConfig } from '@/Types/crud';
import { buildRouteParams } from '@/Utils/helpers';
import toast from 'react-hot-toast';

interface UseCrudManagerOptions {
  config: CrudConfig;
  onSuccess?: (action: string) => void;
  onError?: (action: string, error: any) => void;
}

export function useCrudManager({ config, onSuccess, onError }: UseCrudManagerOptions) {
  const [state, setState] = useState({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isBulkDeleting: false,
    isLoading: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  const routeParams = config?.routeParams?.create || null;


  const create = useCallback(
    (data: any) => {
      setState((prev) => ({ ...prev, isCreating: true }));
      setErrors({});

      router.post(route(config?.routes?.store!, routeParams), data, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isCreating: false }));
          onSuccess?.('create');
        },
        onError: (errors) => {
          setState((prev) => ({ ...prev, isCreating: false }));
          setErrors(errors);


          onError?.('create', errors);
        },
      });
    },
    [config, onSuccess, onError]
  );

  // Update
  const update = useCallback(
    (id: any, data: any) => {
      setState((prev) => ({ ...prev, isUpdating: true }));
      setErrors({});

      let routeParams = config?.routeParams?.edit || null;

      console.log(routeParams, id);



      const url = (() => {
        if (routeParams) {
          const params = buildRouteParams(routeParams, [
            { pattern: '{item.id}', value: id },
          ]);

          return route(config.routes.update!, params);
        }

        return route(config.routes.update!, id);
      })();

      router.post((url + '?_method=PATCH'), data, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isUpdating: false }));
          onSuccess?.('update');
        },
        onError: (errors) => {
          setState((prev) => ({ ...prev, isUpdating: false }));
          setErrors(errors);


          onError?.('update', errors);
        },
      });
    },
    [config, onSuccess, onError]
  );

  // Delete
  const destroy = useCallback(
    (id: any) => {
      setState((prev) => ({ ...prev, isDeleting: true }));

      const isTrashMode = window.location.search.includes('is_trash=1');

      /*
       * Fall back to `destroy` when a config declares no `forceDestroy`.
       * Previously this was `config.routes.forceDestroy!` — a non-null
       * assertion over a genuinely optional key. In trash mode on any resource
       * without that route, `route(undefined)` threw synchronously, so the
       * request never left the browser, `onSuccess` never ran, and the delete
       * dialog stayed open with its spinner stuck on.
       */
      const routeName = (isTrashMode ? config.routes.forceDestroy : config.routes.destroy)
        ?? config.routes.destroy;

      const destroyParams = isTrashMode ? config?.routeParams?.forceDestroy : config?.routeParams?.destroy;

      let finalUrl: string;

      try {
        if (!routeName) {
          throw new Error('No destroy route is configured for this resource.');
        }

        const url = destroyParams
          ? route(routeName, buildRouteParams(destroyParams, [{ pattern: '{item.id}', value: id }]))
          : route(routeName, id);

        finalUrl = isTrashMode ? `${url}?is_trash=1` : url;
      } catch (error) {
        // Never leave the dialog wedged: surface the failure and release it.
        setState((prev) => ({ ...prev, isDeleting: false }));
        toast.error('Delete is not configured for this resource');
        onError?.('delete', error as any);

        return;
      }

      router.delete(finalUrl, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page: any) => {
          setState((prev) => ({ ...prev, isDeleting: false }));
          onSuccess?.('delete');
        },
        onError: (error) => {
          setState((prev) => ({ ...prev, isDeleting: false }));
          onError?.('delete', error);
        },
      });
    },
    [config, onSuccess, onError]
  );

  // Bulk Delete
  const bulkDestroy = useCallback(
    (ids: (number | string)[]) => {
      if (!config.routes.bulkDestroy) {
        toast.error('Bulk delete is not configured');
        return;
      }

      setState((prev) => ({ ...prev, isBulkDeleting: true }));

      router.post(route(config.routes.bulkDestroy), { ids, _method: 'DELETE' }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isBulkDeleting: false }));
          onSuccess?.('bulk-delete');
        },
        onError: (error) => {
          setState((prev) => ({ ...prev, isBulkDeleting: false }));
          onError?.('bulk-delete', error);
        },
      });
    },
    [config, onSuccess, onError]
  );


  // Bulk action
  const bulkAction = useCallback(

    (ids: (number | string)[], action: string) => {
      if (!config.routes.bulkAction) {
        toast.error('Bulk action is not configured');
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));


      let routeName = (config.routes.bulkAction);

      const queryParams = config?.routeParams?.bulkAction;

      let url = (() => {
        if (queryParams) {
          const params = buildRouteParams(queryParams);

          return route(routeName, params);
        }

        return route(routeName);
      })();


      if (action === 'permanent_delete' || action === 'restore') {
        url = url + '?is_trash=1'
      }
      router.post(url, { ids, action }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onSuccess?.('bulk-action');
        },
        onError: (error) => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onError?.('bulk-action', error);
        },
      });
    },
    [config, onSuccess, onError]
  );

  // Update Status
  const updateStatus = useCallback(
    (id: any, status: string) => {
      if (!config.routes.updateStatus) {
        toast.error('Status update is not configured');
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      router.post(route(config.routes.updateStatus), { id, value: status }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onSuccess?.('update-status');
        },
        onError: (error) => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onError?.('update-status', error);
        },
      });
    },
    [config, onSuccess, onError]
  );

  // Restore
  const restore = useCallback(
    (id: any) => {
      if (!config.routes.restore) {
        toast.error('Restore is not configured');
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));


      const destroyParams = config?.routeParams?.restore;

      const routeName = config.routes.restore!

      const url = (() => {
        if (destroyParams) {
          const params = buildRouteParams(destroyParams, [
            { pattern: '{item.id}', value: id },
          ]);

          return route(routeName, params);
        }

        return route(routeName, id);
      })();

      const finalUrl = `${url}?is_trash=1`;


      router.post(finalUrl, {}, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onSuccess?.('restore');
        },
        onError: (error) => {
          setState((prev) => ({ ...prev, isLoading: false }));
          onError?.('restore', error);
        },
      });
    },
    [config, onSuccess, onError]
  );

  return {
    state,
    errors,
    create,
    update,
    destroy,
    bulkDestroy,
    bulkAction,
    updateStatus,
    restore,
    isSubmitting: state.isCreating || state.isUpdating || state?.isDeleting || state?.isLoading,
    isLoading: Object.values(state).some((v) => v),
  };
}
