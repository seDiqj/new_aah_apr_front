import { usePermissions } from "@/contexts/PermissionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ComponentType } from "react";

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermission: string
) {
  const ComponentWithPermission = (props: P) => {
    const permissions = usePermissions();
    const router = useRouter();

    useEffect(() => {
      if (!permissions.includes(requiredPermission)) {
        router.replace("/403");
      }
    }, [permissions, router]);

    if (!permissions.includes(requiredPermission)) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPermission;
}
