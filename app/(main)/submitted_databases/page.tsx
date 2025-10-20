"use client";

import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import Cards from "@/components/ui/shadcn-io/Cards";
import SubmitNewDB from "@/components/ui/shadcn-io/SubmitNewDB";
import SubmitSummary from "@/components/ui/shadcn-io/submitSummary";
import { useState } from "react";
import { submittedAndFirstApprovedDatabasesTableColumn } from "@/definitions/DataTableColumnsDefinitions";
import { Button } from "@/components/ui/button";
import { useParentContext } from "@/contexts/ParentContext";
import { Check, XCircle } from "lucide-react";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationDialogue,
    axiosInstance,
  } = useParentContext();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [reqForConfirmationModel, setReqForConfirmationModel] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [openSubmitNewDatabase, setOpenSubmitNewDatabase] =
    useState<boolean>(false);

  const [
    OpenSubmittedDatabaseSummaryModel,
    setOpenSubmittedDatabaseSummaryModel,
  ] = useState<boolean>(false);

  const approveDatabase = () => {
    axiosInstance
      .post(`/db_management/change_db_status/${idFeildForEditStateSetter}`, {
        newStatus: "firstApproved",
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const rejectDatabase = () => {
    axiosInstance
      .post(`/db_management/change_db_status/${idFeildForEditStateSetter}`, {
        newStatus: "firstRejected",
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <>
      <Navbar14 />
      <SubHeader
        pageTitle={"Submitted Database"}
        children={
          <div className="flex flex-row items-center gap-2">
            <Button
              variant={"outline"}
              onClick={() => setOpenSubmitNewDatabase(!openSubmitNewDatabase)}
            >
              Submitt New
            </Button>
            {/* <Button
              variant={"outline"}
              onClick={() =>
                axiosInstance
                  .get("/test/16/3/1/2025-10-01/2025-11-01")
                  .then((response: any) => console.log(response))
                  .catch((error: any) => {
                    console.log(error.response);
                    reqForToastAndSetMessage(error.response);
                  })
              }
            >
              Generate
            </Button> */}
            {/* <Button onClick={() => setOpenSubmittedDatabaseSummaryModel(true)}>
              open sum
            </Button> */}
          </div>
        }
      ></SubHeader>
      <Cards />

      <DataTableDemo
        columns={submittedAndFirstApprovedDatabasesTableColumn}
        indexUrl="/db_management/submitted_databases"
        deleteUrl="/db_management/deleted_submitted_databases"
        searchableColumn="name"
        idFeildForShowStateSetter={setIdFeildForEditStateSetter}
        idFeildForEditStateSetter={setIdFeildForEditStateSetter}
        showModelOpenerStateSetter={setOpenSubmittedDatabaseSummaryModel}
        injectedElement={
          <div className="flex flex-row items-center gap-1">
            <Button
              title="Approve"
              className="text-green-400"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationDialogue(
                  "Are You Absolutely Sure ?",
                  "",
                  () => approveDatabase()
                )
              }
            >
              <Check />
            </Button>
            <Button
              title="Reject"
              className="text-red-500"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationDialogue(
                  "Are You Absolutely Sure ?",
                  "",
                  () => rejectDatabase
                )
              }
            >
              <XCircle />
            </Button>
          </div>
        }
      ></DataTableDemo>

      {openSubmitNewDatabase && (
        <SubmitNewDB
          open={openSubmitNewDatabase}
          onOpenChange={setOpenSubmitNewDatabase}
        />
      )}

      {OpenSubmittedDatabaseSummaryModel && (
        <SubmitSummary
          open={OpenSubmittedDatabaseSummaryModel}
          onOpenChange={setOpenSubmittedDatabaseSummaryModel}
          databaseId={idFeildForEditStateSetter as unknown as string}
        />
      )}
    </>
  );
};

export default SubmittedDatabasesPage;
