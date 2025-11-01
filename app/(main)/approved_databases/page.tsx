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
import { FileChartColumn } from "lucide-react";
import { useRouter } from "next/navigation";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationDialogue,
    axiosInstance,
    aprStats
  } = useParentContext();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [
    OpenSubmittedDatabaseSummaryModel,
    setOpenSubmittedDatabaseSummaryModel,
  ] = useState<boolean>(false);

  const approveDatabase = () => {
    axiosInstance
      .post(`/apr_management/generate_apr/${idFeildForEditStateSetter}`)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };


  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Approved Databases"}></SubHeader>
      <Cards/>

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
                reqForConfirmationDialogue(
                  "Are You Absolutely Sure ?",
                  "",
                  () => approveDatabase()
                )
              }
            >
              <FileChartColumn />
            </Button>
            
          </div>
        }
        filterUrl="/filter/approved_databases"
        filtersList={["projectCode", "province", "database", "fromDate", "toDate"]}
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
