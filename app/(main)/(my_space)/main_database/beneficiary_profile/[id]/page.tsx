"use client";

import SessionsPage from "@/components/global/BnfProfileTest";
import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import MealToolForm from "@/components/global/MealToolForm";
import SubHeader from "@/components/global/SubHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useParentContext } from "@/contexts/ParentContext";
import { MainDatabaseBeneficiaryProfileInterface } from "@/interfaces/Interfaces";
import {
  BeneficiaryEvaluationSubmitButtonMessage,
  MealToolDeleteButtonMessage,
} from "@/constants/ConfirmationModelsTexts";
import { BeneficiaryEvaluationDefault } from "@/constants/FormsDefaultValues";
import { clientSatisfactionOptions } from "@/constants/SingleAndMultiSelectOptionsList";
import { withPermission } from "@/lib/withPermission";
import {
  BeneficiaryEvaluationType,
  MainDatabaseBeneficiaryProfileInfoType,
  MainDatabaseProgram,
} from "@/types/Types";
import { use, useEffect, useState } from "react";
import ChromeTabs from "@/app/(main)/projects/Components/ChromeTab";

type Session = {
  id: number | null;
  group: string | null;
  session: string;
  date: string;
  topic: string;
};

type Dessaggregation = {
  id: string;
  description: string;
};

type IndicatorState = {
  id: number;
  indicatorRef: string;
  type: string;
  sessions: Session[];
  dessaggregations: Dessaggregation[];
};

const BeneficiaryProfilePage: React.FC<
  MainDatabaseBeneficiaryProfileInterface
