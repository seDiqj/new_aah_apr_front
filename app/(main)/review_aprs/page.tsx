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
import {
  RejectSecondApprovedDatabaseMessage,
  ReviewAprMessage,
} from "@/constants/ConfirmationModelsTexts";
import { ReviewAprFiltersList } from "@/constants/FiltersList";

const SubmittedDatabasesPage = () => {
  const {
    axiosInstance,
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    handleReload,
    handleAprReload,
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
    router.push(`/apr_preview/${idFeildForEditStateSetter}`);
  };

  const markAprAsReviewed = () => {
    axiosInstance
      .post(`/apr_management/mark_apr_as_reviewed/${idFeildForEditStateSetter}`)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleAprReload();
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const rejectApr = () => {
    axiosInstance
      .post(
        `/apr_management/reject_in_review_stage/${idFeildForEditStateSetter}`
      )
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleAprReload();
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Review Apr's"}></SubHeader>
      <Cards />

      <DataTableDemo
        columns={submittedAndFirstApprovedDatabasesTableColumn}
        indexUrl="/apr_management/generated_aprs"
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
                reqForConfirmationModelFunc(ReviewAprMessage, markAprAsReviewed)
              }
            >
              <ClipboardCheck />
            </Button>
            <Button
              title="Reject"
              className="text-red-500"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(
                  RejectSecondApprovedDatabaseMessage,
                  rejectApr
                )
              }
            >
              <XCircle />
            </Button>
          </div>
        }
        filtersList={ReviewAprFiltersList}
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
