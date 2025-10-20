"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import CreateCD from "@/components/ui/shadcn-io/CreateCD";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CommunityDialogDatabasePage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage } = useParentContext();
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [
    reqForCommunityDialogueCreationForm,
    setReqForCommunityDialogueCreationForm,
  ] = useState<boolean>(false);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const openCommunityDialogueProfile = (id: number) => {
    router.push(
      `community_dialogues/community_dialogue_profile/${id}`
    );
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openCommunityDialogueProfile(idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Community Dialogues"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button
              onClick={() =>
                setReqForCommunityDialogueCreationForm(
                  !reqForCommunityDialogueCreationForm
                )
              }
            >
              Create New Community Dialogue
            </Button>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
          indexUrl="/community_dialogue_db/community_dialogues"
          deleteUrl="community_dialogue_db/delete_beneficiaries"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={() => {}}
        ></DataTableDemo>

        {reqForCommunityDialogueCreationForm && (
          <CreateCD
            open={reqForCommunityDialogueCreationForm}
            onOpenChange={setReqForCommunityDialogueCreationForm}
          ></CreateCD>
        )}
      </div>
    </>
  );
};

export default CommunityDialogDatabasePage;
