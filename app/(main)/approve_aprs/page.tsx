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
import { Eye, ShieldCheck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ApproveAprMessage,
  RejectAprMessage,
} from "@/constants/ConfirmationModelsTexts";
import {
  ApprovedAprsFiltersList,
  ApprovedAprsFilterUrl,
} from "@/constants/FiltersList";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    axiosInstance,
    handleReload,
  } = useParentContext();

  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [
    OpenSubmittedDatabaseSummaryModel,
    setOpenSubmittedDatabaseSummaryModel,
  ] = useState<boolean>(false);

  const approveApr = () => {
    if (!idFeildForEditStateSetter)
      reqForToastAndSetMessage("Please select a valid apr.");
    axiosInstance
      .post(`/apr_management/approve_apr/${idFeildForEditStateSetter}`, {
        newStatus: "secondApproved",
      })
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const rejectApr = () => {
    if (!idFeildForEditStateSetter)
      reqForToastAndSetMessage("Please select a valid apr.");
    axiosInstance
      .post(`/apr_management/approve_apr/${idFeildForEditStateSetter}`, {
        newStatus: "fourthRejected",
      })
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const previewApr = () => {
    router.push(`/test/${idFeildForEditStateSetter}`);
  };

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Approve Apr's"}></SubHeader>
      <Cards />

      <DataTableDemo
        columns={submittedAndFirstApprovedDatabasesTableColumn}
        indexUrl="/apr_management/reviewed_aprs"
        searchableColumn="name"
        idFeildForShowStateSetter={setIdFeildForEditStateSetter}
        idFeildForEditStateSetter={setIdFeildForEditStateSetter}
        showModelOpenerStateSetter={setOpenSubmittedDatabaseSummaryModel}
        injectedElement={
          <div className="flex flex-row items-center gap-1">
            <Button
              title="Approve Apr"
              className="text-blue-600"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(ApproveAprMessage, approveApr)
              }
            >
              <ShieldCheck />
            </Button>
            <Button
              title="Reject"
              className="text-red-500"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationModelFunc(RejectAprMessage, rejectApr)
              }
            >
              <XCircle />
            </Button>
            <Button
              title="Review Apr"
              className="text-blue-600"
              variant={"outline"}
              onClick={previewApr}
            >
              <Eye />
            </Button>
          </div>
        }
        filterUrl={ApprovedAprsFilterUrl}
        filtersList={ApprovedAprsFiltersList}
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
