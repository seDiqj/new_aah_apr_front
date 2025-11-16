"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import MonitoringTablePage from "@/components/global/ExcelSheet";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withPermission } from "@/lib/withPermission";
import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import OutcomeForm from "../Components/OutcomeForm";
import OutputForm from "../Components/OutputForm";
import DessaggregationForm from "../Components/DessaggregationForm";
import ProjectForm from "../Components/ProjectForm";
import { Dessaggregation, Isp3, Output } from "../types/Types";
import AprFinalizationSubPage from "../Components/AprFinalizationSubPage";
import AprLogsSubPage from "../Components/AprLogsSubPage";
import IndicatorForm from "../Components/IndicatorForm";
import Isp3SubPage from "../Components/Isp3SubPage";
import { Button } from "@/components/ui/button";
import IndicatorModel from "@/components/global/IndicatorEditModel";
import { useParentContext } from "@/contexts/ParentContext";
import OutcomeModel from "@/components/global/OutcomeEditModel";
import OutputModel from "@/components/global/OutputEditModel";
import { Isp3Default, ProjectDefault } from "@/lib/FormsDefaultValues";

const NewProjectPage = () => {

  const {reqForToastAndSetMessage} = useParentContext();

  const [formData, setFormData] = useState<Project>(ProjectDefault());

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const [outputs, setOutputs] = useState<Output[]>([]);

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [dessaggregations, setDessaggregations] = useState<Dessaggregation[]>([]);

  const [isp3, setIsp3] = useState<Isp3[]>(Isp3Default());

  const [projectAprStatus, setProjectAprStatus] = useState<string>("notCreatedYet");

  const [actionLogs, setActionLogs] = useState([]);

  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectProvinces, setProjectProvinces] = useState<string[]>(["kabul"]);
  const [projectGoal, setProjectGoal] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>("project");

  const [reqForOutcomeForm, setReqForOutcomeForm] = useState(false);
  const [reqForOutputForm, setReqForOutputForm] = useState(false);
  const [reqForIndicatorForm, setReqForIndicatorForm] = useState(false);

  return (
    <>
      <ComponentContext.Provider value={{
        outcomes,
        outputs,
        indicators,
        setOutcomes,
        setOutputs,
        setIndicators,
        setCurrentTab,
        projectProvinces,
        setProjectProvinces,
        projectId,
        setProjectId,
        projectGoal,
        setProjectGoal,
        dessaggregations,
        setDessaggregations,
        formData,
        setFormData,
        actionLogs,
        setActionLogs,
        projectAprStatus,
        setProjectAprStatus,
        isp3,
        setIsp3
      }}>
        <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Create New Project"}>
          <div className="flex flex-row items-center justify-end gap-2">
            {(currentTab == "outcome" || currentTab == "output" || currentTab == "indicator") && 
              (<Button
                onClick={() => {
                  switch (currentTab) {
                    case "outcome":
                      setReqForOutcomeForm(true);
                      break;
                    case "output":
                      setReqForOutputForm(true);
                      break;
                    case "indicator":
                      if (outputs.length == 0) {
                        reqForToastAndSetMessage("Please add at least one ouptut !");
                        return;
                      }
                      setReqForIndicatorForm(true);
                      break;
                  }
                }}>
                {currentTab == "outcome" ? "New Outcome" : currentTab == "output" ? "New Output" : "New Indicator"}
              </Button>)
            }
            
          </div>
        </SubHeader>
        <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
          <Tabs
            defaultValue="project"
            onValueChange={(value: string) => setCurrentTab(value)}
            value={currentTab}
            className="h-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="outcome">OutCome</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="indicator">Indicator</TabsTrigger>
              <TabsTrigger value="dessaggregation">Dessaggregation</TabsTrigger>
              {/* <TabsTrigger value="aprPreview">APR Preview</TabsTrigger> */}
              <TabsTrigger value="isp3">ISP3</TabsTrigger>
              <TabsTrigger value="finalization">APR Finalization</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            {/* Project */}
            <TabsContent value="project" className="h-full">
              <ProjectForm mode="create"></ProjectForm>
            </TabsContent>

            {/* Outcome */}
            <TabsContent value="outcome" className="h-full">
              <OutcomeForm mode="create"></OutcomeForm>
            </TabsContent>

            {/* Output */}
            <TabsContent value="output" className="h-full">
              <OutputForm mode="create"></OutputForm>
            </TabsContent>

            {/* Indicator */}
            <TabsContent value="indicator" className="h-full">
               <IndicatorForm mode="create"></IndicatorForm>
            </TabsContent>

            {/* Dessaggregation */}
            <TabsContent value="dessaggregation" className="h-full">
              <DessaggregationForm mode="create"></DessaggregationForm>
            </TabsContent>

            {/* APR preview */}
            {/* <TabsContent value="aprPreview" className="h-full">
              <MonitoringTablePage mode="create"></MonitoringTablePage>
            </TabsContent> */}
 
            {/* ISP3 */}
            <TabsContent value="isp3" className="h-full">
              <Isp3SubPage mode="create"></Isp3SubPage>
            </TabsContent>

            {/* APR Finalization */}
            <TabsContent value="finalization" className="h-full">
              <AprFinalizationSubPage mode="create"></AprFinalizationSubPage>
            </TabsContent>

            {/* APR Logs */}
            <TabsContent value="logs" className="h-full">
              <AprLogsSubPage mode="create"></AprLogsSubPage>
            </TabsContent>
          </Tabs>
        </div>


        {reqForIndicatorForm && (
            <IndicatorModel
                isOpen={reqForIndicatorForm}
                onClose={() => setReqForIndicatorForm(false)}
                mode="create"
                pageIdentifier="create"
            />
        )}

        {reqForOutcomeForm && (
          <OutcomeModel
            isOpen={reqForOutcomeForm}
            onOpenChange={setReqForOutcomeForm}
            mode="create"
            pageIdentifier="create"
            >
           </OutcomeModel>
        )}

        {reqForOutputForm && (
          <OutputModel isOpen={reqForOutputForm} onOpenChange={setReqForOutputForm} mode={"create"} pageIdentifier={"create"}></OutputModel>
        )}
        
      </div>
      </ComponentContext.Provider>
    </>
  );
};


export const ComponentContext = createContext<any>({});
  
export const useProjectContext = () => useContext(ComponentContext);

export default withPermission(NewProjectPage, "Project.create");