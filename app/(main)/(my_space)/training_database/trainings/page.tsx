"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreateNewTrainingForm from "@/components/global/CreateNewTrainingForm";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import {
  trainingsListColumns,
} from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TrainingsPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForTrainingCreationForm, setReqForTrainingCreationForm] =
    useState<boolean>(false);

  const [reqForTrainingEditionForm, setReqForTrainingEditionForm] =
    useState<boolean>(false);

  const openTrainingProfilePage = (value: boolean, id: number) => {
    router.push(`/training_database/trainings/training_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openTrainingProfilePage(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Trainings"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button onClick={() => setOpen(!open)}>Create New Training</Button>
          </div>
        </SubHeader>

        <DataTableDemo
          columns={trainingsListColumns}
          indexUrl="/training_db/trainings"
          deleteUrl="training_db/delete_trainings"
          searchableColumn="name"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={setReqForTrainingEditionForm}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          showModelOpenerStateSetter={() => {}}
        ></DataTableDemo>

        {reqForTrainingCreationForm && (
          <CreateNewTrainingForm
            open={reqForTrainingCreationForm}
            onOpenChange={setReqForTrainingCreationForm}
            title={"Create New Training"}
            mode="create"
          ></CreateNewTrainingForm>
        )}
        {reqForTrainingEditionForm && (
          <CreateNewTrainingForm
            open={reqForTrainingEditionForm}
            onOpenChange={setReqForTrainingEditionForm}
            title={"Edit Training"}
            mode="edit"
            id={idFeildForEditStateSetter as unknown as number}
          ></CreateNewTrainingForm>
        )}
      </div>
    </>
  );
};

export default TrainingsPage;
