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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye, Trash } from "lucide-react";
import { Dessaggregation, Indicator, Output, Project } from "../types/Types";
import React, { useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import IndicatorModel from "@/components/global/IndicatorEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { useProjectContext } from "../create_new_project/page";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { IndicatorFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsIndicatorRelatedToThisOutput,
  IsNotShowMode,
  IsNotSubIndicator,
  IsOutputSaved,
  IsShowMode,
} from "@/constants/Constants";
import { DeleteIndicatorMessage } from "@/constants/ConfirmationModelsTexts";
import { Button } from "@/components/ui/button";

const IndicatorForm: React.FC<IndicatorFormInterface> = ({ mode }) => {
  const { reqForConfirmationModelFunc } = useParentContext();

  const {
    outputs,
    indicators,
    setIndicators,
    setCurrentTab,
    handleDelete,
    setDessaggregations,
  }: {
    outputs: Output[];
    indicators: Indicator[];
    setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;
    setDessaggregations: React.Dispatch<
      React.SetStateAction<Dessaggregation[]>
    >;
    formData: Project;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
    handleDelete: (url: string, id: string | null) => void;
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

  const [reqForIndicatorForm, setReqForIndicatorForm] = useState(false);

  return (
    <>
      <Card className="relative h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-end w-full">
          <CardTitle>
            {IsNotShowMode(mode) && (
              <Button
                onClick={() => setReqForIndicatorForm(!reqForIndicatorForm)}
              >
                Add Indicator
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 overflow-auto h-[70%]">
          {outputs.length >= 1 ? (
            <Accordion type="single" collapsible={true} className="w-full">
              {outputs
                .filter((o) => IsOutputSaved(o))
                .map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.output}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-6 max-h-[600px] overflow-auto">
                      {/* indicators list */}
                      <div className="mt-4 max-h-[200px] overflow-auto border rounded-xl">
                        {indicators
                          .filter((ind) =>
                            IsIndicatorRelatedToThisOutput(
                              Number(item.id),
                              Number(ind.outputId)
                            )
                          )
                          .filter((ind) => IsNotSubIndicator(ind))
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
                                    onClick={() =>
                                      reqForConfirmationModelFunc(
                                        DeleteIndicatorMessage,
                                        () => {
                                          setIndicators((prev) =>
                                            prev.filter(
                                              (_, i) => i !== indIndex
                                            )
                                          );
                                          setDessaggregations((prev) =>
                                            prev.filter((d) =>
                                              indicators.some(
                                                (i) => i.id == d.indicatorId
                                              )
                                            )
                                          );
                                          handleDelete(
                                            "projects/indicator",
                                            indItem.id
                                          );
                                        }
                                      )
                                    }
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
          ) : (
            <div className="flex flex-row items-center justify-center text-center text-sm text-muted-foreground">
              No indicator added yet !
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-row w-full gap-2 items-start justify-end absolute bottom-5">
          {cardsBottomButtons(
            setCurrentTab,
            "output",
            undefined,
            false,
            setCurrentTab,
            "dessaggregation"
          )}
        </CardFooter>
      </Card>

      {IsNotShowMode(mode) && reqForIndicatorForm && (
        <IndicatorModel
          isOpen={reqForIndicatorForm}
          onClose={() => setReqForIndicatorForm(false)}
          mode="create"
          pageIdentifier={mode}
        />
      )}

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
