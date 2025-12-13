"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cardsBottomButtons } from "./CardsBottomButtons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Eye, Trash } from "lucide-react";
import { Outcome, Output } from "../types/Types";
import React, { useState } from "react";
import { useProjectContext } from "../create_new_project/page";
import OutputEditModel from "@/components/global/OutputEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { OutputFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsNotShowMode,
  IsOutcomeSaved,
  IsOutputRelatedToThisOutcome,
  IsShowMode,
} from "@/constants/Constants";
import { useParentContext } from "@/contexts/ParentContext";
import { DeleteOutputMessage } from "@/constants/ConfirmationModelsTexts";
import OutputModel from "@/components/global/OutputEditModel";
import { Button } from "@/components/ui/button";

const OutputForm: React.FC<OutputFormInterface> = ({ mode }) => {
  const { reqForConfirmationModelFunc } = useParentContext();

  const {
    setCurrentTab,
    outcomes,
    outputs,
    setOutputs,
    handleDelete,
  }: {
    setCurrentTab: (value: string) => void;
    outcomes: Outcome[];
    outputs: Output[];
    setOutputs: React.Dispatch<React.SetStateAction<Output[]>>;
    handleDelete: (url: string, id: string | null) => void;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const [reqForOutputEditModel, setReqForOutputEditModel] =
    useState<boolean>(false);
  const [reqForOutputShowModel, setReqForOutputShowModel] =
    useState<boolean>(false);
  const [outputIdForEditOrShow, setOutputIdForEditOrShow] = useState<
    number | null
  >(null);

  const [reqForOutputForm, setReqForOutputForm] = useState(false);

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="relative h-full flex flex-col overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-end w-full">
          <CardTitle>
            {IsNotShowMode(mode) && (
              <Button onClick={() => setReqForOutputForm(!reqForOutputForm)}>
                Add Output
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 overflow-auto h-[70%]">
          {outcomes.length >= 1 ? (
            <Accordion type="single" collapsible className="w-full">
              {outcomes
                .filter((o) => IsOutcomeSaved(o))
                .map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.outcome}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance max-h-96 overflow-auto">
                      {/* List of added outputs for current outcome */}
                      <div className="mt-4 overflow-auto border rounded-xl">
                        {outputs.filter((o) =>
                          IsOutputRelatedToThisOutcome(
                            Number(item.id),
                            Number(o.outcomeId)
                          )
                        ).length === 0 && (
                          <p className="text-center text-sm text-muted-foreground py-3">
                            No outputs added yet.
                          </p>
                        )}
                        {outputs
                          .filter((outputItem) =>
                            IsOutputRelatedToThisOutcome(
                              Number(item.id),
                              Number(outputItem.outcomeId)
                            )
                          )
                          .map((outputItem, outIndex) => (
                            <div
                              key={outIndex}
                              className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {outputItem.output}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {outputItem.outputRef}
                                </span>
                              </div>
                              <div className="flex flex-row items-center justify-end gap-2">
                                {!readOnly && (
                                  <Trash
                                    onClick={() =>
                                      reqForConfirmationModelFunc(
                                        DeleteOutputMessage,
                                        () => {
                                          setOutputs((prev) =>
                                            prev.filter((_, i) => i !== index)
                                          );
                                          handleDelete(
                                            `projects/output`,
                                            outputItem.id
                                          );
                                        }
                                      )
                                    }
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    size={18}
                                  />
                                )}
                                {outputItem.id &&
                                  (!readOnly ? (
                                    <Edit
                                      className="cursor-pointer text-orange-500 hover:text-orange-700"
                                      onClick={() => {
                                        setOutputIdForEditOrShow(
                                          outputItem.id as unknown as number
                                        );
                                        setReqForOutputEditModel(true);
                                      }}
                                      size={18}
                                    ></Edit>
                                  ) : (
                                    <Eye
                                      className="cursor-pointer text-orange-500 hover:text-orange-700"
                                      onClick={() => {
                                        setOutputIdForEditOrShow(
                                          outputItem.id as unknown as number
                                        );
                                        setReqForOutputShowModel(true);
                                      }}
                                      size={18}
                                    ></Eye>
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
            <div className="flex flex-row items-center justify-center text-center text-muted-foreground text-sm">
              No output added yet !
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-row w-full gap-2 items-start justify-end absolute bottom-5">
          {cardsBottomButtons(
            setCurrentTab,
            "outcome",
            undefined,
            setCurrentTab,
            "indicator"
          )}
        </CardFooter>
      </Card>

      {IsNotShowMode(mode) && reqForOutputForm && (
        <OutputModel
          isOpen={reqForOutputForm}
          onOpenChange={setReqForOutputForm}
          mode={"create"}
          pageIdentifier={"create"}
        ></OutputModel>
      )}

      {reqForOutputEditModel && outputIdForEditOrShow && (
        <OutputEditModel
          isOpen={reqForOutputEditModel}
          onOpenChange={() => setReqForOutputEditModel(false)}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
          outputId={outputIdForEditOrShow}
        ></OutputEditModel>
      )}

      {reqForOutputShowModel && outputIdForEditOrShow && (
        <OutputEditModel
          isOpen={reqForOutputShowModel}
          onOpenChange={() => setReqForOutputShowModel(false)}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
          outputId={outputIdForEditOrShow}
        ></OutputEditModel>
      )}
    </>
  );
};

export default OutputForm;
