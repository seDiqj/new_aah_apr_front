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
import KitDatabaseBeneficiaryForm from "@/components/global/KitDatabaseBeneficiaryForm";
import KitDatabaseBeneficiaryUpdateForm from "@/components/global/KitDatabaseBeneficiaryUpdateForm";
import { Can } from "@/components/Can";

const MainDatabasePage = () => {
  const { reqForToastAndSetMessage } = useParentContext();
  const router = useRouter();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForBeneficiaryCreationForm, setReqForBeneficiaryCreationForm] =
    useState<boolean>(false);

  const [reqForBeneficiaryUpdateForm, setReqForBeneficiaryUpdateForm] =
    useState<boolean>(false);

  const openBeneficiaryProfile = (value: boolean, id: number) => {
    router.push(`kit_database/beneficiary_profile/${id}`);
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
            <Button onClick={() => router.push("/kit_database/programs")}>
              Programs
            </Button>
            <Can permission="Kit.create">
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
          indexUrl="/kit_db/beneficiaries"
          deleteUrl="kit_db/delete_beneficiaries"
          searchableColumn="name"
          deleteBtnPermission="Kit.delete"
          editBtnPermission="Kit.edit"
          viewPermission="Kit.view"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryUpdateForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={() => {}}
          filterUrl="/filter/kit_database/beneficiaries"
          filtersList={["projectCode", "indicator", "focalPoint", "province", "siteCode", "healthFacilitator", "dateOfRegistration",
            "age", "maritalStatus", "householdStatus", "baselineDate", "endlineDate"
          ]}
        ></DataTableDemo>

        {/* Create new beneficiary form */}
        {reqForBeneficiaryCreationForm && (
          <KitDatabaseBeneficiaryForm
            open={reqForBeneficiaryCreationForm}
            onOpenChange={setReqForBeneficiaryCreationForm}
            title={"Create New Beneficiary"}
          ></KitDatabaseBeneficiaryForm>
        )}

        {reqForBeneficiaryUpdateForm && idFeildForEditStateSetter != null && (
          <KitDatabaseBeneficiaryUpdateForm
            open={reqForBeneficiaryUpdateForm}
            onOpenChange={setReqForBeneficiaryUpdateForm}
            title={"Update Beneficiary Information"}
            beneficiaryId={idFeildForEditStateSetter as unknown as string}
          ></KitDatabaseBeneficiaryUpdateForm>
        )}
      </div>
    </>
  );
};

export default MainDatabasePage;
