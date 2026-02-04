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
import { MainDatabaseProgramFormSchema } from "@/schemas/FormsSchema";
import { MainDatabaseProgramDefault } from "@/constants/FormsDefaultValues";
import {
  MainDatabaseProgramCreationMessage,
  MainDatabaseProgramEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { MainDatabaseProgramFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import { AxiosError } from "axios";

const ProgramMainForm: React.FC<MainDatabaseProgramFormInterface> = ({
  open,
  onOpenChange,
  mode,
  programId,
  createdProgramStateSetter,
  programsListStateSetter,
}) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<MainDatabaseProgram>(
    MainDatabaseProgramDefault(),
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    const result = MainDatabaseProgramFormSchema.safeParse(formData);

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

    if (IsCreateMode(mode)) {
      requestHandler()
        .post("/global/program/main_database", formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          if (createdProgramStateSetter)
            createdProgramStateSetter({
              target: {
                name: "program",
                value: response.data.data.id,
              },
            });

          if (programsListStateSetter)
            programsListStateSetter((prev: { focalPoint: number }[]) => [
              ...prev,
              {
                id: response.data.data.id,
                name: formData.name,
              },
            ]);
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    } else if (IsEditMode(mode) && programId) {
      requestHandler()
        .put(`/global/program/${programId}`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    }
  };

  const [districts, setDistricts] = useState<{ name: string }[]>([]);
  const [provinces, setProvinces] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);

  useEffect(() => {
    requestHandler()
      .get("/global/districts")
      .then((res: any) => setDistricts(Object.values(res.data.data)))
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message, "error"),
      );
    requestHandler()
      .get("/projects/p/main_database")
      .then((res: any) => setProjects(Object.values(res.data.data)))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message, "error"),
      );
  }, []);

  useEffect(() => {
    if (!formData.project_id) return;
    requestHandler()
      .get(`/global/project/provinces/${formData.project_id}`)
      .then((res: any) => {
        setProvinces(Object.values(res.data.data));
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message, "error"),
      );
  }, [formData.project_id]);

  // Fetch program data from backend in edit and show mode.
  useEffect(() => {
    if ((IsEditMode(mode) || IsShowMode(mode)) && programId && open) {
      requestHandler()
        .get(`/global/program/${programId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message, "error");
        });
    }
  }, [mode, programId, open]);

  const readOnly = IsShowMode(mode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[80%] w-[70%]">
        <DialogTitle>
          {IsCreateMode(mode) && "Create New Program"}
          {IsEditMode(mode) && "Edit Program"}
          {IsShowMode(mode) && "Program Details"}
        </DialogTitle>
        <form className="space-y-4 grid grid-cols-2 gap-4 overflow-auto">
          {/* Project code */}
          <div className="flex flex-col gap-2">
            <Label>Project Code</Label>
            <SingleSelect
              options={projects.map((p) => ({
                value: p.id,
                label: p.projectCode.toUpperCase(),
              }))}
              value={formData.project_id}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: { name: "project_id", value: value },
                })
              }
              disabled={readOnly}
              error={formErrors.project_id}
            />
          </div>
          {/* Program name */}
          <div className="flex flex-col gap-2">
            <Label>Program Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.name ? "!border-red-500" : ""
              }`}
              title={formErrors.name ? formErrors["name"] : undefined}
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
              className={`border p-2 rounded ${
                formErrors.focalPoint ? "!border-red-500" : ""
              }`}
              title={
                formErrors.focalPoint ? formErrors["focalPoint"] : undefined
              }
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
              className={`border p-2 rounded ${
                formErrors.village ? "!border-red-500" : ""
              }`}
              title={formErrors.village ? formErrors["village"] : undefined}
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
              className={`border p-2 rounded ${
                formErrors.siteCode ? "!border-red-500" : ""
              }`}
              title={formErrors.siteCode ? formErrors["siteCode"] : undefined}
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
              className={`border p-2 rounded ${
                formErrors.healthFacilityName
                  ? "!border-red-500"
                  : "!border-gray-300"
              }`}
              title={
                formErrors.healthFacilityName
                  ? formErrors["healthFacilityName"]
                  : undefined
              }
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
              className={`border p-2 rounded ${
                formErrors.interventionModality
                  ? "!border-red-500"
                  : "!border-gray-300"
              }`}
              title={
                formErrors.interventionModality
                  ? formErrors["interventionModality"]
                  : undefined
              }
            />
          </div>
        </form>
        {/* Submit */}
        {IsNotShowMode(mode) && (
          <div className="flex justify-end w-full col-span-2 fixed left-0 bottom-1">
            <Button
              id={SUBMIT_BUTTON_PROVIDER_ID}
              disabled={isLoading}
              className="mr-2"
              type="button"
              onClick={() =>
                reqForConfirmationModelFunc(
                  IsCreateMode(mode)
                    ? MainDatabaseProgramCreationMessage
                    : MainDatabaseProgramEditionMessage,
                  () => {
                    handleSubmit();
                  },
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
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(ProgramMainForm, "Maindatabase.create");
