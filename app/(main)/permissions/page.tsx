"use client"

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";
import { withPermission } from "@/lib/withPermission";

const PermissionsPage = () => {
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
        ></DataTableDemo>
      </div>
    </>
  );
};

export default withPermission(PermissionsPage, "List Role");
