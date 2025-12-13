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
import {
  SubmittedDatabasesFiltersList,
  SubmittedDatabasesFilterUrl,
} from "@/constants/FiltersList";
import {
  ApproveDatabaseMessage,
  RejectDatabaseMessage,
} from "@/constants/ConfirmationModelsTexts";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    axiosInstance,
    handleReload
  } = useParentContext();

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
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const rejectDatabase = () => {
    axiosInstance
      .post(`/db_management/change_db_status/${idFeildForEditStateSetter}`, {
        newStatus: "firstRejected",
      })
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
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
              onClick={() => setOpenSubmitNewDatabase(!openSubmitNewDatabase)}
            >
              Submitt New
            </Button>
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
                reqForConfirmationModelFunc(
                  ApproveDatabaseMessage,
                  approveDatabase
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
                reqForConfirmationModelFunc(
                  RejectDatabaseMessage,
                  rejectDatabase
                )
              }
            >
              <XCircle />
            </Button>
          </div>
        }
        filterUrl={SubmittedDatabasesFilterUrl}
        filtersList={SubmittedDatabasesFiltersList}
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
