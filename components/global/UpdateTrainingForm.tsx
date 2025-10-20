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
import { Chapter, TrainingForm } from "@/types/Types";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  trainingId: number;
}

const UpdateTrainingForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  title,
  trainingId,
}) => {
  const { reqForToastAndSetMessage } = useParentContext();
  const axiosInstance = createAxiosInstance();

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

  const [chapter, setChapter] = useState<Chapter>({
    topic: "",
    facilitatorName: "",
    facilitatorJobTitle: "",
    startDate: "",
    endDate: "",
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = <T extends keyof TrainingForm>(field: T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axiosInstance
      .put(`/training_db/training/${trainingId}`, { ...formData, chapters })
      .then((res) => reqForToastAndSetMessage(res.data.message))
      .catch((err) =>
        reqForToastAndSetMessage(err.response?.data?.message || "Error")
      );
  };

  const [districts, setDistricts] = useState<{ name: string }[]>([]);
  const [provinces, setProvinces] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<{ projectCode: string }[]>([]);
  const [indicators, setIndicators] = useState<{ indicator: string }[]>([]);

  // گرفتن دیتاهای عمومی
  useEffect(() => {
    axiosInstance.get("/global/districts").then((res: any) => setDistricts(Object.values(res.data.data)));
    axiosInstance.get("/global/provinces").then((res: any) => setProvinces(Object.values(res.data.data)));
    axiosInstance.get("/global/projects").then((res: any) => setProjects(Object.values(res.data.data)));
    axiosInstance.get("/global/indicators/training_database").then((res: any) => setIndicators(Object.values(res.data.data)));
  }, []);

  // گرفتن داده فرم برای Update
  useEffect(() => {
    if (!trainingId || !open) return;

    axiosInstance
      .get(`/training_db/training/${trainingId}`)
      .then((res: any) => {
        const data = res.data.data;
        setFormData({
          projectCode: data.projectCode,
          province: data.province,
          district: data.district,
          trainingLocation: data.trainingLocation,
          name: data.name,
          participantCatagory: data.participantCatagory,
          aprIncluded: data.aprIncluded,
          trainingModality: data.trainingModality,
          startDate: data.startDate,
          endDate: data.endDate,
          indicator: data.indicator,
        });
        setChapters(data.chapters || []);
      })
      .catch((err) => reqForToastAndSetMessage(err.response?.data?.message || "Error"));
  }, [trainingId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto" style={{ maxHeight: "85vh", padding: "16px" }}>
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-2 text-center font-bold mb-4">Program Information</h2>

          {/* مشابه Create: project, indicator, province, district, ... */}
          {/* بقیه فیلدها و chapter info و دکمه submit مثل Create است */}
          {/* می‌توانیم همان کد Create را اینجا با فرمData پر کنیم */}

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTrainingForm;
