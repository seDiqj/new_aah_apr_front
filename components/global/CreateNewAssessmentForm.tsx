"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { AssessmentFormType } from "@/types/Types";
import { createAxiosInstance } from "@/lib/axios";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AssessmentFormSchema } from "@/schemas/FormsSchema";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  projectId?: number;
}

const AssessmentForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  projectId,
}) => {
  const { reqForToastAndSetMessage } = useParentContext();
  const axiosInstance = createAxiosInstance();

  const [formData, setFormData] = useState<AssessmentFormType>({
    project_id: "",
    indicator_id: "",
    province_id: "",
    councilorName: "",
    raterName: "",
    type: "",
    date: "",
    aprIncluded: true,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => console.log(formErrors), [formErrors])


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

    const result = AssessmentFormSchema.safeParse(formData);

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
        .post("/enact_database/", formData)
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    } else if (mode === "edit" && projectId) {
      axiosInstance
        .put(`/enact_database/${projectId}`, formData)
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  };

  const [indicators, setIndicators] = useState<
    { id: string; indicatorRef: string }[]
  >([]);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);

  // Fetch program data from backend in edit and show mode.
  useEffect(() => {
    if ((mode === "edit" || mode === "show") && projectId && open) {
      axiosInstance
        .get(`/enact_database/${projectId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
        });
    }
  }, [mode, projectId, open]);

  useEffect(() => {
    axiosInstance
      .get("/global/projects")
      .then((response: any) => setProjects(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    if (!formData.project_id) return;
    axiosInstance
      .get(`projects/indicators/enact_database/${formData.project_id}`)
      .then((response: any) => setIndicators(response.data.data))
      .catch((error: any) => {
        console.log(error.response.data);
        reqForToastAndSetMessage(error.response.data.message);
      });

    axiosInstance
      .get(`projects/provinces/${formData.project_id}`)
      .then((res: any) => setProvinces(Object.values(res.data.data)))
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      });
  }, [formData.project_id]);

  useEffect(() => console.log(formData), [formData]);

  const readOnly = mode === "show";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[80%] w-[70%]">
        <DialogTitle>
          {mode === "create" && "Create New Assessment"}
          {mode === "edit" && "Edit Assessment"}
          {mode === "show" && "Assessment Details"}
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
              value={
                projects.find((project) => project.id == formData.project_id)
                  ?.projectCode ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "project_id",
                    value: projects.find(
                      (project) => project.projectCode == value
                    )?.id,
                  },
                })
              }
              disabled={readOnly}
              error={formErrors.project_id}
            />
          </div>
          {/* Indicator */}
          <div className="flex flex-col gap-2">
            <Label>Indicator</Label>
            <SingleSelect
              options={indicators.map((indicator) => ({
                value: indicator.indicatorRef,
                label: indicator.indicatorRef.toUpperCase(),
              }))}
              value={
                indicators.find(
                  (indicator) => indicator.id == formData.indicator_id
                )?.indicatorRef ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "indicator_id",
                    value: indicators.find(
                      (indicator) => indicator.indicatorRef == value
                    )?.id,
                  },
                })
              }
              disabled={readOnly}
              error={formErrors.indicator_id}
            />
          </div>
          {/* Province */}
          <div className="flex flex-col gap-2">
            <Label>Province</Label>
            <SingleSelect
              options={provinces.map((province) => ({
                value: province.name,
                label: province.name.toUpperCase(),
              }))}
              value={
                provinces.find(
                  (province) => province.id == formData.province_id
                )?.name ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "province_id",
                    value: provinces.find((province) => province.name == value)
                      ?.id,
                  },
                })
              }
              disabled={readOnly}
              error={formErrors.province_id}
            />
          </div>
          {/* Councilor Name */}
          <div className="flex flex-col gap-2">
            <Label>Councilor Name </Label>
            <Input
              name="councilorName"
              value={formData.councilorName}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.councilorName ? "!border-red-500" : ""}`}
              title={formErrors.councilorName}
            />
          </div>
          {/* Rater Name */}
          <div className="flex flex-col gap-2">
            <Label>Rater Name</Label>
            <Input
              name="raterName"
              value={formData.raterName}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.raterName ? "!border-red-500" : ""}`}
              title={formErrors.raterName}
            />
          </div>
          {/* Type Of Assessment */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label>Type Of Assessment</Label>
              <SingleSelect
                options={[
                  { value: "type 1", label: "Type1" },
                  { value: "type 2", label: "Type2" },
                ]}
                value={formData.type}
                onValueChange={(value: string) =>
                  handleFormChange({
                    target: {
                      name: "type",
                      value: value,
                    },
                  })
                }
                disabled={readOnly}
                error={formErrors.type}
              />
            </div>
          </div>
          {/* Date Of Assessment */}
          <div className="flex flex-col gap-2">
            <Label>Date Of Assessment</Label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${formErrors.date ? "!border-red-500" : ""}`}
              title={formErrors.date}
            />
          </div>
          {/* Apr Included */}
          <div className="flex flex-col gap-2">
            <Label>Apr Included</Label>
            <RadioGroup
              name="aprIncluded"
              value={formData.aprIncluded ? "true" : "false"}
              onValueChange={(value: string) => {
                const e = {
                  target: {
                    name: "aprIncluded",
                    value: value == "true" ? true : false,
                  },
                };
                handleFormChange(e);
              }}
              disabled={readOnly}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id={`r1`} />
                <Label htmlFor={`r1`}>Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id={`r2`} />
                <Label htmlFor={`r2`}>No</Label>
              </div>
            </RadioGroup>
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

export default AssessmentForm;
