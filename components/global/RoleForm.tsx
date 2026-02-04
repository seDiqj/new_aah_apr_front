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
import { useParentContext } from "@/contexts/ParentContext";
import { withPermission } from "@/lib/withPermission";
import { Skeleton } from "../ui/skeleton";
import { RoleFormSchema } from "@/schemas/FormsSchema";
import { RoleInterface } from "@/interfaces/Interfaces";
import {
  RoleCreationMessage,
  RoleEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { IsCreateMode, IsEditMode } from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";

type Permission = {
  id: number;
  name: string;
  group_name: string;
};

type PermissionsGrouped = {
  [group: string]: Permission[];
};

let mode: string = "";

const RoleForm: React.FC<RoleInterface> = ({
  open,
  openStateSetter,
  mode,
  idFeildForEditStateSetter,
}) => {
  mode = mode;

  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
    handleReload,
  } = useParentContext();

  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [permissions, setPermissions] = useState<PermissionsGrouped | null>(
    null,
  );
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLoading(true);
    requestHandler()
      .get("user_mng/permissions")
      .then((response: any) => {
        setPermissions(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error",
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [mode, idFeildForEditStateSetter]);

  useEffect(() => {
    setLoading(true);

    const permissionsRequest = requestHandler().get("user_mng/permissions");

    const roleRequest =
      mode !== "create" && idFeildForEditStateSetter
        ? requestHandler().get(`user_mng/role/${idFeildForEditStateSetter}`)
        : Promise.resolve({ data: { data: null } });

    Promise.all([permissionsRequest, roleRequest]).then(
      ([permRes, roleRes]) => {
        setPermissions(permRes.data.data);

        if (roleRes.data.data) {
          const roleData = roleRes.data.data;
          setName(roleData.name);
          setStatus(roleData.status);

          const rolePermIds = roleData.permissions.map((p: any) =>
            typeof p === "number" ? p : p.id,
          );
          setRolePermissions(rolePermIds);
        }
      },
    );
  }, [mode, idFeildForEditStateSetter]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = () => {
    const result = RoleFormSchema.safeParse({ name: name });

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errors[field as string] = issue.message;
      });

      setFormErrors(errors);
      reqForToastAndSetMessage(
        "Please fix validation errors before submitting.",
        "warning",
      );
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    const url = IsCreateMode(mode)
      ? "user_mng/role"
      : `user_mng/role/${idFeildForEditStateSetter}`;
    const method = IsCreateMode(mode) ? "post" : "put";

    requestHandler()
      .request(url, method, {
        name,
        status,
        permissions: rolePermissions,
      })
      .then((response: AxiosResponse<any, any, any>) => {
        openStateSetter(false);
        reqForToastAndSetMessage(response.data.message, "success");
        handleReload();
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error",
          "error",
        ),
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={openStateSetter} modal={false}>
      <form>
        <DialogContent className="sm:max-w-[900px] w-full">
          <DialogHeader>
            <DialogTitle>
              {IsCreateMode(mode)
                ? "Create Role"
                : IsEditMode(mode)
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
                className={`border p-2 rounded ${
                  formErrors.name ? "!border-red-500" : ""
                }`}
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
                  <div
                    key={i}
                    className="p-2 border rounded-lg shadow-sm space-y-2"
                  >
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Permissions Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2 p-1 min-w-0"
                        >
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-full rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading &&
              permissions && (
                <div className="w-full border rounded-lg p-4 space-y-6">
                  {Object.entries(permissions).map(([group, perms]) => {
                    const allSelected = perms.every((p: Permission) =>
                      rolePermissions.includes(p.id),
                    );

                    const toggleGroup = () => {
                      if (allSelected) {
                        setRolePermissions((prev) =>
                          prev.filter(
                            (id) => !perms.some((p: Permission) => p.id === id),
                          ),
                        );
                      } else {
                        const newIds = perms.map((p: Permission) => p.id);
                        setRolePermissions((prev) =>
                          Array.from(new Set([...prev, ...newIds])),
                        );
                      }
                    };

                    return (
                      <div key={group} className="p-2">
                        <div
                          onClick={toggleGroup}
                          className="flex items-center justify-between cursor-pointer select-none mb-2"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {group}
                          </h3>
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
                                    setRolePermissions((prev) => [
                                      ...prev,
                                      p.id,
                                    ]);
                                  } else {
                                    setRolePermissions((prev) =>
                                      prev.filter((permId) => permId !== p.id),
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
              )
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              id={SUBMIT_BUTTON_PROVIDER_ID}
              disabled={isLoading}
              type="button"
              onClick={() =>
                reqForConfirmationModelFunc(
                  IsCreateMode(mode) ? RoleCreationMessage : RoleEditionMessage,
                  onSubmit,
                )
              }
            >
              {isLoading
                ? IsCreateMode(mode)
                  ? "Creating ..."
                  : "Updating ..."
                : IsCreateMode(mode)
                  ? "Create"
                  : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default withPermission(
  RoleForm,
  IsCreateMode(mode as "create" | "edit" | "show")
    ? "Create Role"
    : IsEditMode(mode as "create" | "edit" | "show")
      ? "Edit Role"
      : "View Role",
);
