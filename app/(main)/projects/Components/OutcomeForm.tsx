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
import { handleDelete } from "../utils/CommonFunctions";
import { Outcome } from "../types/Types";
import { useProjectContext } from "../create_new_project/page";
import OutcomeEditModal from "@/components/global/OutcomeEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { IsCreateMode, IsShowMode } from "@/lib/Constants";
import { OutcomeFormInterface } from "@/interfaces/Interfaces";
import { useParentContext } from "@/contexts/ParentContext";
import { DeleteOutcomeMessage } from "@/lib/ConfirmationModelsTexts";

const OutcomeForm: React.FC<OutcomeFormInterface> = ({ mode }) => {
  const { reqForConfirmationModelFunc } = useParentContext();

  const {
    outcomes,
    setOutcomes,
    setCurrentTab,
  }: {
    projectId: number | null;
    outcomes: Outcome[];
    setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
    setCurrentTab: (value: string) => void;
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

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="relative h-full flex flex-col">
        <CardHeader className="w-full">
          <CardTitle>Add Outcomes</CardTitle>
          <CardDescription>
            Define each Outcome with its reference code
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 overflow-auto">
          <div className="mt-4 max-h-60 ">
            {outcomes.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-3">
                No outcomes added yet.
              </p>
            )}
            {outcomes.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.outcome}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.outcomeRef}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-end gap-2">
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
                  {item.id != null &&
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
                      ></Edit>
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
                      ></Eye>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-row w-full gap-2 items-start justify-end absolute bottom-5">
          {cardsBottomButtons(
            setCurrentTab,
            "project",
            undefined,
            setCurrentTab,
            "output"
          )}
        </CardFooter>
      </Card>

      {reqForOutcomeEditModel && outcomeIdForEditOrShow && (
        <OutcomeEditModal
          isOpen={reqForOutcomeEditModel}
          onOpenChange={setReqForOutcomeEditModel}
          outcomeId={outcomeIdForEditOrShow}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
        ></OutcomeEditModal>
      )}
      {reqForOutcomeShowModel && outcomeIdForEditOrShow && (
        <OutcomeEditModal
          isOpen={reqForOutcomeShowModel}
          onOpenChange={setReqForOutcomeShowModel}
          outcomeId={outcomeIdForEditOrShow}
          mode={readOnly ? "show" : "edit"}
          pageIdentifier={mode}
        ></OutcomeEditModal>
      )}
    </>
  );
};

export default OutcomeForm;
