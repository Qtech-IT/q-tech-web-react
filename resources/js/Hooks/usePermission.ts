import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/Types/Inertia";

export function usePermission() {
  const { auth }      = usePage<{ auth: SharedProps["auth"] }>().props;

  const user          = auth?.user ?? null;
  const authorization = auth?.authorization ?? null;
  const role          = authorization?.role ?? null;
  const permissions   = authorization?.permissions ?? [];


  const isSuperAdmin = useMemo(
      () => role?.data?.is_super_admin === true,
    [role]
  );

    

  // -------------------------------
  // CAN (any)
  // -------------------------------
  const can = useMemo(
    () => (permission: string | string[]): boolean => {

      if (isSuperAdmin) return true;

      if (!role || !permissions) return false;
      // super admin bypass

      if (typeof permission === "string") {

        if(permission === 'superadmin_check'){
          return isSuperAdmin
        }

        return permissions.includes(permission);
      }


        return permission.some((p) => {
          if (p === 'superadmin_check') return isSuperAdmin;
          return permissions.includes(p);
        });
    },
    [role, permissions,isSuperAdmin]
  );

  // -------------------------------
  // CAN ALL (every)
  // -------------------------------
  const canAll = useMemo(
    () => (required: string[]): boolean => {
      if (!role || !permissions) return false;

      // super admin bypass
      if (isSuperAdmin) return true;

      return required.every((p) => permissions.includes(p));
    },
    [role, permissions ,isSuperAdmin]
  );

  // -------------------------------
  // RETURN (memoized)
  // -------------------------------
  return {
    user,
    role,
    permissions,
    can,
    canAll,
    isSuperAdmin
  };
}
