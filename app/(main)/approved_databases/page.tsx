"use client";

import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import Cards from "@/components/ui/shadcn-io/Cards";
import SubmitSummary from "@/components/ui/shadcn-io/submitSummary";
import { useState } from "react";
import { submittedAndFirstApprovedDatabasesTableColumn } from "@/definitions/DataTableColumnsDefinitions";
import { Button } from "@/components/ui/button";
import { useParentContext } from "@/contexts/ParentContext";
import { FileChartColumn, XCircle } from "lucide-react";
import {
  GenerateAprMessage,
  RejectFirstApprovedDatabaseMessage,
} from "@/constants/ConfirmationModelsTexts";
import { ApprovedDatabasesFiltersList } from "@/constants/FiltersList";
import { AxiosError, AxiosResponse } from "axios";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    axiosInstance,
    handleReload,
    handleAprReload,
  } = useParentContext();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [
    OpenSubmittedDatabaseSummaryModel,
    setOpenSubmittedDatabaseSummaryModel,
  ] = useState<boolean>(false);

  const generateApr = () => {
    axiosInstance
      .post(`/apr_management/generate_apr/${idFeildForEditStateSetter}`)
      .then((response: any) => {
        {
          reqForToastAndSetMessage(response.data.message);
          handleAprReload();
          handleReload();
        }
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const rejectDatabase = () => {
    axiosInstance
      .post(`/db_management/change_db_status/${idFeildForEditStateSetter}`, {
        newStatus: "secondRejected",
      })
      .then((response: AxiosResponse<any, any, any>) => {
        reqForToastAndSetMessage(response.data.message);
        handleAprReload();
        handleReload();
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message)
      );
  };

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Approved Databases"}></SubHeader>
      <Cards />

      <DataTableDemo
        columns={submittedAndFirstApprovedDatabasesTableColumn}
        indexUrl="/db_management/first_approved_databases"
        deleteUrl="/db_management/deleted_first_approved_databases"
        searchableColumn="name"
        idFeildForShowStateSetter={setIdFeildForEditStateSetter}
        idFeildForEditStateSetter={setIdFeildForEditStateSetter}
        showModelOpenerStateSetter={setOpenSubmittedDatabaseSummaryModel}
        injectedElement={
          <div className="flex flex-row items-center gap-1">
            <Button
              title="Generate Apr"
              className="text-blue-600"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(GenerateAprMessage, generateApr)
              }
            >
              <FileChartColumn />
            </Button>
            <Button
              title="Reject"
              className="text-red-500"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(
                  RejectFirstApprovedDatabaseMessage,
                  rejectDatabase
                )
              }
            >
              <XCircle />
            </Button>
          </div>
        }
        filtersList={ApprovedDatabasesFiltersList}
      ></DataTableDemo>

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
