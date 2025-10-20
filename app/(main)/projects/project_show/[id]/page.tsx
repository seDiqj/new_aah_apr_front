"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import SubHeader from "@/components/global/SubHeader";
import { SingleSelect } from "@/components/single-select";
import { MultiSelect } from "@/components/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";

type Project = {
  id: string | null;
  projectCode: string;
  projectTitle: string;
  projectGoal: string;
  projectDonor: string;
  startDate: string;
  endDate: string;
  status: string;
  projectManager: string;
  provinces: string[];
  thematicSector: string[];
  reportingPeriod: string;
  reportingDate: string;
  aprStatus: string;
  description: string;
};


const  ShowProjectPage = () => {
  const { id } = useParams();
  const axiosInstance = createAxiosInstance();
  const { reqForToastAndSetMessage } = useParentContext();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Project>({
    id: null,
    projectCode: "",
    projectTitle: "",
    projectGoal: "",
    projectDonor: "",
    startDate: "",
    endDate: "",
    status: "active",
    projectManager: "",
    provinces: [],
    thematicSector: [],
    reportingPeriod: "",
    reportingDate: "",
    aprStatus: "NotCreatedYet",
    description: "",
  });

  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [desaggregations, setDessaggregations] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`/projects/${id}`)
      .then((res) => {
        const data = res.data.data;

        setFormData({
          id: data.id,
          projectCode: data.projectCode,
          projectTitle: data.projectTitle,
          projectGoal: data.projectGoal,
          projectDonor: data.projectDonor,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          projectManager: data.projectManager,
          provinces: data.provinces || [],
          thematicSector: data.thematicSector || [],
          reportingPeriod: data.reportingPeriod,
          reportingDate: data.reportingDate,
          aprStatus: data.aprStatus,
          description: data.description,
        });

        setOutcomes(data.outcomes || []);
        const allOutputs = (data.outcomes || []).flatMap(
          (o: any) => o.outputs || []
        );
        setOutputs(allOutputs);
        const allIndicators = allOutputs.flatMap(
          (o: any) => o.indicators || []
        );
        setIndicators(allIndicators);
        const allDessaggregations = allIndicators.flatMap(
          (i: any) => i.dessaggregations || []
        );
        setDessaggregations(allDessaggregations);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(
          error.response?.data?.message || "Something went wrong"
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2">
      <Navbar14 />
      <div className="flex flex-row items-center justify-start my-2">
        <BreadcrumbWithCustomSeparator />
      </div>
      <SubHeader pageTitle={"Project Details"} />
      <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
        <Tabs defaultValue="project" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="outcome">Outcome</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="indicator">Indicator</TabsTrigger>
            <TabsTrigger value="dessaggregation">Dessaggregation</TabsTrigger>
            {/* <TabsTrigger value="aprPreview">APR Preview</TabsTrigger> */}
          </TabsList>

          {/* Project Tab */}
          <TabsContent value="project" className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <Label>Project Code</Label>
                    <Input value={formData.projectCode} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Project Title</Label>
                    <Input value={formData.projectTitle} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Project Goal</Label>
                    <Input value={formData.projectGoal} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Donor</Label>
                    <Input value={formData.projectDonor} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Start Date</Label>
                    <Input type="date" value={formData.startDate} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>End Date</Label>
                    <Input type="date" value={formData.endDate} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Status</Label>
                    <SingleSelect
                      value={formData.status}
                      disabled
                      options={[]}
                      onValueChange={function (value: string) {}}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Project Manager</Label>
                    <Input value={formData.projectManager} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Provinces</Label>
                    <MultiSelect
                      value={formData.provinces}
                      options={[]}
                      onValueChange={(value: string[]) => {}}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Thematic Sector</Label>
                    <MultiSelect
                      value={formData.thematicSector}
                      disabled
                      options={[]}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Reporting Period</Label>
                    <Input value={formData.reportingPeriod} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Reporting Date</Label>
                    <Input value={formData.reportingDate} disabled />
                  </div>
                  <div className="flex flex-col gap-1 col-span-full">
                    <Label>Description</Label>
                    <Textarea value={formData.description} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outcome Tab */}
          <TabsContent value="outcome" className="h-full">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 overflow-auto">
                {outcomes.map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-4 border p-3 rounded-lg"
                  >
                    <Input value={item.outcome} disabled />
                    <Input value={item.outcomeRef} disabled />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Output Tab */}
          <TabsContent value="output" className="h-full">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Outputs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 overflow-auto">
                {outputs.map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-4 border p-3 rounded-lg"
                  >
                    <Input value={item.output} disabled />
                    <Input value={item.outputRef} disabled />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Indicator Tab */}
          <TabsContent value="indicator" className="h-full">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Indicators</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 overflow-auto">
                {indicators.map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-4 border p-3 rounded-lg"
                  >
                    <Input value={item.indicator} disabled />
                    <Input value={item.indicatorRef} disabled />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dessaggregation Tab */}
          <TabsContent value="dessaggregation" className="h-full">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Dessaggregations</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 overflow-auto">
                {desaggregations.map((d, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-2 border p-2 rounded"
                  >
                    <Input value={d.description} disabled />
                    <Input type="number" value={d.target} disabled />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* APR Preview */}
          {/* <TabsContent value="aprPreview" className="h-full">
            <MonitoringTablePage
              data={{
                impact: formData.projectGoal,
                outcomes: outcomes.map((outcome) => ({
                  name: outcome.outcome,
                  outputs: outputs
                    .filter((o) => o.outcomeRef === outcome.outcomeRef)
                    .map((output) => ({
                      name: output.output,
                      indicators: indicators.filter(
                        (ind) => ind.outputRef === output.outputRef
                      ),
                    })),
                })),
              }}
              provincesList={formData.provinces}
            />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}

export default ShowProjectPage;
