"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { AssessmentFormType } from "@/types/Types";
import { createAxiosInstance } from "@/lib/axios";
import { useParams } from "next/navigation";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  projectId?: number;
}

const AssessmentForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  projectId,
}) => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage } = useParentContext();
  const axiosInstance = createAxiosInstance();

  const [formData, setFormData] = useState<Record<string, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
  });

  const [assessmentsList, setAssessmentsList] = useState<
    Record<string, { id: string; group: string; description: string }[]>
  >({});

  useEffect(() => {
    axiosInstance
      .get("/enact_database/assessments_list")
      .then((response: any) => setAssessmentsList(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: number = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const request =
      mode === "create"
        ? axiosInstance.post("/enact_database/assess_assessment", {
            enactId: id,
            scores: formData,
          })
        : axiosInstance.put(`/enact_database/${projectId}`, formData);

    request
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        console.log(response.data.data);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
        console.log(error.response.data.data);
      });
  };

  useEffect(() => console.log(formData), [formData]);

  const readOnly = mode === "show";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[85vh] w-[70vw] max-w-[900px] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-2">
          {mode === "create" && "Create New Assessment"}
          {mode === "edit" && "Edit Assessment"}
          {mode === "show" && "Assessment Details"}
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {Object.entries(assessmentsList).map(
            ([groupName, assessments], i) => (
              <div key={groupName} className="flex flex-col gap-3">
                <Label
                  className={`font-semibold border-b pb-1 ${
                    i == 0
                      ? "text-blue-600"
                      : i == 1
                      ? "text-green-500"
                      : i == 2
                      ? "text-purple-700"
                      : "text-orange-400"
                  }`}
                >
                  {groupName.toUpperCase()}
                </Label>

                <div className="flex flex-col gap-2">
                  {assessments.map((assessment, i) => (
                    <div
                      key={assessment.id}
                      className={`flex items-center justify-between border-b pb-2`}
                    >
                      <span className="text-sm">{assessment.description}</span>
                      <Input
                        type="number"
                        name={assessment.id}
                        value={formData[assessment.id]}
                        className="w-[80px] text-center"
                        readOnly={readOnly}
                        onChange={handleFormChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {!readOnly && (
            <div className="flex justify-end mt-4">
              <Button type="submit" className="px-6">
                {mode === "create" ? "Save" : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentForm;
