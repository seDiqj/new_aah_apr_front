"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye, Trash } from "lucide-react";
import { Indicator, Output, Project } from "../types/Types";
import React, { useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { handleDelete } from "../utils/CommonFunctions";
import IndicatorModel from "@/components/global/IndicatorEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { useProjectContext } from "../create_new_project/page";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { IndicatorFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsIndicatorRelatedToThisOutput,
  IsOutputSaved,
  IsShowMode,
} from "@/lib/Constants";

const IndicatorForm: React.FC<IndicatorFormInterface> = ({ mode }) => {
  const { axiosInstance, reqForToastAndSetMessage } = useParentContext();

  const {
    outputs,
    indicators,
    setIndicators,
    setCurrentTab,
  }: {
    outputs: Output[];
    indicators: Indicator[];
    setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;
    formData: Project;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const [indicatorIdForEditOrShow, setIndicatorIdForEditOrShow] = useState<
    number | null
  >(null);
  const [reqForIndicatorEditModel, setReqForIndicatorEditModel] =
    useState<boolean>(false);
  const [reqForIndicatorShowModel, setReqForIndicatorShowModel] =
    useState<boolean>(false);

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="relative h-full flex flex-col">
        <CardHeader>
          <CardTitle>Add Indicator</CardTitle>
          <CardDescription>
            Define each Indicator with its properties.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 overflow-auto">
          <Accordion type="single" collapsible className="w-full">
            {outputs
              .filter((o) => IsOutputSaved(o))
              .map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.output}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-6 max-h-[600px] overflow-auto">
                    {/* indicators list */}
                    <div className="mt-4 min-h-[240px] overflow-auto border rounded-xl">
                      {indicators
                        .filter((ind) =>
                          IsIndicatorRelatedToThisOutput(
                            Number(item.id),
                            Number(ind.outputId)
                          )
                        )
                        .map((indItem, indIndex) => (
                          <div
                            key={indIndex}
                            className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {indItem.indicator}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {indItem.indicatorRef}
                              </span>
                            </div>

                            <div className="flex flex-row items-center justify-end gap-2">
                              {!readOnly && (
                                <Trash
                                  onClick={() => {
                                    setIndicators((prev) =>
                                      prev.filter((_, i) => i !== indIndex)
                                    );
                                    handleDelete(
                                      "projects/indicator",
                                      indItem.id
                                    );
                                  }}
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  size={18}
                                />
                              )}
                              {indItem.id &&
                                (readOnly ? (
                                  <Eye
                                    className="cursor-pointer text-orange-500 hover:text-orange-700"
                                    onClick={() => {
                                      setReqForIndicatorShowModel(true);
                                      setIndicatorIdForEditOrShow(
                                        Number(indItem.id)
                                      );
                                    }}
                                    size={18}
                                  ></Eye>
                                ) : (
                                  <Edit
                                    className="cursor-pointer text-orange-500 hover:text-orange-700"
                                    onClick={() => {
                                      setReqForIndicatorEditModel(true);
                                      setIndicatorIdForEditOrShow(
                                        Number(indItem.id)
                                      );
                                    }}
                                    size={18}
                                  ></Edit>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>

        <CardFooter className="flex flex-row w-full gap-2 items-start justify-end absolute bottom-5">
          {cardsBottomButtons(
            setCurrentTab,
            "output",
            undefined,
            setCurrentTab,
            "dessaggregation"
          )}
        </CardFooter>
      </Card>

      {reqForIndicatorEditModel && indicatorIdForEditOrShow && (
        <IndicatorModel
          isOpen={reqForIndicatorEditModel}
          onClose={() => setReqForIndicatorEditModel(false)}
          indicatorId={indicatorIdForEditOrShow}
          mode="edit"
          pageIdentifier={mode}
        />
      )}
      {reqForIndicatorShowModel && indicatorIdForEditOrShow && (
        <IndicatorModel
          isOpen={reqForIndicatorShowModel}
          onClose={() => setReqForIndicatorShowModel(false)}
          indicatorId={indicatorIdForEditOrShow}
          mode="show"
          pageIdentifier={mode}
        />
      )}
    </>
  );
};

export default IndicatorForm;
