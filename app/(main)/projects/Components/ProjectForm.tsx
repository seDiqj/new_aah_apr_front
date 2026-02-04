"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/multi-select";
import { SingleSelect } from "@/components/single-select";
import React, { useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { ProjectFormSchema } from "@/schemas/FormsSchema";
import { useProjectContext } from "../create_new_project/page";
import { Project } from "../types/Types";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { IsCreateMode, IsEditMode, IsShowMode } from "@/constants/Constants";
import { ProjectFormInterface } from "@/interfaces/Interfaces";
import {
  ProjectStatusOptions,
  ProvinceOptions,
  SectorOptions,
} from "@/constants/SingleAndMultiSelectOptionsList";

const ProjectForm: React.FC<ProjectFormInterface> = ({ mode }) => {
  const { reqForToastAndSetMessage, requestHandler } = useParentContext();
  const {
    projectId,
    setProjectId,
    setCurrentTab,
    setProjectProvinces,
    formData,
    setFormData,
    setOutcomes,
  }: {
    projectId: number | null;
    setCurrentTab: (value: string) => void;
    setProjectId: React.Dispatch<React.SetStateAction<string>>;
    setProjectProvinces: React.Dispatch<React.SetStateAction<string[]>>;
    formData: Project;
    setFormData: React.Dispatch<React.SetStateAction<Project>>;
    setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hundleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hundleSubmit = () => {
    const result = ProjectFormSchema.safeParse(formData);

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
        .post("/projects", formData)
        .then((response: any) => {
          setProjectId(response.data.data.project.id);
          setOutcomes((prev) => [...prev, response.data.data.outcome]);
          reqForToastAndSetMessage(response.data.message, "success");
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message, "error");
        })
        .finally(() => setIsLoading(false));
      return;
    }

    if (IsEditMode(mode)) {
      requestHandler()
        .post(`projects/${projectId}`, formData)
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
    }
  };

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Project Details</CardTitle>
        </CardHeader>

        <CardContent className="overflow-auto px-4 sm:px-6">
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-4
            sm:gap-6
          "
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="projectCode">Project Code</Label>
              <Input
                id="projectCode"
                name="projectCode"
                value={formData.projectCode}
                onChange={hundleFormChange}
                className={`border p-2 rounded ${
                  formErrors.projectCode ? "!border-red-500" : ""
                }`}
                title={formErrors.projectCode}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Textarea
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={hundleFormChange}
                className={`border p-2 rounded min-h-[80px] ${
                  formErrors.projectTitle ? "!border-red-500" : ""
                }`}
                title={formErrors.projectTitle}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="projectGoal">Project Goal</Label>
              <Textarea
                id="projectGoal"
                name="projectGoal"
                value={formData.projectGoal}
                onChange={hundleFormChange}
                className={`border p-2 rounded min-h-[80px] ${
                  formErrors.projectGoal ? "!border-red-500" : ""
                }`}
                title={formErrors.projectGoal}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="projectDonor">Donor</Label>
              <Input
                id="projectDonor"
                name="projectDonor"
                value={formData.projectDonor}
                onChange={hundleFormChange}
                className={`border p-2 rounded ${
                  formErrors.projectDonor ? "!border-red-500" : ""
                }`}
                title={formErrors.projectDonor}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={hundleFormChange}
                className={`border p-2 rounded ${
                  formErrors.startDate ? "!border-red-500" : ""
                }`}
                title={formErrors.startDate}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={hundleFormChange}
                className={`border p-2 rounded ${
                  formErrors.endDate ? "!border-red-500" : ""
                }`}
                title={formErrors.endDate}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="status">Status</Label>
              <SingleSelect
                options={ProjectStatusOptions}
                value={formData.status}
                onValueChange={(value: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }));
                }}
                placeholder="Project Status"
                error={formErrors.status}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="projectManeger">Project Manager</Label>
              <Input
                id="projectManager"
                name="projectManager"
                value={formData.projectManager}
                onChange={hundleFormChange}
                className={`border p-2 rounded ${
                  formErrors.projectManager ? "!border-red-500" : ""
                }`}
                title={formErrors.projectManager}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="province">Province</Label>
              <MultiSelect
                options={ProvinceOptions}
                value={formData.provinces}
                onValueChange={(value: string[]) => {
                  setFormData((prev) => ({
                    ...prev,
                    provinces: value,
                  }));
                  setProjectProvinces(value);
                }}
                placeholder="Project Provinces ..."
                error={formErrors.provinces}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="thematicSector">Thematic Sector</Label>
              <MultiSelect
                options={SectorOptions}
                value={formData.thematicSector}
                onValueChange={(value: string[]) => {
                  setFormData((prev) => ({
                    ...prev,
                    thematicSector: value,
                  }));
                }}
                placeholder="Project Status"
                disabled={readOnly}
                error={formErrors.thematicSector}
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-1">
              <Label htmlFor="reportingPeriod">Reporting Period</Label>
              <Textarea
                id="reportingPeriod"
                name="reportingPeriod"
                value={formData.reportingPeriod}
                onChange={hundleFormChange}
                className={`border p-2 rounded min-h-[80px] ${
                  formErrors.reportingPeriod ? "!border-red-500" : ""
                }`}
                title={formErrors.reportingPeriod}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="reportingDate">Reporting Date</Label>
              <Input
                id="reportingDate"
                name="reportingDate"
                value={formData.reportingDate}
                onChange={hundleFormChange}
                type="text"
                className={`border p-2 rounded ${
                  formErrors.reportingDate ? "!border-red-500" : ""
                }`}
                title={formErrors.reportingDate}
                disabled={readOnly}
              />
            </div>

            <div className="flex flex-col gap-1 col-span-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Type your message here."
                id="description"
                name="description"
                value={formData.description}
                onChange={hundleFormChange}
                className={`border p-2 rounded min-h-[120px] ${
                  formErrors.description ? "!border-red-500" : ""
                }`}
                title={formErrors.description}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-end gap-3 px-4 sm:px-6">
          {cardsBottomButtons(
            setCurrentTab,
            "project",
            readOnly ? undefined : hundleSubmit,
            isLoading,
            setCurrentTab,
            "outcome",
            "project",
            true,
            false,
            !!projectId && IsCreateMode(mode)
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ProjectForm;
