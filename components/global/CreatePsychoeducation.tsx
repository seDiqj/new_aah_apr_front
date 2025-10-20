"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { SingleSelect } from "../single-select";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";

type PsychoeducationForm = {
  programInformation: {
    indicator_id: string;
    project_id: string;
    focalPoint: string;
    province_id: string;
    district_id: string;
    village: string;
    siteCode: string;
    healthFacilityName: string;
    interventionModality: string;
  };
  psychoeducationInformation: {
    awarenessTopic: string;
    awarenessDate: string;
    // men
    ofMenHostCommunity: string;
    ofMenIdp: string;
    ofMenRefugee: string;
    ofMenReturnee: string;
    ofMenDisabilityType: string;
    // women
    ofWomenHostCommunity: string;
    ofWomenIdp: string;
    ofWomenRefugee: string;
    ofWomenReturnee: string;
    ofWomenDisabilityType: string;
    // boy
    ofBoyHostCommunity: string;
    ofBoyIdp: string;
    ofBoyRefugee: string;
    ofBoyReturnee: string;
    ofBoyDisabilityType: string;
    // girl
    ofGirlHostCommunity: string;
    ofGirlIdp: string;
    ofGirlRefugee: string;
    ofGirlReturnee: string;
    ofGirlDisabilityType: string;
    remark: string;
  };
};

