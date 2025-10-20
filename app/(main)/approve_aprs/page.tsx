"use client";

import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import Cards from "@/components/ui/shadcn-io/Cards";
import SubmitNewDB from "@/components/ui/shadcn-io/SubmitNewDB";
import SubmitSummary from "@/components/ui/shadcn-io/submitSummary";
import { useState } from "react";
import {
  permissionColumns,
  submittedAndFirstApprovedDatabasesTableColumn,
} from "@/definitions/DataTableColumnsDefinitions";
import { Button } from "@/components/ui/button";
import { useParentContext } from "@/contexts/ParentContext";
import {
  Check,
  Eye,
  FileChartColumn,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SubmittedDatabasesPage = () => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationDialogue,
    axiosInstance,
  } = useParentContext();

  const router = useRouter();

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

  const approveApr = () => {
    if (!idFeildForEditStateSetter)
      reqForToastAndSetMessage("Please select a valid apr.");
    axiosInstance.post(
      `/apr_management/approve_apr/${idFeildForEditStateSetter}`
    );
  };

  const previewApr = () => {
    router.push(`/preview_apr/${idFeildForEditStateSetter}`);
  };

  return (
    <>
      <Navbar14 />
      <SubHeader pageTitle={"Approve Apr's"}></SubHeader>
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
              title="Approve Apr"
              className="text-blue-600"
              variant={"outline"}
              onClick={() =>
                reqForConfirmationDialogue(
                  "Are You Absolutely Sure ?",
                  "",
                  () => approveApr()
                )
              }
            >
              <ShieldCheck />
            </Button>
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
