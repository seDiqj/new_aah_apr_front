"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreateNewProgramMain from "@/components/global/CreateNewProgramMain";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import {
  mainDatabaseAndKitDatabaseProgramColumns,
} from "@/definitions/DataTableColumnsDefinitions";
import { useState } from "react";

const MainDatabaseProgramsPage = () => {
  const [reqForProgramCreationForm, setReqForProgramCreationForm] = useState<boolean>(false);
  const [reqForProgramEditionForm, setReqForProgramEditionForm] = useState<boolean>(false);
  const [reqForProgramShowForm, setReqForProgramShowForm] = useState<boolean>(false);

  const [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Main Database Programs"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button onClick={() => setReqForProgramCreationForm(!reqForProgramCreationForm)}>Create New Program</Button>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseProgramColumns}
          indexUrl="/global/programs/main_database"
          deleteUrl="/global/delete_programs"
          searchableColumn="focalPoint"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForProgramEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={setReqForProgramShowForm}
          filterUrl="/filter/main_database/program"
          filtersList={["projectCode", "focalPoint", "province", "district", "village", "siteCode", "healthFacilityName", "interventionModality"]}
        ></DataTableDemo>


        {/* Program show form */}
        {reqForProgramCreationForm && (
            <CreateNewProgramMain
            open={reqForProgramCreationForm}
            onOpenChange={setReqForProgramCreationForm}
            mode="create"
          ></CreateNewProgramMain>
        )}        

        {/* Program edit form */}
        {reqForProgramEditionForm && (
            <CreateNewProgramMain
            open={reqForProgramEditionForm}
            onOpenChange={setReqForProgramEditionForm}
            mode="edit"
            programId={idFeildForEditStateSetter!}
          ></CreateNewProgramMain>
        )}

        {/* Program show form */}
        {reqForProgramShowForm && (
            <CreateNewProgramMain
            open={reqForProgramShowForm}
            onOpenChange={setReqForProgramShowForm}
            mode="show"
            programId={idFeildForShowStateSetter!}
          ></CreateNewProgramMain>
        )}
      </div>
    </>
  );
};

export default MainDatabaseProgramsPage;
