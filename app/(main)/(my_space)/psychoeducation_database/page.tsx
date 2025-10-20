"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreatePsychoeducation from "@/components/global/CreatePsychoeducation";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns, psychoeducationTableListColumn } from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PsychoeducationDatabasePage = () => {
  const { reqForToastAndSetMessage } = useParentContext();
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [
    reqForPsychoeducationCreationForm,
    setReqForPsychoeducationCreationForm,
  ] = useState<boolean>(false);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const openPsychoeducatoinProfile = (value: boolean, id: number) => {
    router.push(`main_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openPsychoeducatoinProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Psychoeducations"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button
              onClick={() =>
                setReqForPsychoeducationCreationForm(
                  !reqForPsychoeducationCreationForm
                )
              }
            >
              Create New Psychoeducation
            </Button>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={psychoeducationTableListColumn}
          indexUrl="/psychoeducation_db/psychoeducations"
          deleteUrl="/psychoeducation_db/delete_psychoeducations"
          searchableColumn="name"
          
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={() => {}}
        ></DataTableDemo>

        {reqForPsychoeducationCreationForm && (
          <CreatePsychoeducation
            open={reqForPsychoeducationCreationForm}
            onOpenChange={setReqForPsychoeducationCreationForm}
          ></CreatePsychoeducation>
        )}
      </div>
    </>
  );
};

export default PsychoeducationDatabasePage;
