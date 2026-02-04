"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  EnactResetButtonMessage,
  EnactSubmitButtonMessage,
} from "@/constants/ConfirmationModelsTexts";
import { AssessmentScoreFormInterface } from "@/interfaces/Interfaces";
import { Assessments } from "@/types/Types";
import { IsCreateMode, IsEditMode, IsShowMode } from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import DatePicker from "react-datepicker";

const AssessmentForm: React.FC<AssessmentScoreFormInterface> = ({
  open,
  onOpenChange,
  mode,
  dateRange,
  exceptMonth,
  assessmentId,
}) => {
  const { id } = useParams<{ id: string }>();
  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
    handleReload,
  } = useParentContext();

  const [formData, setFormData] = useState<Record<string, number>>(
    Array.from({ length: 15 }, (_, i) => i + 1).reduce(
      (acc, cur) => ({ ...acc, [cur]: 0 }),
      {},
    ),
  );

  const [assessmentDate, setAssessmentData] = useState<string>("");
  const [assessmentsList, setAssessmentsList] = useState<Assessments>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    if (value < 0 || value > 4) return;

    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleReset = () => {
    const resetData = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );
    setFormData(resetData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const request = IsCreateMode(mode)
      ? requestHandler().post("/enact_database/assess_assessment", {
          enactId: id,
          scores: formData,
          date: assessmentDate,
        })
      : requestHandler().put(`/enact_database/assessment/${assessmentId}`, {
          scores: formData,
          date: assessmentDate,
        });

    request
      .then((res: any) => {
        reqForToastAndSetMessage(res.data.message, "success");
        onOpenChange(false);
        handleReload();
      })
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error"),
      )
      .finally(() => setIsLoading(false));
  };

  const readOnly = IsShowMode(mode);

  const totalScore = useMemo(
    () => Object.values(formData).reduce((acc, val) => acc + val, 0),
    [formData],
  );

  const titleColors = ["#1E3A8A", "#059669", "#7C3AED", "#F97316"];

  useEffect(() => {
    requestHandler()
      .get("/enact_database/assessments_list")
      .then((res: any) => setAssessmentsList(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message || "Error", "error"),
      );
  }, []);

  useEffect(() => {
    if (!assessmentId) return;

    if (IsShowMode(mode) || IsEditMode(mode)) {
      requestHandler()
        .get(`/enact_database/assessment/${assessmentId}`)
        .then((response: AxiosResponse<any>) => {
          setFormData(
            Array.from({ length: 15 }, (_, i) => i).reduce((acc, cur) => {
              return {
                ...acc,
                [cur]: Number(response.data.data.questions?.[cur]?.score ?? 0),
              };
            }, {}),
          );
          setAssessmentData(response.data.data.date);
        })
        .catch((error: AxiosError<any>) => {
          reqForToastAndSetMessage(error.response?.data?.message, "error");
        });
    }
  }, [mode, assessmentId]);

  let counter = 0;

  const filterMonths = (date: Date) => {
    const month = date.getMonth() + 1;
    return month !== 2 && month !== 4;
  };

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

            <DatePicker
              selected={assessmentDate ? new Date(assessmentDate) : null}
              onChange={(date: Date | null) =>
                date && setAssessmentData(date.toISOString().split("T")[0])
              }
              filterDate={filterMonths}
              minDate={new Date(dateRange.startDate)}
              maxDate={new Date(dateRange.endDate)}
              disabled={readOnly}
              readOnly={readOnly}
              placeholderText="Select date"
              className="border border-gray-300 rounded-lg shadow-sm px-4 py-2 w-full md:w-64 min-w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {Object.entries(assessmentsList).map(
            ([groupName, assessments], i) => (
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
                  {assessments.map((assessment, i) => (
                    <div
                      key={assessment.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 pt-4 px-4 rounded-lg shadow-sm min-h-[70px]"
                    >
                      <span className="text-base md:text-lg mb-2 md:mb-0 max-w-[400px] text-wrap">
                        {assessment.description}
                      </span>
                      <Input
                        type="number"
                        name={`${counter}`}
                        value={formData[counter++]}
                        className="w-full md:w-40 lg:w-48 text-center border-gray-300 rounded-lg px-3 py-2 text-lg"
                        readOnly={readOnly}
                        disabled={readOnly}
                        onChange={handleFormChange}
                        min={0}
                        max={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}

          <div className="flex justify-between items-center p-4 rounded-xl shadow-inner">
            <span className="font-semibold text-lg">Total Score:</span>
            <span className="font-bold text-xl text-blue-600">
              {totalScore}
            </span>
          </div>

          {!readOnly && (
            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 rounded-xl shadow-md"
                onClick={() =>
                  reqForConfirmationModelFunc(
                    EnactResetButtonMessage,
                    handleReset,
                  )
                }
              >
                Reset
              </Button>
              <Button
                id={SUBMIT_BUTTON_PROVIDER_ID}
                disabled={IsShowMode(mode) || isLoading}
                type="button"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
                onClick={(e) =>
                  reqForConfirmationModelFunc(EnactSubmitButtonMessage, () =>
                    handleSubmit(e),
                  )
                }
              >
                {isLoading
                  ? IsCreateMode(mode)
                    ? "Saveing ..."
                    : "Updating ..."
                  : IsCreateMode(mode)
                    ? "Save"
                    : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentForm;
