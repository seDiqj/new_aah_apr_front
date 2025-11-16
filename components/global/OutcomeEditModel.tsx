import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParentContext } from "@/contexts/ParentContext";
import { useProjectContext } from "@/app/(main)/projects/create_new_project/page";
import { useProjectEditContext } from "@/app/(main)/projects/edit_project/[id]/page";
import { useProjectShowContext } from "@/app/(main)/projects/project_show/[id]/page";
import { OutcomeFormSchema } from "@/schemas/FormsSchema";
import { OutcomeCreationMessage, OutcomeEditionMessage } from "@/lib/ConfirmationModelsTexts";
import { Outcome } from "@/app/(main)/projects/types/Types";
import { OutcomeDefault } from "@/lib/FormsDefaultValues";
import { OutcomeInterface } from "@/interfaces/Interfaces";
import { IsCreateMode, IsCreatePage, IsEditMode, IsEditOrShowMode, IsEditPage, IsShowMode, IsThereAnyOutcomeWithEnteredReferance, IsThereAnyOutcomeWithEnteredReferanceAndDefferentId } from "@/lib/Constants";

const OutcomeModel: React.FC<OutcomeInterface> = ({
    isOpen,
    onOpenChange,
    outcomeId,
    mode,
    pageIdentifier
}) => {

    const {reqForToastAndSetMessage, reqForConfirmationModelFunc, axiosInstance} = useParentContext();

    const {outcomes, setOutcomes,  projectId} : {
            projectId: number | null;
            outcomes: Outcome[];
            setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
            setCurrentTab: (value: string) => void;
        } = IsCreatePage(pageIdentifier) ? useProjectContext() : IsEditPage(pageIdentifier) ? useProjectEditContext() :
            useProjectShowContext();

    const [formData, setFormData] = useState<Outcome>(OutcomeDefault());
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFormChange = (e: any) => {
        const name: string = e.target.name;
        const value: string = e.target.value;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = () => {

        const result = OutcomeFormSchema.safeParse(formData);

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

        if (IsCreateMode(mode) && IsThereAnyOutcomeWithEnteredReferance(outcomes, formData)) {
          reqForToastAndSetMessage("A project can not have two outcomes with same referance !")
          return;
        } else if (IsEditMode(mode) && IsThereAnyOutcomeWithEnteredReferanceAndDefferentId(outcomes, formData)) {
            reqForToastAndSetMessage("A project can not have two outcomes with same referance !")
            return;
        }

        setIsLoading(true);
        
        if (IsCreateMode(mode)) 
        {
            axiosInstance
            .post("/projects/o/outcome", 
                {
                    project_id: projectId,
                    outcome: formData.outcome,
                    outcomeRef: formData.outcomeRef
                }
            )
            .then((response: any) => {
                reqForToastAndSetMessage(response.data.message);
                setOutcomes((prev) => [...prev, response.data.data]);
            })
            .catch((error: any) => {
                reqForToastAndSetMessage(error.response.data.message);
            });
        }

        else if (IsEditMode(mode))
            axiosInstance.put(`projects/outcome/${outcomeId}`, {outcome: formData.outcome, outcomeRef: formData.outcomeRef})
            .then((response: any) => {
                reqForToastAndSetMessage(response.data.message);
                setOutcomes((prev) => prev.map((o) => o.outcomeRef == formData.outcomeRef ? {...o, outcome: formData.outcome, outcomeRef: formData.outcomeRef}: o))
            })
            .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (IsEditOrShowMode(mode) && outcomeId) {
            setIsLoading(true);
            axiosInstance.get(`/projects/outcome/${outcomeId}`)
            .then((response: any) => setFormData(response.data.data))
            .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
            .finally(() => setIsLoading(false));
        }
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={() => onOpenChange(false)}>
        <DialogContent className="max-w-lg">
            <DialogHeader>
            <DialogTitle>{mode == "create" ? "Create New Outcome" : mode == "edit" ? "Edit Outcome" : "Show Outcome"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
            <div className="flex flex-col gap-1">
                <Label htmlFor="outcome">Outcome</Label>
                <Input
                    id="outcome"
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleFormChange}
                    disabled={mode == "show"}
                    className={`border p-2 rounded ${formErrors.outcome ? "!border-red-500" : ""}`}
                    title={formErrors.projectCode}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="outcomeRef">Outcome Reference</Label>
                <Input
                    id="outcomeRef"
                    name="outcomeRef"
                    value={formData.outcomeRef}
                    onChange={handleFormChange}
                    disabled={mode == "show"}
                    className={`border p-2 rounded ${formErrors.outcomeRef ? "!border-red-500" : ""}`}
                    title={formErrors.projectCode}
                />
            </div>
            </div>

            {mode != "show" && (
                <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
                <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                >
                Cancel
                </Button>
                    <Button onClick={() => reqForConfirmationModelFunc(
                        (mode == "create" ? OutcomeCreationMessage : OutcomeEditionMessage),
                        handleSubmit
                    )}>
                        Save
                    </Button>
            </div>
            </DialogFooter>
            )}
        </DialogContent>
        </Dialog>
    );
};


export default OutcomeModel;