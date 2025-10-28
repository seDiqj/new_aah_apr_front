"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import Preloader from "@/components/global/Preloader";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainDatabasePage = () => {
  const { reqForToastAndSetMessage } = useParentContext();
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForBeneficiaryCreationForm, setReqForBeneficiaryCreationForm] =
    useState<boolean>(false);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const [selectedRowsIds, setSelectedRows] = useState<{}>({});

  const openBeneficiaryProfile = (value: boolean, id: number) => {
    router.push(`referral_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openBeneficiaryProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiaries"}></SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
          indexUrl="/referral_db/beneficiaries"
          deleteUrl="/referral_db/delete_beneficiaries"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          selectedRowsIdsStateSetter={setSelectedRows}
          showModelOpenerStateSetter={() => {}}
          loadingStateSetter={setIsLoading}
          filterUrl="/filter/main_database/beneficiaries"
          filtersList={["projectCode", "indicator", "focalPoint", "province", "siteCode", "healthFacilitator", "dateOfRegistration",
          "age", "maritalStatus", "householdStatus"]}
        ></DataTableDemo>

        {isLoading && <Preloader reqForLoading={isLoading} />}
      </div>
    </>
  );
};

export default MainDatabasePage;
