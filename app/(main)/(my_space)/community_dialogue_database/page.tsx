"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import MainDatabaseBeneficiaryForm from "@/components/global/MainDatabaseBeneficiaryCreationForm";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BeneficiaryCreateCD from "@/components/global/BeneficiaryCreateCD";
import { Plus } from "lucide-react";
import CommunityDialogueSelector from "@/components/global/CommunityDialogSelector";
import BeneficiaryUpdateCD from "@/components/global/BeneficiaryUpdateFormCd";

const CommunityDialogDatabasePage = () => {
  const { reqForToastAndSetMessage } = useParentContext();
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForBeneficiaryCreationForm, setReqForBeneficiaryCreationForm] =
    useState<boolean>(false);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const [reqForCommunityDialogueSelector, setReqForCommunityDialogueSelector] =
    useState<boolean>(false);

  const [selectedRowsIds, setSelectedRows] = useState<{}>({});

  const openBeneficiaryProfile = (value: boolean, id: number) => {
    router.push(`/community_dialogue_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openBeneficiaryProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  useEffect(() => console.log(selectedRowsIds), [selectedRowsIds]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiaries"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button
              onClick={() =>
                router.push("/community_dialogue_database/community_dialogues")
              }
            >
              Community Dialogues
            </Button>
            <Button
              onClick={() =>
                setReqForBeneficiaryCreationForm(!reqForBeneficiaryCreationForm)
              }
            >
              Create New Benficiary
            </Button>
          </div>
        </SubHeader>
        <DataTableDemo
          columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
          indexUrl="/community_dialogue_db/beneficiaries"
          deleteUrl="community_dialogue_db/delete_beneficiaries"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          selectedRowsIdsStateSetter={setSelectedRows}
          showModelOpenerStateSetter={() => {}}
          injectedElement={
            <div className="flex flex-row items-center justify-end gap-1">
              <Button
                onClick={() =>
                  setReqForCommunityDialogueSelector(
                    !reqForCommunityDialogueSelector
                  )
                }
                title="Add Community Dialogue"
                variant={"outline"}
              >
                <Plus></Plus>
              </Button>
            </div>
          }
        ></DataTableDemo>

        {reqForBeneficiaryCreationForm && (
          <BeneficiaryCreateCD
            open={reqForBeneficiaryCreationForm}
            onOpenChange={setReqForBeneficiaryCreationForm}
          ></BeneficiaryCreateCD>
        )}

        {reqForBeneficiaryEditionForm && idFeildForEditStateSetter && (
          <BeneficiaryUpdateCD
            open={reqForBeneficiaryEditionForm}
            onOpenChange={setReqForBeneficiaryEditionForm}
            beneficiaryId={idFeildForEditStateSetter}
          ></BeneficiaryUpdateCD>
        )}

        {reqForCommunityDialogueSelector && (
          <CommunityDialogueSelector
            open={reqForCommunityDialogueSelector}
            onOpenChange={setReqForCommunityDialogueSelector}
            ids={Object.keys(selectedRowsIds)}
          ></CommunityDialogueSelector>
        )}
      </div>
    </>
  );
};

export default CommunityDialogDatabasePage;
