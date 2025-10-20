"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreateNewBeneficiaryTraining from "@/components/global/CreateNewBeneficiaryTraining";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import TrainingSelectorDialog from "@/components/global/TrainingSelectorDialog";
import { Button } from "@/components/ui/button";

import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { trainingDatabaseBeneificiaryListColumn } from "@/definitions/DataTableColumnsDefinitions";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TrainingDatabasePage = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [openTrainingSelectorDialog, setOpenTrainingSelectorDialog] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForBeneficiaryEditionForm, setReqForBeneficiaryEditionForm] =
    useState<boolean>(false);

  const [selectedRowsIds, setSelectedRows] = useState<{}>({});

  const openTrainingProfilePage = (value: boolean, id: number) => {
    router.push(`/training_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openTrainingProfilePage(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  useEffect(() => console.log(selectedRowsIds), [selectedRowsIds]);

  return (
    <div className="w-full h-full p-2">
      <Navbar14 />
      <div className="flex flex-row items-center justify-start my-2">
        <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
      </div>
      <SubHeader pageTitle={"Benficiaries"}>
        <div className="flex flex-row items-center justify-around gap-2">
          <Button onClick={() => router.push("/training_database/trainings")}>
            Trainings
          </Button>
          <Button onClick={() => setOpen(!open)}>Create New Beneficiary</Button>
        </div>
      </SubHeader>
      <DataTableDemo
        columns={trainingDatabaseBeneificiaryListColumn}
        indexUrl="/training_db/beneficiaries"
        deleteUrl="training_db/delete_beneficiaries"
        searchableColumn="name"
        idFeildForEditStateSetter={setIdFeildForEditStateSetter}
        editModelOpenerStateSetter={setReqForBeneficiaryEditionForm}
        idFeildForShowStateSetter={setIdFeildForShowStateSetter}
        showModelOpenerStateSetter={() => {}}
        selectedRowsIdsStateSetter={setSelectedRows}
        injectedElement={
          <div className="flex flex-row items-center gap-1">
            <Button
              onClick={() =>
                setOpenTrainingSelectorDialog(!openTrainingSelectorDialog)
              }
              variant={"outline"}
              title="Add Training"
            >
              <Plus></Plus>
            </Button>
          </div>
        }
      ></DataTableDemo>

      {open && (
        <CreateNewBeneficiaryTraining
          open={open}
          onOpenChange={setOpen}
          title={"Create New Beneficiary"}
        ></CreateNewBeneficiaryTraining>
      )}

      {openTrainingSelectorDialog && (
        <TrainingSelectorDialog
          open={openTrainingSelectorDialog}
          onOpenChange={setOpenTrainingSelectorDialog}
          ids={Object.keys(selectedRowsIds)}
        ></TrainingSelectorDialog>
      )}
    </div>
  );
};

export default TrainingDatabasePage;
