"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreatePsychoeducation from "@/components/global/CreatePsychoeducation";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import {
  psychoeducationTableListColumn,
} from "@/definitions/DataTableColumnsDefinitions";
import { useState } from "react";

const PsychoeducationDatabasePage = () => {
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

  const [
    reqForPsychoeducationEditionForm,
    setReqForPsychoeducationEditionForm,
  ] = useState<boolean>(false);

  const [reqForPsychoeducationShowForm, setReqForPsychoeducationShowForm] =
    useState<boolean>(false);

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
          editModelOpenerStateSetter={setReqForPsychoeducationEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={setReqForPsychoeducationShowForm}
          editBtnPermission="Psychoeducation.edit"
          deleteBtnPermission="Psychoeducation.delete"
          filterUrl="filter/psychoeducation_db/psychoeducations"
          filtersList={[
            "indicator",
            "awarenessTopic",
            "awarenessDate"
          ]}
        ></DataTableDemo>

        {reqForPsychoeducationCreationForm && (
          <CreatePsychoeducation
            open={reqForPsychoeducationCreationForm}
            onOpenChange={setReqForPsychoeducationCreationForm}
            mode="create"
          ></CreatePsychoeducation>
        )}
        {reqForPsychoeducationEditionForm && idFeildForEditStateSetter && (
          <CreatePsychoeducation
            open={reqForPsychoeducationEditionForm}
            onOpenChange={setReqForPsychoeducationEditionForm}
            mode="edit"
            psychoeducationId={idFeildForEditStateSetter as unknown as string}
          ></CreatePsychoeducation>
        )}
        {reqForPsychoeducationShowForm && idFeildForShowStateSetter && (
          <CreatePsychoeducation
            open={reqForPsychoeducationShowForm}
            onOpenChange={setReqForPsychoeducationShowForm}
            mode="show"
            psychoeducationId={idFeildForShowStateSetter as unknown as string}
          ></CreatePsychoeducation>
        )}
      </div>
    </>
  );
};

export default PsychoeducationDatabasePage;
