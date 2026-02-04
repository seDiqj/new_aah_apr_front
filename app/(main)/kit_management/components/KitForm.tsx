"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { useEffect, useState } from "react";
import { KitType } from "@/types/Types";
import { withPermission } from "@/lib/withPermission";
import { KitFormDefault } from "@/constants/FormsDefaultValues";
import {
  KitCreationMessage,
  KitEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { KitStatusOptions } from "@/constants/SingleAndMultiSelectOptionsList";
import { KitFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsEditOrShowMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SingleSelect } from "@/components/single-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

let mode: "create" | "edit" | "show" = "create";

const KitForm: React.FC<KitFormInterface> = ({
  open,
  onOpenChange,
  mode,
  kitId,
}) => {
  mode = mode;

  const {
    reqForToastAndSetMessage,
    axiosInstance,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<KitType>(KitFormDefault());

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    if (IsCreateMode(mode)) {
      axiosInstance
        .post(`/kit_db/kit_mng/`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    } else if (IsEditMode(mode) && kitId) {
      axiosInstance
        .put(`/kit_db/kit_mng/${kitId}`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
        )
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (IsEditOrShowMode(mode) && kitId && open) {
      axiosInstance
        .get(`/kit_db/kit_mng/${kitId}`)
        .then((response: AxiosResponse<any, any, any>) => {
          setFormData(response.data.data);
        })
        .catch((error: AxiosError<any, any>) => {
          reqForToastAndSetMessage(error.response?.data.message, "error");
        });
    }
  }, [mode, kitId, open]);

  const readOnly = IsShowMode(mode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[50%] w-[70%]">
        <DialogTitle>
          {IsCreateMode(mode) && "Add New Kit"}
          {IsEditMode(mode) && "Edit Beneficiary Kit"}
          {IsShowMode(mode) && "Beneficiary Kit"}
        </DialogTitle>
        <form className="space-y-4 grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              disabled={readOnly}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <SingleSelect
              options={KitStatusOptions}
              value={formData.status}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "status",
                    value: value,
                  },
                })
              }
              disabled={readOnly}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              disabled={readOnly}
            />
          </div>

          {/* Submit */}
          {IsNotShowMode(mode) && (
            <div className="flex justify-end col-span-2">
              <Button
                id={SUBMIT_BUTTON_PROVIDER_ID}
                disabled={isLoading}
                type="button"
                onClick={(e) =>
                  reqForConfirmationModelFunc(
                    IsCreateMode(mode) ? KitCreationMessage : KitEditionMessage,
                    () => handleSubmit(e),
                  )
                }
              >
                {isLoading
                  ? IsCreateMode(mode)
                    ? "Saving ..."
                    : "Updating ..."
                  : IsCreateMode(mode)
                    ? "Save"
                    : "Update"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(
  KitForm,
  IsCreateMode(mode)
    ? "Kit.create"
    : IsEditMode(mode)
      ? "Kit.edit"
      : "Kit.view",
);
