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
import {
  BeneficiaryPresenceTogglerButtonMessage,
  RemoveTrainingFromBeneficiaryButtonMessage,
} from "@/constants/ConfirmationModelsTexts";
import { IsIdFeild } from "@/constants/Constants";
import ChromeTabs from "@/app/(main)/projects/Components/ChromeTab";
import { AxiosError, AxiosResponse } from "axios";

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

  const [currentTab, setCurrentTab] = useState<string>("beneficiaryInfo");

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
              trainingId: training.id,
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

  const removeTrainingFromBeneficiaryTrainingList = (
    trainingId: number | null
  ) => {
    if (!trainingId) {
      reqForToastAndSetMessage("Training is not valid !");
      return;
    }
    axiosInstance
      .post(`/training_db/remove_training_from_bnf`, {
        trainingId: trainingId,
        beneficiaryId: id,
      })
      .then((response: AxiosResponse<any, any>) => {
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message)
      );
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
        <Tabs
          defaultValue="beneficiaryInfo"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <ChromeTabs
            initialTabs={[
              {
                value: "beneficiaryInfo",
                title: "Beneficiary Info",
                stateSetter: setCurrentTab,
              },

              ...trainingsData.map((training) => ({
                value: training.id as string,
                title: training.name.toUpperCase(),
                stateSetter: setCurrentTab,
              })),
            ]}
          ></ChromeTabs>

          <TabsContent value="beneficiaryInfo">
            <Card className="min-h-[400px]">
              <CardContent className="h-full grid gap-4 max-h-[400px] overflow-auto">
                <div>{structuredInfo(beneficiaryInfo)}</div>
              </CardContent>
            </Card>
          </TabsContent>
          {chaptersData.map((chapter, index) => (
            <TabsContent key={index} value={chapter.trainingId as string}>
              <Card className="min-h-[400px]">
                <CardContent className="pt-6 space-y-6">
                  {/* Inner Tabs */}
                  <Tabs defaultValue="training-info" className="space-y-4">
                    {/* Tabs Header */}
                    <TabsList className="flex flex-wrap gap-2">
                      <TabsTrigger value="training-info">
                        Training Info
                      </TabsTrigger>

                      {chapter.chapters.map((_, i) => (
                        <TabsTrigger key={i} value={`chapter-${i + 1}`}>
                          Chapter {i + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* ================= Training Info ================= */}
                    <TabsContent value="training-info">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {Object.entries(
                          trainingsData.find(
                            (t) => t.id === chapter.trainingId
                          ) ?? {}
                        ).map(([key, value], idx) => {
                          if (IsIdFeild(key)) return null;

                          return (
                            <>
                              <div
                                key={idx}
                                className="grid grid-cols-[150px_1fr] border-b pb-2"
                              >
                                <span className="text-sm text-muted-foreground">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-sm font-medium">
                                  {value?.toString() || "-"}
                                </span>
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <div className="flex flex-row items-center justify-end w-full mt-4">
                        <Button
                          title="Remove training from current beneficiary's training list !"
                          onClick={() =>
                            reqForConfirmationModelFunc(
                              RemoveTrainingFromBeneficiaryButtonMessage,
                              () =>
                                removeTrainingFromBeneficiaryTrainingList(
                                  chapter.trainingId as unknown as number
                                )
                            )
                          }
                        >
                          Remove Training
                        </Button>
                      </div>
                    </TabsContent>

                    {/* ================= Chapters ================= */}
                    {chapter.chapters.map((ch, i) => (
                      <TabsContent key={i} value={`chapter-${i + 1}`}>
                        <div className="space-y-6">
                          {/* Chapter Header */}
                          <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-sm font-semibold">
                              Chapter {i + 1}
                            </h3>

                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Present</Label>
                              <Switch
                                onCheckedChange={() =>
                                  reqForConfirmationModelFunc(
                                    BeneficiaryPresenceTogglerButtonMessage,
                                    () =>
                                      handleTogglePrecenseOfBeneficiary(ch.id)
                                  )
                                }
                                defaultChecked={
                                  selfChaptersData.find((s) => s.id === ch.id)
                                    ?.isPresent
                                }
                              />
                            </div>
                          </div>

                          {/* Chapter Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {Object.entries(ch).map(([key, value], idx) => {
                              if (key === "id") return null;

                              return (
                                <div
                                  key={idx}
                                  className="grid grid-cols-[150px_1fr] border-b pb-2"
                                >
                                  <span className="text-sm text-muted-foreground">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {value?.toString() || "-"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end pt-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                openPreAndPostTestFormAndSetChapterId(
                                  ch.id.toString()
                                )
                              }
                            >
                              Pre & Post Test
                            </Button>
                          </div>
                        </div>
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
