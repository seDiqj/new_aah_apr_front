"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  databaseId: string | null;
}

const SubmitSummary: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  databaseId,
}) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const status = "Pending Approval";

  const databaseDetails = [
    { label: "Database", value: "Main DB" },
    { label: "Province", value: "Kabul" },
    { label: "Date", value: "Jan 2025 → May 2025" },
    { label: "Submitted by", value: "Sediq" },
  ];

  const clickableDetails = [
    { label: "Project", value: "BMZ" },
    { label: "Outcome", value: "4" },
    { label: "Output", value: "3" },
    { label: "Indicator", value: "7" },
    { label: "Disaggregation", value: "5" },
  ];

  useEffect(() => {
    if (databaseId)
      axiosInstance
        .get(`/db_management/show_database/${databaseId}`)
        .then((response: any) => console.log(response.data.data))
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "80vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify- mb-2 relative">
          <DialogHeader>
            <DialogTitle className="text-lg">Database Summary</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 w-1/2">
            <Input
              placeholder="Search..."
              className="h-8 w-60 ml-auto mr-auto"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-sm text-muted-foreground mb-4">
          Summary of selected database
        </div>

        {/* Modern Details Section */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Row 1 */}
          <div className="flex w-full gap-3">
            {databaseDetails.map((item) => (
              <div
                key={item.label}
                className="flex-1 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-lg px-4 py-3 text-sm shadow-sm flex flex-col items-center justify-center text-center transition hover:shadow-md"
              >
                <span className="font-semibold">{item.label}</span>
                <span className="mt-1">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex w-full gap-3">
            {clickableDetails.map((item) => (
              <button
                key={item.label}
                className="flex-1 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg px-4 py-3 text-sm flex flex-col items-center justify-center text-center transition hover:shadow-md hover:underline hover:text-primary"
                type="button"
              >
                <span className="font-semibold">{item.label}</span>
                <span className="mt-1">{item.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List of Beneficiaries */}
        <div className="flex items-center justify-between mb-3 w-full rounded-md bg-muted/50 px-4 py-2">
          <div className="font-semibold">List of Beneficiaries</div>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700">
            {status}
          </span>
        </div>

        {/* Table Section */}
        <div className="mt-2">
          <DataTableDemo
            columns={permissionColumns}
            indexUrl="user_mng/permissions"
            deleteUrl="user_mng/delete_permissions"
            searchableColumn="name"
            idFeildForEditStateSetter={setIdFeildForEditStateSetter}
            editModelOpenerStateSetter={setReqForPermissionUpdateForm}
          ></DataTableDemo>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSummary;
