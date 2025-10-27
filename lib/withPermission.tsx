import { usePermissions } from "@/contexts/PermissionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ComponentType } from "react";

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermission: string
) {
  const ComponentWithPermission = (props: P) => {
    const { permissions, loading } = usePermissions();
    const router = useRouter();

    useEffect(() => {
      if (!loading && permissions && !permissions.includes(requiredPermission)) {
        router.replace("/403");
      }
    }, [permissions, loading, router]);

    if (loading) return null;

    if (!permissions.includes(requiredPermission)) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPermission;
}

