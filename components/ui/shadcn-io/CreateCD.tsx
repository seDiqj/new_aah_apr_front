"use client";

import * as React from "react";
import { useState, useEffect } from "react";

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
  mode: "create" | "update" | "show";
  dialogueId?: number;
}

const inputClass = "border h-8 w-full text-base px-2 rounded-md";
const labelClass = "block text-sm font-medium mb-1";

const CommunityDialogueFormComponent: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  dialogueId,
}) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [formData, setFormData] = useState<CommunityDialogueForm>({
    project_id: "",
    focalPoint: "",
    province_id: "",
    district_id: "",
    village: "",
    indicator_id: "",
  });

  const [groups, setGroups] = useState<{ id?: number; name: string }[]>([]);
  const [sessions, setSessions] = useState<
    { type: "initial" | "followUp"; topic: string; date: string }[]
  >([{ type: "initial", topic: "", date: "" }]);
  const [remark, setRemark] = useState<string>("");

  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );
  const [indicators, setIndicators] = useState<
    { id: string; indicatorRef: string }[]
  >([]);

  const isReadOnly = mode === "show";

  // --- Load projects initially ---
  useEffect(() => {
    axiosInstance
      .get("/projects/p/cd_database")
      .then((res: any) => setProjects(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message)
      );
  }, []);

  // --- Load dialogue data if update/show ---
  useEffect(() => {
    if ((mode === "update" || mode === "show") && dialogueId) {
      axiosInstance
        .get(`/community_dialogue_db/community_dialogue_for_edit/${dialogueId}`)
        .then((res: any) => {
          const data = res.data.data;
          setFormData(data.programInformation);
          setGroups(data.groups?.map((g: any) => ({ ...g })) ?? []);
          setSessions(
            data.sessions ?? [{ type: "initial", topic: "", date: "" }]
          );
          setRemark(data.remark ?? "");
        })
        .catch((err: any) =>
          reqForToastAndSetMessage(
            err.response?.data?.message || "Failed to load data"
          )
        );
    }
  }, [mode, dialogueId]);

  // --- Load indicators/provinces/districts when project changes ---
  useEffect(() => {
    if (!formData.project_id) return;
    const projectId = formData.project_id;

    axiosInstance
      .get(`projects/indicators/cd_database/${projectId}`)
      .then((res: any) => setIndicators(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message)
      );

    axiosInstance
      .get(`projects/provinces/${projectId}`)
      .then((res: any) => setProvinces(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message)
      );

    axiosInstance
      .get("/global/districts")
      .then((res: any) => setDistricts(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message)
      );
  }, [formData.project_id]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (mode === "create") {
      axiosInstance
        .post("/community_dialogue_db/community_dialogue", {
          programInformation: formData,
          sessions,
          groups,
          remark,
        })
        .then((res: any) => reqForToastAndSetMessage(res.data.message))
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message)
        );
    } else if (mode === "update" && dialogueId) {
      axiosInstance
        .put(`/community_dialogue_db/community_dialogue/${dialogueId}`, {
          programInformation: formData,
          sessions,
          groups,
          remark,
        })
        .then((res: any) => reqForToastAndSetMessage(res.data.message))
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message)
        );
    }
  };

  // --- Add group/session functions ---
  const addGroup = () => setGroups([...groups, { name: "" }]);
  const addSession = () =>
    setSessions([...sessions, { type: "followUp", topic: "", date: "" }]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{ maxHeight: "85vh", padding: 16 }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">
            {mode === "create"
              ? "Create Community Dialogue"
              : mode === "update"
              ? "Update Community Dialogue"
              : "View Community Dialogue"}
          </DialogTitle>
        </DialogHeader>

        {/* Program Information Section */}
        <div className="font-bold text-base text-center px-6 py-2 rounded-xl mb-4 shadow-sm max-w-fit mx-auto">
          Program Information
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Project */}
          <div>
            <Label className={labelClass}>Project Code</Label>
            <SingleSelect
              options={projects.map((p) => ({
                value: p.projectCode,
                label: p.projectCode.toUpperCase(),
              }))}
              value={
                projects.find((p) => p.id == formData.project_id)
                  ?.projectCode ?? ""
              }
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "project_id",
                    value: projects.find((p) => p.projectCode == value)?.id,
                  },
                })
              }
              disabled={isReadOnly}
            />
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
              disabled={isReadOnly}
            />
          </div>

          {/* Province */}
          <div>
            <Label className={labelClass}>Province</Label>
            <SingleSelect
              options={provinces.map((p) => ({
                value: p.name,
                label: p.name.toUpperCase(),
              }))}
              value={
                provinces.find((p) => p.id == formData.province_id)?.name ?? ""
              }
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "province_id",
                    value: provinces.find((p) => p.name == value)?.id,
                  },
                })
              }
              disabled={isReadOnly}
            />
          </div>

          {/* District */}
          <div>
            <Label className={labelClass}>District</Label>
            <SingleSelect
              options={districts.map((d) => ({
                value: d.name,
                label: d.name.toUpperCase(),
              }))}
              value={
                districts.find((d) => d.id == formData.district_id)?.name ?? ""
              }
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "district_id",
                    value: districts.find((d) => d.name == value)?.id,
                  },
                })
              }
              disabled={isReadOnly}
            />
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
              disabled={isReadOnly}
            />
          </div>

          {/* Indicator */}
          <div>
            <Label className={labelClass}>Select Indicator</Label>
            <SingleSelect
              options={indicators.map((i) => ({
                value: i.indicatorRef,
                label: i.indicatorRef.toUpperCase(),
              }))}
              value={
                indicators.find((i) => i.id == formData.indicator_id)
                  ?.indicatorRef ?? ""
              }
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "indicator_id",
                    value: indicators.find((i) => i.indicatorRef == value)?.id,
                  },
                })
              }
              disabled={isReadOnly}
            />
          </div>

          {/* Add Group Button */}
          {mode !== "show" && (
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={addGroup}
                className="h-8 w-full"
              >
                Add Group
              </Button>
            </div>
          )}
        </div>

        {/* Groups */}
        {groups.map((group, index) => (
          <div key={index} className="mt-3">
            <Label className={labelClass}>Group Name {index + 1}</Label>
            <Input
              placeholder={`Group Name ${index + 1}`}
              className={inputClass}
              value={group.name}
              onChange={(e) => {
                const newGroups = [...groups];
                newGroups[index] = {
                  ...newGroups[index],
                  name: e.target.value,
                };
                setGroups(newGroups);
              }}
              disabled={isReadOnly}
            />
          </div>
        ))}

        {/* Community Dialogues */}
        <div className="font-bold text-base text-center px-6 py-2 rounded-xl mt-4 mb-4 shadow-sm max-w-fit mx-auto">
          Community Dialogues Information
        </div>

        {sessions.map((session, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
          >
            <div>
              <Label className={labelClass}>CD Topic</Label>
              <Input
                value={session.topic}
                onChange={(e) =>
                  setSessions((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, topic: e.target.value } : s
                    )
                  )
                }
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label className={labelClass}>CD Date</Label>
              <Input
                type="date"
                value={session.date}
                onChange={(e) =>
                  setSessions((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, date: e.target.value } : s
                    )
                  )
                }
                className={inputClass}
                disabled={isReadOnly}
              />
            </div>
          </div>
        ))}

        {/* Add Session Button */}
        {mode !== "show" && (
          <div className="flex justify-start">
            <Button
              variant="secondary"
              onClick={addSession}
              className="h-8 px-4"
            >
              Add Session
            </Button>
          </div>
        )}

        {/* Remark */}
        <div className="mt-4">
          <Label className={labelClass}>Remark</Label>
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter Remark"
            className={inputClass}
            disabled={isReadOnly}
          />
        </div>

        {/* Submit / Update / Close Button */}
        <div className="mt-6">
          {mode === "create" && (
            <Button className="w-full" onClick={handleSubmit}>
              Submit
            </Button>
          )}
          {mode === "update" && (
            <Button className="w-full" onClick={handleSubmit}>
              Update
            </Button>
          )}
          {mode === "show" && (
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityDialogueFormComponent;
