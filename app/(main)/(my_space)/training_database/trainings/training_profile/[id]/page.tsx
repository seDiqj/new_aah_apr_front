"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import CreateNewChapterForm from "@/components/global/CreateNewChapterForm";
import SubHeader from "@/components/global/SubHeader";
import TrainingEvaluationForm from "@/components/global/TrainingEvaluationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentContext } from "@/contexts/ParentContext";
import { TrainingProfileInterface } from "@/interfaces/Interfaces";
import { createAxiosInstance } from "@/lib/axios";
import { TrainingFormDefault } from "@/lib/FormsDefaultValues";
import { ChapterForm, Evaluations, TrainingForm } from "@/types/Types";
import { Plus } from "lucide-react";
import { use, useEffect, useState } from "react";

const TrainingProfilePage: React.FC<TrainingProfileInterface> = (
  params: TrainingProfileInterface
) => {
  const { id } = use(params.params);

  const { reqForToastAndSetMessage } = useParentContext();

  const axiosInstance = createAxiosInstance();

  let [open, setOpen] = useState<boolean>(false);

  const [trainingInfo, setTrainingInfo] = useState<TrainingForm>(TrainingFormDefault());

  const [chaptersData, setChaptersData] = useState<ChapterForm[]>([]);

  const [evaluationsData, setEvaluationsData] = useState<Evaluations>(null);

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
        <SubHeader pageTitle={"Trainings"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button>Beneficiaries</Button>
          </div>
        </SubHeader>

        {/* Main Content */}
        <Tabs defaultValue="trainingInfo">
          <TabsList className="flex flex-row items-center justify-between w-full">
            {/* Triggers list */}
            <div className="overflow-auto">
              <TabsTrigger value="trainingInfo">Training Info</TabsTrigger>
              {chaptersData.map((_, index) => (
                <TabsTrigger value={`chapter-${index + 1}`}>
                  Chapter {index + 1}
                </TabsTrigger>
              ))}
              <TabsTrigger value="trainingEvaluation">
                Training Evaluation
              </TabsTrigger>
            </div>
            <div>
              <Button className="rounded-2xl" onClick={() => setOpen(!open)}>
                <Plus></Plus>
              </Button>
            </div>
          </TabsList>
          <TabsContent value="trainingInfo">
            <Card className="max-h-[400px]">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(trainingInfo).map((info, index) => (
                    <div key={index} className="flex gap-7 p-2 rounded">
                      <span>{info[0]} : </span>
                      <span>{info[1]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {chaptersData.map((chapter, index) => (
            <TabsContent key={index} value={`chapter-${index + 1}`}>
              <Card>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(chapter).map((entity, index) => {
                      if (entity[0] == "id") return;

                      return (
                        <div key={index} className="flex gap-7 p-2 rounded">
                          <span>{entity[0]} : </span>
                          <span>{entity[1]}</span>
                        </div>
                      );
                    })}
                  </div>
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

export default TrainingProfilePage;
