"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { MainDatabaseProgram } from "@/types/Types";
import { withPermission } from "@/lib/withPermission";
import { z } from "zod";


interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  programId?: number;

  // Only for creation mode, temp
  createdProgramStateSetter?: any

  // temp
  programsListStateSetter?: any;
}

const ProgramKitForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  programId,
  createdProgramStateSetter,
  programsListStateSetter
}) => {
  const { reqForToastAndSetMessage, axiosInstance, handleReload } = useParentContext();

  const programSchema = z.object({
    projectCode: z.string().min(1, "Project code is required"),
    focalPoint: z.string().min(3, "Focal point must be at least 3 characters or 3 digits"),
    province: z.string().min(1, "Select a valid province"),
    district: z.string().min(1, "Select a valid district"),
    village: z.string().min(1, "Village name should be at least 2 characters"),
    siteCode: z.string().min(1, "Site code should be at least 1 characters !"),
    healthFacilityName: z.string().min(3, "Health facility name is required"),
    interventionModality: z.string().min(1, "Intervention modality is required"),
  });

  const [formData, setFormData] = useState<MainDatabaseProgram>({
    projectCode: "",
    focalPoint: "",
    province: "",
    district: "",
    village: "",
    siteCode: "",
    healthFacilityName: "",
    interventionModality: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch program data from backend in edit and show mode.
  useEffect(() => {
    if ((mode === "edit" || mode === "show") && programId && open) {
      axiosInstance
        .get(`/global/program/${programId}`)
        .then((response: any) => {
          console.log(response.data.data)
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
        });
    }
  }, [mode, programId, open]);

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();


    const result = programSchema.safeParse(formData);

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


    if (mode === "create") {
      axiosInstance
        .post("/global/program/kit_database", formData)
        .then((response: any) =>
        {
          reqForToastAndSetMessage(response.data.message);
          if (createdProgramStateSetter)
            createdProgramStateSetter({
            target: {
              name: "program",
              value: formData.focalPoint
              }
            })

          if (programsListStateSetter)
            programsListStateSetter((prev: {focalPoint: number}[]) => [
              ...prev,
              {
                focalPoint: formData.focalPoint
              }
            ])
            handleReload()
        }
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    } else if (mode === "edit" && programId) {
      axiosInstance
        .put(`/global/program/${programId}`, formData)
        .then((response: any) =>
        {
          reqForToastAndSetMessage(response.data.message);
          handleReload()
        }
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  };

  const [districts, setDistricts] = useState<{ name: string }[]>([]);
  const [provinces, setProvinces] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<{ projectCode: string }[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/global/districts")
      .then((res: any) => setDistricts(Object.values(res.data.data)));
    axiosInstance
      .get("/global/provinces")
      .then((res: any) => setProvinces(Object.values(res.data.data)));
    axiosInstance
      .get("/projects/p/kit_database")
      .then((res: any) => {setProjects(Object.values(res.data.data))}).catch((error: any) => reqForToastAndSetMessage(error.response.data.message));
  }, []);

  const readOnly = mode === "show";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[80%] w-[70%]">
        <DialogTitle>
          {mode === "create" && "Create New Program"}
          {mode === "edit" && "Edit Program"}
          {mode === "show" && "Program Details"}
        </DialogTitle>
        <form className="space-y-4 grid grid-cols-2 gap-4">
          {/* Project code */}
          <div className="flex flex-col gap-2">
            <Label>Project Code</Label>
            <SingleSelect
              options={projects.map((p) => ({
                value: p.projectCode,
                label: p.projectCode,
              }))}
              value={formData.projectCode}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: { name: "projectCode", value },
                })
              }
              disabled={readOnly}
              error={formErrors.projectCode}
            />
          </div>
          {/* Focal point */}
          <div className="flex flex-col gap-2">
            <Label>Focal Point</Label>
            <Input
              name="focalPoint"
              value={formData.focalPoint}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.focalPoint ? "!border-red-500" : ""}`}
              title={formErrors.focalPoint}
            />
          </div>
          {/* Province */}
          <div className="flex flex-col gap-2">
            <Label>Province</Label>
            <SingleSelect
              options={provinces.map((p) => ({
                value: p.name,
                label: p.name.toUpperCase(),
              }))}
              value={formData.province}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: { name: "province", value },
                })
              }
              disabled={readOnly}
              error={formErrors.province}
            />
          </div>
          {/* District */}
          <div className="flex flex-col gap-2">
            <Label>District</Label>
            <SingleSelect
              options={districts.map((d) => ({
                value: d.name,
                label: d.name.toUpperCase(),
              }))}
              value={formData.district}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: { name: "district", value },
                })
              }
              disabled={readOnly}
              error={formErrors.district}
            />
          </div>
          {/* Village */}
          <div className="flex flex-col gap-2">
            <Label>Village</Label>
            <Input
              name="village"
              value={formData.village}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.village ? "!border-red-500" : ""}`}
              title={formErrors.village}
            />
          </div>
          {/* Site code */}
          <div className="flex flex-col gap-2">
            <Label>Site Code</Label>
            <Input
              name="siteCode"
              value={formData.siteCode}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.siteCode ? "!border-red-500" : ""}`}
              title={formErrors.siteCode}
            />
          </div>
          {/* Health Facility Name */}
          <div className="flex flex-col gap-2">
            <Label>Health Facility Name</Label>
            <Input
              name="healthFacilityName"
              value={formData.healthFacilityName}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.healthFacilityName ? "!border-red-500" : ""}`}
              title={formErrors.healthFacilityName}
            />
          </div>
          {/* Intervention Modality */}
          <div className="flex flex-col gap-2">
            <Label>Intervention Modality</Label>
            <Input
              name="interventionModality"
              value={formData.interventionModality}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.interventionModality ? "!border-red-500" : ""}`}
              title={formErrors.interventionModality}
            />
          </div>
          {/* Submit */}
          {mode !== "show" && (
            <div className="flex justify-end col-span-2">
              <Button onClick={handleSubmit}>
                {mode === "create" ? "Submit" : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(ProgramKitForm, "Kit.create");
