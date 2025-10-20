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
  // State for opening and closing the program form model.
  const [open, setOpen] = useState<boolean>(false);

  let [openEditForm, setOpenEditForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
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
            <Button onClick={() => setOpen(!open)}>Create New Program</Button>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseProgramColumns}
          indexUrl="/global/programs/main_database"
          deleteUrl="/global/delete_programs"
          searchableColumn="focalPoint"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setOpenEditForm}
        ></DataTableDemo>

        {/* Program create form */}
        <CreateNewProgramMain
          open={open}
          onOpenChange={setOpen}
          mode="create"
        ></CreateNewProgramMain>

        {/* Program edit form */}
        <CreateNewProgramMain
          open={openEditForm}
          onOpenChange={setOpenEditForm}
          mode="edit"
          programId={idFeildForEditStateSetter!}
        ></CreateNewProgramMain>
      </div>
    </>
  );
};

export default MainDatabaseProgramsPage;
