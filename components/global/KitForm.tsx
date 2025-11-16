"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { KitFormType } from "@/types/Types";
import { MultiSelect } from "../multi-select";
import { useParams } from "next/navigation";
import { withPermission } from "@/lib/withPermission";
import { KitDefault } from "@/lib/FormsDefaultValues";
import { KitCreationMessage, KitEditionMessage } from "@/lib/ConfirmationModelsTexts";
import { KitRecievedOptions } from "@/lib/SingleAndMultiSelectOptionsList";
import { KitFormInterface } from "@/interfaces/Interfaces";
import { IsCreateMode, IsEditMode, IsEditOrShowMode, IsNotShowMode, IsShowMode } from "@/lib/Constants";

let mode = ""

const KitForm: React.FC<KitFormInterface> = ({
  open,
  onOpenChange,
  mode,
  kitId,
}) => {
  mode = mode;

  const { id } = useParams();

  const { reqForToastAndSetMessage, axiosInstance, handleReload, reqForConfirmationModelFunc } = useParentContext();

  const [formData, setFormData] = useState<KitFormType>(KitDefault());

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (IsCreateMode(mode)) {
      axiosInstance
        .post(`/kit_db/add_kit_to_bnf/${id}`, formData)
        .then((response: any) =>
        {
          reqForToastAndSetMessage(response.data.message);
          handleReload();
        }
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    } else if (IsEditMode(mode) && kitId) {
      axiosInstance
        .put(`/kit_db/kit/${kitId}`, formData)
        .then((response: any) =>
        {
          reqForToastAndSetMessage(response.data.message);
          handleReload();
        }
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  };

  const [kits, setKits] = useState<{id: string; name: string;}[]>();

  useEffect(() => {
    if (IsEditOrShowMode(mode) && kitId && open) {
      axiosInstance
        .get(`/kit_db/show_kit/${kitId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
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
            <MultiSelect
              options={
                kits
                  ? kits.map((kit) => ({
                      value: kit.id,
                      label: kit.name.toUpperCase(),
                    }))
                  : []
              }
              value={formData.kits}
              onValueChange={(value: string[]) =>
                handleFormChange({
                  target: { name: "kits", value },
                })
              }
            />
          </div>

          {/* Distribution Date */}
          <div className="flex flex-col gap-2">
            <Label>Distribution Date</Label>
            <Input
              name="distributionDate"
              value={formData.distributionDate}
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
              value={formData.isReceived ? "true" : "false"}
              onValueChange={(value: string) =>
                handleFormChange({
                  target: {
                    name: "isReceived",
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
              <Button type="button" onClick={(e) => reqForConfirmationModelFunc(
                (IsCreateMode(mode) ? KitCreationMessage : KitEditionMessage),
                () => handleSubmit(e)
              )}>
                {IsCreateMode(mode) ? "Submit" : "Update"}
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
  mode == "create" ? "Kit.create" : mode == "edit" ? "Kit.edit" : "Kit.view"
);
