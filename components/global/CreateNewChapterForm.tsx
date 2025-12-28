"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParentContext } from "@/contexts/ParentContext";
import { ChapterForm } from "@/types/Types";
import { useParams } from "next/navigation";
import { ChapterDefault } from "@/constants/FormsDefaultValues";
import { ChapterCreationMessage } from "@/constants/ConfirmationModelsTexts";
import { ChapterFormInterface } from "@/interfaces/Interfaces";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";

const CreateNewChapterForm: React.FC<ChapterFormInterface> = ({
  open,
  onOpenChange,
  title,
}) => {
  const { id } = useParams<{ id: string }>();

  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<ChapterForm>(ChapterDefault());

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axiosInstance
      .post(`/training_db/training/chapter/${id}`, formData)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || "Error")
      )
      .finally(() => setIsLoading(false));
  };

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
          {/* Chapter Info */}
          <div className="col-span-2 mt-6">
            <h2 className="text-center font-bold mb-4">Chapter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Chapter Topic</Label>
                <Input
                  name="topic"
                  value={formData.topic}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Facilitator Name</Label>
                <Input
                  name="facilitatorName"
                  value={formData.facilitatorName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Facilitator Job Title</Label>
                <Input
                  name="facilitatorJobTitle"
                  value={formData.facilitatorJobTitle}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <Button
              id={SUBMIT_BUTTON_PROVIDER_ID}
              disabled={isLoading}
              onClick={(e) =>
                reqForConfirmationModelFunc(ChapterCreationMessage, () =>
                  handleSubmit(e)
                )
              }
              className="w-full mt-6"
            >
              {isLoading ? "Saving ..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewChapterForm;
