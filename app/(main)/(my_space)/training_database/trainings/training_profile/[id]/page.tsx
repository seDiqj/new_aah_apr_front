"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreateNewChapterForm from "@/components/global/CreateNewChapterForm";
import SubHeader from "@/components/global/SubHeader";
import TrainingEvaluationForm from "@/components/global/TrainingEvaluationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useParentContext } from "@/contexts/ParentContext";
import { TrainingProfileInterface } from "@/interfaces/Interfaces";
import { IsANullValue, IsIdFeild } from "@/constants/Constants";
import { TrainingDefault } from "@/constants/FormsDefaultValues";
import { ChapterForm, Evaluations, TrainingForm } from "@/types/Types";
import { use, useEffect, useState } from "react";
import ChromeTabs from "@/app/(main)/projects/Components/ChromeTab";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { trainingDatabaseBeneificiaryListColumn } from "@/definitions/DataTableColumnsDefinitions";
import { TrainingBeneficiariesFiltersList } from "@/constants/FiltersList";
import { useRouter } from "next/navigation";

const TrainingProfilePage: React.FC<TrainingProfileInterface> = (
  params: TrainingProfileInterface
) => {
  const { id } = use(params.params);

  const router = useRouter();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  let [open, setOpen] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<string>("trainingInfo");

  const [trainingInfo, setTrainingInfo] = useState<TrainingForm>(
    TrainingDefault()
  );

  const [chaptersData, setChaptersData] = useState<ChapterForm[]>([]);

  const [evaluationsData, setEvaluationsData] = useState<Evaluations>(null);

  const openBeneficiaryProfilePage = (value: boolean, id: number) => {
    router.push(`/training_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openBeneficiaryProfilePage(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  useEffect(() => {
    axiosInstance(`training_db/training/${id}`)
      .then((response: any) => {
        const { chapters, ...trainingAndEvaluationsData } = response.data.data;
        const { evaluations, ...trainingData } = trainingAndEvaluationsData;
        setTrainingInfo(trainingData);
        setChaptersData(chapters);
        setEvaluationsData(evaluations);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Trainings"}></SubHeader>

        {/* Main Content */}
        <Tabs
          defaultValue="trainingInfo"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <ChromeTabs
            initialTabs={[
              {
                value: "trainingInfo",
                title: "Training Info",
                stateSetter: setCurrentTab,
              },
              {
                value: "beneficiaries",
                title: "Training Beneficiaries",
                stateSetter: setCurrentTab,
              },

              ...chaptersData.map((_, index) => ({
                value: `chapter-${index + 1}`,
                title: `Chapter ${index + 1}`,
                stateSetter: setCurrentTab,
              })),

              {
                value: "trainingEvaluation",
                title: "Training Evaluation",
                stateSetter: setCurrentTab,
              },
            ]}
          ></ChromeTabs>

          <TabsContent value="trainingInfo">
            <Card className="max-h-[400px]">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                {structuredInfo(trainingInfo)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="beneficiaries">
            <Card className="max-h-[400px]">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                <DataTableDemo
                  columns={trainingDatabaseBeneificiaryListColumn}
                  indexUrl={`/training_db/training_beneficiaries/${id}`}
                  deleteUrl={`/training_db/remove_beneficiaries_from_training/${id}`}
                  searchableColumn="Name"
                  idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                  showModelOpenerStateSetter={() => {}}
                  filtersList={TrainingBeneficiariesFiltersList}
                ></DataTableDemo>
              </CardContent>
            </Card>
          </TabsContent>
          {chaptersData.map((chapter, index) => (
            <TabsContent key={index} value={`chapter-${index + 1}`}>
              <Card>
                <CardContent className="grid gap-6 min-h-[340px]">
                  {structuredInfo(chapter)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
          <TabsContent value="trainingEvaluation">
            <Card className="max-h-[400px] overflow-auto">
              <CardContent className="p-4">
                <TrainingEvaluationForm
                  previosTrainingEvaluations={evaluationsData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {open && (
          <CreateNewChapterForm
            open={open}
            onOpenChange={setOpen}
            title={"Add New ChapterForm"}
          ></CreateNewChapterForm>
        )}
      </div>
    </>
  );
};

const structuredInfo = (info: any) => {
  return (
    <>
      {info ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(info).map(([key, value], index) => {
            if (IsIdFeild(key) || IsANullValue(value)) return;
            return (
              <div
                key={index}
                className="flex flex-col rounded-xl border p-3 transition-all hover:shadow-sm"
              >
                <span className="text-xs font-medium uppercase opacity-70 tracking-wide">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-sm font-semibold truncate">
                  {value?.toString() || "-"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[56px] w-full rounded-xl animate-pulse bg-muted/30"
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TrainingProfilePage;
