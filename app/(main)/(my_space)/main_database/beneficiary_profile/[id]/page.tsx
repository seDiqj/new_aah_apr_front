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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { withPermission } from "@/lib/withPermission";
import { MainDatabaseProgram } from "@/types/Types";
import { use, useEffect, useState } from "react";

interface ComponentProps {
  params: Promise<{
    id: string;
  }>;
}

const BeneficiaryProfilePage: React.FC<ComponentProps> = (
  params: ComponentProps
) => {
  const { id } = use(params.params);

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [beneficiaryInfo, setBeneficiaryInfo] = useState<{
    dateOfRegistration: string;
    code: string;
    name: string;
    fatherHusbandName: string;
    gender: string;
    age: number;
    maritalStatus: string;
    childCode: string;
    ageOfChild: number;
    phone: string;
    houseHoldStatus: string;
    literacyLevel: string;
    disablilityType: string;
    referredForProtection: boolean;
  }>();

  
  const [evaluationForm, setEvaluationForm] = useState<{
    date: string;
    clientSessionEvaluation: string[];
    otherClientSessionEvaluation: string;
    clientSatisfaction: "veryBad" | "bad" | "neutral" | "good" | "veryGood";
    satisfactionDate: string;
    dischargeReason: string[];
    otherDischargeReasone: string;
    dischargeReasonDate: string;
  }>({
    date: "",
    clientSessionEvaluation: [],
    otherClientSessionEvaluation: "",
    clientSatisfaction: "neutral",
    satisfactionDate: "",
    dischargeReason: [],
    otherDischargeReasone: "",
    dischargeReasonDate: "",
  });

  const [mealTools, setMealTools] = useState<any[]>([]);

  const handleEvaluationFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setEvaluationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [reqForMealToolForm, setReqForMealToolForm] = useState<boolean>(false);
  
  const handleSubmitMealtoolForm = (e: any) => {
    e.preventDefault();

    if (mealTools.length == 0) return;
    axiosInstance
      .post(`/main_db/beneficiary/mealtools/${id}`, { mealtools: mealTools })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
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
      axiosInstance
        .post(`main_db/beneficiary/evaluation/${id}`, {
          evaluation: evaluationForm,
        })
        .then((response: any) =>
          reqForToastAndSetMessage(response.data.message)
        )
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    else reqForToastAndSetMessage("Please fill all the fields !");
  };

  const handleDelete = (index: number) => {
    setMealTools(mealTools.filter((_: any, i: number) => i !== index));
  };

  const [programInfo, setProgramInfo] = useState<MainDatabaseProgram[]>();

  useEffect(() => {
    // Fitching Beneficiary info.
    axiosInstance
      .get(`/main_db/beneficiary/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
        if (response.data.status) setBeneficiaryInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    // Fitching Program Info.
    axiosInstance
      .get(`main_db/program/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
        if (response.data.status) setProgramInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`main_db/beneficiary/mealtool/${id}`)
      .then((response: any) => {
        setMealTools(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`main_db/beneficiary/evaluation/${id}`)
      .then((response: any) => {
        setEvaluationForm(response.data.data);
        console.log(response.data.data);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
        console.log(error.response.data);
      });
  }, []);

  const [currentTab, setCurrentTab] = useState<string>("beneficiaryInfo");

  return (
    <>
      <div className="flex flex-col w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiary Profile"}>
          {currentTab == "mealtool" && (
            <div className="flex flex-row items-center justify-end gap-2">
            <Button onClick={() => setReqForMealToolForm(!reqForMealToolForm)}>Add MealTool</Button>
          </div>
          )}
        </SubHeader>

        {/* Main Content */}
        <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
          <Tabs onValueChange={(value: string) => setCurrentTab(value)} defaultValue="beneficiaryInfo" className="h-full">
            {/* List of tabs */}
            <TabsList className="w-full">
              <TabsTrigger value="beneficiaryInfo">Beneficiary</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="mealtool">Meal Tools</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            </TabsList>

            {/* Beneficiary Info */}
            <TabsContent value="beneficiaryInfo" className="h-full">
              <Card className="h-full flex flex-col">
                <CardContent>
                  <div className="flex flex-col gap-2 items-start justify-around w-full">
                    {/* Beneficiary information */}
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Beneficiary Information</Label>
                      <div className="flex flex-col w-full max-h-[160px] border-2 border-green-100 rounded-2xl p-4 overflow-y-auto">
                        {beneficiaryInfo &&
                          Object.entries(beneficiaryInfo).map(
                            ([key, value], index) => (
                              <div
                                key={index}
                                className="flex flex-row items-center justify-between gap-6 w-full"
                              >
                                <span>{key}</span>
                                <span>{value}</span>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Program Information</Label>
                      <div className="flex flex-col w-full max-h-[160px] border-2 border-green-100 rounded-2xl p-4 overflow-y-auto">
                        {programInfo &&
                          programInfo.map((programInfo, index) =>
                            Object.entries(programInfo).map(
                              ([key, value], index) => (
                                <div
                                  key={index}
                                  className="flex flex-row items-center justify-between gap-6 w-full"
                                >
                                  <span>{key}</span>
                                  <span>{value}</span>
                                </div>
                              )
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="h-full">
              <Card className="relative h-full flex flex-col">
                <CardContent className="flex flex-col gap-4 overflow-auto">
                  <SessionsPage></SessionsPage>
                </CardContent>
                <CardFooter className="flex flex-row w-full gap-2 items-center justify-end"></CardFooter>
              </Card>
            </TabsContent>

            {/* Meal tool */}
            <TabsContent value="mealtool" className="h-full">
              <Card className="h-full flex flex-col overflow-auto">
                <CardContent className="flex flex-col gap-6">
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
                              variant="destructive"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>

                <CardFooter>
                  <Button onClick={handleSubmitMealtoolForm}>Save</Button>
                </CardFooter>
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
                          className="w-64 bg-white text-black"
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
                        className="w-full bg-white text-black"
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
                          className="w-64 bg-white text-black"
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
                          {[
                            { emoji: "😊", label: "veryGood" },
                            { emoji: "🙂", label: "good" },
                            { emoji: "😐", label: "neutral" },
                            { emoji: "🙁", label: "bad" },
                            { emoji: "😡", label: "veryBad" },
                          ].map((option) => (
                            <div
                              key={option.label}
                              className="flex flex-col items-center gap-1"
                            >
                              <span className="text-3xl">{option.emoji}</span>
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
                          className="w-64 bg-white text-black"
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
                        className="w-full bg-white text-black"
                        name="otherDischargeReasone"
                        value={evaluationForm.otherDischargeReasone}
                        onChange={handleEvaluationFormChange}
                        rows={2}
                      />
                    </section>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button onClick={handleSubmitEvaluationForm}>Save</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {reqForMealToolForm && (
          <MealToolForm open={reqForMealToolForm} onOpenChange={setReqForMealToolForm} onSubmit={handleSubmitMealtoolForm} mealToolsStateSetter={setMealTools} mealToolsState={mealTools} mode={"create"}></MealToolForm>
        )}
        
      </div>
    </>
  );
};

export default withPermission(BeneficiaryProfilePage, "Maindatabase.view");
