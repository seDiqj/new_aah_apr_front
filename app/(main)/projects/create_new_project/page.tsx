"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import MonitoringTablePage from "@/components/global/ExcelSheet";
import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { withPermission } from "@/lib/withPermission";
import React, { createContext, useContext } from "react";
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
import { useParentContext } from "@/contexts/ParentContext";
import { Isp3Default, ProjectDefault } from "@/constants/FormsDefaultValues";
import ChromeTabs from "../Components/ChromeTab";

const NewProjectPage = () => {
  const { reqForToastAndSetMessage, requestHandler } = useParentContext();

  const [formData, setFormData] = useState<Project>(ProjectDefault());

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const [outputs, setOutputs] = useState<Output[]>([]);

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [dessaggregations, setDessaggregations] = useState<Dessaggregation[]>(
    []
  );

  const [isp3, setIsp3] = useState<Isp3[]>(Isp3Default());

  const [projectAprStatus, setProjectAprStatus] =
    useState<string>("notCreatedYet");

  const [actionLogs, setActionLogs] = useState([]);

  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectProvinces, setProjectProvinces] = useState<string[]>(["kabul"]);
  const [projectGoal, setProjectGoal] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("project");

  const handleDelete = (url: string, id: string | null) => {
    if (!id) return;

    requestHandler()
      .delete(url + `/${id}`)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <>
      <ComponentContext.Provider
        value={{
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
          setIsp3,
          handleDelete,
        }}
      >
        <div className="max-w-full h-full p-2">
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
              <ChromeTabs
                currentTab={currentTab}
                onCurrentTabChange={setCurrentTab}
                initialTabs={[
                  {
                    value: "project",
                    title: "Project",
                  },
                  {
                    value: "outcome",
                    title: "Outcome",
                  },
                  {
                    value: "output",
                    title: "Output",
                  },
                  {
                    value: "indicator",
                    title: "Indicator",
                  },
                  {
                    value: "dessaggregation",
                    title: "Disaggregation",
                  },
                  {
                    value: "aprPreview",
                    title: "APR Preview",
                  },
                  {
                    value: "isp3",
                    title: "ISP3",
                  },
                  {
                    value: "finalization",
                    title: "APR Finalization",
                  },
                  {
                    value: "logs",
                    title: "Activity Logs",
                  },
                ]}
              />

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
              <TabsContent value="aprPreview" className="h-full">
                <MonitoringTablePage mode="create"></MonitoringTablePage>
              </TabsContent>

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
        </div>
      </ComponentContext.Provider>
    </>
  );
};

export const ComponentContext = createContext<any>({});

export const useProjectContext = () => useContext(ComponentContext);

export default withPermission(NewProjectPage, "Project.create");
