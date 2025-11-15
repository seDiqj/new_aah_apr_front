"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { useRouter } from "next/navigation";
import { SubmitSummaryInterface } from "@/interfaces/Interfaces";

const SubmitSummary: React.FC<SubmitSummaryInterface> = ({
  open,
  onOpenChange,
  databaseId,
}) => {
  const router = useRouter();
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const status = "Pending Approval";

  const [databaseDetails, setDatabaseDetails] = useState<{label: string; value: string | {id: string, name: string}}[]>();

  const [projectDetails, setProjectDetails] = useState<{label: string; value: string | {id: string, projectCode: string}}[]>();
   
  useEffect(() => {
    if (databaseId)
      axiosInstance
        .get(`/db_management/show_database/${databaseId}`)
        .then((response: any) => {
          setDatabaseDetails([
            { label: "Database", value: response.data.data.database },
            { label: "Province", value: `${response.data.data.province}` },
            { label: "Date", value:  `${response.data.data.fromDate} → ${response.data.data.toDate}` },
            { label: "Submitted by", value: `Mosa Baregzay` },
          ])
          setProjectDetails([
            { label: "Project", value: `${response.data.data.project.projectCode}` },
            { label: "Outcome", value: response.data.data.numOfOutcomes },
            { label: "Output", value: response.data.data.numOfOutputs },
            { label: "Indicator", value: response.data.data.numOfIndicators },
          ])
        })
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
            {databaseDetails && databaseDetails.map((item) => (
              <div
                key={item.label}
                className="flex-1 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-lg px-4 py-3 text-sm shadow-sm flex flex-col items-center justify-center text-center transition hover:shadow-md"
              >
                <span className="font-semibold">{item.label}</span>
                {(
                  () => {
                    if (item.label == "project" && typeof item.value ==  "object") {
                      return <span className="mt-1">item.value.name</span>
                    }
                    return <span className="mt-1">{item.value as string}</span>
                  }
                )()}
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex w-full gap-3">
            {projectDetails && projectDetails.map((item) => (
              <button
                key={item.label}
                className="flex-1 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg px-4 py-3 text-sm flex flex-col items-center justify-center text-center transition"
                type="button"
                title={(item.label == "project" || item.label == "Submitted By") ? "Click for more details" : undefined}
                onClick={(
                  () => {
                    if (item.label == "project" && typeof item.value == "object")
                        return () => router.push(`/projects/show_project/${item.value}`)

                    return undefined
                  }
                )()}
              >
                <span className="font-semibold">{item.label}</span>
                {(() => {
                  if (item.label == "project" && typeof item.value == "object") {
                    return <span>{item.value.projectCode}</span>
                  }

                  return <span className="mt-1">{item.value as string}</span>
                })()}
              </button>
            ))}
          </div>
        </div>

        {databaseDetails && databaseDetails.find((item) => item.label == "Database")?.value != "psychoeducation_database" && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSummary;
