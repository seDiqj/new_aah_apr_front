"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useState } from "react";
import { userColumns } from "@/definitions/DataTableColumnsDefinitions";
import { Can } from "@/components/Can";
import { withPermission } from "@/lib/withPermission";
import ProfileModal from "@/components/global/UserFormTest";
import { useParentContext } from "@/contexts/ParentContext";
import { UserFiltersList, UserFilterUrl } from "@/lib/FiltersList";

const UsersPage = () => {

  const {handleReload} = useParentContext();

  let [reqForUserCreationForm, setReqForUserCreationForm] =
    useState<boolean>(false);

  let [reqForUserShowForm, setReqForUserShowForm] = useState<boolean>(false);

  let [reqForUserUpdateForm, setReqForUserUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Users"}>
          <Can permission={"Create User"}>
            <Button onClick={() => setReqForUserCreationForm(true)}>
              Create New User
            </Button>
          </Can>
        </SubHeader>
        <DataTableDemo
          columns={userColumns}
          indexUrl="user_mng/users"
          deleteUrl="user_mng/delete_users"
          searchableColumn="email"
          deleteBtnPermission="Delete User"
          editBtnPermission="Edit User"
          viewPermission="View User"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForUserUpdateForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={setReqForUserShowForm}
          filterUrl={UserFilterUrl}
          filtersList={UserFiltersList}
        ></DataTableDemo>
      </div>

      {reqForUserCreationForm && (
        <ProfileModal
          open={reqForUserCreationForm}
          onOpenChange={setReqForUserCreationForm}
          mode="create"
          reloader={handleReload}
          />
          
      )}
      {reqForUserUpdateForm && (
        <ProfileModal
          open={reqForUserUpdateForm}
          onOpenChange={setReqForUserUpdateForm}
          mode="edit"
          userId={Number(idFeildForEditStateSetter)}
          reloader={handleReload}
        />
      )}
      {reqForUserShowForm && (
        <ProfileModal
          open={reqForUserShowForm}
          onOpenChange={setReqForUserShowForm}
          mode="show"
          userId={Number(idFeildForShowStateSetter)}
        />
      )}
    </>
  );
};

export default withPermission(UsersPage, "List User");
