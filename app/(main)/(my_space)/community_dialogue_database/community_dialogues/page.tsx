"use client";

import { Can } from "@/components/Can";
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

  const [
    reqForCommunityDialogueEditionForm,
    setReqForCommunityDialogueEditionForm,
  ] = useState<boolean>(false);

  const [reqForCommunityDialogueShowForm, setReqForCommunityDialogueShowForm] =
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
          {
            <Can permission="Dialogue.create">
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
            </Can>
          }
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
          indexUrl="/community_dialogue_db/community_dialogues"
          deleteUrl="community_dialogue_db/delete_beneficiaries"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForCommunityDialogueEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={() => {}}
          editBtnPermission="Dialogue.edit"
          deleteBtnPermission="Dialogue.delete"
        ></DataTableDemo>

        {reqForCommunityDialogueCreationForm && (
          <CreateCD
            open={reqForCommunityDialogueCreationForm}
            onOpenChange={setReqForCommunityDialogueCreationForm}
            mode="create"
          ></CreateCD>
        )}
        {reqForCommunityDialogueEditionForm && (
          <CreateCD
            open={reqForCommunityDialogueEditionForm}
            onOpenChange={setReqForCommunityDialogueEditionForm}
            mode="update"
            dialogueId={idFeildForEditStateSetter as unknown as number}
          ></CreateCD>
        )}
        {reqForCommunityDialogueShowForm && (
          <CreateCD
            open={reqForCommunityDialogueShowForm}
            onOpenChange={setReqForCommunityDialogueShowForm}
            mode="show"
            dialogueId={idFeildForShowStateSetter as unknown as number}
          ></CreateCD>
        )}
      </div>
    </>
  );
};

export default CommunityDialogDatabasePage;