interface DatabaseSummaryProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const CreatePsychoeducation: React.FC<DatabaseSummaryProps> = ({
  open,
  onOpenChange,
}) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const [formData, setFormData] = useState<PsychoeducationForm>({
    programInformation: {
      indicator_id: "",
      project_id: "",
      focalPoint: "",
      province_id: "",
      district_id: "",
      village: "",
      siteCode: "",
      healthFacilityName: "",
      interventionModality: "",
    },
    psychoeducationInformation: {
      awarenessTopic: "",
      awarenessDate: "",
      // men
      ofMenHostCommunity: "",
      ofMenIdp: "",
      ofMenRefugee: "",
      ofMenReturnee: "",
      ofMenDisabilityType: "",
      // women
      ofWomenHostCommunity: "",
      ofWomenIdp: "",
      ofWomenRefugee: "",
      ofWomenReturnee: "",
      ofWomenDisabilityType: "",
      // boy
      ofBoyHostCommunity: "",
      ofBoyIdp: "",
      ofBoyRefugee: "",
      ofBoyReturnee: "",
      ofBoyDisabilityType: "",
      // girl
      ofGirlHostCommunity: "",
      ofGirlIdp: "",
      ofGirlRefugee: "",
      ofGirlReturnee: "",
      ofGirlDisabilityType: "",
      remark: "",
    },
  });

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
  };

  const handleSubmit = () => {
    axiosInstance
      .post("/psychoeducation_db/psychoeducation", formData)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const [indicators, setIndicators] = useState<
    {
      id: string;
      indicatorRef: string;
    }[]
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

  useEffect(() => {
    axiosInstance
      .get("/global/projects")
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

  useEffect(() => console.log(formData), [formData]);

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
          <div>
            <Label>Project Code</Label>
            <SingleSelect
              options={projects.map((project, i) => ({
                value: project.projectCode,
                label: project.projectCode.toUpperCase(),
              }))}
              value={
                projects.find(
                  (project: { id: string; projectCode: string }) =>
                    project.id == formData.programInformation.project_id
                )?.projectCode ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "project_id",
                      value: projects.find(
                        (project: { id: string; projectCode: string }) =>
                          project.projectCode == value
                      )?.id,
                    },
                  },
                  "program"
                )
              }
            ></SingleSelect>
          </div>

          <div>
            <Label>Select Indicator</Label>
            <SingleSelect
              options={indicators.map((indicator, i) => ({
                value: indicator.indicatorRef,
                label: indicator.indicatorRef,
              }))}
              value={
                indicators.find(
                  (indicator: { id: string; indicatorRef: string }) =>
                    indicator.id === formData.programInformation.indicator_id
                )?.indicatorRef ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "indicator_id",
                      value: indicators.find(
                        (indicator: { id: string; indicatorRef: string }) =>
                          indicator.indicatorRef === value
                      )?.id,
                    },
                  },
                  "program"
                )
              }
            ></SingleSelect>
          </div>

          <div>
            <Label>Focal Point</Label>
            <Input
              name="focalPoint"
              value={formData.programInformation.focalPoint}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Focal Point"
              className="border w-full mt-2"
            />
          </div>

          <div>
            <Label>Province</Label>
            <SingleSelect
              options={provinces.map((province, i) => ({
                value: province.name,
                label: province.name.toUpperCase(),
              }))}
              value={
                provinces.find(
                  (province: { id: string; name: string }) =>
                    province.id == formData.programInformation.province_id
                )?.name ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "province_id",
                      value: provinces.find(
                        (province: { id: string; name: string }) =>
                          province.name == value
                      )?.id,
                    },
                  },
                  "program"
                )
              }
            ></SingleSelect>
          </div>

          <div>
            <Label>District</Label>
            <SingleSelect
              options={districts.map((district, i) => ({
                value: district.name,
                label: district.name.toUpperCase(),
              }))}
              value={
                districts.find(
                  (district: { id: string; name: string }) =>
                    district.id == formData.programInformation.district_id
                )?.name ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange(
                  {
                    target: {
                      name: "district_id",
                      value: districts.find(
                        (district: { id: string; name: string }) =>
                          district.name == value
                      )?.id,
                    },
                  },
                  "program"
                )
              }
            ></SingleSelect>
          </div>

          <div>
            <Label>Village</Label>
            <Input
              name="village"
              value={formData.programInformation.village}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Village"
              className="border w-full mt-2"
            />
          </div>

          <div>
            <Label>Sit Code</Label>
            <Input
              name="siteCode"
              value={formData.programInformation.siteCode}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Sit Code"
              className="border w-full mt-2"
            />
          </div>

          <div>
            <Label>Health Facility Name</Label>
            <Input
              name="healthFacilityName"
              value={formData.programInformation.healthFacilityName}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Health Facility Name"
              className="border w-full mt-2"
            />
          </div>

          <div>
            <Label>Intervention Modality</Label>
            <Input
              name="interventionModality"
              value={formData.programInformation.interventionModality}
              onChange={(e) => handleFormChange(e, "program")}
              placeholder="Intervention Modality"
              className="border w-full mt-2"
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
            />
          </div>

          <div>
            <Label>Date of Awareness</Label>
            <Input type="date" name="awarenessDate" onChange={(e) => handleFormChange(e, "psychoeducation")}></Input>
          </div>
        </div>

        {/* Demographics with real Inputs */}
        <DemographicLine
          title="Of Men"
          prefix="ofMen"
          formData={formData}
          formChangeHandler={handleFormChange}
        />
        <DemographicLine
          title="Of Women"
          prefix="ofWomen"
          formData={formData}
          formChangeHandler={handleFormChange}
        />
        <DemographicLine
          title="Of Boys"
          prefix="ofBoy"
          formData={formData}
          formChangeHandler={handleFormChange}
        />
        <DemographicLine
          title="Of Girls"
          prefix="ofGirl"
          formData={formData}
          formChangeHandler={handleFormChange}
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
          />
        </div>

        {/* Submit Button */}
        <Button className="w-full mt-6" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

function DemographicLine({
  title,
  prefix,
  formData,
  formChangeHandler,
}: {
  title: string;
  prefix: "ofMen" | "ofWomen" | "ofBoy" | "ofGirl";
  formData: PsychoeducationForm;
  formChangeHandler: (e: any, part: "program" | "psychoeducation") => void;
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatePsychoeducation;
