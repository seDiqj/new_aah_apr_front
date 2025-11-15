import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  OutputCreationMessage,
  OutputEditionMessage,
} from "@/lib/ConfirmationModelsTexts";
import { useParentContext } from "@/contexts/ParentContext";
import { OutputDefault } from "@/lib/FormsDefaultValues";
import { Outcome, Output } from "@/app/(main)/projects/types/Types";
import { useProjectContext } from "@/app/(main)/projects/create_new_project/page";
import { useProjectEditContext } from "@/app/(main)/projects/edit_project/[id]/page";
import { useProjectShowContext } from "@/app/(main)/projects/project_show/[id]/page";
import { SingleSelect } from "../single-select";
import { OutputInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsOutcomeSaved,
  IsShowMode,
  IsThereAnyOutputWithEnteredReferance,
  IsThereAnyOutputWithEnteredReferanceAndDefferentId,
} from "@/lib/Constants";
import { OutcomeFormSchema, OutputFormSchema } from "@/schemas/FormsSchema";

const OutputModel: React.FC<OutputInterface> = ({
  isOpen,
  onOpenChange,
  mode,
  pageIdentifier,
  outputId,
}) => {
  const {
    reqForConfirmationModelFunc,
    reqForToastAndSetMessage,
    axiosInstance,
  } = useParentContext();
  const {
    outcomes,
    outputs,
    setOutputs,
  }: {
    outcomes: Outcome[];
    outputs: Output[];
    setOutputs: React.Dispatch<React.SetStateAction<Output[]>>;
  } =
    pageIdentifier == "create"
      ? useProjectContext()
      : pageIdentifier == "edit"
      ? useProjectEditContext()
      : useProjectShowContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Output>(OutputDefault());
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => console.log(formErrors), [formErrors]);

  const handleSubmit = () => {

    const result = OutputFormSchema.safeParse(formData);
    
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

    if (
      IsCreateMode(mode) &&
      IsThereAnyOutputWithEnteredReferance(outputs, formData.outputRef)
    ) {
      reqForToastAndSetMessage(
        "A project can not have two output with same referance !"
      );
      return;
    } else if (
      IsEditMode(mode) &&
      IsThereAnyOutputWithEnteredReferanceAndDefferentId(outputs, formData)
    ) {
      reqForToastAndSetMessage(
        "A project can not have two output with same referance !"
      );
      return;
    }

    setIsLoading(true);

    if (IsCreateMode(mode))
      axiosInstance
        .post("/projects/o/output", formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          setOutputs((prev) => [
            ...prev,
            { ...formData, id: response.data.data.id },
          ]);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
        })
        .finally(() => setIsLoading(false));
    else if (IsEditMode(mode))
      axiosInstance
        .put(`/projects/output/${outputId}`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          setOutputs((prev) =>
            prev.map((output) => (output.id == formData.id ? formData : output))
          );
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if ((IsEditMode(mode) || IsShowMode(mode)) && outputId) {
      setIsLoading(true);
      axiosInstance
        .get(`projects/output/${outputId}`)
        .then((response: any) => {
          console.log(response.data.data);
          setFormData(response.data.data);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode == "create"
              ? "Create New Output"
              : mode == "edit"
              ? "Edit Output"
              : "Show Output"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="outputRef">Outcome Reference</Label>
            <SingleSelect
              options={outcomes
                .filter((outcome) => IsOutcomeSaved(outcome))
                .map((outcome) => ({
                  value: outcome.id!,
                  label: outcome.outcomeRef,
                }))}
              value={formData.outcomeId ?? "Unknown value"}
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  outcomeId: value,
                }))
              }
              error={formErrors.outcomeId}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="output">Output</Label>
            <Input
              id="output"
              name="output"
              value={formData.output}
              onChange={handleFormChange}
              disabled={mode == "show"}
              className={`border p-2 rounded ${
                formErrors.output ? "!border-red-500" : ""
              }`}
              title={formErrors.output}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="outputRef">Output Reference</Label>
            <Input
              id="outputRef"
              name="outputRef"
              value={formData.outputRef}
              onChange={handleFormChange}
              disabled={mode == "show"}
              className={`border p-2 rounded ${
                formErrors.outputRef ? "!border-red-500" : ""
              }`}
              title={formErrors.outputRef}
            />
          </div>
        </div>

        {mode != "show" && (
          <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  reqForConfirmationModelFunc(
                    mode == "create"
                      ? OutputCreationMessage
                      : OutputEditionMessage,
                    handleSubmit
                  )
                }
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OutputModel;
