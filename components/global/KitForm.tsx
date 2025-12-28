"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { KitFormType } from "@/types/Types";
import { useParams } from "next/navigation";
import { withPermission } from "@/lib/withPermission";
import { KitDefault } from "@/constants/FormsDefaultValues";
import {
  KitCreationMessage,
  KitEditionMessage,
} from "@/constants/ConfirmationModelsTexts";
import { KitRecievedOptions } from "@/constants/SingleAndMultiSelectOptionsList";
import { KitFormInterface } from "@/interfaces/Interfaces";
import {
  IsCreateMode,
  IsEditMode,
  IsEditOrShowMode,
  IsNotShowMode,
  IsShowMode,
} from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";

let mode: "create" | "edit" | "show" = "create";

const KitForm: React.FC<KitFormInterface> = ({
  open,
  onOpenChange,
  mode,
  kitId,
}) => {
  mode = mode;

  const { id } = useParams();

  const {
    reqForToastAndSetMessage,
    axiosInstance,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<KitFormType>(KitDefault());

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
        .post(`/kit_db/add_kit_to_bnf/${id}`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
    } else if (IsEditMode(mode) && kitId) {
      axiosInstance
        .put(`/kit_db/kit/${kitId}`, formData)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          onOpenChange(false);
          handleReload();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        )
        .finally(() => setIsLoading(false));
    }
  };

  const [kits, setKits] = useState<{ id: string; name: string }[]>();

  useEffect(() => {
    if (IsEditOrShowMode(mode) && kitId && open) {
      axiosInstance
        .get(`/kit_db/show_kit/${kitId}`)
        .then((response: AxiosResponse<any, any, any>) => {
          console.log(response.data.data);
          setFormData(response.data.data);
        })
        .catch((error: AxiosError<any, any>) => {
          reqForToastAndSetMessage(error.response?.data.message);
        });
    }

    // Fitching kits list.
    axiosInstance
      .get("/kit_db/kit_list")
      .then((response: any) => {
        if (response.data.status) setKits(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
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
          {/* Kit Selector */}
          <div className="flex flex-col gap-2">
            <Label>Select Kit</Label>
            <SingleSelect
              options={
                kits
                  ? kits.map((kit) => ({
                      value: kit.id,
                      label: kit.name.toUpperCase(),
                    }))
                  : []
              }
              value={formData.kitId}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: { name: "kitId", value },
                })
              }
            />
          </div>

          {/* Distribution Date */}
          <div className="flex flex-col gap-2">
            <Label>Destribution Date</Label>
            <Input
              name="destribution_date"
              value={formData.destribution_date}
              onChange={handleFormChange}
              disabled={readOnly}
            />
          </div>

          {/* Remark */}
          <div className="flex flex-col gap-2">
            <Label>Remark</Label>
            <Input
              name="remark"
              value={formData.remark}
              onChange={handleFormChange}
              disabled={readOnly}
            />
          </div>

          {/* Is Reveived */}
          <div className="flex flex-col gap-2">
            <Label>Is Received</Label>
            <SingleSelect
              options={KitRecievedOptions}
              value={formData.is_received ? "true" : "false"}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "is_received",
                    value: value == "true" ? true : false,
                  },
                })
              }
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
                    () => handleSubmit(e)
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
  IsCreateMode(mode) ? "Kit.create" : IsEditMode(mode) ? "Kit.edit" : "Kit.view"
);
