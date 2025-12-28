"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SingleSelect } from "../single-select";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { withPermission } from "@/lib/withPermission";
import { PsychoeducationFormSchema } from "@/schemas/FormsSchema";
import { PsychoeducationForm } from "@/types/Types";
import { PsychoeducationDefault } from "@/constants/FormsDefaultValues";
import {
  PsychoeducationCreationMessage,
  PsychoeducationEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { PsychoeducationFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";

const CreatePsychoeducation: React.FC<PsychoeducationFormInterface> = ({
  open,
  onOpenChange,
  mode,
  psychoeducationId,
}) => {
  const {
    reqForToastAndSetMessage,
    axiosInstance,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<PsychoeducationForm>(
    PsychoeducationDefault()
  );

  const [formErrors, setFormErrors] = useState<{
    programInformation: { [key: string]: string };
    psychoeducationInformation: { [key: string]: string };
  }>({ programInformation: {}, psychoeducationInformation: {} });

  const [indicators, setIndicators] = useState<
    { id: string; indicatorRef: string }[]
  >([]);

  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );

  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);

  const handleFormChange = (e: any, part: "program" | "psychoeducation") => {
    const { name, value } = e.target;

    part == "program"
      ? setFormData((prev) => ({
          ...prev,
          programInformation: {
            ...prev?.programInformation,
            [name]: value,
          },
        }))
      : setFormData((prev) => ({
          ...prev,
          psychoeducationInformation: {
            ...prev.psychoeducationInformation,
            [name]: value,
          },
        }));
    PsychoeducationFormSchema.safeParse(formData);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => console.log(formErrors), [formErrors]);

  const handleSubmit = () => {
    const result = PsychoeducationFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: { [key: string]: { [key: string]: string } } = {};

      result.error.issues.forEach((issue) => {
        if (issue.path.length === 2) {
          const [parent, child] = issue.path;
          if (!errors[parent as string]) errors[parent as string] = {};
          errors[parent as string][child as string] = issue.message;
        } else if (issue.path.length === 1) {
          const [field] = issue.path;
          errors[field as string] = { general: issue.message }; // fallback
        }
      });

      if (!errors.programInformation) errors.programInformation = {};
      if (!errors.psychoeducationInformation)
        errors.psychoeducationInformation = {};

      setFormErrors(errors);

      console.log(errors);

      reqForToastAndSetMessage(
        "Please fix validation errors before submitting."
      );
      return;
    }

    setFormErrors({
      programInformation: {},
      psychoeducationInformation: {},
    });

    setIsLoading(true);

    if (IsCreateMode(mode)) {
      axiosInstance
        .post("/psychoeducation_db/psychoeducation", formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
    } else if (IsEditMode(mode)) {
      axiosInstance
        .put(
          `/psychoeducation_db/psychoeducation/${psychoeducationId}`,
          formData
        )
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/projects/p/psychoeducation_database")
      .then((res: any) => {
        setProjects(Object.values(res.data.data));
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    if (!formData.programInformation.project_id) return;

    const projectId = formData.programInformation.project_id;

    axiosInstance
      .get(`projects/indicators/psychoeducation_database/${projectId}`)
      .then((response: any) => setIndicators(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    axiosInstance
      .get("/global/districts")
      .then((res: any) => setDistricts(Object.values(res.data.data)))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    axiosInstance
      .get(`projects/provinces/${projectId}`)
      .then((res: any) => setProvinces(Object.values(res.data.data)))
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
        console.log(error.response.data.message);
      });
  }, [formData.programInformation.project_id]);

  useEffect(() => {
    if ((IsEditMode(mode) || IsShowMode(mode)) && psychoeducationId && open) {
      axiosInstance
        .get(`/psychoeducation_db/psychoeducation/${psychoeducationId}`)
        .then((response: any) => {
          const { programData, ...psychoeducationData } = response.data.data;

          console.log(programData);
          setFormData((prev) => ({
            programInformation: programData,
            psychoeducationInformation: {
              ...response.data.data.psychoeducationData,
            },
          }));
        });
    }
  }, [mode, psychoeducationId]);

  const readOnly: boolean = IsShowMode(mode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Create</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-2 relative">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Create Psychoeducation
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Program Information Badge */}
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
          Program Information
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Project Code</Label>
            <SingleSelect
              options={projects.map((project, i) => ({
                value: project.id,
                label: project.projectCode.toUpperCase(),
              }))}
              value={formData.programInformation.project_id}
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "project_id",
                      value: value,
                    },
                  },
                  "program"
                )
              }
              disabled={readOnly}
              error={formErrors.programInformation.project_id}
            ></SingleSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Select Indicator</Label>
            <SingleSelect
              options={indicators.map((indicator, i) => ({
                value: indicator.id,
                label: indicator.indicatorRef,
              }))}
              value={formData.programInformation.indicator_id}
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "indicator_id",
                      value: value,
                    },
                  },
                  "program"
                )
              }
              disabled={readOnly}
              error={formErrors.programInformation.indicator_id}
            ></SingleSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Program Name</Label>
            <Input
              name="name"
              value={formData.programInformation.name}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Program Name"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.name ? "!border-red-500" : ""
              }`}
              title={
                formErrors.programInformation.name
                  ? formErrors.programInformation.name
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Focal Point</Label>
            <Input
              name="focalPoint"
              value={formData.programInformation.focalPoint}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Focal Point"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.focalPoint
                  ? "!border-red-500"
                  : ""
              }`}
              title={
                formErrors.programInformation.focalPoint
                  ? formErrors.programInformation.focalPoint
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Province</Label>
            <SingleSelect
              options={provinces.map((province, i) => ({
                value: province.id,
                label: province.name.toUpperCase(),
              }))}
              value={formData.programInformation.province_id}
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "province_id",
                      value: value,
                    },
                  },
                  "program"
                )
              }
              disabled={readOnly}
              error={formErrors.programInformation.province_id}
            ></SingleSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>District</Label>
            <SingleSelect
              options={districts.map((district, i) => ({
                value: district.id,
                label: district.name.toUpperCase(),
              }))}
              value={formData.programInformation.district_id}
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "district_id",
                      value: value,
                    },
                  },
                  "program"
                )
              }
              disabled={readOnly}
              error={formErrors.programInformation.district_id}
            ></SingleSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Village</Label>
            <Input
              name="village"
              value={formData.programInformation.village}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Village"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.village ? "!border-red-500" : ""
              }`}
              title={
                formErrors.programInformation.village
                  ? formErrors.programInformation.village
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Sit Code</Label>
            <Input
              name="siteCode"
              value={formData.programInformation.siteCode}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Sit Code"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.siteCode ? "!border-red-500" : ""
              }`}
              title={
                formErrors.programInformation.siteCode
                  ? formErrors.programInformation.siteCode
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Health Facility Name</Label>
            <Input
              name="healthFacilityName"
              value={formData.programInformation.healthFacilityName}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Health Facility Name"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.healthFacilityName
                  ? "!border-red-500"
                  : ""
              }`}
              title={
                formErrors.programInformation.healthFacilityName
                  ? formErrors.programInformation.healthFacilityName
                  : undefined
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Intervention Modality</Label>
            <Input
              name="interventionModality"
              value={formData.programInformation.interventionModality}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Intervention Modality"
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.interventionModality
                  ? "!border-red-500"
                  : ""
              }`}
              title={
                formErrors.programInformation.interventionModality
                  ? formErrors.programInformation.interventionModality
                  : undefined
              }
            />
          </div>
        </div>

        {/* Topic of Awareness & Date of Awareness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Topic of Awareness</Label>
            <Input
              name="awarenessTopic"
              value={formData.psychoeducationInformation.awarenessTopic}
              onChange={(e) => handleFormChange(e, "psychoeducation")}
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.awarenessTopic
                  ? "!border-red-500"
                  : ""
              }`}
              title={
                formErrors.psychoeducationInformation.awarenessTopic
                  ? formErrors.psychoeducationInformation.awarenessTopic
                  : undefined
              }
            />
          </div>

          <div>
            <Label>Date of Awareness</Label>
            <Input
              type="date"
              name="awarenessDate"
              value={formData.psychoeducationInformation.awarenessDate}
              onChange={(e) => handleFormChange(e, "psychoeducation")}
              disabled={readOnly}
              className={`border p-2 rounded ${
                formErrors.programInformation.awarenessDate
                  ? "!border-red-500"
                  : ""
              }`}
              title={
                formErrors.psychoeducationInformation.awarenessDate
                  ? formErrors.psychoeducationInformation.awarenessDate
                  : undefined
              }
            ></Input>
          </div>
        </div>

        {/* Demographics with real Inputs */}
        <DemographicLine
          title="Of Men"
          prefix="ofMen"
          formData={formData}
          formChangeHandler={handleFormChange}
          readonly={readOnly}
        />
        <DemographicLine
          title="Of Women"
          prefix="ofWomen"
          formData={formData}
          formChangeHandler={handleFormChange}
          readonly={readOnly}
        />
        <DemographicLine
          title="Of Boys"
          prefix="ofBoy"
          formData={formData}
          formChangeHandler={handleFormChange}
          readonly={readOnly}
        />
        <DemographicLine
          title="Of Girls"
          prefix="ofGirl"
          formData={formData}
          formChangeHandler={handleFormChange}
          readonly={readOnly}
        />

        {/* Remark */}
        <div className="mt-4">
          <Label>Remark</Label>
          <Textarea
            name="remark"
            value={formData.psychoeducationInformation.remark}
            onChange={(e) => handleFormChange(e, "psychoeducation")}
            placeholder="Write remark here..."
            className="mt-2"
            disabled={readOnly}
          />
        </div>

        {/* Submit Button */}
        {IsNotShowMode(mode) && (
          <Button
            id={SUBMIT_BUTTON_PROVIDER_ID}
            disabled={isLoading}
            className="w-full mt-6"
            onClick={(e) =>
              reqForConfirmationModelFunc(
                IsCreateMode(mode)
                  ? PsychoeducationCreationMessage
                  : PsychoeducationEditionMessage,
                () => handleSubmit()
              )
            }
          >
            {isLoading ? "Saving ..." : "Save"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

function DemographicLine({
  title,
  prefix,
  formData,
  formChangeHandler,
  readonly,
}: {
  title: string;
  prefix: "ofMen" | "ofWomen" | "ofBoy" | "ofGirl";
  formData: PsychoeducationForm;
  formChangeHandler: (e: any, part: "program" | "psychoeducation") => void;
  readonly: boolean;
}) {
  const fields: {
    label: string;
    placeholder: string;
    name:
      | "awarenessTopic"
      | "awarenessDate"
      // men
      | "ofMenHostCommunity"
      | "ofMenIdp"
      | "ofMenRefugee"
      | "ofMenReturnee"
      | "ofMenDisabilityType"
      // women
      | "ofWomenHostCommunity"
      | "ofWomenIdp"
      | "ofWomenRefugee"
      | "ofWomenReturnee"
      | "ofWomenDisabilityType"
      // boy
      | "ofBoyHostCommunity"
      | "ofBoyIdp"
      | "ofBoyRefugee"
      | "ofBoyReturnee"
      | "ofBoyDisabilityType"
      // girl
      | "ofGirlHostCommunity"
      | "ofGirlIdp"
      | "ofGirlRefugee"
      | "ofGirlReturnee"
      | "ofGirlDisabilityType";
  }[] = [
    {
      label: "Host Community",
      placeholder: "Enter value",
      name:
        prefix == "ofMen"
          ? "ofMenHostCommunity"
          : prefix == "ofWomen"
          ? "ofWomenHostCommunity"
          : prefix == "ofBoy"
          ? "ofBoyHostCommunity"
          : "ofGirlHostCommunity",
    },
    {
      label: "of IDP",
      placeholder: "Enter value",
      name:
        prefix == "ofMen"
          ? "ofMenIdp"
          : prefix == "ofWomen"
          ? "ofWomenIdp"
          : prefix == "ofBoy"
          ? "ofBoyIdp"
          : "ofGirlIdp",
    },
    {
      label: "of Refugee",
      placeholder: "Enter value",
      name:
        prefix == "ofMen"
          ? "ofMenRefugee"
          : prefix == "ofWomen"
          ? "ofWomenRefugee"
          : prefix == "ofBoy"
          ? "ofBoyRefugee"
          : "ofGirlRefugee",
    },
    {
      label: "of Returnee",
      placeholder: "Enter value",
      name:
        prefix == "ofMen"
          ? "ofMenReturnee"
          : prefix == "ofWomen"
          ? "ofWomenReturnee"
          : prefix == "ofBoy"
          ? "ofBoyReturnee"
          : "ofGirlReturnee",
    },
    {
      label: "Disability Type",
      placeholder: "Enter value",
      name:
        prefix == "ofMen"
          ? "ofMenDisabilityType"
          : prefix == "ofWomen"
          ? "ofWomenDisabilityType"
          : prefix == "ofBoy"
          ? "ofBoyDisabilityType"
          : "ofGirlDisabilityType",
    },
  ];

  return (
    <div className="mt-4">
      <span className="font-semibold">{title}.</span>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
        {fields.map((field) => (
          <div key={field.label}>
            <Label>{field.label}</Label>
            <Input
              name={field.name}
              value={formData.psychoeducationInformation[field.name]}
              onChange={(e) => formChangeHandler(e, "psychoeducation")}
              placeholder={field.placeholder}
              className="border w-full mt-1"
              disabled={readonly}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default withPermission(CreatePsychoeducation, "Psychoeducation.create");
