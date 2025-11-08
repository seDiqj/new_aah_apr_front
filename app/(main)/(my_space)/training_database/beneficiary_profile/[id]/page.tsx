"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import PreAndPostTestForm from "@/components/global/PreAndPostTestForm";
import SubHeader from "@/components/global/SubHeader";
import TrainingSelectorDialog from "@/components/global/TrainingSelectorDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import {
  TrainingBenefeciaryForm,
  TrainingForm,
} from "@/types/Types";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { InfoItem } from "../../../referral_database/beneficiary_profile/[id]/page";

const TrainingBeneficiaryProfile = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage } = useParentContext();

  const [reqForTrainingSelector, setReqForTrainingSelector] = useState<boolean>(false);

  const axiosInstance = createAxiosInstance();

  const [beneficiaryInfo, setBeneficiaryInfo] =
    useState<TrainingBenefeciaryForm>({
      name: "",
      fatherHusbandName: "",
      gender: "male",
      age: 0,
      phone: "",
      email: "",
      participantOrganization: "",
      jobTitle: "",
      dateOfRegistration: ""
    });

  const [trainingsData, setTrainingsData] = useState<TrainingForm[]>([]);

  const [chaptersData, setChaptersData] = useState<
    {
      trainingName: string;
      chapters: {
        id: number;
        topic: string;
        facilitatorName: string;
        facilitatorJobTitle: string;
        startDate: string;
        endDate: string;
      }[];
    }[]
  >([]);

  const [selfChaptersData, setSelfChaptersData] = useState<
    {
      id: number;
      isPresent: boolean;
      preTestScore: number;
      postTestScore: number;
      remark: string;
    }[]
  >([]);

  useEffect(() => {
    axiosInstance
      .get(`/training_db/beneficiary/trainings/${id}`)
      .then((response: any) => {
        const { trainings, ...beneficiaryData } = response.data.data;
        const { selfChapters, ...bnfData } = beneficiaryData;
        setBeneficiaryInfo(bnfData);
        setSelfChaptersData(selfChapters);
        trainings.map((training: any) => {
          const { chapters, ...t } = training;

          setTrainingsData((prev) => [...prev, t]);

          setChaptersData((prev) => [
            ...prev,
            {
              trainingName: training.name,
              chapters: training.chapters,
            },
          ]);
        });
      })
      .catch((error: any) => 
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const handleTogglePrecenseOfBeneficiary = (chapterId: number) => {
    axiosInstance
      .put(`training_db/beneficiary/chapter/setPrecense/${id}/${chapterId}`)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const [openPreAndPostTestForm, setOpenPreAndPostTestForm] =
    useState<boolean>(false);

  const [
    chapterIdForSettingThePreAndPostTestScores,
    setChapterIdForSettingThePreAndPostTestScores,
  ] = useState<string>("");

  const openPreAndPostTestFormAndSetChapterId = (chapterId: string) => {
    setChapterIdForSettingThePreAndPostTestScores(chapterId);
    setOpenPreAndPostTestForm(!openPreAndPostTestForm);
  };

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Beneficiary Profile"}></SubHeader>

        {/* Main Content */}
        {/* Main Content */}
        <Tabs defaultValue="beneficiaryInfo">
          <TabsList className="flex flex-row items-center justify-between w-full">
            {/* Triggers list */}
            <div className="overflow-auto">
              <TabsTrigger value="beneficiaryInfo">
                Beneficiary Info
              </TabsTrigger>
              {trainingsData.map((training, index) => (
                <TabsTrigger key={index} value={training.name}>
                  {training.name.toUpperCase()}
                </TabsTrigger>
              ))}
            </div>
            <div>
              <Button className="rounded-2xl" onClick={() => setReqForTrainingSelector(!reqForTrainingSelector)}>
                <Plus></Plus>
              </Button>
            </div>
          </TabsList>
          <TabsContent value="beneficiaryInfo">
            <Card className="min-h-[400px] flex flex-col items-start justify-around felx-wrap">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {beneficiaryInfo &&
                    Object.entries(beneficiaryInfo).map((entry, i) => {
                      if (entry[0] == "id") return;
                      return (
                        <InfoItem
                          key={i}
                          label={entry[0].toUpperCase()}
                          value={entry[1].toString()}
                        />
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {chaptersData.map((chapter, index) => (
            <TabsContent key={index} value={chapter.trainingName}>
              <Card className="min-h-[400px]">
                <CardContent className="grid gap-6">
                  <Tabs defaultValue={chapter.trainingName}>
                    <TabsList>
                      <TabsTrigger value={chapter.trainingName}>
                        Training info
                      </TabsTrigger>
                      {chapter.chapters.map((_, i) => (
                        <TabsTrigger key={i} value={`chapter-${i + 1}`}>
                          {`Chapter ${i + 1}`}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value={chapter.trainingName}>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(
                          trainingsData.find(
                            (training) => training.name === chapter.trainingName
                          ) ?? {}
                        ).map((entity, idx) => {
                          if (entity[0] == "id") return;
                          return (
                            <div key={idx} className="flex gap-7 p-2 rounded">
                              <span>{entity[0]} : </span>
                              <span>{entity[1]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    {chapter.chapters.map((ch, i) => (
                      <TabsContent key={i} value={`chapter-${i + 1}`}>
                        <>
                          {/* Presence toggle btn */}
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="airplane-mode"
                              onCheckedChange={(checked: boolean) =>
                                handleTogglePrecenseOfBeneficiary(ch.id)
                              }
                              defaultChecked={
                                selfChaptersData.map((selfChapterData) => {
                                  if (selfChapterData.id == ch.id)
                                    return selfChapterData.isPresent;
                                })[0]
                              }
                            />
                            <Label htmlFor="airplane-mode">Is Present</Label>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(ch).map((entry, idx) => {
                              if (entry[0] == "id") return;
                              return (
                                <div
                                  key={idx}
                                  className="flex gap-7 p-2 rounded"
                                >
                                  <span>{entry[0]} : </span>
                                  <span>{entry[1]}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-row items-center justify-end">
                            <Button
                              onClick={() =>
                                openPreAndPostTestFormAndSetChapterId(
                                  ch.id.toString()
                                )
                              }
                            >
                              Pre & Post Test
                            </Button>
                          </div>
                        </>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {openPreAndPostTestForm &&
          chapterIdForSettingThePreAndPostTestScores && (
            <PreAndPostTestForm
              open={openPreAndPostTestForm}
              onOpenChange={setOpenPreAndPostTestForm}
              chapterId={chapterIdForSettingThePreAndPostTestScores}
            ></PreAndPostTestForm>
          )}

          {reqForTrainingSelector && (
            <TrainingSelectorDialog
              open={reqForTrainingSelector}
              onOpenChange={setReqForTrainingSelector}
              ids={[id]}
            ></TrainingSelectorDialog>
          )}
          
      </div>
    </>
  );
};

export default TrainingBeneficiaryProfile;