> = (params: MainDatabaseBeneficiaryProfileInterface) => {
  const { id } = use(params.params);

  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [beneficiaryInfo, setBeneficiaryInfo] =
    useState<MainDatabaseBeneficiaryProfileInfoType>();
  const [evaluationForm, setEvaluationForm] =
    useState<BeneficiaryEvaluationType>(BeneficiaryEvaluationDefault());
  const [programInfo, setProgramInfo] = useState<MainDatabaseProgram[]>();
  const [mealTools, setMealTools] = useState<any[]>([]);
  const [reqForMealToolForm, setReqForMealToolForm] = useState<boolean>(false);
  const [mealToolId, setMealToolId] = useState<number | null>(null);
  const [reqForMealToolEditForm, setReqForMealToolEditForm] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("beneficiaryInfo");

  const [indicators, setIndicators] = useState<IndicatorState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<number | false>(false);

  const handleEvaluationFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setEvaluationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmitEvaluationForm = (e: any) => {
    e.preventDefault();

    let isError: boolean = false;

    Object.values(evaluationForm).forEach((value) => {
      if (
        (typeof value == "string" && value.trim() == "") ||
        (Array.isArray(value) && value.length == 0)
      )
        isError = true;
    });

    if (!isError)
      requestHandler()
        .post(`main_db/beneficiary/evaluation/${id}`, {
          evaluation: evaluationForm,
        })
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    else reqForToastAndSetMessage("Please fill all the fields !");
  };

  const handleDeleteMealtool = (index: number, id: number | null) => {
    if (!id) {
      setMealTools(mealTools.filter((_: any, i: number) => i !== index));
      return;
    }
    setDeleteLoading(id);

    requestHandler()
      .delete(`/main_db/beneficiary/mealtool/${id}`)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        setMealTools(mealTools.filter((_: any, i: number) => i !== index));
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      )
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => {
    // Fitching Beneficiary info.
    requestHandler()
      .get(`/main_db/beneficiary/${id}`)
      .then((response: any) => {
        if (response.data.status) setBeneficiaryInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    // Fitching Program Info.
    requestHandler()
      .get(`main_db/program/${id}`)
      .then((response: any) => {
        if (response.data.status) setProgramInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    requestHandler()
      .get(`main_db/beneficiary/mealtool/${id}`)
      .then((response: any) => {
        setMealTools((prev) => [...prev, response.data.data]);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    requestHandler()
      .get(`main_db/beneficiary/evaluation/${id}`)
      .then((response: any) => {
        setEvaluationForm(response.data.data);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      });
  }, []);

  // Fetch indicators from backend
  useEffect(() => {
    setLoading(true);
    requestHandler()
      .get(`/main_db/indicators/${id}`)
      .then((response: any) => {
        const mapped = response.data.data.map((ind: any) => ({
          id: ind.id,
          type: ind.type,
          sessions: ind.sessions.map((session: any) => ({
            id: session.id,
            group: session.group,
            session: session.session,
            date: session.date,
            topic: session.topic,
          })),
          dessaggregations:
            ind.dessaggregations.map((d: any) => ({
              id: d.id,
              description: d.description,
            })) || [],
        }));
        setIndicators(mapped);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error fetching indicators"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiary Profile"}></SubHeader>

        {/* Main Content */}
        <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
          <Tabs
            onValueChange={(value: string) => setCurrentTab(value)}
            value={currentTab}
            defaultValue="beneficiaryInfo"
            className="h-full"
          >
            {/* List of tabs */}
            <ChromeTabs
              currentTab={currentTab}
              onCurrentTabChange={setCurrentTab}
              initialTabs={[
                {
                  value: "beneficiaryInfo",
                  title: "Beneficiary",
                },
                {
                  value: "activity",
                  title: "Activity",
                  hoverTitle: `Number of individual sessions: ${indicators.reduce(
                    (s: any, ind: IndicatorState) =>
                      s +
                      ind.sessions.filter(
                        (session: any) => session.group == null
                      ).length,
                    0
                  )} \nNumber of group sessions: ${indicators.reduce(
                    (s: any, ind: IndicatorState) =>
                      s +
                      ind.sessions.filter(
                        (session: any) => session.group != null
                      ).length,
                    0
                  )}`,
                },
                {
                  value: "mealtool",
                  title: "Meal Tools",
                  hoverTitle: `Number of mealtools: ${mealTools.length}`,
                },
                {
                  value: "evaluation",
                  title: "Evaluation",
                },
              ]}
            ></ChromeTabs>

            {/* Beneficiary Info */}
            <TabsContent value="beneficiaryInfo" className="h-full">
              <Card className="h-full flex flex-col shadow-sm border rounded-2xl">
                <CardContent className="p-6 space-y-8">
                  {/* Beneficiary Information */}
                  <section className="w-full space-y-4">
                    <Label className="text-lg font-semibold tracking-tight">
                      Beneficiary Information
                    </Label>

                    {beneficiaryInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(beneficiaryInfo).map(
                          ([key, value], index) => (
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
                          )
                        )}
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
                  </section>

                  {/* Program Information */}
                  <section className="w-full space-y-4">
                    <Label className="text-lg font-semibold tracking-tight">
                      Program Information
                    </Label>

                    {programInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {programInfo.map((info, idx) =>
                          Object.entries(info).map(([key, value], i) => (
                            <div
                              key={`${idx}-${i}`}
                              className="flex flex-col rounded-xl border p-3 transition-all hover:shadow-sm"
                            >
                              <span className="text-xs font-medium uppercase opacity-70 tracking-wide">
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                              <span className="text-sm font-semibold truncate">
                                {value?.toString() || "-"}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[56px] w-full rounded-xl animate-pulse bg-muted/30"
                          />
                        ))}
                      </div>
                    )}
                  </section>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="h-full">
              <Card className="relative min-h-[350px] h-full flex flex-col">
                <CardContent className="flex flex-col gap-4 overflow-auto">
                  <SessionsPage
                    indicatorStateSetter={setIndicators}
                    indicators={indicators}
                    isLoading={loading}
                  ></SessionsPage>
                </CardContent>
                <CardFooter className="flex flex-row w-full gap-2 items-center justify-end"></CardFooter>
              </Card>
            </TabsContent>

            {/* Meal tool */}
            <TabsContent value="mealtool" className="h-full">
              <Card className="min-h-[350px] h-full flex flex-col overflow-auto">
                <CardHeader className="flex flex-row items-center justify-end w-full">
                  <Button
                    onClick={() => setReqForMealToolForm(!reqForMealToolForm)}
                  >
                    Add MealTool
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {mealTools.length >= 1 ? (
                    <Accordion type="single" collapsible className="mt-4">
                      {mealTools.map((tool, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{tool.type}</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-4 p-4">
                              <div>
                                <Label>Date Of Baseline:</Label>
                                <div>{tool.baselineDate}</div>
                              </div>
                              <div>
                                <Label>Date Of Endline:</Label>
                                <div>{tool.endlineDate}</div>
                              </div>
                              <div>
                                <Label>Baseline Score:</Label>
                                <div>{tool.baselineTotalScore}</div>
                              </div>
                              <div>
                                <Label>Endline Score:</Label>
                                <div>{tool.endlineTotalScore}</div>
                              </div>
                              <div>
                                <Label>Improvement %:</Label>
                                <div>{tool.improvementPercentage}</div>
                              </div>
                              <div>
                                <Label>Is Baseline Active :</Label>
                                <div>{tool.isBaselineActive.toString()}</div>
                              </div>
                              <div>
                                <Label>Is Endline Active :</Label>
                                <div>{tool.isEndlineActive.toString()}</div>
                              </div>
                              <div>
                                <Label>Baseline :</Label>
                                <div>{tool.baseline}</div>
                              </div>
                              <div>
                                <Label>Endline :</Label>
                                <div>{tool.endline}</div>
                              </div>
                              <div>
                                <Label>Evaluation:</Label>
                                <div>{tool.evaluation}</div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 p-2">
                              <Button
                                variant="default"
                                className="bg-orange-500"
                                onClick={() => {
                                  setMealToolId(tool.id);
                                  setReqForMealToolEditForm(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="default"
                                className="bg-red-500"
                                disabled={deleteLoading == tool.id}
                                onClick={() =>
                                  reqForConfirmationModelFunc(
                                    MealToolDeleteButtonMessage,
                                    () => {
                                      handleDeleteMealtool(index, tool.id);
                                    }
                                  )
                                }
                              >
                                {deleteLoading == tool.id
                                  ? "Deleting ..."
                                  : "Delete"}
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="flex flex-row items-center justify-center text-center text-sm text-muted-foreground">
                      No meal tool added yet !
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evaluation */}
            <TabsContent value="evaluation" className="h-full">
              <Card className="h-full flex flex-col">
                <CardContent className="flex flex-col gap-6 overflow-auto">
                  <div className="space-y-10 p-6 rounded-xl">
                    {/* Evaluation of the client */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Evaluation of the client
                      </h2>

                      <div className="mb-4">
                        <Label
                          htmlFor="eval-date"
                          className="block text-sm mb-1"
                        >
                          Date
                        </Label>
                        <Input
                          id="eval-date"
                          name="date"
                          value={evaluationForm.date}
                          type="date"
                          className="w-64 bg-white"
                          onChange={handleEvaluationFormChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {[
                          "New information",
                          "Time and place to relax",
                          "Learning new practice",
                          "Improve wellbeing",
                          "A listing space",
                          "Improve Mother-child bonding",
                          "Meet other people",
                          "Other, specify",
                          "Avoid isolation",
                          "Sharing experience",
                          "Quiet and safe place",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox
                              id={item}
                              defaultChecked={evaluationForm.clientSessionEvaluation.includes(
                                item
                              )}
                              onCheckedChange={(value: boolean) => {
                                evaluationForm.clientSessionEvaluation.includes(
                                  item
                                )
                                  ? setEvaluationForm((prev) => ({
                                      ...prev,
                                      clientSessionEvaluation:
                                        prev.clientSessionEvaluation.filter(
                                          (ev) => ev != item
                                        ),
                                    }))
                                  : setEvaluationForm((prev) => ({
                                      ...prev,
                                      clientSessionEvaluation: [
                                        ...prev.clientSessionEvaluation,
                                        item,
                                      ],
                                    }));
                              }}
                            />
                            <Label htmlFor={item} className="text-sm">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <Textarea
                        placeholder="If other please specify here..."
                        className="w-full"
                        name="otherClientSessionEvaluation"
                        value={evaluationForm.otherClientSessionEvaluation}
                        onChange={handleEvaluationFormChange}
                        rows={2}
                      />
                    </section>

                    {/* Satisfaction of the client */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Satisfaction of the client
                      </h2>

                      <div className="mb-4">
                        <Label
                          htmlFor="sat-date"
                          className="block text-sm mb-1"
                        >
                          Date
                        </Label>
                        <Input
                          id="sat-date"
                          type="date"
                          name="satisfactionDate"
                          value={evaluationForm.satisfactionDate}
                          onChange={handleEvaluationFormChange}
                          className="w-64 bg-white"
                        />
                      </div>

                      <RadioGroup
                        defaultValue={evaluationForm.clientSatisfaction}
                        onValueChange={(value: string) =>
                          handleEvaluationFormChange({
                            target: {
                              name: "clientSatisfaction",
                              value: value,
                            },
                          })
                        }
                      >
                        <div className="flex items-center gap-6">
                          {clientSatisfactionOptions.map((option) => (
                            <div
                              key={option.label}
                              className="flex flex-col items-center gap-1"
                            >
                              <span className="text-3xl">{option.emoji}</span>
                              <span className="text-sm">{option.label}</span>
                              <RadioGroupItem
                                value={option.label}
                                id={option.label}
                              />
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </section>

                    {/* Discharge */}
                    <section>
                      <h2 className="text-xl font-semibold mb-4">
                        Discharge (Reason for discharge)
                      </h2>

                      <div className="mb-4">
                        <Label
                          htmlFor="dis-date"
                          className="block text-sm mb-1"
                        >
                          Date
                        </Label>
                        <Input
                          id="dis-date"
                          type="date"
                          name="dischargeReasonDate"
                          value={evaluationForm.dischargeReasonDate}
                          onChange={handleEvaluationFormChange}
                          className="w-64 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {[
                          "PSS cycle completed",
                          "Improved wellbeing",
                          "No longer interested",
                          "Other child(ren) at home",
                          "Referral",
                          "Husband/family not granting permission",
                          "No improvement",
                          "Non-attendance",
                          "Other, specify",
                          "Displacement",
                          "Workload",
                          "Insecurity",
                          "Death of Child",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <Checkbox
                              id={item}
                              defaultChecked={evaluationForm.dischargeReason.includes(
                                item
                              )}
                              onCheckedChange={(value: boolean) => {
                                evaluationForm.dischargeReason.includes(item)
                                  ? setEvaluationForm((prev) => ({
                                      ...prev,
                                      dischargeReason:
                                        prev.dischargeReason.filter(
                                          (ev) => ev != item
                                        ),
                                    }))
                                  : setEvaluationForm((prev) => ({
                                      ...prev,
                                      dischargeReason: [
                                        ...prev.dischargeReason,
                                        item,
                                      ],
                                    }));
                              }}
                            />
                            <Label htmlFor={item} className="text-sm">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <Textarea
                        placeholder="If other please specify here..."
                        className="w-full"
                        name="otherDischargeReasone"
                        value={evaluationForm.otherDischargeReasone}
                        onChange={handleEvaluationFormChange}
                        rows={2}
                      />
                    </section>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-row items-center justify-end">
                  <Button
                    onClick={(e) =>
                      reqForConfirmationModelFunc(
                        BeneficiaryEvaluationSubmitButtonMessage,
                        () => {
                          handleSubmitEvaluationForm(e);
                        }
                      )
                    }
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {reqForMealToolForm && (
          <MealToolForm
            open={reqForMealToolForm}
            onOpenChange={setReqForMealToolForm}
            mealToolsStateSetter={setMealTools}
            mode={"create"}
          ></MealToolForm>
        )}

        {reqForMealToolEditForm && mealToolId && (
          <MealToolForm
            open={reqForMealToolEditForm}
            onOpenChange={setReqForMealToolEditForm}
            mealToolsStateSetter={setMealTools}
            mealtoolId={mealToolId}
            mode={"edit"}
          ></MealToolForm>
        )}
      </div>
    </>
  );
};

export default withPermission(BeneficiaryProfilePage, "Maindatabase.view");
