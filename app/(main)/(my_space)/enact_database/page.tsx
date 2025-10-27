"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import MainDatabaseBeneficiaryForm from "@/components/global/MainDatabaseBeneficiaryCreationForm";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { enactTableColumn, mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssessmentForm from "@/components/global/CreateNewAssessmentForm";
import { useRouter } from "next/navigation";
import Preloader from "@/components/global/Preloader";

const EnactDatabasePage = () => {
  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForAssessmentCreationForm, setReqForAssessmentCreationForm] =
    useState<boolean>(false);

  const [reqForAssessmentUpdateForm, setReqForAssessmentUpdateForm] =
    useState<boolean>(false);

  const [reqForAssessmentShowForm, setReqForAssessmentShowForm] =
    useState<boolean>(false);

  const enactTabsList = [
    "ENACT: FOUNDATIONAL HELPING SKILLS-ADULT",
    "PROBLEUM MANAGEMENT PLUS (COMINED ENACT & PM+)",
    "PROBLEUM MANAGEMENT PLUS (PM+) COMPETENCIES [LEGACY VERSION]",
    "SELF HELP PLUS",
    "BEHAVIORAL ACTIVATION COMPETENCIES",
  ];

  const openAssessmentProfile = (value: boolean, id: number) => {
    router.push(`enact_database/enact_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openAssessmentProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);


    const [isLoading, setIsLoading] = useState<boolean>(true);


  return (
    <>
      <div className="max-w-[1020px] h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Enact Assessments"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button
              onClick={() =>
                setReqForAssessmentCreationForm(!reqForAssessmentCreationForm)
              }
            >
              Create New Assessment
            </Button>
          </div>
        </SubHeader>

        <div className="w-full ">
          <Tabs
            defaultValue="ENACT: FOUNDATIONAL HELPING SKILLS-ADULT"
            className="h-full max-w-full w-full overflow-auto"
          >
            {/* List of tabs */}
            <div className="overflow-x-auto">
              <TabsList className="max-w-full overflow-auto">
                <TabsTrigger value="ENACT: FOUNDATIONAL HELPING SKILLS-ADULT">
                  ENACT: FOUNDATIONAL HELPING SKILLS-ADULT
                </TabsTrigger>
                {enactTabsList.map((tab) => (
                  <TabsTrigger disabled value="tab">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Project */}
            <TabsContent
              value="ENACT: FOUNDATIONAL HELPING SKILLS-ADULT"
              className="h-full"
            >
              <DataTableDemo
                columns={enactTableColumn}
                indexUrl="/enact_database/"
                deleteUrl="enact_database/delete_enacts"
                searchableColumn="name"
                idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                editModelOpenerStateSetter={setReqForAssessmentUpdateForm}
                idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                showModelOpenerStateSetter={setReqForAssessmentShowForm}
                loadingStateSetter={setIsLoading}
              ></DataTableDemo>
            </TabsContent>
          </Tabs>

          {reqForAssessmentCreationForm && (
            <AssessmentForm
              open={reqForAssessmentCreationForm}
              onOpenChange={setReqForAssessmentCreationForm}
              mode={"create"}
            ></AssessmentForm>
          )}
          {reqForAssessmentUpdateForm && idFeildForEditStateSetter && (
            <AssessmentForm
              open={reqForAssessmentUpdateForm}
              onOpenChange={setReqForAssessmentUpdateForm}
              mode={"edit"}
              projectId={idFeildForEditStateSetter as unknown as number}
            ></AssessmentForm>
          )}

          {isLoading && <Preloader reqForLoading={isLoading} />}

        </div>
      </div>
    </>
  );
};

export default EnactDatabasePage;
