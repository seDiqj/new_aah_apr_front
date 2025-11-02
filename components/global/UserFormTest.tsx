"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {  User, Shield, Check } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useParentContext } from "@/contexts/ParentContext"
import { SingleSelect } from "../single-select"
import { withPermission } from "@/lib/withPermission"
import { UserFormSchema } from "@/schemas/FormsSchema"

interface ComponentProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  mode?: "create" | "edit" | "show"
  permission?: "";
  userId?: number
  reloader?: () => void
}

const ProfileModal: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode = "create",
  userId,
  reloader,
  permission
}) => {
  const { axiosInstance, reqForToastAndSetMessage, reqForConfirmationModelFunc } = useParentContext()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, label: "Personal Info", icon: <User size={18} /> },
    { id: 2, label: "Permissions", icon: <Shield size={18} /> },
    { id: 3, label: "Summary", icon: <Check size={18} /> },
  ]

  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    password: "",
    email_verified_at: "",
    photo_path: "",
    department: "",
    status: "active",
    role: ""
  })

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});


  const [allPermissions, setAllPermissions] = useState<{ [key: string]: Record<string, string>[] }>({})
  const [userPermissions, setUserPermissions] = useState<string[]>([])

  const isReadOnly = mode === "show"

  const handlePermissionToggle = (permissionId: string) => {
    if (isReadOnly) return
    setUserPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectRole = (role: any) => {
    if (isReadOnly) return
    setUserPermissions(role.permissions.map((p: any) => p.id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setSelectedFile(file);
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, photo_path: url }))
  }

  const [allRoles, setAllRoles] = useState<{id: string, name: string}[]>([])
  const [userRole, setUserRole] = useState<string>("")


  const handleSubmit = () => {

    const result = UserFormSchema.safeParse(form);

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

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("title", form.title)
    formData.append("email", form.email)
    formData.append("password", form.password)
    formData.append("department", form.department)
    formData.append("status", form.status)
    if (selectedFile) {
      formData.append("photo_path", selectedFile)
    }


    formData.append("permissions", JSON.stringify(userPermissions))
    formData.append("role", userRole);

    const request =
      mode === "create"
        ? axiosInstance.post("/user_mng/user", formData)
        : axiosInstance.post(`/user_mng/edit_user/${userId}`, formData)

    request
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        onOpenChange(false);
        if (reloader) reloader();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || "Error")
      )
}


  useEffect(() => {
    if (mode === "edit" || mode === "show") {
      Promise.all([
        axiosInstance.get(`/user_mng/user/${userId}`),
        axiosInstance.get(`/user_mng/permissions_&_roles`),
      ])
        .then(([userRes, rolePermRes]: any) => {
          const { permissions, role, ...rest } = userRes.data.data;
          setForm(prev => ({ ...prev, ...rest }));
          setAllPermissions(rolePermRes.data.data.permissions);
          setAllRoles(rolePermRes.data.data.roles);
          setUserRole(userRes.data.data.roles.length > 0 ? userRes.data.data.roles[0] : "");
          setUserPermissions(userRes.data.data.permissions.map((p: any) => p.id))
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      axiosInstance
        .get("/user_mng/permissions_&_roles")
        .then((response: any) => {
          setAllPermissions(response.data.data.permissions);
          setAllRoles(response.data.data.roles);
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [mode, axiosInstance, userId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={mode === "show" ? "outline" : "default"}>
          {mode === "show" ? "View Profile" : "Open Profile Modal"}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          min-w-[1000px]
          max-h-[90vh]
          bg-[#1e1e1e]
          text-white
          border border-gray-700
          rounded-2xl
          overflow-hidden
          p-0
          flex
        "
      >
        {/* Sidebar */}
        <div className="w-[22%] bg-[#151515] p-8 border-r border-gray-800">
          <h2 className="text-xl font-semibold mb-10">
            {mode === "show" ? "View User" : mode === "edit" ? "Edit User" : "Create User"}
          </h2>
          <div className="space-y-8 sticky top-0">
            {steps.map((s) => (
              <div
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-4 cursor-pointer ${
                  step === s.id ? "text-white" : "opacity-60 hover:opacity-100 transition"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    step === s.id ? "bg-blue-600" : "border border-gray-600 bg-transparent"
                  }`}
                >
                  {s.icon}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          {loading && mode !== "create" ? (
            <>
              <DialogHeader>
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold mb-4">
                  {steps.find((s) => s.id === step)?.label}
                </DialogTitle>
                <DialogDescription className="text-gray-400 mb-6">
                  {step === 1
                    ? "View personal details below."
                    : step === 2
                    ? "Assigned permissions for this user."
                    : "Summary of user information."}
                </DialogDescription>
              </DialogHeader>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div
                      className="relative w-20 h-20 rounded-full border border-gray-600 overflow-hidden cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {form.photo_path ? (
                        <Image
                          src={form.photo_path}
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center text-gray-300">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                    />
                    <div>
                      <p className="text-lg font-medium">{form.name}</p>
                      <p className="text-gray-400">{form.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {["name", "title", "email","password", "department", "status"].map((field) => 
                      {

                        if (field === "password" && mode !== "create") {
                          return null;
                        }
                      
                      return <div key={field}>
                        <Label>
                          {field.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                        <Input
                          name={field}
                          type={field == "password" ? "password" : "text"}
                          value={(form as any)[field] || ""}
                          onChange={handleChange}
                          disabled={isReadOnly}
                          className={`border p-2 rounded ${formErrors[field] ? "!border-red-500" : ""} disabled:opacity-70`}
                          title={formErrors[field]}
                        />
                      </div>}
                    )}
                    <div>
                      <Label>Role</Label>
                      <SingleSelect options={allRoles.map((role) => ({
                        value: role.name,
                        label: role.name
                      }))} value={
                        userRole
                      } onValueChange={(value: string) => {setUserRole(value); handleSelectRole(allRoles.find(role => role.name === value)); setForm((prev) => ({...prev, role: value}))}} disabled={isReadOnly}
                      error={formErrors.role}
                      >
                      </SingleSelect>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-8">
                  {Object.entries(allPermissions).map(([group, perms]) => (
                    <div key={group}>
                      <h3 className="text-lg font-semibold mb-3">{group}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center gap-3 bg-[#252525] border border-gray-700 rounded-lg px-4 py-3"
                          >
                            <Checkbox
                              checked={userPermissions.includes(perm.id)}
                              onCheckedChange={() => handlePermissionToggle(perm.id)}
                              disabled={isReadOnly}
                              className="border-gray-500 data-[state=checked]:bg-blue-600"
                            />
                            <span className="select-none">{perm.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3 */}
              {(step === 3 && mode != "show") && (
                <div className="space-y-4">
                  <Card className="bg-[#252525] border-gray-700">
                    <CardContent className="p-6 space-y-2">
                      {Object.entries(form).map(([key, value]) => (
                        <p key={key}>
                          <strong>
                            {key.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
                          </strong>{" "}
                          {value}
                        </p>
                      ))}
                      <p className="pt-3">
                        <strong>Permissions:</strong>
                      </p>
                      <ul className="list-disc list-inside text-gray-300">
                        {Object.values(allPermissions).map((groupPerms: any) =>
                          groupPerms.map(
                            (perm: any) =>
                              userPermissions.includes(perm.id) && (
                                <li key={perm.id}>{perm.name}</li>
                              )
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Footer Navigation */}
              {mode !== "show" && (
                <div className="flex justify-between mt-10">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="border-gray-600"
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                  ) : (
                    <Button onClick={() => reqForConfirmationModelFunc(
                      "Are you compleatly sure ?",
                      "",
                      handleSubmit
                    )}>Save</Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


// export default withPermission(ProfileModal, permission);

export default ProfileModal;