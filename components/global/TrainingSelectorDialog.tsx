"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleSelect } from "@/components/single-select";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  ids: {};
}

const TrainingSelectorDialog: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  ids,
}) => {
  const { reqForToastAndSetMessage, axiosInstance, reqForConfirmationModelFunc } = useParentContext();

  const [trainings, setTrainings] = useState<
    {
      name: string;
    }[]
  >([]);

  const [selectedTraining, setSelectedTraining] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedTraining) return;

    axiosInstance
      .post("/training_db/beneficiaries/add_training", {
        training: selectedTraining,
        ids: ids,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  useEffect(() => {
    axiosInstance
      .get("/training_db/trainings/for_selection")
      .then((response: any) => {
        setTrainings(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, [open]);

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
          <DialogTitle className="text-lg">Select Training</DialogTitle>
        </DialogHeader>

        <SingleSelect
          options={trainings.map((training) => ({
            value: training.name,
            label: training.name.toUpperCase(),
          }))}
          value={selectedTraining}
          onValueChange={(value: string) => setSelectedTraining(value)}
        />

        {/* Submit Button */}
        <Button onClick={() => reqForConfirmationModelFunc(
          "Are you compleatly sure ?",
          "",
          () => handleSubmit()
        )} className="w-full mt-6">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSelectorDialog;
