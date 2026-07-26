import { usePermission } from "@/Hooks/usePermission";
import { ReactNode } from "react";

interface CanProps {
  permission: string | string[];
  children: ReactNode;
}

export function Can({ permission, children }: CanProps) {

  const { can, canAll } = usePermission();

  // Array = check ANY permission
  if (Array.isArray(permission)) {
    return can(permission) ? <>{children}</> : null;
  }

  // String = single permission
  return can(permission) ? <>{children}</> : null;
}