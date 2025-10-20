"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, User, Shield, Check } from "lucide-react";
import { useParentContext } from "@/contexts/ParentContext";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { withPermission } from "@/lib/withPermission";

type PermissionsGrouped = {
  [group: string]: Permission[];
};

interface Permission {
  id: string | number;
  name: string;
  label: string;
  group_name?: string;
}

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode?: "create" | "edit" | "show";
  userId?: string | null;
}

let mode: string = "";

const UserForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  userId,
  mode,
}) => {
  mode = mode;
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, label: "User Info", icon: <User className="w-5 h-5" /> },
    {
      id: 2,
      label: "Roles & Permissions",
      icon: <Shield className="w-5 h-5" />,
    },
    { id: 3, label: "Done", icon: <Check className="w-5 h-5" /> },
  ];

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    photo_path: "",
    department: "",
    status: "active",
  });

  useEffect(() => console.log(formData), [formData]);

  const [permissions, setPermissions] = useState<PermissionsGrouped | null>(
    null
  );
  const [userPermissions, setUserPermissions] = useState<(string | number)[]>(
    []
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/user_mng/permissions")
      .then((res: any) => {
        console.log(res.data.data);
        setPermissions(res.data.data);
      })
      .catch(() => reqForToastAndSetMessage("Failed to load permissions"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (userId && (mode === "edit" || mode === "show")) {
      setLoading(true);
      axiosInstance
        .get(`/user_mng/user/${userId}`)
        .then((res: any) => {
          console.log(res.data.data);
          const data = res.data.data;
          setFormData({
            name: data.name || "",
            title: data.title || "",
            email: data.email || "",
            photo_path: data.photo_path || "",
            department: data.department || "",
            status: data.status || "active",
          });
          setUserPermissions(data.permissions?.map((p: any) => p.id) || []);
        })
        .catch(() => reqForToastAndSetMessage("Failed to load user"))
        .finally(() => setLoading(false));
    }
  }, [userId, mode]);

  const handleSubmit = () => {
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("title", formData.title);
    formPayload.append("email", formData.email);
    formPayload.append("status", formData.status || "active");
    formPayload.append("department", formData.department || "");

    if (selectedFile) {
      formPayload.append("photo_path", selectedFile);
    }

    // permissions اگر داری
    userPermissions.forEach((perm) =>
      formPayload.append("permissions[]", perm.toString())
    );

    // نکته مهم: هرگز Content-Type را دستی تنظیم نکن.
    // مرورگر خودش header مناسب multipart/form-data; boundary=... را می‌گذارد.

    const request = userId
      ? axiosInstance.post(`/user_mng/user/${userId}`, formPayload)
      : axiosInstance.post("/user_mng/user", formPayload);

    request
      .then((response: any) => {
        console.log(response.data.data);
        reqForToastAndSetMessage("User saved successfully ✅");
        onOpenChange(false);
      })
      .catch((error: any) => {
        console.log(error.response?.data.message);
        reqForToastAndSetMessage("Failed to save user ❌");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log("Permissions loaded:", permissions);
  }, [permissions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-row sm:max-w-4xl h-[90vh] border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto">
        {/* Sidebar Steps */}
        <div className="w-60 p-6 flex flex-col justify-around gap-6 h-[100%]">
          {steps.map((s) => (
            <Button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-3 p-2 rounded-full transition ${
                step === s.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full">
                {s.icon}
              </div>
              <span>{s.label}</span>
            </Button>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 bg-background p-8 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {steps.find((s) => s.id === step)?.label}
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Profile Photo */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="photo">Profile Photo</Label>
                <Input
                  id="photo"
                  name="photo_path"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      setFormData((prev) => ({
                        ...prev,
                        photo_path: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />

                {formData.photo_path && (
                  <img
                    src={formData.photo_path}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mt-2"
                  />
                )}
              </div>

              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Username"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Select
                value={formData.department}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, department: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
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

              {!loading && permissions && (
                <div className="w-full max-h-[200px] overflow-y-auto border rounded p-4 space-y-4">
                  {Object.entries(permissions).map(([group, perms]) => (
                    <div key={group}>
                      <h3 className="font-semibold mb-2">{group}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {perms.map((p: Permission) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 min-w-[120px]"
                          >
                            <Checkbox
                              checked={userPermissions.includes(p.id)}
                              id={`perm-${p.id}`}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setUserPermissions((prev) => [...prev, p.id]);
                                } else {
                                  setUserPermissions((prev) =>
                                    prev.filter((permId) => permId !== p.id)
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={`perm-${p.id}`}>{p.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center h-full">
              <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold">
                User Updated Successfully!
              </h2>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < steps.length ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Done"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default   UserForm;
;
