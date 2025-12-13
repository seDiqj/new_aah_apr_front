"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleSelect } from "../single-select";
import { Checkbox } from "../ui/checkbox";
import { useParentContext } from "@/contexts/ParentContext";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChapterForm, TrainingForm } from "@/types/Types";
import {
  ChapterDefault,
  TrainingDefault,
} from "@/constants/FormsDefaultValues";
import {
  TrainingCreationMessage,
  TrainingEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { TrainingFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsEditOrShowMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";

const TrainingFormDialog: React.FC<TrainingFormInterface> = ({
  open,
  onOpenChange,
  title,
  mode,
  id,
}) => {
  const {
    reqForToastAndSetMessage,
    axiosInstance,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const isReadOnly = IsShowMode(mode);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<TrainingForm>(TrainingDefault());

  const [chapters, setChapters] = useState<ChapterForm[]>([]);

  const [chapter, setChapter] = useState<ChapterForm>(ChapterDefault());

  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );

  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);

  const [indicators, setIndicators] = useState<
    { id: string; indicatorRef: string }[]
  >([]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChapter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChapter = () => {
    if (!chapter.topic) return;
    setChapters((prev) => [...prev, chapter]);
    setChapter(ChapterDefault());
  };

  const handleDeleteChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, chapters };

    try {
      let res;
      if (IsEditMode(mode) && id) {
        res = await axiosInstance.put(`/training_db/training/${id}`, payload);
      } else if (IsCreateMode(mode)) {
        res = await axiosInstance.post("/training_db/training", payload);
      } else return;

      reqForToastAndSetMessage(res.data.message);
      handleReload();
      onOpenChange(false);
    } catch (err: any) {
      reqForToastAndSetMessage(err.response?.data?.message || "Error");
    }
  };

  const handleCheckboxChange = <T extends keyof TrainingForm>(
    field: T,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (IsEditOrShowMode(mode) && id) {
      setLoading(true);

      axiosInstance
        .get(`/training_db/training_for_edit/${id}`)
        .then((response: any) => {
          const data = response.data.data;
          setFormData({
            project_id: data.project_id || "",
            province_id: data.province_id || "",
            district_id: data.district_id || "",
            trainingLocation: data.trainingLocation || "",
            name: data.name || "",
            participantCatagory: data.participantCatagory || "",
            aprIncluded: data.aprIncluded ?? true,
            trainingModality: data.trainingModality || "",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            indicator_id: data.indicator_id || "",
          });
          setChapters(data.chapters || []);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(
            error.response?.data?.message || "Error loading data"
          );
        })
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  useEffect(() => {
    axiosInstance
      .get("/projects/p/training_database")
      .then((res: any) => {
        setProjects(Object.values(res.data.data));
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    axiosInstance.get("/global/districts").then((res: any) => {
      setDistricts(Object.values(res.data.data));
    });
    axiosInstance
      .get("/global/indicators/training_database")
      .then((res: any) => setIndicators(Object.values(res.data.data)));
  }, []);

  useEffect(() => {
    if (!formData.project_id) return;
    axiosInstance
      .get(`/global/project/provinces/${formData.project_id}`)
      .then((res: any) => {
        setProvinces(Object.values(res.data.data));
      });
  }, [formData.project_id]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <p className="text-center py-8">Loading data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{ maxHeight: "85vh", padding: "16px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-2 text-center font-bold mb-4">
            Program Information
          </h2>

          {/* --- Project --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Project</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={projects.map((p) => ({
                value: p.id,
                label: p.projectCode.toUpperCase(),
              }))}
              value={formData.project_id ?? "Unknown value"}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "project_id", value } })
              }
            />
          </div>

          {/* --- Indicator --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Indicator</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={indicators.map((i) => ({
                value: i.id,
                label: i.indicatorRef.toUpperCase(),
              }))}
              value={formData.indicator_id}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "indicator_id", value } })
              }
            />
          </div>

          {/* --- Province --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Province</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={provinces.map((p) => ({
                value: p.id,
                label: p.name.toUpperCase(),
              }))}
              value={formData.province_id}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "province_id", value } })
              }
            />
          </div>

          {/* --- District --- */}
          <div className="flex flex-col gap-1">
            <Label>Select District</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={districts.map((d) => ({
                value: d.id,
                label: d.name.toUpperCase(),
              }))}
              value={formData.district_id}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "district_id", value } })
              }
            />
          </div>

          {/* --- Text Inputs --- */}
          <div className="flex flex-col gap-1">
            <Label>Training Location</Label>
            <Input
              name="trainingLocation"
              disabled={isReadOnly}
              value={formData.trainingLocation}
              onChange={handleChange}
            />
          </div>

          {/* Training Name */}
          <div className="flex flex-col gap-1">
            <Label>Training Name</Label>
            <Input
              name="name"
              disabled={isReadOnly}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Participant Category */}
          <div className="flex flex-col gap-1">
            <Label>Participant Category</Label>
            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.participantCatagory === "acf-staff"}
                  onCheckedChange={(val) =>
                    handleCheckboxChange(
                      "participantCatagory",
                      val ? "acf-staff" : ""
                    )
                  }
                />
                <Label>ACF Staff</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.participantCatagory === "stakeholder"}
                  onCheckedChange={(val) =>
                    handleCheckboxChange(
                      "participantCatagory",
                      val ? "stakeholder" : ""
                    )
                  }
                />
                <Label>Stakeholder</Label>
              </div>
            </div>
          </div>

          {/* Apr Included */}
          <div className="flex flex-col gap-1">
            <Label>APR Included</Label>
            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.aprIncluded === true}
                  onCheckedChange={(val) =>
                    val && handleCheckboxChange("aprIncluded", true)
                  }
                />
                <Label>Yes</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.aprIncluded === false}
                  onCheckedChange={(val) =>
                    val && handleCheckboxChange("aprIncluded", false)
                  }
                />
                <Label>No</Label>
              </div>
            </div>
          </div>

          {/* Training Modality */}
          <div className="flex flex-col gap-1">
            <Label>Training Modality</Label>
            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.trainingModality === "face-to-face"}
                  onCheckedChange={(val) =>
                    handleCheckboxChange(
                      "trainingModality",
                      val ? "face-to-face" : ""
                    )
                  }
                />
                <Label>Face-to-Face</Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={formData.trainingModality === "online"}
                  onCheckedChange={(val) =>
                    handleCheckboxChange(
                      "trainingModality",
                      val ? "online" : ""
                    )
                  }
                />
                <Label>Online</Label>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <Label>Start Date</Label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <Label>End Date</Label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          {/* --- Chapter Section --- */}
          <div className="col-span-2 mt-6">
            <h2 className="text-center font-bold mb-4">Chapter Information</h2>

            {!isReadOnly && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Topic */}
                  <div className="flex flex-col gap-2">
                    <Label>Topic</Label>
                    <Input
                      name="topic"
                      placeholder="Topic"
                      value={chapter.topic}
                      onChange={handleChapterChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Facilitator Name</Label>
                    <Input
                      name="facilitatorName"
                      placeholder="Facilitator"
                      value={chapter.facilitatorName}
                      onChange={handleChapterChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Facilitator Job Title</Label>
                    <Input
                      name="facilitatorJobTitle"
                      placeholder="Job Title"
                      value={chapter.facilitatorJobTitle}
                      onChange={handleChapterChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={chapter.startDate}
                      onChange={handleChapterChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={chapter.endDate}
                      onChange={handleChapterChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end w-full">
                  <Button
                  type="button"
                  onClick={handleAddChapter}
                  className="mt-4"
                >
                  Add Chapter
                </Button>
                </div>
              </>
            )}

            {chapters.length > 0 && (
              <Accordion type="multiple" className="mt-4">
                {chapters.map((ch, index) => (
                  <AccordionItem value={`ch-${index}`} key={index}>
                    <AccordionTrigger>{ch.topic}</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 text-sm">
                        <p>
                          <strong>Facilitator:</strong> {ch.facilitatorName}
                        </p>
                        <p>
                          <strong>Job Title:</strong> {ch.facilitatorJobTitle}
                        </p>
                        <p>
                          <strong>Start:</strong> {ch.startDate}
                        </p>
                        <p>
                          <strong>End:</strong> {ch.endDate}
                        </p>
                      </div>
                      {!isReadOnly && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleDeleteChapter(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* --- Buttons --- */}
          <div className="col-span-2 mt-6">
            {IsNotShowMode(mode) ? (
              <Button
                type="button"
                className="w-full"
                onClick={(e) =>
                  reqForConfirmationModelFunc(
                    IsCreateMode(mode)
                      ? TrainingCreationMessage
                      : TrainingEditionMessage,
                    () => handleSubmit(e)
                  )
                }
              >
                {IsEditMode(mode) ? "Update" : "Submit"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingFormDialog;
