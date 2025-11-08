"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import MonitoringTablePage from "@/components/global/ExcelSheet";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentContext } from "@/contexts/ParentContext";
import { withPermission } from "@/lib/withPermission";
import React, { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { isp3s } from "../../utils/OptionLists";
import ProjectForm from "../../Components/ProjectForm";
import OutputForm from "../../Components/OutputForm";
import DessaggregationForm from "../../Components/DessaggregationForm";
import AprFinalizationSubPage from "../../Components/AprFinalizationSubPage";
import { Dessaggregation, Isp3, Outcome, Output } from "../../types/Types";
import OutcomeForm from "../../Components/OutcomeForm";
import AprLogsSubPage from "../../Components/AprLogsSubPage";
import IndicatorForm from "../../Components/IndicatorForm";
import Isp3SubPage from "../../Components/Isp3SubPage";

const EditProjectPage = () => {

  const {id} = useParams();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

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

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const [outputs, setOutputs] = useState<Output[]>([]);

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [dessaggregations, setDessaggregations] = useState<Dessaggregation[]>([]);

  const [isp3, setIsp3] = useState<Isp3[]>(
    isp3s.map((i) => ({
      name: i,
      indicators: [],
    })),
  );

  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectProvinces, setProjectProvinces] = useState<string[]>(["kabul"]);
  const [projectGoal, setProjectGoal] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>("project");

  const [actionLogs, setActionLogs] = useState([]);

  const [logs, setLogs] = useState<
    {
      action: string;
      userName: string;
      projectCode: string;
      result: string;
      date: string;
      comment: string;
    }[]
  >([]);

  const [projectAprStatus, setProjectAprStatus] = useState<string>("notCreatedYet");
  
  
  // Fech project data
  useEffect(() => {

    axiosInstance.get(`/projects/${id}`)
    .then((response: any) => {
      const {outcomesInfo, ...project} = response.data.data;
      project["provinces"] = project.provinces.map((province: {id: string, name: string, pivo: any}) => province.name);
      setFormData(project);
      setProjectProvinces(project["provinces"]);
      setOutcomes(outcomesInfo.map((outcome: any) => {
        const {outputs, ...outcomeInfo} = outcome;

        return outcomeInfo;
      }));
      setOutputs(outcomesInfo.flatMap((outcome: any) => {
        const outputs =  outcome.outputs.flatMap((output: any) => {
          const {indicators, ...outputInfo} = output;
          
          outputInfo["outcomeId"] = outcome.id;
          outputInfo["outcomeRef"] = outcome.outcomeRef;

          return outputInfo;
        });

        return outputs;
      }));
      setIndicators(outcomesInfo.flatMap((outcome: any) => {
        const indicators = outcome.outputs.flatMap((output: any) => output.indicators.flatMap((indicator: any) => {
          const {dessaggregations, ...indicatorInfo} = indicator;

          indicatorInfo["outputId"] = output.id;
          indicatorInfo["outputRef"] = output.outputRef;

          return indicatorInfo;
        }))

        return indicators;
      }));
      setDessaggregations(outcomesInfo.flatMap((outcome: any) => {
        const dessaggregations = outcome.outputs.flatMap((output: any) => output.indicators.flatMap((indicator: any) => indicator.dessaggregations.flatMap((dessaggregation: any) => {

          dessaggregation["indicatorId"] = dessaggregation.indicator_id;

          return dessaggregation;

        })))
        return dessaggregations;
      }));
      setProjectAprStatus(project.aprStatus);
      setProjectId(project.id)
      outcomesInfo.flatMap((outcome: any) => {
        const isp3s = outcome.outputs.flatMap((output: any) => output.indicators.flatMap((indicator: any) => indicator.isp3.flatMap((isp: any) => {

          setIsp3((prev) => prev.map((i) => 
            i.name == isp.description ?
            {
              ...i,
              indicators: [...i.indicators, isp.pivot.indicator_id]
            }:
            i
          ))

        })))
        return isp3s;
      });
    }).catch((error: any) => reqForToastAndSetMessage(error.response.data.message));
  }, []);

  return (
    <>
      <ComponentContext.Provider value={{
        formData,
        setFormData,
        outcomes,
        setOutcomes,
        outputs,
        setOutputs,
        indicators,
        setIndicators,
        dessaggregations,
        setDessaggregations,
        projectId,
        setProjectId,
        projectGoal,
        setProjectGoal,
        projectProvinces,
        setProjectProvinces,
        currentTab,
        setCurrentTab,
        logs,
        setLogs,
        projectAprStatus,
        setProjectAprStatus,
        isp3,
        setIsp3,
        actionLogs,
        setActionLogs
      }}>
        <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Create New Project"}></SubHeader>
        <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
          <Tabs
            defaultValue="project"
            onValueChange={(value: string) => setCurrentTab(value)}
            value={currentTab}
            className="h-full"
          >
            {/* List of tabs */}
            <TabsList className="w-full">
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="outcome">OutCome</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="indicator">Indicator</TabsTrigger>
              <TabsTrigger value="dessaggregation">Dessaggregation</TabsTrigger>
              <TabsTrigger value="aprPreview">APR Preview</TabsTrigger>
              <TabsTrigger value="isp3">ISP3</TabsTrigger>
              <TabsTrigger value="finalization">APR Finalization</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            {/* Project */}
            <TabsContent value="project" className="h-full">
              <ProjectForm mode="edit"></ProjectForm>
            </TabsContent>

            {/* Outcome */}
            <TabsContent value="outcome" className="h-full">
              <OutcomeForm mode="edit" readOnly={false}></OutcomeForm>
            </TabsContent>

            {/* Output */}
            <TabsContent value="output" className="h-full">
              <OutputForm mode="edit" readOnly={false}></OutputForm>
            </TabsContent>

            {/* Indicator */}
            <TabsContent value="indicator" className="h-full">
              <IndicatorForm mode="edit"></IndicatorForm>
            </TabsContent>

            {/* Dessaggregation */}
            <TabsContent value="dessaggregation" className="h-full">
              <DessaggregationForm mode="edit"></DessaggregationForm>
            </TabsContent>

            {/* APR preview */}
            <TabsContent value="aprPreview" className="h-full">
              <MonitoringTablePage mode="edit"></MonitoringTablePage>
            </TabsContent>

            {/* ISP3 */}
            <TabsContent value="isp3" className="h-full">
              <Isp3SubPage mode="edit"></Isp3SubPage>
            </TabsContent>

            {/* APR Finalization */}
            <TabsContent value="finalization" className="h-full">
              <AprFinalizationSubPage mode="edit"></AprFinalizationSubPage>
            </TabsContent>

            {/* APR Logs */}
            <TabsContent value="logs" className="h-full overflow-hidden">
              <AprLogsSubPage mode="edit"></AprLogsSubPage>
            </TabsContent>
          </Tabs>
        </div>
                
      </div>
      </ComponentContext.Provider>
    </>
  );
};

export const ComponentContext = createContext<any>({});
  
export const useProjectEditContext = () => useContext(ComponentContext);

export default withPermission(EditProjectPage, "Project.edit");