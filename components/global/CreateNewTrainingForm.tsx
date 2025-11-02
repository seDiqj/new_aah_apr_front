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
import { createAxiosInstance } from "@/lib/axios";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChapterForm, TrainingForm } from "@/types/Types";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  mode: "create" | "edit" | "show";
  id?: number;
}

const TrainingFormDialog: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  title,
  mode,
  id,
}) => {
  const { reqForToastAndSetMessage, axiosInstance, handleReload, reqForConfirmationModelFunc } = useParentContext();

  const isReadOnly = mode === "show";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TrainingForm>({
    projectCode: "",
    province: "",
    district: "",
    trainingLocation: "",
    name: "",
    participantCatagory: "",
    aprIncluded: true,
    trainingModality: "",
    startDate: "",
    endDate: "",
    indicator: "",
  });
  const [chapters, setChapters] = useState<ChapterForm[]>([]);
  const [chapter, setChapter] = useState<ChapterForm>({
    topic: "",
    facilitatorName: "",
    facilitatorJobTitle: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "show") && id) {
      setLoading(true);
  
      axiosInstance
        .get(`/training_db/training/${id}`)
        .then((response: any) => {
          const data = response.data.data;
          setFormData({
            projectCode: data.projectCode || "",
            province: data.province || "",
            district: data.district || "",
            trainingLocation: data.trainingLocation || "",
            name: data.name || "",
            participantCatagory: data.participantCatagory || "",
            aprIncluded: data.aprIncluded ?? true,
            trainingModality: data.trainingModality || "",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            indicator: data.indicator || "",
          });
          setChapters(data.chapters || []);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response?.data?.message || "Error loading data");
        })
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

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
    setChapter({
      topic: "",
      facilitatorName: "",
      facilitatorJobTitle: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleDeleteChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, chapters };

    try {
      let res;
      if (mode === "edit" && id) {
        res = await axiosInstance.put(`/training_db/training/${id}`, payload);
      } else if (mode === "create") {
        res = await axiosInstance.post("/training_db/training", payload);
      } else return;

      reqForToastAndSetMessage(res.data.message);
      handleReload()
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

  const [districts, setDistricts] = useState<{ name: string }[]>([]);
  const [provinces, setProvinces] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<{ projectCode: string }[]>([]);
  const [indicators, setIndicators] = useState<{ indicator: string }[]>([]);

  useEffect(() => {
    axiosInstance.get("/global/districts").then((res: any) => {
      setDistricts(Object.values(res.data.data));
    });
    axiosInstance.get("/global/provinces").then((res: any) => {
      setProvinces(Object.values(res.data.data));
    });
    axiosInstance.get("/global/projects").then((res: any) => {
      setProjects(Object.values(res.data.data));
    });
    axiosInstance
      .get("/global/indicators/training_database")
      .then((res: any) => setIndicators(Object.values(res.data.data)));
  }, []);

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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 text-center font-bold mb-4">
            Program Information
          </h2>

          {/* --- Project --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Project</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={projects.map((p) => ({
                value: p.projectCode,
                label: p.projectCode.toUpperCase(),
              }))}
              value={formData.projectCode}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "projectCode", value } })
              }
            />
          </div>

          {/* --- Indicator --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Indicator</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={indicators.map((i) => ({
                value: i.indicator,
                label: i.indicator.toUpperCase(),
              }))}
              value={formData.indicator}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "indicator", value } })
              }
            />
          </div>

          {/* --- Province --- */}
          <div className="flex flex-col gap-1">
            <Label>Select Province</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={provinces.map((p) => ({
                value: p.name,
                label: p.name.toUpperCase(),
              }))}
              value={formData.province}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "province", value } })
              }
            />
          </div>

          {/* --- District --- */}
          <div className="flex flex-col gap-1">
            <Label>Select District</Label>
            <SingleSelect
              disabled={isReadOnly}
              options={districts.map((d) => ({
                value: d.name,
                label: d.name.toUpperCase(),
              }))}
              value={formData.district}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "district", value } })
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
          <div className="flex flex-col gap-1">
            <Label>Training Name</Label>
            <Input
              name="name"
              disabled={isReadOnly}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <Label>Start Date</Label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
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
                  <Input
                    name="topic"
                    placeholder="Topic"
                    value={chapter.topic}
                    onChange={handleChapterChange}
                  />
                  <Input
                    name="facilitatorName"
                    placeholder="Facilitator"
                    value={chapter.facilitatorName}
                    onChange={handleChapterChange}
                  />
                  <Input
                    name="facilitatorJobTitle"
                    placeholder="Job Title"
                    value={chapter.facilitatorJobTitle}
                    onChange={handleChapterChange}
                  />
                  <Input
                    type="date"
                    name="startDate"
                    value={chapter.startDate}
                    onChange={handleChapterChange}
                  />
                  <Input
                    type="date"
                    name="endDate"
                    value={chapter.endDate}
                    onChange={handleChapterChange}
                  />
                </div>
                <Button onClick={handleAddChapter} className="mt-4">
                  Add Chapter
                </Button>
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
            {mode !== "show" ? (
              <Button className="w-full" onClick={(e) => reqForConfirmationModelFunc(
                "Are you compleatly sure ?",
                "",
                () => handleSubmit(e)
              )}>
                {mode === "edit" ? "Update" : "Submit All"}
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
