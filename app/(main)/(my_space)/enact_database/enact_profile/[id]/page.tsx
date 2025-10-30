"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentFormType } from "@/types/Types";
import { useParentContext } from "@/contexts/ParentContext";
import { InfoItem } from "../../../referral_database/beneficiary_profile/[id]/page";
import { useParams } from "next/navigation";
import AssessmentForm from "@/components/global/CreateNewAssessmentForm";
import AssessmentScoreForm from "@/components/global/AssessmentScoreForm";

const MainDatabasePage = () => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const { id } = useParams<{
    id: string;
  }>();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForAssessmentCreationForm, setReqForAssessmentCreationForm] =
    useState<boolean>(false);

  const [reqForAddNewAssessment, setReqForAddNewAssessment] =
    useState<boolean>(false);

  const [assessmentInfo, setAssessmentInfo] =
    useState<AssessmentFormType | null>(null);

  const [assessmentsData, setAssessmentsData] = useState<
    {
      id: string;
      description: string;
    }[]
  >();

  const hasRef = useRef(false);

  useEffect(() => {
    if (hasRef.current) return;
    hasRef.current = true;

    axiosInstance
      .get(`/enact_database/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
        const { assessments, ...assessmentData } = response.data.data;
        setAssessmentInfo(assessmentData);
        setAssessmentsData(assessments);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
        console.log(error.response.data);
      });
  }, []);

  useEffect(() => console.log(assessmentsData), [assessmentsData]);

  return (
    <>
      <div className="max-w-full w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Benficiaries"}>
          <div className="flex flex-row items-center justify-around gap-2">
            <Button
              onClick={() => setReqForAddNewAssessment(!reqForAddNewAssessment)}
            >
              Add Assessment
            </Button>
          </div>
        </SubHeader>

        <div className="w-full ">
          <Tabs
            defaultValue="assessmentDetails"
            className="h-full max-w-full w-full overflow-auto"
          >
            {/* List of tabs */}
            <TabsList className="max-w-full overflow-auto">
              <TabsTrigger value="assessmentDetails">
                Assessment Details
              </TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>

            <TabsContent value="assessmentDetails" className="h-full">
              <Card className="shadow-sm border border-border w-full bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Assessment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {assessmentInfo &&
                      Object.entries(assessmentInfo).map((entry, i) => {
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

            <TabsContent
              className="flex flex-col items-start justify-around overflow-auto"
              value={"assessments"}
            >
              <Card className="shadow-sm border border-border max-h-full w-full bg-background overflow-y-auto">
                <CardContent>
                  {assessmentsData?.map((assessment, i) => {
                    return (
                      <Card
                        key={i}
                        className="flex flex-row items-center justify-between w-full px-2 mb-2"
                      >
                        {/* <CardHeader>{`Assessment ${i}`}</CardHeader> */}
                        <div>
                          <span>{`Assessment ${i + 1}`}</span>
                        </div>
                        <CardContent>
                          <Button onClick={() => {}}>Assess</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {reqForAddNewAssessment && (
            <AssessmentScoreForm
              open={reqForAddNewAssessment}
              onOpenChange={setReqForAddNewAssessment}
              mode={"create"}
            ></AssessmentScoreForm>
          )}
        </div>
      </div>
    </>
  );
};

export default MainDatabasePage;
