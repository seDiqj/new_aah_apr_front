"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "next/navigation";
import { useParentContext } from "@/contexts/ParentContext";
import { MealToolDefault } from "@/constants/FormsDefaultValues";
import { MealToolFormType } from "@/types/Types";
import {
  MealToolCreationMessage,
  MealToolEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import {
  baselineOptions,
  endlineOptions,
} from "@/constants/SingleAndMultiSelectOptionsList";
import { MealToolInterface } from "@/interfaces/Interfaces";
import { IsCreateMode, IsEditMode, IsShowMode } from "@/constants/Constants";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";
import { AxiosError, AxiosResponse } from "axios";
import StringHelper from "@/helpers/StringHelpers/StringHelper";
import { MealToolFormSchema } from "@/schemas/FormsSchema";

const MealToolForm: React.FC<MealToolInterface> = ({
  open,
  onOpenChange,
  mealToolsStateSetter,
  mode,
  mealtoolId,
}) => {
  const {
    requestHandler,
    reqForConfirmationModelFunc,
    reqForToastAndSetMessage,
  } = useParentContext();

  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [baselineSelection, setBaselineSelection] = useState<string>("");
  const [endlineSelection, setEndlineSelection] = useState<string>("");

  const [mealTool, setMealTool] = useState<MealToolFormType>(
    MealToolDefault(id as unknown as string)
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (e: any) => {
    setMealTool({ ...mealTool, [e.target.name]: e.target.value });
  };

  const handleSubmitMealtoolForm = (mealTool: any) => {
    const result = MealToolFormSchema.safeParse(mealTool);

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errors[field as string] = issue.message;
      });

      setFormErrors(errors);
      reqForToastAndSetMessage(
        "Please fix validation errors before submitting."
      );
      return;
    }

    setFormErrors({});

    if (IsCreateMode(mode)) {
      setLoading(true);
      requestHandler()
        .post(`/main_db/beneficiary/mealtools/${id}`, { mealtool: mealTool })
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          mealToolsStateSetter((prev: any) => [ 
            ...prev,
            { id: response.data.data.id, ...mealTool },
          ]);
          setMealTool(MealToolDefault(id as unknown as string));
          onOpenChange(false);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setLoading(false));

      return;
    } else if (IsEditMode(mode)) {
      setLoading(true);
      requestHandler()
        .put(`/main_db/beneficiary/mealtool/${mealTool.id}`, mealTool)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          mealToolsStateSetter((prev: any) =>
            prev.map((mt: any) =>
              mt.id == mealtoolId
                ? {
                    ...mealTool,
                    baseline: baselineSelection,
                    endline: endlineSelection,
                  }
                : mt
            )
          );
          onOpenChange(false);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (IsShowMode(mode) || (IsEditMode(mode) && mealtoolId)) {
      setLoading(true);
      requestHandler()
        .get(`main_db/beneficiary/mealtool/${mealtoolId}`)
        .then((response: AxiosResponse<any, any>) => {
          setMealTool(response.data.data);
          setBaselineSelection(response.data.data.baseline);
          setEndlineSelection(response.data.data.endline);
        })
        .catch((error: AxiosError<any, any>) =>
          reqForToastAndSetMessage(error.response?.data.message)
        )
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{ maxHeight: "85vh", padding: "10px 16px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{"Add Meal TOOL"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24 rounded-md" />{" "}
              {/* Label Skeleton */}
              {renderSkeletonInput()}
            </div>
          ))
        ) : (
          <>
            <h2 className="text-black-800 font-bold text-lg text-center px-6 py-2 rounded-xl shadow-sm max-w-fit mx-auto">
              Add Meal Tool
            </h2>

            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={mealTool.type}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.type ? "!border-red-500" : ""
                  }`}
                  title={formErrors.type}
                />
              </div>

              {/* Date Of Baseline */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="baselineDate">Date Of Baseline</Label>
                <Input
                  id="baselineDate"
                  name="baselineDate"
                  type="date"
                  value={mealTool.baselineDate}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.baselineDate ? "!border-red-500" : ""
                  }`}
                  title={formErrors.baselineDate}
                />
              </div>

              {/* Date Of Endline */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="endlineDate">Date Of Endline</Label>
                <Input
                  id="endlineDate"
                  name="endlineDate"
                  type="date"
                  value={mealTool.endlineDate}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.endlineDate ? "!border-red-500" : ""
                  }`}
                  title={formErrors.endlineDate}
                />
              </div>

              {/* Activate baseline/endline */}
              <div className="flex flex-col gap-2 pt-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="baseline"
                    checked={mealTool.isBaselineActive}
                    onCheckedChange={(e: boolean) => {
                      setMealTool((prev) => ({
                        ...prev,
                        isBaselineActive: e,
                      }));
                    }}
                  />
                  <Label htmlFor="baseline">Activate Baseline</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="endline"
                    checked={mealTool.isEndlineActive}
                    onCheckedChange={(e: boolean) => {
                      setMealTool((prev) => ({
                        ...prev,
                        isEndlineActive: e,
                      }));
                    }}
                    className={`border p-2 rounded ${
                      formErrors.endline ? "!border-red-500" : ""
                    }`}
                    title={formErrors.endline}
                  />
                  <Label htmlFor="endline">Activate Endline</Label>
                </div>
              </div>
            </div>

            {/* Section 2: Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Baseline Total Score */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="baselineTotalScore">Baseline Total Score</Label>
                <Input
                  id="baselineTotalScore"
                  name="baselineTotalScore"
                  type="number"
                  value={mealTool.baselineTotalScore}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.baselineTotalScore ? "!border-red-500" : ""
                  }`}
                  title={formErrors.baselineTotalScore}
                />
              </div>

              {/* Endline Total Score */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="endlineTotalScore">Endline Total Score</Label>
                <Input
                  id="endlineTotalScore"
                  name="endlineTotalScore"
                  type="number"
                  value={mealTool.endlineTotalScore}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.endlineTotalScore ? "!border-red-500" : ""
                  }`}
                  title={formErrors.endlineTotalScore}
                />
              </div>

              {/* Improvement Percentage */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="improvementPercentage">
                  Percentage Of Improvement
                </Label>
                <Input
                  id="improvementPercentage"
                  name="improvementPercentage"
                  type="number"
                  value={mealTool.improvementPercentage}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.improvementPercentage ? "!border-red-500" : ""
                  }`}
                  title={formErrors.improvementPercentage}
                />
              </div>
            </div>

            {/* Evaluation */}
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">
                Evaluation Based On General Judgment
              </Label>
              <Input
                name="evaluation"
                value={mealTool.evaluation}
                onChange={handleFormChange}
                className={`border p-2 rounded ${
                  formErrors.evaluation ? "!border-red-500" : ""
                }`}
                title={formErrors.evaluation}
              />
            </div>

            {/* Section 4: Baseline & Endline Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Baseline */}
              <div className="border rounded-xl p-4">
                <Label className="font-semibold">Baseline</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {baselineOptions.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          baselineSelection.toLowerCase() ===
                          option.toLowerCase()
                        }
                        onCheckedChange={() => setBaselineSelection(option)}
                      />
                      <Label>{StringHelper.normalize(option)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endline */}
              <div className="border rounded-xl p-4">
                <Label className="font-semibold">Endline</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {endlineOptions.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          endlineSelection.toLowerCase() ===
                          option.toLowerCase()
                        }
                        onCheckedChange={() => setEndlineSelection(option)}
                      />
                      <Label>{StringHelper.normalize(option)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button
            id={SUBMIT_BUTTON_PROVIDER_ID}
            disabled={loading}
            className="w-full mt-6"
            onClick={(e) => {
              reqForConfirmationModelFunc(
                IsCreateMode(mode)
                  ? MealToolCreationMessage
                  : MealToolEditionMessage,
                () => {
                  if (IsCreateMode(mode)) {
                    handleSubmitMealtoolForm({
                      ...mealTool,
                      baseline: baselineSelection,
                      endline: endlineSelection,
                    });
                  } else if (IsEditMode(mode)) {
                    handleSubmitMealtoolForm({
                      ...mealTool,
                      baseline: baselineSelection,
                      endline: endlineSelection,
                    });
                  }
                }
              );
            }}
          >
            {loading ? "Saving ..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const renderSkeletonInput = () => (
  <Skeleton className="h-10 w-full rounded-md" />
);

export default MealToolForm;
