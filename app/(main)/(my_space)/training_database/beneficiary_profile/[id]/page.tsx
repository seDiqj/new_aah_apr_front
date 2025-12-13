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
import {
  Chapters,
  SelfChapters,
  TrainingBenefeciaryForm,
  TrainingForm,
} from "@/types/Types";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { TrainingBeneficiaryDefault } from "@/constants/FormsDefaultValues";
import { BeneficiaryPresenceTogglerButtonMessage } from "@/constants/ConfirmationModelsTexts";
import { IsIdFeild } from "@/constants/Constants";

const TrainingBeneficiaryProfile = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [reqForTrainingSelector, setReqForTrainingSelector] =
    useState<boolean>(false);

  const [beneficiaryInfo, setBeneficiaryInfo] =
    useState<TrainingBenefeciaryForm>(TrainingBeneficiaryDefault());

  const [trainingsData, setTrainingsData] = useState<TrainingForm[]>([]);

  const [chaptersData, setChaptersData] = useState<Chapters>([]);

  const [selfChaptersData, setSelfChaptersData] = useState<SelfChapters>([]);

  const isBeneficiaryTrainingsListFeched: RefObject<boolean> = useRef(false);

  useEffect(() => {
    if (isBeneficiaryTrainingsListFeched.current) return;
    isBeneficiaryTrainingsListFeched.current = true;
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
              <Button
                className="rounded-2xl"
                onClick={() =>
                  setReqForTrainingSelector(!reqForTrainingSelector)
                }
              >
                <Plus></Plus>
              </Button>
            </div>
          </TabsList>
          <TabsContent value="beneficiaryInfo">
            <Card className="min-h-[400px]">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                <div>{structuredInfo(beneficiaryInfo)}</div>
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
                                reqForConfirmationModelFunc(
                                  BeneficiaryPresenceTogglerButtonMessage,
                                  () => handleTogglePrecenseOfBeneficiary(ch.id)
                                )
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

const structuredInfo = (info: any) => {
  return (
    <>
      {info ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(info).map(([key, value], index) => {
            if (IsIdFeild(key)) return;
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

export default TrainingBeneficiaryProfile;
