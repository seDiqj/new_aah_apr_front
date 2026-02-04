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
import { CdFormSchema } from "@/schemas/FormsSchema";
import { CommunityDialogueFormType } from "@/types/Types";
import { CommunityDialogueFormDefault } from "@/constants/FormsDefaultValues";
import {
  CommunityDialogueCreationMessage,
  CommunityDialogueEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { CommunityDialogueFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsEditOrShowMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";
import { toDateOnly } from "@/components/global/MainDatabaseBeneficiaryCreationForm";

const inputClass = "border h-8 w-full text-base px-2 rounded-md";
const labelClass = "block text-sm font-medium mb-1";

const CommunityDialogueFormComponent: React.FC<
  CommunityDialogueFormInterface
> = ({ open, onOpenChange, mode, dialogueId }) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<CommunityDialogueFormType>(
    CommunityDialogueFormDefault()
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [groups, setGroups] = useState<{ id: number | null; name: string }[]>(
    []
  );

  const [sessions, setSessions] = useState<
    {
      id: number | null;
      type: "initial" | "followUp";
      topic: string;
      date: string;
    }[]
  >([{ id: null, type: "initial", topic: "", date: "" }]);
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

  const isReadOnly = IsShowMode(mode);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const result = CdFormSchema.safeParse(formData);

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

    if (IsCreateMode(mode)) {
      requestHandler()
        .post("/community_dialogue_db/community_dialogue", {
          programInformation: formData,
          sessions,
          groups,
          remark,
        })
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response?.data?.message, "error")
        );
    } else if (IsEditMode(mode) && dialogueId) {
      requestHandler()
        .put(`/community_dialogue_db/community_dialogue/${dialogueId}`, {
          programInformation: formData,
          sessions,
          groups,
          remark,
        })
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response?.data?.message, "error")
        );
    }
  };

  const addGroup = () => setGroups([...groups, { id: null, name: "" }]);

  const addSession = () =>
    setSessions([
      ...sessions,
      { id: null, type: "followUp", topic: "", date: "" },
    ]);

  useEffect(() => {
    requestHandler()
      .get("/projects/p/cd_database")
      .then((res: any) => setProjects(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error")
      );
  }, []);

  const [registrationDateValidRange, setRegistrationDateValidRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (IsEditOrShowMode(mode) && dialogueId) {
      requestHandler()
        .get(`/community_dialogue_db/community_dialogue_for_edit/${dialogueId}`)
        .then((res: any) => {
          const data = res.data.data;
          setFormData(data.programInformation);
          setGroups(data.groups?.map((g: any) => ({ ...g })) ?? []);
          setSessions(
            data.sessions ?? [
              { id: null, type: "initial", topic: "", date: "" },
            ]
          );
          setRemark(data.remark ?? "");
        })
        .catch((err: any) =>
          reqForToastAndSetMessage(
            err.response?.data?.message || "Failed to load data",
            "error"
          )
        );
    }
  }, [mode, dialogueId]);

  useEffect(() => {
    if (!formData.project_id) return;
    const projectId = formData.project_id;

    requestHandler()
      .get(`projects/indicators/cd_database/${projectId}`)
      .then((res: any) => setIndicators(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error")
      );

    requestHandler()
      .get(`projects/provinces/${projectId}`)
      .then((res: any) => setProvinces(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error")
      );

    requestHandler()
      .get("/global/districts")
      .then((res: any) => setDistricts(Object.values(res.data.data)))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error")
      );

    requestHandler()
      .get(`/date/project_date_range/${formData.project_id}`)
      .then((response: AxiosResponse<any, any>) => {
        setRegistrationDateValidRange({
          start: toDateOnly(response.data.data.start),
          end: toDateOnly(response.data.data.end),
        });
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message, "error")
      );
  }, [formData.project_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{ maxHeight: "85vh", padding: 16 }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">
            {IsCreateMode(mode)
              ? "Create Community Dialogue"
              : IsEditMode(mode)
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
                value: p.id,
                label: p.projectCode.toUpperCase(),
              }))}
              value={formData.project_id}
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "project_id",
                    value: value,
                  },
                })
              }
              disabled={isReadOnly}
              error={formErrors.project_id}
            />
          </div>

          {/* Program Name */}
          <div>
            <Label className={labelClass}>Program Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name"
              disabled={isReadOnly}
              className={`border p-2 rounded ${
                formErrors.name ? "!border-red-500" : ""
              }`}
              title={formErrors.name}
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
              // className={inputClass}
              disabled={isReadOnly}
              className={`border p-2 rounded ${
                formErrors.focalPoint ? "!border-red-500" : ""
              }`}
              title={formErrors.focalPoint}
            />
          </div>

          {/* Province */}
          <div>
            <Label className={labelClass}>Province</Label>
            <SingleSelect
              options={provinces.map((p) => ({
                value: p.id,
                label: p.name.toUpperCase(),
              }))}
              value={formData.province_id}
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "province_id",
                    value: value,
                  },
                })
              }
              disabled={isReadOnly}
              error={formErrors.province_id}
            />
          </div>

          {/* District */}
          <div>
            <Label className={labelClass}>District</Label>
            <SingleSelect
              options={districts.map((d) => ({
                value: d.id,
                label: d.name.toUpperCase(),
              }))}
              value={formData.district_id}
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "district_id",
                    value: value,
                  },
                })
              }
              disabled={isReadOnly}
              error={formErrors.district_id}
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
              // className={inputClass}
              disabled={isReadOnly}
              className={`border p-2 rounded ${
                formErrors.village ? "!border-red-500" : ""
              }`}
              title={formErrors.village}
            />
          </div>

          {/* Indicator */}
          <div>
            <Label className={labelClass}>Select Indicator</Label>
            <SingleSelect
              options={indicators.map((i) => ({
                value: i.id,
                label: i.indicatorRef.toUpperCase(),
              }))}
              value={formData.indicator_id}
              onValueChange={(value) =>
                handleFormChange({
                  target: {
                    name: "indicator_id",
                    value: value,
                  },
                })
              }
              disabled={isReadOnly}
              error={formErrors.indicator_id}
            />
          </div>

          {/* Cd Name */}
          <div>
            <Label className={labelClass}>Community Dialogue Name</Label>
            <Input
              name="cdName"
              value={formData.cdName}
              onChange={handleFormChange}
              placeholder="Community Dialogue Name"
              disabled={isReadOnly}
              className={`border p-2 rounded ${
                formErrors.cdName ? "!border-red-500" : ""
              }`}
              title={formErrors.cdName}
            />
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

          {/* Add Group Button */}
          {IsNotShowMode(mode) && (
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
                disabled={isReadOnly || !formData.project_id}
                min={registrationDateValidRange.start}
                max={registrationDateValidRange.end}
              />
            </div>
          </div>
        ))}

        {/* Add Session Button */}
        {IsNotShowMode(mode) && (
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
          {IsNotShowMode(mode) && (
            <Button
              className="w-full"
              onClick={() =>
                reqForConfirmationModelFunc(
                  IsCreateMode(mode)
                    ? CommunityDialogueCreationMessage
                    : CommunityDialogueEditionMessage,
                  () => handleSubmit()
                )
              }
            >
              {IsCreateMode(mode) ? "Submit" : "Update"}
            </Button>
          )}
          {IsShowMode(mode) && (
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
