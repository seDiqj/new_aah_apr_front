"use client";

import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { use, useEffect, useState } from "react";
import { KitForm, MainDatabaseProgram } from "@/types/Types";
import { createAxiosInstance } from "@/lib/axios";
import { MultiSelect } from "../multi-select";
import { size } from "zod";
import { useParams } from "next/navigation";
import { withPermission } from "@/lib/withPermission";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  kitId?: number;
}

let mode: string = "";

const KitForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  kitId,
}) => {
  mode = mode;

  const { id } = useParams();
  const { reqForToastAndSetMessage } = useParentContext();
  const axiosInstance = createAxiosInstance();

  const [formData, setFormData] = useState<KitForm>({
    kits: [],
    distributionDate: "",
    remark: "",
    isReceived: false,
  });

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

    if (mode === "create") {
      axiosInstance
        .post(`/kit_db/add_kit_to_bnf/${id}`, formData)
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    } else if (mode === "edit" && kitId) {
      axiosInstance
        .put(`/kit_db/kit/${kitId}`, formData)
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  };

  const [kits, setKits] = useState<
    {
      name: string;
    }[]
  >();

  useEffect(() => {
    if ((mode === "edit" || mode === "show") && kitId && open) {
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
        console.log(response.data.data);
        if (response.data.status) setKits(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, [mode, kitId, open]);

  const readOnly = mode === "show";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[50%] w-[70%]">
        <DialogTitle>
          {mode === "create" && "Add New Kit"}
          {mode === "edit" && "Edit Beneficiary Kit"}
          {mode === "show" && "Beneficiary Kit"}
        </DialogTitle>
        <form className="space-y-4 grid grid-cols-2 gap-4">
          {/* Kit Selector */}
          <div className="flex flex-col gap-2">
            <Label>Select Kit</Label>
            <MultiSelect
              options={
                kits
                  ? kits.map((kit) => ({
                      value: kit.name,
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
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
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
          {mode !== "show" && (
            <div className="flex justify-end col-span-2">
              <Button onClick={handleSubmit}>
                {mode === "create" ? "Submit" : "Update"}
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
