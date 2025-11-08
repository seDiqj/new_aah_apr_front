"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import {Outcome, Output} from "../types/Types";
import React, { useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { handleDelete } from "../utils/CommonFunctions";
import { useProjectContext } from "../create_new_project/page";
import OutputEditModel from "@/components/global/OutputEditModel";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { OutputFormSchema } from "@/schemas/FormsSchema";

interface ComponentProps {
    mode: "create" | "edit";
    readOnly?: boolean;
}

const OutputForm: React.FC<ComponentProps> = ({mode, readOnly}) => {

    const {axiosInstance, reqForToastAndSetMessage} = useParentContext();

    const {
        setCurrentTab, outcomes, outputs, setOutputs
        }: {
        setCurrentTab: (value: string) => void;
        outcomes: Outcome[];
        outputs: Output[],
        setOutputs: React.Dispatch<React.SetStateAction<Output[]>>;
    } = mode == "create" ? useProjectContext() : readOnly ? useProjectShowContext() : useProjectEditContext();

    let [openAccordion, setOpenAccordion] = useState<string>("");

    let [output, setOutput] = useState<string>("");
    let [outputRef, setOutputRef] = useState<string>("");

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const [reqForOutputEditModel, setReqForOutputEditModel] = useState<{id: string, output: string, outputRef: string} | null>(null);


    const handleAddOutput = (newOutputData: Output) => {

        const result = OutputFormSchema.safeParse({
          output,
          outputRef
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

        if (!output.trim()) {
            reqForToastAndSetMessage("A project can not have two outputs with same referance !");
            return;
        } 

        setOutputs((prev) => [
            ...prev,
            newOutputData,
            ]);
            setOutput("");
            setOutputRef("");
    }

    const hundleSubmit = () => {
        axiosInstance
          .post("/projects/o/output", {
                  outputs: outputs.map((output) => {
                    const correspondingOutcomeId = outcomes.find(
                      (outcome) => outcome.outcomeRef == output.outcomeRef
                    )?.id;
    
                    output.outcomeId = correspondingOutcomeId ?? null;
    
                    if (!output.outcomeId) {
                      reqForToastAndSetMessage(
                        `Output with referance ${output.outputRef} Has no valid outcome \n Note: Before creating some outputs to a outcome please ensure that it is stored in database !`
                      );
    
                      return;
                    }
    
                    const { outcomeRef, ...updatedOutputForApi } = output;
    
                    return output;
                  }),
                },)
          .then((response: any) => {
            reqForToastAndSetMessage(response.data.message);
              setOutputs(
                outputs.map((output) => {
                  const outputId = response.data.data.find(
                    (outputFromBackend: { id: string; outputRef: string }) =>
                      outputFromBackend.outputRef == output.outputRef
                  ).id;
    
                  output.id = outputId;
    
                  return output;
                })
              );
          })
          .catch((error: any) => {
            reqForToastAndSetMessage(error.response.data.message);
          });
    };

    const handleUpdateOutput = async (local: {id: string, output:string, outputRef: string}) => {
          if (!local.output.trim() || !local.outputRef.trim()) {
            reqForToastAndSetMessage("Please fill all the fields !");
            return;
          }

          if (outputs.some((output) => output.outputRef == local.outputRef && output.id != local.id)) {
            reqForToastAndSetMessage("A project can not have two outputs with same referance !");
            return;
          }
    
          try {
            const id = local!.id;
            const payload = {
              output: local.output,
              outputRef: local.outputRef,
            };
    
            const response = await axiosInstance.put(
              `/projects/output/${id}`,
              payload
            );
    
            // Update local outputs state
            setOutputs((prev) =>
              prev.map((o) =>
                o.id === id ? { ...o, output: local.output, outputRef: local.outputRef } : o
              )
            );
    
            reqForToastAndSetMessage(response.data?.message || "Output updated");
            setReqForOutputEditModel(null);
          } catch (error: any) {
            reqForToastAndSetMessage(
              error?.response?.data?.message || "Failed to update output"
            );
          } finally {
          }
      };

    return (

        <>
            <Card className="relative h-full flex flex-col overflow-y-auto">
                <CardHeader>
                    <CardTitle>Add Output</CardTitle>
                    <CardDescription>
                    Define each Output with its reference code.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={openAccordion}
                        onValueChange={setOpenAccordion}
                    >
                    {outcomes.filter((o) => o.id != null).map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{item.outcome}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance max-h-96 overflow-auto">
                            <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor={`output-${index}`}>Output</Label>
                                <Input
                                  id={`output-${index}`}
                                  value={output}
                                  onChange={(e) => setOutput(e.target.value)}
                                  placeholder="Enter output title..."
                                  disabled={readOnly}
                                  className={`border p-2 rounded ${formErrors.output ? "!border-red-500" : ""}`}
                                  title={formErrors.output}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor={`outputRef-${index}`}>
                                    Output Reference
                                </Label>
                                <Input
                                  id={`outputRef-${index}`}
                                  value={outputRef}
                                  onChange={(e) => setOutputRef(e.target.value)}
                                  placeholder="Enter output reference..."
                                  disabled={readOnly}
                                  className={`border p-2 rounded ${formErrors.outputRef ? "!border-red-500" : ""}`}
                                  title={formErrors.outputRef}
                                />
                            </div>
                            </div>
                            {/* Add Btn */}
                            {!readOnly && (
                              <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={() => handleAddOutput({
                                                                id: null,
                                                                outcomeId: item.id,
                                                                outcomeRef: item.outcomeRef,
                                                                output: output,
                                                                outputRef: outputRef,
                                                                })}
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Output
                            </Button>
                            </div>
                            )}

                            {/* List of added outputs for current outcome */}
                            <div className="mt-4 max-h-60 overflow-auto border rounded-xl">
                            {outputs.filter(
                                (o) => o.outcomeRef === item.outcomeRef
                            ).length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-3">
                                No outputs added yet.
                                </p>
                            )}
                            {outputs
                                .filter(
                                (outputItem) =>
                                    outputItem.outcomeRef === item.outcomeRef
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
                          {setOutputs((prev) =>
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
                            !readOnly ? <Edit className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutputEditModel({
                              id: outputItem.id!,
                              output: outputItem.output,
                              outputRef: outputItem.outputRef
                            })} size={18}></Edit> : <Eye className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutputEditModel({
                              id: outputItem.id!,
                              output: outputItem.output,
                              outputRef: outputItem.outputRef
                            })} size={18}></Eye>
                        }
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
                    {cardsBottomButtons(setCurrentTab, "outcome", readOnly ? undefined : hundleSubmit, setCurrentTab, "indicator")}
                </CardFooter>
            </Card>
            
            {reqForOutputEditModel && <OutputEditModel isOpen={!!reqForOutputEditModel} onClose={() => setReqForOutputEditModel(null)} onSave={handleUpdateOutput} outputData={reqForOutputEditModel} outputs={outputs} mode={readOnly ? "show" : "edit"} ></OutputEditModel>}

        </>

    )
}

export default OutputForm;