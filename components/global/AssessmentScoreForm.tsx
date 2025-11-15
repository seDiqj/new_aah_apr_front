"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { EnactResetButtonMessage, EnactSubmitButtonMessage } from "@/lib/ConfirmationModelsTexts";
import { AssessmentScoreFormInterface } from "@/interfaces/Interfaces";
import { Assessments } from "@/types/Types";
import { IsCreateMode, IsEditMode, IsShowMode } from "@/lib/Constants";

const AssessmentForm: React.FC<AssessmentScoreFormInterface> = ({
  open,
  onOpenChange,
  mode,
  projectId,
}) => {
  const { id } = useParams<{ id: string }>();
  const { reqForToastAndSetMessage, axiosInstance, reqForConfirmationModelFunc, handleReload } = useParentContext();

  const [formData, setFormData] = useState<Record<string, number>>(
    Array.from({ length: 15 }, (_, i) => i + 1).reduce(
      (acc, cur) => ({ ...acc, [cur]: 0 }),
      {}
    )
  );

  const [assessmentDate, setAssessmentData] = useState<string>("");
  const [assessmentsList, setAssessmentsList] = useState<Assessments>({});

  useEffect(() => {
    axiosInstance
      .get("/enact_database/assessments_list")
      .then((res: any) => setAssessmentsList(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message || "Error")
      );
  }, []);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleReset = () => {
    const resetData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);
    setFormData(resetData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const request =
      IsCreateMode(mode)
        ? axiosInstance.post("/enact_database/assess_assessment", {
            enactId: id,
            scores: formData,
            date: assessmentDate,
          })
        : axiosInstance.put(`/enact_database/${projectId}`, formData);

    request
      .then((res: any) => {
        reqForToastAndSetMessage(res.data.message);
        handleReload();
      })
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message || "Error")
      );
  };

  const readOnly = IsShowMode(mode);

  const totalScore = useMemo(
    () => Object.values(formData).reduce((acc, val) => acc + val, 0),
    [formData]
  );

  const titleColors = ["#1E3A8A", "#059669", "#7C3AED", "#F97316"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <DialogTitle className="text-3xl font-extrabold mb-6">
          {IsCreateMode(mode)
            ? "Create New Assessment"
            : IsEditMode(mode)
            ? "Edit Assessment"
            : "Assessment Details"}
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 w-full">
            <Label className="font-semibold">Assessment Date</Label>
            <Input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentData(e.target.value)}
              className="border-gray-300 rounded-lg shadow-sm px-4 py-2 w-full md:w-64 min-w-full"
            />
          </div>

          {Object.entries(assessmentsList).map(([groupName, assessments], i) => (
            <div
              key={groupName}
              className="flex flex-col gap-6 p-6 rounded-xl shadow-inner w-full"
            >
              <Label
                className="font-bold text-xl mb-4"
                style={{ color: titleColors[i % titleColors.length] }}
              >
                {groupName.toUpperCase()}
              </Label>

              <div className="flex flex-col gap-4 w-full">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 pt-4 px-4 rounded-lg shadow-sm min-h-[70px]"
                  >
                    <span className="text-base md:text-lg mb-2 md:mb-0">
                      {assessment.description}
                    </span>
                    <Input
                      type="number"
                      name={assessment.id}
                      value={formData[assessment.id]}
                      className="w-full md:w-40 lg:w-48 text-center border-gray-300 rounded-lg px-3 py-2 text-lg"
                      readOnly={readOnly}
                      onChange={handleFormChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}


          <div className="flex justify-between items-center p-4 rounded-xl shadow-inner">
            <span className="font-semibold text-lg">Total Score:</span>
            <span className="font-bold text-xl text-blue-600">{totalScore}</span>
          </div>

          {!readOnly && (
            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 rounded-xl shadow-md"
                onClick={() => reqForConfirmationModelFunc(
                  EnactResetButtonMessage,
                  handleReset
                )}
              >
                Reset
              </Button>
              <Button
                type="button"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
                onClick={(e) => reqForConfirmationModelFunc(
                  EnactSubmitButtonMessage,
                  () => handleSubmit(e)
                )}
              >
                {IsCreateMode(mode) ? "Save" : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentForm;
