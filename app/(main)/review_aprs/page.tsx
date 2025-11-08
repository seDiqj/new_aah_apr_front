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
import { ClipboardCheck, Eye, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SubmittedDatabasesPage = () => {
  const {
    axiosInstance,
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc
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

  const markAprAsReviewed = () => {
    axiosInstance.post(`/apr_management/mark_apr_as_reviewed/${idFeildForEditStateSetter}`)
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message));
  }

  const rejectApr = () => {
    axiosInstance.post(`/apr_management/reject_in_review_stage/${idFeildForEditStateSetter}`)
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
  }

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Review Apr's"}></SubHeader>
      <Cards/>

      <DataTableDemo
        columns={submittedAndFirstApprovedDatabasesTableColumn}
        indexUrl="/db_management/first_approved_and_second_rejected_databases"
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
              onClick={previewApr}
            >
              <Eye />
            </Button>
            <Button
              title="Mark as reviewed"
              className="text-blue-600"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(
                  "Are you compleatly sure ?",
                  "This action will change the selected apr status as Reviewed !",
                  markAprAsReviewed
                )
              }
            >
              <ClipboardCheck />
              <Button
              title="Reject"
              className="text-red-500"
              variant={"outline"}
              onClick={() =>
              reqForConfirmationModelFunc(
                "Are you compleatly sure ?",
                "This action will mark the selected APR as rejected and notify the user who approved it at the first stage.",
                rejectApr
              )
              }
            >
              <XCircle />
            </Button>
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
