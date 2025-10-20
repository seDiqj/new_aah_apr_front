"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import MainDatabaseBeneficiaryForm from "@/components/global/MainDatabaseBeneficiaryCreationForm";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { Can } from "@/components/Can";
import KitDatabaseBeneficiaryUpdateForm from "@/components/global/KitDatabaseBeneficiaryUpdateForm";

const MainDatabasePage = () => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [selectedRowsIds, setSelectedRows] = useState<{}>({});

  const [reqForBeneficiaryCreationForm, setReqForBeneficiaryCreationForm] =
    useState<boolean>(false);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const referrBeneficiaies = () => {
    if (Object.values(selectedRowsIds).length == 0) return;
    axiosInstance
      .post("/referral_db/beneficiaries/referrBeneficiaries", {
        ids: Object.keys(selectedRowsIds),
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const openBeneficiaryProfile = (value: boolean, id: number) => {
    router.push(`main_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openBeneficiaryProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiaries"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button onClick={() => router.push("/main_database/programs")}>
              Programs
            </Button>
            <Can permission="Maindatabase.create">
              <Button
                onClick={() =>
                  setReqForBeneficiaryCreationForm(
                    !reqForBeneficiaryCreationForm
                  )
                }
              >
                Create New Benficiary
              </Button>
            </Can>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
          indexUrl="/main_db/beneficiaries"
          deleteUrl="main_db/delete_beneficiaries"
          searchableColumn="name"
          deleteBtnPermission="Maindatabase.delete"
          editBtnPermission="Maindatabase.edit"
          viewPermission="Maindatabase.view"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          selectedRowsIdsStateSetter={setSelectedRows}
          showModelOpenerStateSetter={() => {}}
          injectedElement={
            <div>
              <Button
                title="Send Beneficiary to referral"
                onClick={referrBeneficiaies}
                variant="outline"
              >
                <Share2 />
              </Button>
            </div>
          }
        ></DataTableDemo>
        {/* Beneficiary creation form */}
        {reqForBeneficiaryCreationForm && (
          <MainDatabaseBeneficiaryForm
            title={"Create new Beneficiary"}
            open={reqForBeneficiaryCreationForm}
            onOpenChange={setReqForBeneficiaryCreationForm}
          ></MainDatabaseBeneficiaryForm>
        )}
        {reqForBeneficiaryEditionForm && (
          <KitDatabaseBeneficiaryUpdateForm
            title={"Edit Beneficiary"}
            open={reqForBeneficiaryEditionForm}
            onOpenChange={setReqForBeneficiaryEditionForm}
            beneficiaryId={idFeildForEditStateSetter as unknown as string}
          ></KitDatabaseBeneficiaryUpdateForm>
        )}
      </div>
    </>
  );
};

export default MainDatabasePage;
