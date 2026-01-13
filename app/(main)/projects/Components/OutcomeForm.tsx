"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye, Trash } from "lucide-react";
import { cardsBottomButtons } from "./CardsBottomButtons";
import React, { useState } from "react";
import { Outcome } from "../types/Types";
import { useProjectContext } from "../create_new_project/page";
import OutcomeEditModal from "@/components/global/OutcomeEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import {
  IsCreateMode,
  IsNoOutcome,
  IsNotANullValue,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { OutcomeFormInterface } from "@/interfaces/Interfaces";
import { useParentContext } from "@/contexts/ParentContext";
import { DeleteOutcomeMessage } from "@/constants/ConfirmationModelsTexts";
import OutcomeModel from "@/components/global/OutcomeEditModel";
import { Button } from "@/components/ui/button";

const OutcomeForm: React.FC<OutcomeFormInterface> = ({ mode }) => {
  const { reqForConfirmationModelFunc } = useParentContext();

  const {
    outcomes,
    setOutcomes,
    setCurrentTab,
    handleDelete,
  }: {
    projectId: number | null;
    outcomes: Outcome[];
    setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
    setCurrentTab: (value: string) => void;
    handleDelete: (url: string, id: string | null) => void;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const [reqForOutcomeEditModel, setReqForOutcomeEditModel] =
    useState<boolean>(false);
  const [reqForOutcomeShowModel, setReqForOutcomeShowModel] =
    useState<boolean>(false);
  const [outcomeIdForEditOrShow, setOutcomeIdForEditOrShow] = useState<
    number | null
  >(null);

  const [reqForOutcomeForm, setReqForOutcomeForm] = useState<boolean>(false);

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="relative h-full flex flex-col">
        <CardHeader
          className="
          flex
          flex-row
          items-center
          justify-end
          w-full
          px-4
          sm:px-6
        "
        >
          <CardTitle className="w-full flex justify-end">
            {IsNotShowMode(mode) && (
              <Button
                className="w-full sm:w-auto"
                onClick={() => setReqForOutcomeForm(!reqForOutcomeForm)}
              >
                Add Outcomes
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent
          className="
          flex
          flex-col
          gap-4
          overflow-auto
          px-4
          sm:px-6
          h-[65%]
          sm:h-[70%]
        "
        >
          <div className="mt-4">
            {outcomes.filter((outcome) => !IsNoOutcome(outcome)).length ===
              0 && (
              <p className="text-center text-sm text-muted-foreground py-3">
                No outcomes added yet.
              </p>
            )}

            {outcomes
              .filter((outcome) => !IsNoOutcome(outcome))
              .map((item, index) => (
                <div
                  key={index}
                  className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
                px-2
                sm:px-3
                py-3
                border-b
                last:border-b-0
              "
                >
                  <div
                    className="flex flex-col cursor-pointer"
                    title={`Outcome: ${item.outcome} \nOutcome Referance: ${item.outcomeRef}`}
                  >
                    <span className="font-medium break-words max-w-[250px] truncate">
                      {item.outcome}
                    </span>
                    <span className="text-sm text-muted-foreground break-words">
                      {item.outcomeRef}
                    </span>
                  </div>

                  <div
                    className="
                  flex
                  flex-row
                  items-center
                  justify-end
                  gap-3
                "
                  >
                    {!readOnly && (
                      <Trash
                        onClick={() =>
                          reqForConfirmationModelFunc(
                            DeleteOutcomeMessage,
                            () => {
                              setOutcomes((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              handleDelete(`projects/outcome`, item.id);
                            }
                          )
                        }
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        size={18}
                      />
                    )}

                    {IsNotANullValue(item.id) &&
                      (!readOnly ? (
                        <Edit
                          className="cursor-pointer text-orange-500 hover:text-orange-700"
                          onClick={() => {
                            setOutcomeIdForEditOrShow(
                              item.id as unknown as number
                            );
                            setReqForOutcomeEditModel(true);
                          }}
                          size={18}
                        />
                      ) : (
                        <Eye
                          className="cursor-pointer text-orange-500 hover:text-orange-700"
                          onClick={() => {
                            setOutcomeIdForEditOrShow(
                              item.id as unknown as number
                            );
                            setReqForOutcomeShowModel(true);
                          }}
                          size={18}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>

        <CardFooter
          className="
          flex
          flex-wrap
          w-full
          gap-2
          items-start
          justify-end
          px-4
          sm:px-6
          static
          sm:absolute
          sm:bottom-5
        "
        >
          {cardsBottomButtons(
            setCurrentTab,
            "project",
            undefined,
            false,
            setCurrentTab,
            "output"
          )}
        </CardFooter>
      </Card>

      {IsNotShowMode(mode) && reqForOutcomeForm && (
        <OutcomeModel
          isOpen={reqForOutcomeForm}
          onOpenChange={setReqForOutcomeForm}
          mode="create"
          pageIdentifier={mode}
        />
      )}

      {reqForOutcomeEditModel && outcomeIdForEditOrShow && (
        <OutcomeEditModal
          isOpen={reqForOutcomeEditModel}
          onOpenChange={setReqForOutcomeEditModel}
          outcomeId={outcomeIdForEditOrShow}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
        />
      )}

      {reqForOutcomeShowModel && outcomeIdForEditOrShow && (
        <OutcomeEditModal
          isOpen={reqForOutcomeShowModel}
          onOpenChange={setReqForOutcomeShowModel}
          outcomeId={outcomeIdForEditOrShow}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
        />
      )}
    </>
  );
};

export default OutcomeForm;
