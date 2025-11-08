"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { cardsBottomButtons } from "./CardsBottomButtons";
import React, { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { handleDelete } from "../utils/CommonFunctions";
import {Outcome} from "../types/Types";
import { useProjectContext } from "../create_new_project/page";
import OutcomeEditModal from "@/components/global/OutcomeEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { OutcomeFormSchema } from "@/schemas/FormsSchema";

interface ComponentProps {
    mode: "create" | "edit";
    readOnly?: boolean;
}

const OutcomeForm: React.FC<ComponentProps> = ({mode, readOnly}) => {
    const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

    const {projectId, outcomes, setOutcomes, setCurrentTab}: {
        projectId: number | null;
        outcomes: Outcome[];
        setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
        setCurrentTab: (value: string) => void;
    } = mode == "create" ? useProjectContext(): readOnly ? useProjectShowContext() : useProjectEditContext();

    let [outcome, setOutcome] = useState<string>("");
    let [outcomeRef, setOutcomeRef] = useState<string>("");
    
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const [reqForOutcomeEditModel, setReqForOutcomeEditModel] = useState<{id: string, outcome: string, outcomeRef: string} | null>(null);

    const handleAddOutcome = () => {

        const result = OutcomeFormSchema.safeParse({
          outcome,
          outcomeRef
        });

        if (!result.success) {
          const errors: { [key: string]: string } = {};
          result.error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (field) errors[field as string] = issue.message;
          });

          setFormErrors(errors);
          reqForToastAndSetMessage("Please fix validation errors before submitting.");
          return;
        }

        setFormErrors({});

        if (!outcome.trim() || !outcomeRef.trim()) {
          reqForToastAndSetMessage("A project can not have two outcomes with same referance !")
          return
        } 
        setOutcomes((prev) => [
        ...prev,
        { id: null, outcome, outcomeRef },
        ]);
        setOutcome("");
        setOutcomeRef("");
    }

    const handleSubmit = () => {
        axiosInstance
          .post("/projects/o/outcome", {
            project_id: projectId,
            outcomes: outcomes.filter((outcome) => outcome.id == null)
          })
          .then((response: any) => {
             reqForToastAndSetMessage(response.data.message);
              setOutcomes(
                outcomes.map((outcome) => {
                  const outcomeId = response.data.data.find(
                    (outcomeFromBackend: { id: string; outcomeRef: string }) =>
                      outcomeFromBackend.outcomeRef == outcome.outcomeRef
                  ).id;
    
                  outcome.id = outcomeId;
    
                  return outcome;
                })
              );
           
          })
          .catch((error: any) => {
            reqForToastAndSetMessage(error.response.data.message);
          });
    };

    const handleUpdateOutcome = async (local: {id: string, outcome:string, outcomeRef: string}) => {
      if (!local.outcome.trim() || !local.outcomeRef.trim()) {
        reqForToastAndSetMessage("Please fill all the fields !");
        return;
      }

      if (outcomes.some((outcome) => outcome.outcomeRef == local.outcomeRef && outcome.id != local.id)) {
        reqForToastAndSetMessage("A project can not have two outcomes with same referance !");
        return;
      }

      try {
        const id = local!.id;
        const payload = {
          outcome: local.outcome,
          outcomeRef: local.outcomeRef,
        };

        const response = await axiosInstance.put(
          `/projects/outcome/${id}`,
          payload
        );

        // Update local outcomes state
        setOutcomes((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, outcome: local.outcome, outcomeRef: local.outcomeRef } : o
          )
        );

        reqForToastAndSetMessage(response.data?.message || "Outcome updated");
      } catch (error: any) {
        reqForToastAndSetMessage(
          error?.response?.data?.message || "Failed to update outcome"
        );
      } finally {
      }
    };

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
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="outcome">Outcome</Label>
                        <Input
                          id="outcome"
                          value={outcome}
                          onChange={(e) => setOutcome(e.target.value)}
                          placeholder="Enter outcome title..."
                          className={`border p-2 rounded ${formErrors.outcome ? "!border-red-500" : ""}`}
                          title={formErrors.outcome}
                          disabled={readOnly}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="outcomeRef">Outcome Reference</Label>
                        <Input
                          id="outcomeRef"
                          value={outcomeRef}
                          onChange={(e) => setOutcomeRef(e.target.value)}
                          placeholder="Enter outcome reference..."
                          className={`border p-2 rounded ${formErrors.outcomeRef ? "!border-red-500" : ""}`}
                          title={formErrors.outcomeRef}
                          disabled={readOnly}
                        />
                    </div>
                    </div>
                    <div className="flex justify-end">
                    {!readOnly && (
                      <Button
                        type="button"
                        onClick={handleAddOutcome}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Outcome
                    </Button>
                    )}
                    </div>

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
                          {setOutcomes((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            handleDelete(`projects/outcome`, item.id)
                            }
                          }
                          
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          size={18}
                        />
                          )}
                        {item.id != null && 
                            !readOnly ? <Edit className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutcomeEditModel({
                              id: item.id!,
                              outcome: item.outcome,
                              outcomeRef: item.outcomeRef
                            })} size={18}></Edit> : <Eye className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutcomeEditModel({
                              id: item.id!,
                              outcome: item.outcome,
                              outcomeRef: item.outcomeRef
                            })} size={18}></Eye>
                        }
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-row w-full gap-2 items-start justify-end absolute bottom-5">
                    {cardsBottomButtons(setCurrentTab, "project", readOnly ? undefined : handleSubmit, setCurrentTab, "output")}
                </CardFooter>
            </Card>

            {reqForOutcomeEditModel && <OutcomeEditModal isOpen={!!reqForOutcomeEditModel} onSave={handleUpdateOutcome} onClose={() => setReqForOutcomeEditModel(null)} outcomeData={reqForOutcomeEditModel} outcomes={outcomes} mode={readOnly ? "show" : "edit"} ></OutcomeEditModal> }

        </>
    )
}

export default OutcomeForm;