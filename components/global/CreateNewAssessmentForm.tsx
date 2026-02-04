"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { AssessmentFormType } from "@/types/Types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AssessmentFormSchema } from "@/schemas/FormsSchema";
import { AssessmentDefault } from "@/constants/FormsDefaultValues";
import { AssessmentSubmitButtonMessage } from "@/constants/ConfirmationModelsTexts";
import { AssessmentFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsEditOrShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { AssessmentTypeOptions } from "@/constants/SingleAndMultiSelectOptionsList";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import { AxiosError, AxiosResponse } from "axios";
import { toDateOnly } from "./MainDatabaseBeneficiaryCreationForm";

const AssessmentForm: React.FC<AssessmentFormInterface> = ({
  open,
  onOpenChange,
  mode,
  projectId,
}) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
    handleReload,
  } = useParentContext();

  const [formData, setFormData] =
    useState<AssessmentFormType>(AssessmentDefault());

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [indicators, setIndicators] = useState<
    { id: string; indicatorRef: string }[]
  >([]);

  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [registrationDateValidRange, setRegistrationDateValidRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "2025-1-1",
    end: "2025-2-1",
  });

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
      reqForToastAndSetMessage(
        "Please fix validation errors before submitting.",
        "warning"
      );
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    if (IsCreateMode(mode)) {
      requestHandler()
        .post("/enact_database/", formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    } else if (IsEditMode(mode) && projectId) {
      requestHandler()
        .put(`/enact_database/${projectId}`, formData)
        .then((response: any) => {
          onOpenChange(false);
          reqForToastAndSetMessage(response.data.message, "success");
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    }
  };

  // Fetch program data from backend in edit and show mode.
  useEffect(() => {
    if (IsEditOrShowMode(mode) && projectId && open) {
      requestHandler()
        .get(`/enact_database/${projectId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message, "error");
        });
    }
  }, [mode, projectId, open]);

  useEffect(() => {
    requestHandler()
      .get("/projects/p/enact_database")
      .then((response: any) => setProjects(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message, "error"),
      );
  }, []);

  useEffect(() => {
    if (!formData.project_id) return;
    requestHandler()
      .get(`projects/indicators/enact_database/${formData.project_id}`)
      .then((response: any) => setIndicators(response.data.data))
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message, "error");
      });

    requestHandler()
      .get(`projects/provinces/${formData.project_id}`)
      .then((res: any) => setProvinces(Object.values(res.data.data)))
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message, "error");
      });
    requestHandler()
      .get(`/date/project_date_range/${formData.project_id}`)
      .then((response: AxiosResponse<any, any>) => {
        setRegistrationDateValidRange({
          start: toDateOnly(response.data.data.start),
          end: toDateOnly(response.data.data.end),
        });
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message, "error"),
      );
  }, [formData.project_id]);

  const readOnly = IsShowMode(mode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[80%] w-[70%]">
        <DialogTitle>
          {IsCreateMode(mode) && "Create New Assessment"}
          {IsEditMode(mode) && "Edit Assessment"}
          {IsShowMode(mode) && "Assessment Details"}
        </DialogTitle>
        <form className="space-y-4 grid grid-cols-2 gap-4">
          {/* Project code */}
          <div className="flex flex-col gap-2">
            <Label>Project Code</Label>
            <SingleSelect
              options={projects.map((p) => ({
                value: p.id,
                label: p.projectCode,
              }))}
              value={formData.project_id}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "project_id",
                    value: value,
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
                value: indicator.id,
                label: indicator.indicatorRef.toUpperCase(),
              }))}
              value={formData.indicator_id}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "indicator_id",
                    value: value,
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
                value: province.id,
                label: province.name.toUpperCase(),
              }))}
              value={formData.province_id}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "province_id",
                    value: value,
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
              className={`border p-2 rounded ${
                formErrors.councilorName ? "!border-red-500" : ""
              }`}
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
              className={`border p-2 rounded ${
                formErrors.raterName ? "!border-red-500" : ""
              }`}
              title={formErrors.raterName}
            />
          </div>
          {/* Type Of Assessment */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label>Type Of Assessment</Label>
              <SingleSelect
                options={AssessmentTypeOptions}
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
              disabled={readOnly || !formData.project_id}
              className={`border p-2 rounded ${
                formErrors.date ? "!border-red-500" : ""
              }`}
              title={formErrors.date}
              min={registrationDateValidRange.start}
              max={registrationDateValidRange.end}
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
              <Button
                id={SUBMIT_BUTTON_PROVIDER_ID}
                disabled={isLoading}
                type="button"
                onClick={(e) =>
                  reqForConfirmationModelFunc(
                    AssessmentSubmitButtonMessage,
                    () => handleSubmit(e),
                  )
                }
              >
                {isLoading
                  ? IsCreateMode(mode)
                    ? "Saving ..."
                    : "Updating ..."
                  : IsCreateMode(mode)
                    ? "Save"
                    : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentForm;
