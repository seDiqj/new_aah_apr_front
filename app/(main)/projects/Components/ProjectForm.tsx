"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ComponentProps {
  mode: "create" | "edit";
  readOnly?: boolean;
}

const ProjectForm: React.FC<ComponentProps> = ({mode, readOnly}) => {

    const {reqForToastAndSetMessage, axiosInstance} = useParentContext();
    const {projectId, setCurrentTab, setProjectId, setProjectProvinces, formData, setFormData}: {projectId: number | null, setCurrentTab: (value: string) => void; setProjectId: React.Dispatch<React.SetStateAction<string>>; setProjectProvinces: React.Dispatch<React.SetStateAction<string[]>>, formData: Project, setFormData: React.Dispatch<React.SetStateAction<Project>>} = mode == "create" ?  useProjectContext() : readOnly ? useProjectShowContext() : useProjectEditContext();

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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
        reqForToastAndSetMessage("Please fix validation errors before submitting.");
        return;
        }

        setFormErrors({});
    
        if (mode == "create")
        {
          axiosInstance
          .post("/projects", formData)
          .then((response: any) => {
            setProjectId(response.data.data.id);
            reqForToastAndSetMessage(response.data.message);
          })
          .catch((error: any) => {
            reqForToastAndSetMessage(error.response.data.message);
          });
          return;
        }

        axiosInstance.post(`projects/${projectId}`, formData)
        .then((response: any) => reqForToastAndSetMessage(response.data.message))
        .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
    };

    return (
        <>
            <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>

                <CardContent className="overflow-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectCode">Project Code</Label>
                      <Input
                        id="projectCode"
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={hundleFormChange}
                        className={`border p-2 rounded ${formErrors.projectCode ? "!border-red-500" : ""}`}
                        title={formErrors.projectCode}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectTitle">Project Title</Label>
                      <Input
                        id="projectTitle"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={hundleFormChange}
                        className={`border p-2 rounded ${formErrors.projectTitle ? "!border-red-500" : ""}`}
                        title={formErrors.projectTitle}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectGoal">Project Goal</Label>
                      <Input
                        id="projectGoal"
                        name="projectGoal"
                        value={formData.projectGoal}
                        onChange={hundleFormChange}
                        className={`border p-2 rounded ${formErrors.projectGoal ? "!border-red-500" : ""}`}
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
                        className={`border p-2 rounded ${formErrors.projectDonor ? "!border-red-500" : ""}`}
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
                        className={`border p-2 rounded ${formErrors.startDate ? "!border-red-500" : ""}`}
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
                        className={`border p-2 rounded ${formErrors.endDate ? "!border-red-500" : ""}`}
                        title={formErrors.endDate}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="status">Status</Label>
                      <SingleSelect
                        options={[
                          { value: "planed", label: "Planed" },
                          { value: "ongoing", label: "On Going" },
                          { value: "completed", label: "Compleated" },
                          { value: "onhold", label: "On Hold" },
                          { value: "canclled", label: "Canclled" },
                        ]}
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
                        className={`border p-2 rounded ${formErrors.projectManager ? "!border-red-500" : ""}`}
                        title={formErrors.projectManager}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="province">Province</Label>
                      <MultiSelect
                        options={[
                          { value: "kabul", label: "Kabul" },
                          { value: "badakhshan", label: "Badakhshan" },
                          { value: "ghor", label: "Ghor" },
                          { value: "helmand", label: "Helmand" },
                          { value: "daikundi", label: "Daikundi" },
                        ]}
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
                        options={[
                          { value: "mhpss", label: "MHPSS" },
                          { value: "wash", label: "WASH" },
                          { value: "health", label: "Health" },
                          { value: "nutrition", label: "Nutrition" },
                        ]}
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

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="reportingPeriod">Reporting Period</Label>
                      <Input
                        id="reportingPeriod"
                        name="reportingPeriod"
                        value={formData.reportingPeriod}
                        onChange={hundleFormChange}
                        type="text"
                        className={`border p-2 rounded ${formErrors.reportingPeriod ? "!border-red-500" : ""}`}
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
                        className={`border p-2 rounded ${formErrors.reportingDate ? "!border-red-500" : ""}`}
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
                        className={`border p-2 rounded ${formErrors.description ? "!border-red-500" : ""}`}
                        title={formErrors.description}
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                    {cardsBottomButtons(setCurrentTab, "project", readOnly ? undefined : hundleSubmit, setCurrentTab, "outcome", true)}
                </CardFooter>
              </Card>
        </>
    )
}

export default ProjectForm;