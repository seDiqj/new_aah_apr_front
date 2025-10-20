"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- import router
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import CreateCD from "@/components/ui/shadcn-io/CreateCD";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Button } from "@/components/ui/button";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";

const CdListPage = () => {
  const [showCreateCD, setShowCreateCD] = useState(false);
  const router = useRouter(); // <-- router instance

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  return (
    <>
      <Navbar14 />

      <div className="mt-4 ml-6 flex items-center justify-between">
        <SubHeader pageTitle={"List of Community Dialogues"} />
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateCD(true)}>Create New CD</Button>
          {/* New button to navigate */}
          <Button
            onClick={() => router.push("/community_dialogue_profile")}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Open Community Dialogue Profile
          </Button>
        </div>
      </div>

      <DataTableDemo
        columns={permissionColumns}
        indexUrl="user_mng/permissions"
        deleteUrl="user_mng/delete_permissions"
        searchableColumn="name"
        idFeildForEditStateSetter={setIdFeildForEditStateSetter}
        editModelOpenerStateSetter={setReqForPermissionUpdateForm}
      ></DataTableDemo>

      {showCreateCD && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <CreateCD open={showCreateCD} setOpen={setShowCreateCD} />
            <Button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowCreateCD(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CdListPage;
