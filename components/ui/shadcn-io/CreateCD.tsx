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
} from "@/components/ui/dialog";
import { SingleSelect } from "@/components/single-select";
import { useParentContext } from "@/contexts/ParentContext";
import { useEffect, useRef, useState } from "react";

type CommunityDialogueForm = {
  project_id: string;
  focalPoint: string;
  province_id: string;
  district_id: string;
  village: string;
  indicator_id: string;
};

interface ComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputClass = "border h-8 w-full text-base px-2 rounded-md";
const labelClass = "block text-sm font-medium mb-1";

const CreateCD: React.FC<ComponentProps> = ({ open, onOpenChange }) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [groups, setGroups] = React.useState<string[]>([]);
  const addGroup = () => setGroups([...groups, ""]);

  const [sessions, setSessions] = React.useState<
    { type: "initial" | "followUp"; topic: string; date: string }[]
  >([{ type: "initial", topic: "", date: "" }]);
  const addSession = () =>
    setSessions([...sessions, { type: "followUp", topic: "", date: "" }]);

  const [formData, setFormData] = useState<CommunityDialogueForm>({
    project_id: "",
    focalPoint: "",
    province_id: "",
    district_id: "",
    village: "",
    indicator_id: "",
  });

  useEffect(() => console.log(formData), [formData])

  let [remark, setRemark] = useState<string>("");

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axiosInstance
      .post("/community_dialogue_db/community_dialogue", {
        programInformation: formData,
        sessions: sessions,
        groups: groups,
        remark: remark,
      })
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
      .get("/projects/p/cd_database")
      .then((res: any) => {
        setProjects(Object.values(res.data.data));
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    if (!formData.project_id) return;

    const projectId = formData.project_id;

    axiosInstance
      .get(`projects/indicators/cd_database/${projectId}`)
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
  }, [formData.project_id]);

  useEffect(() => console.log(indicators), [indicators]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <DialogHeader>
          <DialogTitle className="text-lg">
            Create Community Dialogue
          </DialogTitle>
        </DialogHeader>

        {/* Program Info Section */}
        <div className="font-bold text-base text-center px-6 py-2 rounded-xl mb-4 shadow-sm max-w-fit mx-auto">
          Program Information
        </div>

        {/* Form Fields + Add Group in same grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Project Code */}
          <div>
            <Label className={labelClass}>Project Code</Label>
            <SingleSelect
              options={projects.map((project, i) => ({
                value: project.projectCode,
                label: project.projectCode.toUpperCase(),
              }))}
              value={
                projects.find(
                  (project: { id: string; projectCode: string }) =>
                    project.id == formData.project_id
                )?.projectCode ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "project_id",
                    value: projects.find(
                      (project: { id: string; projectCode: string }) =>
                        project.projectCode == value
                    )?.id,
                  },
                })
              }
            ></SingleSelect>
          </div>

          {/* Focal Point */}
          <div>
            <Label className={labelClass}>Focal Point</Label>
            <Input
              name="focalPoint"
              value={formData.focalPoint}
              onChange={handleFormChange}
              placeholder="Focal Point"
              className={inputClass}
            />
          </div>

          {/* Province */}
          <div>
            <Label className={labelClass}>Province</Label>
            <SingleSelect
              options={provinces.map((province, i) => ({
                value: province.name,
                label: province.name.toUpperCase(),
              }))}
              value={
                provinces.find(
                  (province: { id: string; name: string }) =>
                    province.id == formData.province_id
                )?.name ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "province_id",
                    value: provinces.find(
                      (province: { id: string; name: string }) =>
                        province.name == value
                    )?.id,
                  },
                })
              }
            ></SingleSelect>
          </div>

          {/* District */}
          <div>
            <Label className={labelClass}>District</Label>
            <SingleSelect
              options={districts.map((district, i) => ({
                value: district.name,
                label: district.name.toUpperCase(),
              }))}
              value={
                districts.find(
                  (district: { id: string; name: string }) =>
                    district.id == formData.district_id
                )?.name ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "district_id",
                    value: districts.find(
                      (district: { id: string; name: string }) =>
                        district.name == value
                    )?.id,
                  },
                })
              }
            ></SingleSelect>
          </div>

          {/* Village */}
          <div>
            <Label className={labelClass}>Village</Label>
            <Input
              name="village"
              value={formData.village}
              onChange={handleFormChange}
              placeholder="Village"
              className={inputClass}
            />
          </div>

          {/* Select Indicator */}
          <div>
            <Label className={labelClass}>Select Indicator</Label>
            <SingleSelect
              options={indicators.map((indicator, i) => ({
                value: indicator.indicatorRef,
                label: indicator.indicatorRef.toUpperCase(),
              }))}
              value={
                indicators.find(
                  (indicator: { id: string; indicatorRef: string }) =>
                    indicator.id == formData.indicator_id
                )?.indicatorRef ?? ""
              }
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "indicator_id",
                    value: indicators.find(
                      (indicator: { id: string; indicatorRef: string }) =>
                        indicator.indicatorRef == value
                    )?.id,
                  },
                })
              }
            ></SingleSelect>
          </div>

          {/* Add Group Button (now same size as inputs) */}
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={addGroup}
              className="h-8 w-full"
            >
              Add Group
            </Button>
          </div>
        </div>

        {/* Render Added Groups */}
        {groups.map((group, index) => (
          <div key={index} className="mt-3">
            <Label className={labelClass}>Group Name {index + 1}</Label>
            <Input
              placeholder={`Group Name ${index + 1}`}
              className={inputClass}
              value={group}
              onChange={(e) => {
                const newGroups = [...groups];
                newGroups[index] = e.target.value;
                setGroups(newGroups);
              }}
            />
          </div>
        ))}

        {/* Community Dialogues Section */}
        <div className="font-bold text-base text-center px-6 py-2 rounded-xl mt-4 mb-4 shadow-sm max-w-fit mx-auto">
          Community Dialogues Information
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <Label className={labelClass}>CD Topic</Label>
            <Input
              value={sessions[0].topic}
              onChange={(e) =>
                setSessions((prev) =>
                  prev.map((s) =>
                    prev.indexOf(s) == 0 ? { ...s, topic: e.target.value } : s
                  )
                )
              }
            />
          </div>

          <div>
            <Label className={labelClass}>CD Date</Label>
            <Input
              value={sessions[0].date}
              onChange={(e) =>
                setSessions((prev) =>
                  prev.map((s) =>
                    prev.indexOf(s) == 0 ? { ...s, date: e.target.value } : s
                  )
                )
              }
              type="date"
              className={inputClass}
            />
          </div>
        </div>

        {/* Render Sessions */}
        {sessions.map((_session, index) => {
          if (index == 0) return;
          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
            >
              <div>
                <Label className={labelClass}>CD Topic</Label>
                <Input
                  value={sessions[index].topic}
                  onChange={(e) =>
                    setSessions((prev) =>
                      prev.map((s) =>
                        prev.indexOf(s) == index
                          ? { ...s, topic: e.target.value }
                          : s
                      )
                    )
                  }
                />
              </div>

              <div>
                <Label className={labelClass}>CD Date</Label>
                <Input
                  value={sessions[index].date}
                  onChange={(e) =>
                    setSessions((prev) =>
                      prev.map((s) =>
                        prev.indexOf(s) == index
                          ? { ...s, date: e.target.value }
                          : s
                      )
                    )
                  }
                  type="date"
                  className={inputClass}
                />
              </div>
            </div>
          );
        })}

        {/* Add Session Button - moved under inputs and smaller */}
        <div className="flex justify-start">
          <Button variant="secondary" onClick={addSession} className="h-8 px-4">
            Add Session
          </Button>
        </div>

        {/* Remark */}
        <div className="mt-4">
          <Label className={labelClass}>Remark</Label>
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter Remark"
            className={inputClass}
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

export default CreateCD;
