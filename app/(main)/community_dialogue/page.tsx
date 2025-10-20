"use client";

import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Button } from "@/components/ui/button";
import BeneficiaryCreateCD from "@/components/global/BeneficiaryCreateCD";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { permissionColumns } from "@/definitions/DataTableColumnsDefinitions";

const CommunityDialoguePage = () => {
  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const router = useRouter();
  return (
    <>
      <Navbar14 />
      <div className="mt-4 ml-6">
        <SubHeader pageTitle={"Beneficiaries"} />
      </div>

      {/* Add buttons here */}
      <div className="flex flex-row items-center justify-between ml-6 mt-4 mr-6">
        <div />
        <div className="flex flex-row items-center gap-2">
          <BeneficiaryCreateCD
            title={""}
            databaseDetails={[]}
            clickableDetails={[]}
          />
          <Button
            style={{ backgroundColor: "#2E31E0", color: "#fff" }}
            onClick={() => router.push("/community_dialogue/cd_list")}
          >
            Community Dialogue
          </Button>
          <Button
            style={{ backgroundColor: "#2E31E0", color: "#fff" }}
            onClick={() =>
              router.push("/community_dialogue/beneficiary_profile")
            }
          >
            Beneficiary Profile
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
    </>
  );
};

export default CommunityDialoguePage;
