"use client"

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useState } from "react";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";

const PermissionsPage = () => {
  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
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
        <SubHeader pageTitle={"Permissions"}></SubHeader>
        <DataTableDemo
          columns={permissionColumns}
          indexUrl="user_mng/permissions"
          deleteUrl="user_mng/delete_permissions"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={() => {
            setReqForPermissionUpdateForm(true);
          }}
        ></DataTableDemo>
      </div>
    </>
  );
};

export default PermissionsPage;
