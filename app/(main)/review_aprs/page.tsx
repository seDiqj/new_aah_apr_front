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
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const SubmittedDatabasesPage = () => {
  const {
    reqForConfirmationDialogue,
  } = useParentContext();

  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [
    OpenSubmittedDatabaseSummaryModel,
    setOpenSubmittedDatabaseSummaryModel,
  ] = useState<boolean>(false);

  const previewApr = () => {
    router.push(`/test/${idFeildForEditStateSetter}`);
  };

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Review Apr's"}></SubHeader>
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
              title="Review Apr"
              className="text-blue-600"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationDialogue(
                  "Are You Absolutely Sure ?",
                  "",
                  () => previewApr()
                )
              }
            >
              <Eye />
            </Button>
          </div>
        }
        filterUrl="/filter/reviewed_aprs"
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
