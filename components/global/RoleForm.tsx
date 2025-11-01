"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { createAxiosInstance } from "@/lib/axios";
import { useParentContext } from "@/contexts/ParentContext";
import { withPermission } from "@/lib/withPermission";
import { Skeleton } from "../ui/skeleton";
import { RoleFormSchema } from "@/schemas/FormsSchema";

interface ComponentProps {
  open: boolean;
  openStateSetter: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  idFeildForEditStateSetter?: number | null;
}

type Permission = {
  id: number;
  name: string;
  group_name: string;
};

type PermissionsGrouped = {
  [group: string]: Permission[];
};

let mode: string = "";

const RoleForm: React.FC<ComponentProps> = ({
  open,
  openStateSetter,
  mode,
  idFeildForEditStateSetter,
}) => {
  mode = mode;

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [permissions, setPermissions] = useState<PermissionsGrouped | null>(
    null
  );
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("user_mng/permissions")
      .then((response: any) => {
        setPermissions(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || "Error")
      )
      .finally(() => setLoading(false));
  }, [mode, idFeildForEditStateSetter]);

  useEffect(() => {
    setLoading(true);

    const permissionsRequest = axiosInstance.get("user_mng/permissions");

    const roleRequest =
      mode !== "create" && idFeildForEditStateSetter
        ? axiosInstance.get(`user_mng/role/${idFeildForEditStateSetter}`)
        : Promise.resolve({ data: { data: null } });

    Promise.all([permissionsRequest, roleRequest]).then(
      ([permRes, roleRes]) => {
        setPermissions(permRes.data.data);

        if (roleRes.data.data) {
          const roleData = roleRes.data.data;
          setName(roleData.name);
          setStatus(roleData.status);

          const rolePermIds = roleData.permissions.map((p: any) =>
            typeof p === "number" ? p : p.id
          );
          setRolePermissions(rolePermIds);
        }
      }
    );
  }, [mode, idFeildForEditStateSetter]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = RoleFormSchema.safeParse({name: name});

    if (!result.success) {
    const errors: { [key: string]: string } = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field) errors[field as string] = issue.message;
    });

    setFormErrors(errors);
      reqForToastAndSetMessage("Please fix validation errors before submitting.");
      return;
    }

    setFormErrors({});

    const url =
      mode === "create"
        ? "user_mng/role"
        : `user_mng/role/${idFeildForEditStateSetter}`;
    const method = mode === "create" ? "post" : "put";

    axiosInstance
      .request({
        url,
        method,
        data: {
          name,
          status,
          permissions: rolePermissions,
        },
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || "Error")
      );
  };

  return (
    <Dialog open={open} onOpenChange={openStateSetter} modal={false}>
      <form onSubmit={onSubmit}>
        <DialogContent className="sm:max-w-[900px] w-full">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Create Role"
                : mode === "edit"
                ? "Edit Role"
                : "Role"}
            </DialogTitle>
          </DialogHeader>

          {/* Name and Status */}
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="flex-1 min-w-[250px]">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`border p-2 rounded ${formErrors.name ? "!border-red-500" : ""}`}
                title={formErrors.name}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(e) => setStatus(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactive">Deactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Permissions */}
        <div className="flex flex-col items-start w-full overflow-auto max-h-[200px]">
          <span className="font-semibold text-lg mb-2">Permissions</span>

          {loading && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {loading ? (
              <div className="w-full space-y-4">
                {Object.keys(permissions || { dummy: [] }).map((group, i) => (
                  <div key={i} className="p-2 border rounded-lg shadow-sm space-y-2">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Permissions Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-start gap-2 p-1 min-w-0">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-full rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (!loading && permissions) && (
            <div className="w-full border rounded-lg p-4 space-y-6">
              {Object.entries(permissions).map(([group, perms]) => {
                const allSelected = perms.every((p: Permission) =>
                  rolePermissions.includes(p.id)
                );

                const toggleGroup = () => {
                  if (allSelected) {
                    setRolePermissions((prev) =>
                      prev.filter((id) => !perms.some((p: Permission) => p.id === id))
                    );
                  } else {
                    const newIds = perms.map((p: Permission) => p.id);
                    setRolePermissions((prev) => Array.from(new Set([...prev, ...newIds])));
                  }
                };

                return (
                  <div key={group} className="p-2">
                    <div
                      onClick={toggleGroup}
                      className="flex items-center justify-between cursor-pointer select-none mb-2"
                    >
                      <h3 className="font-semibold text-gray-800">{group}</h3>
                      <span className="text-sm text-gray-500">
                        {allSelected ? "Unselect All" : "Select All"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {perms.map((p: Permission) => (
                        <div
                          key={p.id}
                          className="flex items-start gap-2 min-w-[150px] flex-wrap max-w-full p-1"
                        >
                          <Checkbox
                            checked={rolePermissions.includes(p.id)}
                            id={`perm-${p.id}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setRolePermissions((prev) => [...prev, p.id]);
                              } else {
                                setRolePermissions((prev) =>
                                  prev.filter((permId) => permId !== p.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`perm-${p.id}`}
                            className="break-all whitespace-normal leading-snug text-sm cursor-pointer w-full"
                          >
                            {p.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={onSubmit}>
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default withPermission(
  RoleForm,
  mode == "create" ? "Create Role" : mode == "edit" ? "Edit Role" : "View Role"
);

