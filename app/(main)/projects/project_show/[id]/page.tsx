"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import MonitoringTablePage, { AprData } from "@/components/global/ExcelSheet";
import SubHeader from "@/components/global/SubHeader";
import { MultiSelect } from "@/components/multi-select";
import { SingleSelect } from "@/components/single-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useParentContext } from "@/contexts/ParentContext";
import { withPermission } from "@/lib/withPermission";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import EditIndicatorModal from "@/components/global/IndicatorEditModel";
import { useParams } from "next/navigation";
import OutcomeEditModal from "@/components/global/OutcomeEditModel";
import OutputEditModel from "@/components/global/OutputEditModel";


const isp3s: string[] = [
  "Improved Mental health and psychosocial well-being",
  "Total transfers for the MHPSS & Protection sector",
  "Reach of Care Practices",
  "Reach of Mental health and Psychosocial Support and Protection",
  "Reach of MHPSS, Care Practices and Protection capacity building activities",
  "Reach of MHPSS, Care Practices and Protection kits deliveries",
];

const ShowProjectPage = () => {

  const {id} = useParams();

  // These states will be used for showing the full version of comment that is being selected.
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();
  let [openAccordion, setOpenAccordion] = useState<string>("");

  // Project information.
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

  const [projectProvinces, setProjectProvinces] = useState<string[]>([]);

  const [outcomes, setOutcomes] = useState<
    {
      id: string | null;
      outcome: string;
      outcomeRef: string;
    }[]
  >([]);

  const [outputs, setOutputs] = useState<
    {
      id: string | null;
      outcomeId: string | null;
      outcomeRef: string;
      output: string;
      outputRef: string;
    }[]
  >([]);

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  let [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>();

  const [activeDessaggregationTab, setActiveDessaggregationTab] = useState<
    string | undefined
  >(undefined);

  const hundleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [sessionDessaggregationOptions, setSessionDessaggregationOptions] =
    useState<string[]>([
      "# 0f indevidual MHPSS consultations",
      "# 0f group MHPSS consultations",
    ]);

  const [
    indevidualDessaggregationOptions,
    setIndevidualDessaggregationOptions,
  ] = useState<string[]>([
    "Of Male (above 18)",
    "Of Female (above 18)",
    "of Male adolescents (12 to 17 years old)",
    "of Female adolescents (12 to 17 years old)",
    "of Male children (6 to 11 years old)",
    "of Female children (6 to 11 years old)",
    "of Male CU5 (boys)",
    "of Female CU5 (girls)",
  ]);

  const [enactDessaggregationOptions, setEnactDessaggregationOption] = useState<
    string[]
  >([
    "# of supervised psychosocial counsellors",
    "# Accumulated score EQUIP (ENACT) Tool",
  ]);

  const [desaggregations, setDessaggregations] = useState<
    {
      indicatorId: string | null;
      indicatorRef: string;
      dessaggration: string;
      province: string;
      target: number;
    }[]
  >([]);

  const [
    isThereAnyProvinceDessaggregationTotalOverflow,
    setIsThereAnyProvinceDessaggregationTotalOverflow,
  ] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedIndicator) return;

    const overflows: string[] = [];
    selectedIndicator.provinces.forEach((province) => {
      const totalForProvince = desaggregations
        .filter(
          (d) =>
            d.province === province.province &&
            d.indicatorRef === selectedIndicator?.indicatorRef
        )
        .reduce((sum, d) => sum + Number(d.target || 0), 0);

      if (totalForProvince > (province.target || 0)) {
        overflows.push(province.province);
      }
    });

    setIsThereAnyProvinceDessaggregationTotalOverflow(overflows);
  }, [desaggregations, selectedIndicator]);

  // Data for creating the preview of the final apr in apr preview TabContent.
  const finalDataForAprPreview: AprData = {
    impact: formData.projectGoal,
    outcomes: outcomes.map((outcome) => ({
      name: outcome.outcome,
      outputs: outputs
        .filter((output) => output.outcomeRef === outcome.outcomeRef)
        .map((output) => ({
          name: output.output,
          indicators: indicators
            .filter((indicator) => indicator.outputRef === output.outputRef)
            .flatMap((indicator) => {
              const main = {
                code: indicator.indicatorRef,
                name: indicator.indicator,
                target: indicator.target,
                disaggregation: desaggregations
                  .filter((d) => d.indicatorRef === indicator.indicatorRef)
                  .map((d) => ({
                    name: `${d.dessaggration}     (${d.province})`,
                    target: d.target,
                    province: d.province,
                  })),
              };

              let sub = null;

              if (indicator.subIndicator != null)
                sub = {
                  code: indicator.indicatorRef,
                  name: indicator.subIndicator.name,
                  target: indicator.subIndicator.target,
                  disaggregation: desaggregations
                    .filter(
                      (d) => d.indicatorRef === `sub-${indicator.indicatorRef}`
                    )
                    .map((d) => ({
                      name: `${d.dessaggration}     (${d.province})`,
                      target: d.target,
                      province: d.province,
                    })),
                };

              if (sub) return [main, sub];

              return [main];
            }),
        })),
    })),
  };

  const [isp3, setIsp3] = useState<
    {
      name: string;
      indicators: string[];
    }[]
  >(
    isp3s.map((i) => ({
      name: i,
      indicators: [],
    })),
  );

  // temp variable
  const [projectId, setProjectId] = useState<number | null>(null);

  const hundleSubmit = (
    parts: "project" | "outcome" | "output" | "indicator" | "dessaggration"
  ) => {

    // if (parts == "outcome" && outcome.trim() && outcomeRef.trim()) handleAddOutcome();
    // if (parts == "output" && output.trim() && outputRef.trim()) handleAddOutput();

    const [url, form]: [string, any] =
      parts == "project"
        ? ["/projects", formData]
        : parts == "outcome"
        ? [
            "/projects/outcome",
            {
              project_id: projectId,
              outcomes: outcomes.filter((outcome) => outcome.id == null),
            },
          ]
        : parts == "output"
        ? [
            "/projects/o/output",
            {
              outputs: outputs.filter((output) => output.id == null).map((output) => {
                const correspondingOutcomeId = outcomes.find(
                  (outcome) => outcome.outcomeRef == output.outcomeRef
                )?.id;

                output.outcomeId = correspondingOutcomeId ?? null;

                if (!output.outcomeId) {
                  reqForToastAndSetMessage(
                    `Output with referance ${output.outputRef} Has no valid outcome \n Note: Before creating some outputs to a outcome please ensure that it is stored in database !`
                  );

                  return;
                }

                const { outcomeRef, ...updatedOutputForApi } = output;

                return output;
              }),
            },
          ]
        : parts == "indicator"
        ? [
            "/projects/i/indicator",
            {
              indicators: indicators.filter((indicator) => indicator.id == null).map((indicator) => {
                const correspondingOutputId = outputs.find(
                  (output) => output.outputRef == indicator.outputRef
                )?.id;

                indicator.outputId = correspondingOutputId ?? null;

                if (!indicator.outputId) {
                  reqForToastAndSetMessage(
                    `Indicator with referance ${indicator.indicatorRef} has no valid output \n Note : Before creating some indicators to a output please ensure that the ouput is already stored in database !`
                  );

                  return;
                }

                const { outputRef, ...updatedIndicatoForApi } = indicator;

                return indicator;
              }),
            },
          ]
        : parts == "dessaggration" ? [
            "/projects/disaggregation",
            {
              dessaggregations: desaggregations.map((dessaggregation) => {
                let correspondingIndicatorId = indicators.find(
                  (indicator) =>
                    indicator.indicatorRef == dessaggregation.indicatorRef
                )?.id;

                if (!correspondingIndicatorId)
                  correspondingIndicatorId = indicators.find(
                    (indicator) =>
                      indicator.subIndicator?.indicatorRef ==
                      dessaggregation.indicatorRef
                  )?.id;

                dessaggregation.indicatorId = correspondingIndicatorId ?? null;

                if (!dessaggregation.indicatorId) {
                  reqForToastAndSetMessage(
                    `Dessaggregation with description ${dessaggregation.dessaggration} has no valid indicator \n Note : Before creating some dessaggregations to a indicator please ensure that the indicator is already stored in database !`
                  );

                  return;
                }

                const { indicatorRef, ...updatedDessaggregationForApi } =
                  dessaggregation;

                return dessaggregation;
              }),
            },
          ] : parts == "isp3" ? ["/projects/is/isp3", {
            isp3s: isp3
          }] : ["", ""];

    axiosInstance
      .post(url, form)
      .then((response: any) => {
        if (url == "/projects") setProjectId(response.data.data.id);
        if (url == "/projects/outcome")
          setOutcomes(
            outcomes.map((outcome) => {
              const outcomeId = response.data.data.find(
                (outcomeFromBackend: { id: string; outcomeRef: string }) =>
                  outcomeFromBackend.outcomeRef == outcome.outcomeRef
              ).id;

              outcome.id = outcomeId;

              return outcome;
            })
          );
        if (url == "/projects/output")
          setOutputs(
            outputs.map((output) => {
              const outputId = response.data.data.find(
                (outputFromBackend: { id: string; outputRef: string }) =>
                  outputFromBackend.outputRef == output.outputRef
              ).id;

              output.id = outputId;

              return output;
            })
          );
        if (url == "/projects/indicator")
          setIndicators(
            indicators.map((indicator) => {
              const indicatorId = response.data.data.find(
                (indicatorFromBackend: { id: string; indicatorRef: string }) =>
                  indicatorFromBackend.indicatorRef == indicator.indicatorRef
              ).id;

              if (indicator.subIndicator) {
                const subIndicatorId = response.data.data.find(
                  (indicatorFromBackend: { id: string; indicatorRef: string }) =>
                    indicatorFromBackend.indicatorRef == indicator.subIndicator!.indicatorRef
                ).id;

                indicator.subIndicator.id = subIndicatorId
              }

              indicator.id = indicatorId;

              return indicator;
            })
          );
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: any) => {
        console.log(error);
        reqForToastAndSetMessage(error.response.data.message);
      });
  };

  const handleDelete = (url: string, id: string | null) => {

    if (!id) return;

    axiosInstance.delete(url+`/${id}`)
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))

  }

  const projectAprStatusList = [
    "notCreatedYet",
    "created",
    "hodDhodApproved",
    "hodDhodRejected",
    "grantFinalized",
    "grantRejected",
    "hqFinalized",
    "hqRejected"
  ];

  const changeProjectAprStatus = (status: string) => {
    if (!projectAprStatusList.includes(status)) {
      reqForToastAndSetMessage("Wronge status !");
      return;
    }

    axiosInstance
      .post(`projects/status/change_apr_status/${projectId}`, {
        newStatus: status,
        comment: comment,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    setComment("");
  };

  const [comment, setComment] = useState<string>("");

  const [currentTab, setCurrentTab] = useState<string>("project");

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

  useEffect(() => {
    if (currentTab == "logs")
      axiosInstance
        .get(`/projects/logs/${projectId}`)
        .then((response: any) => setLogs(response.data.data))
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
  }, [currentTab]);


  const handleDessaggregationTargetInputChange = (e: any, province: any, opt: any) => {
    const num =
      e.target.value ===
      ""
        ? 0
        : Number(
            e.target.value
          );
    setDessaggregations(
      (prev) => {
        const foundIndex =
          prev.findIndex(
            (d) =>
              d.dessaggration ===
                opt &&
              d.province ===
                province.province &&
              d.indicatorRef ===
                selectedIndicator?.indicatorRef
          );
        if (
          foundIndex !==
          -1
        ) {
          const copy = [
            ...prev,
          ];
          copy[
            foundIndex
          ] = {
            ...copy[
              foundIndex
            ],
            target: num,
          };
          return copy;
        } else {
          return [
            ...prev,
            {
              indicatorId:
                selectedIndicator!
                  .id,
              indicatorRef:
                selectedIndicator!
                  .indicatorRef,
              dessaggration:
                opt,
              province:
                province.province,
              target: num,
            },
          ];
        }
      }
    );
  }

  // New method's to separating the logic code from ui code .


  const handleUpdateIndicator = (updatedIndicator: Indicator) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.indicatorRef == updatedIndicator.indicatorRef
          ? updatedIndicator
          : ind
      )
    );
    axiosInstance
      .put(`/projects/indicator/${updatedIndicator.id}`, updatedIndicator)
      .then((response: any) =>
      {
        reqForToastAndSetMessage(response.data.message)
        console.log(response.data.data)
      }
      )
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }

  const handleUpdateProjectDetails = () => {
    axiosInstance.post(`projects/${id}`, formData)
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
  }

  const handleUpdateOutcome = async (local: {id: string, outcome:string, outcomeRef: string}) => {
      if (!local.outcome.trim() || !local.outcomeRef.trim()) {
        reqForToastAndSetMessage("Please fill all the fields !");
        return;
      }

      try {
        const id = local!.id;
        const payload = {
          outcome: local.outcome,
          outcomeRef: local.outcomeRef,
        };

        const response = await axiosInstance.put(
          `/projects/outcome/${id}`,
          payload
        );

        // Update local outcomes state
        setOutcomes((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, outcome: local.outcome, outcomeRef: local.outcomeRef } : o
          )
        );

        reqForToastAndSetMessage(response.data?.message || "Outcome updated");
      } catch (error: any) {
        reqForToastAndSetMessage(
          error?.response?.data?.message || "Failed to update outcome"
        );
      } finally {
      }
  };

  const handleUpdateOutput = async (local: {id: string, output:string, outputRef: string}) => {
      if (!local.output.trim() || !local.outputRef.trim()) {
        reqForToastAndSetMessage("Please fill all the fields !");
        return;
      }

      try {
        // If backend expects PUT to /projects/outcome/:id to update
        const id = local!.id;
        const payload = {
          output: local.output,
          outputRef: local.outputRef,
        };

        const response = await axiosInstance.put(
          `/projects/output/${id}`,
          payload
        );

        // Update local outputs state
        setOutputs((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, outcome: local.output, outcomeRef: local.outputRef } : o
          )
        );

        reqForToastAndSetMessage(response.data?.message || "Output updated");
        setReqForOutputEditModel(null);
      } catch (error: any) {
        reqForToastAndSetMessage(
          error?.response?.data?.message || "Failed to update output"
        );
      } finally {
      }
  };

  const handleUpdateDessaggregation = () => {

    axiosInstance.put("/projects/dissaggregation", {
      "dessaggregations": desaggregations
    })
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))

  }

  const [reqForIndicatorEditModel, setReqForIndicatorEditModel] = useState<Indicator | null>(null);
  const [reqForOutcomeEditModel, setReqForOutcomeEditModel] = useState<{id: string, outcome: string, outcomeRef: string} | null>(null);
  const [reqForOutputEditModel, setReqForOutputEditModel] = useState<{id: string, output: string, outputRef: string} | null>(null);


  const [dessaggregationBeforeEdit, setDessaggregationBeforeEdit] = useState<{
    indicatorId: string | null;
    indicatorRef: string;
    dessaggration: string;
    province: string;
    target: number;
  }[]>([]);

  const [projectAprStatus, setProjectAprStatus] = useState<string>("notCreatedYet");

  useEffect(() => {

    axiosInstance.get(`/projects/${id}`)
    .then((response: any) => {
      const {outcomesInfo, ...project} = response.data.data;
      project["provinces"] = project.provinces.map((province: {id: string, name: string, pivo: any}) => province.name);
      setFormData(project);
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
  }, [])

  const mode: "edit" | "show" = "show";

  const readOnly = mode == "show";

  const [actionLogs, setActionLogs] = useState( [
  ]);

  useEffect(() => {
    axiosInstance.get(`/projects/get_project_finalizers_details/${id}`)
    .then((response: any) => setActionLogs(response.data.data))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
  }, [])

  return (
    <>
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
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>

                <CardContent className="overflow-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectCode">Project Code</Label>
                      <Input
                        id="projectCode"
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectTitle">Project Title</Label>
                      <Input
                        id="projectTitle"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectGoal">Project Goal</Label>
                      <Input
                        id="projectGoal"
                        name="projectGoal"
                        value={formData.projectGoal}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectDonor">Donor</Label>
                      <Input
                        id="projectDonor"
                        name="projectDonor"
                        value={formData.projectDonor}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="status">Status</Label>
                      <SingleSelect
                        options={[
                          { value: "planed", label: "Planed" },
                          { value: "ongoing", label: "On Going" },
                          { value: "completed", label: "Compleated" },
                          { value: "onhold", label: "On Hold" },
                          { value: "canclled", label: "Canclled" },
                        ]}
                        value={formData.status}
                        onValueChange={(value: string) => {
                          setFormData((prev) => ({
                            ...prev,
                            status: value,
                          }));
                        }}
                        placeholder="Project Status"
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="projectManeger">Project Manager</Label>
                      <Input
                        id="projectManager"
                        name="projectManager"
                        value={formData.projectManager}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="province">Province</Label>
                      <MultiSelect
                        options={[
                          { value: "kabul", label: "Kabul" },
                          { value: "badakhshan", label: "Badakhshan" },
                          { value: "ghor", label: "Ghor" },
                          { value: "helmand", label: "Helmand" },
                          { value: "daikundi", label: "Daikundi" },
                        ]}
                        value={formData.provinces}
                        onValueChange={(value: string[]) => {
                          setFormData((prev) => ({
                            ...prev,
                            provinces: value,
                          }));
                        }}
                        placeholder="Project Provinces ..."
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="thematicSector">Thematic Sector</Label>
                      <MultiSelect
                        options={[
                          { value: "mhpss", label: "MHPSS" },
                          { value: "wash", label: "WASH" },
                          { value: "health", label: "Health" },
                          { value: "nutrition", label: "Nutrition" },
                        ]}
                        value={formData.thematicSector}
                        onValueChange={(value: string[]) => {
                          setFormData((prev) => ({
                            ...prev,
                            thematicSector: value,
                          }));
                        }}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="reportingPeriod">Reporting Period</Label>
                      <Input
                        id="reportingPeriod"
                        name="reportingPeriod"
                        value={formData.reportingPeriod}
                        onChange={hundleFormChange}
                        type="text"
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="reportingDate">Reporting Date</Label>
                      <Input
                        id="reportingDate"
                        name="reportingDate"
                        value={formData.reportingDate}
                        onChange={hundleFormChange}
                        type="text"
                        disabled={readOnly}
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-full">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        placeholder="Type your message here."
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={hundleFormChange}
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                    {cardsBottomButtons(setCurrentTab, "project", handleUpdateProjectDetails, null, setCurrentTab, "outcome", true, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Outcome */}
            <TabsContent value="outcome" className="h-full">
              <Card className="relative h-full flex flex-col">
                <CardHeader className="w-full">
                  <CardTitle>Add Outcomes</CardTitle>
                  <CardDescription>
                    Define each Outcome with its reference code
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 overflow-auto">
                  <div className="mt-4 max-h-60 ">
                    {outcomes.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-3">
                        No outcomes added yet.
                      </p>
                    )}
                    {outcomes.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.outcome}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.outcomeRef}
                          </span>
                        </div>
                        
                          <div className="flex flex-row items-center justify-end gap-2">
                          {!readOnly && (
                            <Trash
                          onClick={() =>
                          {setOutcomes((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            handleDelete(`projects/outcome`, item.id)
                            }
                          }
                          
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          size={18}
                        />
                          )}
                        {item.id != null && 
                            !readOnly ? <Edit className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutcomeEditModel({
                              id: item.id!,
                              outcome: item.outcome,
                              outcomeRef: item.outcomeRef
                            })} size={18}></Edit> : <Eye className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutcomeEditModel({
                              id: item.id!,
                              outcome: item.outcome,
                              outcomeRef: item.outcomeRef
                            })} size={18}></Eye>
                        }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-row w-full gap-2 items-start justify-end bottom-1">
                  {cardsBottomButtons(setCurrentTab, "project", hundleSubmit, "outcome", setCurrentTab, "output", false, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Output */}
            <TabsContent value="output" className="h-full">
              <Card className="h-full flex flex-col overflow-auto">
                <CardHeader>
                  <CardTitle>Show Output</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={openAccordion}
                    onValueChange={setOpenAccordion}
                  >
                    {outcomes.filter((o) => o.id != null).map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{item.outcome}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance max-h-96 overflow-auto">
                          {/* List of added outputs for current outcome */}
                          <div className="mt-4 max-h-60 overflow-auto border rounded-xl">
                            {outputs.filter(
                              (o) => o.outcomeRef === item.outcomeRef
                            ).length === 0 && (
                              <p className="text-center text-sm text-muted-foreground py-3">
                                No outputs added yet.
                              </p>
                            )}
                            {outputs
                              .filter(  
                                (outputItem) =>
                                  outputItem.outcomeId === item.id
                              )
                              .map((outputItem, outIndex) => (
                                <div
                                  key={outIndex}
                                  className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {outputItem.output}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {outputItem.outputRef}
                                    </span>
                                  </div>
                                    <div className="flex flex-row items-center justify-end gap-2">
                                    {!readOnly && <Trash
                                    onClick={() =>
                                    {
                                      setOutputs((prev) =>
                                        prev.filter((_, i) => i !== outIndex)
                                      )
                                      handleDelete("projects/output", outputItem.id);
                                    }
                                    }
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    size={18}
                                  />}
                                  {outputItem.id && (
                                    !readOnly ? <Edit className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutputEditModel({
                                      id: outputItem.id!,
                                      output: outputItem.output,
                                      outputRef: outputItem.outputRef
                                    })} size={18}></Edit> : <Eye className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForOutputEditModel({
                                      id: outputItem.id!,
                                      output: outputItem.output,
                                      outputRef: outputItem.outputRef
                                    })} size={18}></Eye>
                                  )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>

                <CardFooter className="flex justify-end gap-2 bottom-1">
                    {cardsBottomButtons(setCurrentTab, "outcome", hundleSubmit, "output", setCurrentTab, "indicator", false, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Indicator */}
            <TabsContent value="indicator" className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Show Indicator</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 overflow-auto">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={openAccordion}
                    onValueChange={setOpenAccordion}
                  >
                    {outputs.filter((o) => o.id != null).map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{item.output}</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-6 max-h-[600px] overflow-auto">
                          {/* indicators list */}
                          <div className="mt-4 min-h-[240px] overflow-auto border rounded-xl">
                            {indicators
                              .filter((ind) => ind.outputRef === item.outputRef)
                              .map((indItem, indIndex) => (
                                <div
                                  key={indIndex}
                                  className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {indItem.indicator}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {indItem.indicatorRef}
                                    </span> 
                                  </div>
                                    <div className="flex flex-row items-center justify-end gap-2">
                                    {!readOnly && <Trash
                                    onClick={() =>
                                    {
                                      setIndicators((prev) =>
                                        prev.filter((_, i) => i !== indIndex)
                                      )
                                      handleDelete("projects/indicator", indItem.id);
                                    }
                                    }
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    size={18}
                                  />}
                                  {indItem.id && (
                                    !readOnly ? <Edit className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForIndicatorEditModel(indItem)} size={18}></Edit>
                                    : <Eye className="cursor-pointer text-orange-500 hover:text-orange-700" onClick={() => setReqForIndicatorEditModel(indItem)} size={18}></Eye>
                                  )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  {cardsBottomButtons(setCurrentTab, "output", hundleSubmit, "indicator", setCurrentTab, "dessaggregation", false, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Dessaggregation */}
            <TabsContent value="dessaggregation" className="h-full">
              <Card className="h-full w-full relative overflow-auto">
                <CardHeader>
                  <CardTitle>Dessaggregation</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 overflow-auto">
                  <div className="flex flex-col gap-3 w-full">
                    {/* List all indicators */}
                    {indicators.filter((indicator) => indicator.id != null).map((item, index) => (
                      <Card key={index} className="w-full">
                        <CardContent className="flex items-center justify-between ">
                          <span className="text-base font-medium">
                            {item.indicator}
                          </span>
                          <Button
                            onClick={() => {
                              setSelectedIndicator(item);
                              setActiveDessaggregationTab(
                                item.dessaggregationType
                                  .charAt(0)
                                  .toUpperCase() +
                                  item.dessaggregationType
                                    .slice(1)
                                    .toLowerCase()
                              );
                              setDessaggregationBeforeEdit(desaggregations);
                            }}
                          >
                            {!readOnly ? "Add" : "Check"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {selectedIndicator && (
                      <Dialog
                        open={true}
                        onOpenChange={() => setSelectedIndicator(null)}
                      >
                        <DialogContent className="flex flex-col justify-between sm:max-w-2xl md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {`${selectedIndicator.indicator}: (Target : ${selectedIndicator.target})`}
                            </DialogTitle>
                          </DialogHeader>
                          {/* Content */}
                          <div className="flex flex-col w-full h-full z-50">
                            {/* Tabs */}
                            <div className="flex flex-row items-center justify-around">
                              <Tabs
                                value={activeDessaggregationTab}
                                onValueChange={setActiveDessaggregationTab}
                                className="w-full h-full"
                              >
                                <TabsList className="items-center justify-around w-full">
                                  <TabsTrigger
                                    value={selectedIndicator.dessaggregationType.toLowerCase()}
                                  >
                                    {selectedIndicator.dessaggregationType.charAt(
                                      0
                                    ) +
                                      selectedIndicator.dessaggregationType
                                        .slice(1)
                                        .toLowerCase()}
                                  </TabsTrigger>
                                  {selectedIndicator.subIndicator && (
                                    <TabsTrigger
                                      value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                                    >
                                      {selectedIndicator.subIndicator.dessaggregationType.charAt(
                                        0
                                      ) +
                                        selectedIndicator.subIndicator.dessaggregationType
                                          .slice(1)
                                          .toLowerCase()}
                                    </TabsTrigger>
                                  )}
                                </TabsList>

                                {/* Main indicator dessaggregation page */}
                                <TabsContent
                                  className="w-full"
                                  value={selectedIndicator.dessaggregationType.toLowerCase()}
                                >
                                  {selectedIndicator.provinces.map(
                                    (province) => {
                                      const totalForProvince = desaggregations
                                        .filter(
                                          (d) =>
                                            d.province === province.province &&
                                            d.indicatorRef ===
                                              selectedIndicator?.indicatorRef
                                        )
                                        .reduce(
                                          (sum, d) =>
                                            sum + Number(d.target || 0),
                                          0
                                        );

                                      return (
                                        <React.Fragment key={province.province}>
                                          <Table className="border-2 mx-auto w-[90%]">

                                            <TableCaption className="caption-top text-left">
                                              {`${province.province} (Target : ${province.target})`}
                                            </TableCaption>

                                            <TableHeader>
                                              <TableRow className="border-2 w-10">
                                                <TableHead className="text-center">
                                                  <Checkbox />
                                                </TableHead>
                                                <TableHead className="text-center">
                                                  Description
                                                </TableHead>
                                                <TableHead className="text-center">
                                                  Target
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            
                                            <TableBody>
                                              {(selectedIndicator?.dessaggregationType ==
                                              "session"
                                                ? sessionDessaggregationOptions
                                                : selectedIndicator?.dessaggregationType ==
                                                  "indevidual"
                                                ? indevidualDessaggregationOptions
                                                : enactDessaggregationOptions
                                              ).map((opt, i) => {
                                                const existing =
                                                  desaggregations.find(
                                                    (d) =>
                                                      d.dessaggration === opt &&
                                                      d.province ===
                                                        province.province &&
                                                      d.indicatorRef ===
                                                        selectedIndicator?.indicatorRef
                                                  );
                                                const isChecked = !!existing;

                                                return (
                                                  <TableRow key={i}>
                                                    <TableCell className="text-center w-10">
                                                      <Checkbox
                                                      disabled={readOnly}
                                                        checked={isChecked}
                                                        onCheckedChange={(
                                                          checked
                                                        ) => {
                                                          if (checked) {
                                                            setDessaggregations(
                                                              (prev) => {
                                                                if (
                                                                  prev.some(
                                                                    (d) =>
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator?.indicatorRef
                                                                  )
                                                                )
                                                                  return prev;
                                                                return [
                                                                  ...prev,
                                                                  {
                                                                    indicatorId:
                                                                      selectedIndicator!
                                                                        .id,
                                                                    indicatorRef:
                                                                      selectedIndicator!
                                                                        .indicatorRef,
                                                                    dessaggration:
                                                                      opt,
                                                                    province:
                                                                      province.province,
                                                                    target: 0,
                                                                  },
                                                                ];
                                                              }
                                                            );
                                                          } else {
                                                            setDessaggregations(
                                                              (prev) =>
                                                                prev.filter(
                                                                  (d) =>
                                                                    !(
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator?.indicatorRef
                                                                    )
                                                                )
                                                            );
                                                          }
                                                        }}
                                                      />
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                      {opt}
                                                    </TableCell>

                                                    <TableCell>
                                                      <Input
                                                        type="number"
                                                        disabled={readOnly}
                                                        value={
                                                          existing
                                                            ? String(
                                                                existing.target
                                                              )
                                                            : ""
                                                        }
                                                        onChange={(e) => handleDessaggregationTargetInputChange(e, province, opt)}
                                                        className="mx-auto max-w-[200px] text-center"
                                                      />
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}

                                              <TableRow>
                                                <TableCell className="text-center w-10">
                                                  <Checkbox className="hidden" />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  TOTAL TARGET
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    disabled
                                                    value={totalForProvince}
                                                    className="mx-auto max-w-[200px] text-center"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                          {/* Error previewer */}
                                          {totalForProvince >
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) exceeds the
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          {totalForProvince <
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) should be equal to 
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          <Separator className="my-5" />
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TabsContent>

                                {/* Sub indicator dessaggration page */}
                                {selectedIndicator.subIndicator && (
                                  <TabsContent
                                    value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                                  >
                                    {selectedIndicator.provinces.map(
                                      (province) => {
                                        const totalForProvince = desaggregations
                                          .filter(
                                            (d) =>
                                              d.province ===
                                                province.province &&
                                              d.indicatorRef ===
                                                selectedIndicator?.subIndicator
                                                  ?.indicatorRef
                                          )
                                          .reduce(
                                            (sum, d) =>
                                              sum + Number(d.target || 0),
                                            0
                                          );

                                        return (
                                          <React.Fragment
                                            key={province.province}
                                          >
                                            <Table className="border-2 mx-auto w-[90%]">
                                              <TableCaption className="caption-top text-left">
                                                {province.province}
                                              </TableCaption>
                                              <TableHeader>
                                                <TableRow className="border-2 w-10">
                                                  <TableHead className="text-center">
                                                    <Checkbox />
                                                  </TableHead>
                                                  <TableHead className="text-center">
                                                    Description
                                                  </TableHead>
                                                  <TableHead className="text-center">
                                                    Target
                                                  </TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {(selectedIndicator
                                                  ?.subIndicator
                                                  ?.dessaggregationType ==
                                                "session"
                                                  ? sessionDessaggregationOptions
                                                  : indevidualDessaggregationOptions
                                                ).map((opt, i) => {
                                                  const existing =
                                                    desaggregations.find(
                                                      (d) =>
                                                        d.dessaggration ===
                                                          opt &&
                                                        d.province ===
                                                          province.province &&
                                                        d.indicatorRef ===
                                                          selectedIndicator
                                                            ?.subIndicator
                                                            ?.indicatorRef
                                                    );
                                                  const isChecked = !!existing;

                                                  return (
                                                    <TableRow key={i}>
                                                      <TableCell className="text-center w-10">
                                                        <Checkbox
                                                        disabled={readOnly}
                                                          checked={isChecked}
                                                          onCheckedChange={(
                                                            checked
                                                          ) => {
                                                            if (checked) {
                                                              setDessaggregations(
                                                                (prev) => {
                                                                  if (
                                                                    prev.some(
                                                                      (d) =>
                                                                        d.dessaggration ===
                                                                          opt &&
                                                                        d.province ===
                                                                          province.province &&
                                                                        d.indicatorRef ===
                                                                          selectedIndicator
                                                                            ?.subIndicator
                                                                            ?.indicatorRef
                                                                    )
                                                                  )
                                                                    return prev;
                                                                  return [
                                                                    ...prev,
                                                                    {
                                                                      indicatorId:
                                                                        selectedIndicator!
                                                                          .subIndicator!.id,
                                                                      indicatorRef:
                                                                        selectedIndicator!
                                                                          .subIndicator!
                                                                          .indicatorRef,
                                                                      dessaggration:
                                                                        opt,
                                                                      province:
                                                                        province.province,
                                                                      target: 0,
                                                                    },
                                                                  ];
                                                                }
                                                              );
                                                            } else {
                                                              setDessaggregations(
                                                                (prev) =>
                                                                  prev.filter(
                                                                    (d) =>
                                                                      !(
                                                                        d.dessaggration ===
                                                                          opt &&
                                                                        d.province ===
                                                                          province.province &&
                                                                        d.indicatorRef ===
                                                                          selectedIndicator
                                                                            ?.subIndicator
                                                                            ?.indicatorRef
                                                                      )
                                                                  )
                                                              );
                                                            }
                                                          }}
                                                        />
                                                      </TableCell>

                                                      <TableCell className="text-center">
                                                        {opt}
                                                      </TableCell>

                                                      <TableCell>
                                                        <Input
                                                        disabled={readOnly}
                                                          type="number"
                                                          value={
                                                            existing
                                                              ? String(
                                                                  existing.target
                                                                )
                                                              : ""
                                                          }
                                                          onChange={(e) => {
                                                            const num =
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : Number(
                                                                    e.target
                                                                      .value
                                                                  );
                                                            setDessaggregations(
                                                              (prev) => {
                                                                const foundIndex =
                                                                  prev.findIndex(
                                                                    (d) =>
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator
                                                                          ?.subIndicator
                                                                          ?.indicatorRef
                                                                  );
                                                                if (
                                                                  foundIndex !==
                                                                  -1
                                                                ) {
                                                                  const copy = [
                                                                    ...prev,
                                                                  ];
                                                                  copy[
                                                                    foundIndex
                                                                  ] = {
                                                                    ...copy[
                                                                      foundIndex
                                                                    ],
                                                                    target: num,
                                                                  };
                                                                  return copy;
                                                                } else {
                                                                  return [
                                                                    ...prev,
                                                                    {
                                                                      indicatorId:
                                                                        selectedIndicator!
                                                                          .subIndicator!.id,
                                                                      indicatorRef:
                                                                        selectedIndicator!
                                                                          .subIndicator!
                                                                          .indicatorRef,
                                                                      dessaggration:
                                                                        opt,
                                                                      province:
                                                                        province.province,
                                                                      target:
                                                                        num,
                                                                    },
                                                                  ];
                                                                }
                                                              }
                                                            );
                                                          }}
                                                          className="mx-auto max-w-[200px] text-center"
                                                        />
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                })}

                                                <TableRow>
                                                  <TableCell className="text-center w-10">
                                                    <Checkbox className="hidden" />
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    TOTAL TARGET
                                                  </TableCell>
                                                  <TableCell>
                                                    <Input
                                                      disabled
                                                      value={totalForProvince}
                                                      className="mx-auto max-w-[200px] text-center"
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            </Table>
                                             {/* Error previewer */}
                                          {totalForProvince >
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) exceeds the
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          {totalForProvince <
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) should be equal to 
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                            <Separator className="my-5" />
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  </TabsContent>
                                )}
                              </Tabs>
                            </div>
                          </div>
                          {!readOnly && (
                            <DialogFooter>
                            <div className="flex flex-row items-center justify-end fixed -bottom-40 gap-2">
                              <Button className="bg-blue-400" onClick={() => {
                                setDessaggregations([])
                              }}>
                                Reset
                              </Button>
                              <Button onClick={() => {
                                setDessaggregations(dessaggregationBeforeEdit);
                                setSelectedIndicator(null);
                              }} className="bg-red-400">
                                Cancel
                              </Button>
                              <Button className="bg-green-400" disabled={(() => {
                                const selectedIndicatorId = selectedIndicator.id;
                                let selectedIndicatorSubIndicatorId = null;
                                if (selectedIndicator.subIndicator) {
                                  selectedIndicatorSubIndicatorId = selectedIndicator.subIndicator.id
                                }

                                let selectedIndicatorDessaggregationsTotal = 0;

                                desaggregations.forEach((d) => d.indicatorId == selectedIndicatorId ? selectedIndicatorDessaggregationsTotal += Number(d.target) : selectedIndicatorDessaggregationsTotal += 0)

                                let selectedIndicatorSubIndicatorDessaggregationsTotal = 0;

                                if (selectedIndicatorSubIndicatorId) {

                                  desaggregations.forEach((d) => d.indicatorId == selectedIndicatorSubIndicatorId ? selectedIndicatorSubIndicatorDessaggregationsTotal += Number(d.target) : selectedIndicatorSubIndicatorDessaggregationsTotal += 0)

                                }

                                if (selectedIndicator.target == selectedIndicatorDessaggregationsTotal && selectedIndicator.subIndicator?.target == selectedIndicatorSubIndicatorDessaggregationsTotal) return false;
                                return true;
                              })()}
                              onClick={() => {
                                setSelectedIndicator(null);
                              }}
                              >
                                Done
                              </Button>
                            </div>
                        </DialogFooter> 
                          )}
                        </DialogContent>    
                              
                      </Dialog>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-row items-center justify-end w-full absolute bottom-5">
                  {cardsBottomButtons(setCurrentTab, "indicator", handleUpdateDessaggregation, null, setCurrentTab, "aprPreview", false, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* APR preview */}
            <TabsContent value="aprPreview" className="h-full">
              <MonitoringTablePage
                data={finalDataForAprPreview}
                provincesList={formData.provinces}
              ></MonitoringTablePage>
            </TabsContent>

            {/* ISP3 */}
            <TabsContent value="isp3" className="h-full">
              <Card className="h-full w-full relative overflow-auto">

                <CardHeader>
                  <CardTitle>ISP3</CardTitle>
                  <CardDescription>Link indicators to isp3.</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                  {isp3s.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <Label className="whitespace-nowrap">{name}</Label>

                      <div className="w-[280px] flex-shrink-0">
                        <MultiSelect
                          options={indicators
                            .filter((indicator) => indicator.id != null)
                            .map((ind) => ({
                              label: ind.indicatorRef,
                              value: ind.id!,
                            }))}
                          value={
                            isp3.find((i) => i.name == name)?.indicators ?? []
                          }
                          onValueChange={
                            (value: string[]) => {
                              console.log(value)
                              setIsp3((prev) => prev.map((i) => 
                              i.name == name ? 
                              {
                                ...i, indicators: value
                              } : i
                            ))
                            }
                          }
                          placeholder="Select indicator to link"
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="flex flex-row items-center justify-end w-full absolute bottom-5">
                  {cardsBottomButtons(setCurrentTab, "aprPreview", hundleSubmit, "isp3", setCurrentTab, "finalization", false, false, readOnly)}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* APR Finalization */}
            <TabsContent value="finalization" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Apr Finalization</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6">
                  {[
                    {
                      id: "create",
                      label: "Create",
                      description:
                        "This action will change the status of project to CREATED and send notification to manager for submitting.",
                      acceptStatusValue: "created",
                    },
                    {
                      id: "submit",
                      label: "Manager Submit",
                      description:
                        "This action will mark the project as submitted by manager.",
                      acceptStatusValue: "hodDhodApproved",
                      rejectStatusValue: "hodDhodRejected"
                    },
                    {
                      id: "grantFinalize",
                      label: "Grant Finalization",
                      description:
                        "This action will finalize the grant and update project status.",
                      acceptStatusValue: "grantFinalized",
                      rejectStatusValue: "grantRejected"
                    },
                    {
                      id: "hqFinalize",
                      label: "HQ Finalization",
                      description:
                        "This action will finalize the project at HQ level.",
                      acceptStatusValue: "hqFinalized",
                      rejectStatusValue: "hqRejected"
                    },
                  ].map((step, index) => {
                    const canReject = index !== 0;
                    return (
                      <div
                        key={step.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Checkbox
                                id={step.id}
                                checked={(() => {
                                  const currentIdx = projectAprStatusList.indexOf(projectAprStatus);
                                  const stepIdx = projectAprStatusList.indexOf(step.acceptStatusValue!);
                                  return stepIdx !== -1 && currentIdx >= stepIdx;
                                })()}
                                onCheckedChange={() => {}}
                                disabled={readOnly}
                              />
                            </AlertDialogTrigger>

                            <AlertDialogContent className="space-y-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {canReject ? (
                                    <>
                                      Do you want to{" "}
                                      <span className="text-green-600">Accept</span> or{" "}
                                      <span className="text-red-600">Reject</span> this step?
                                    </>
                                  ) : (
                                    <>
                                      Confirm <span className="text-green-600">{step.label}</span>?
                                    </>
                                  )}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {step.description}
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              {/* Textarea for comment */}
                              <div className="flex flex-col gap-2">
                                <Label
                                  htmlFor={`comment-${step.id}`}
                                  className="text-sm font-medium"
                                >
                                  Enter your comment
                                </Label>
                                <Textarea
                                  id={`comment-${step.id}`}
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="resize-none border rounded p-2 text-sm"
                                  placeholder="Write your comment here..."
                                />
                              </div>

                              <AlertDialogFooter className="flex justify-between">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                {canReject ? (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        if (comment.trim()) {
                                          changeProjectAprStatus(step.rejectStatusValue!);
                                        } else {
                                          reqForToastAndSetMessage("Comment section is required !");
                                        }
                                      }}
                                    >
                                      Reject
                                    </Button>

                                    <Button
                                      onClick={() => {
                                        if (comment.trim()) {
                                          changeProjectAprStatus(step.acceptStatusValue!);
                                        } else {
                                          reqForToastAndSetMessage("Comment section is required !");
                                        }
                                      }}
                                    >
                                      Accept
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      if (comment.trim()) {
                                        changeProjectAprStatus(step.acceptStatusValue!);
                                      } else {
                                        reqForToastAndSetMessage("Comment section is required !");
                                      }
                                    }}
                                  >
                                    Continue
                                  </Button>
                                )}
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Label htmlFor={step.id}>{step.label}</Label>
                        </div>
                      </div>
                    );
                  })}

                  {/* Action Progress Bar */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Action Progress</h3>

                    <div className="flex items-center gap-4 overflow-x-auto p-3  rounded-xl shadow-inner">
                      {actionLogs.map((log: any, i) => (
                        <div
                          key={log.id}
                          className="flex items-center gap-2 shrink-0"
                        >
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={log.avatar}
                              alt={log.name}
                              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                            />
                            <span className="text-xs mt-1 font-medium">{log.name}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                log.action === "Accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {log.action}
                            </span>
                          </div>

                          {i < actionLogs.length - 1 && (
                            <div className="w-10 h-[2px] bg-gray-300 mx-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* APR Logs */}
            <TabsContent value="logs" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Apr Finalization</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <>
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Action</TableHead>
                          <TableHead className="w-[120px]">Doer</TableHead>
                          <TableHead className="w-[120px]">Result</TableHead>
                          <TableHead className="w-[250px]">Comment</TableHead>
                          <TableHead className="w-[120px]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.action}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                            <TableCell>{item.result}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => {
                                  setSelectedComment(item.comment);
                                  setOpen(true);
                                }}
                                className="block max-w-[220px] truncate text-left hover:underline"
                                title={"Click for check full comment"}
                              >
                                {item.comment}
                              </button>
                            </TableCell>
                            <TableCell>{item.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Comment</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2 text-sm text-gray-700">
                          {selectedComment}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button onClick={() => setOpen(false)}>Close</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {reqForIndicatorEditModel && (
          <EditIndicatorModal
          isOpen={!!reqForIndicatorEditModel}
          onClose={() => setReqForIndicatorEditModel(null)}
          onSave={(indicator) => {
            handleUpdateIndicator(indicator);

            setReqForIndicatorEditModel(null);
          }}
          indicatorData={reqForIndicatorEditModel}
          indicators={indicators}
          mode={!readOnly ? "edit" : "show"}
        />
        )}

        {reqForOutcomeEditModel && <OutcomeEditModal isOpen={!!reqForOutcomeEditModel} onSave={handleUpdateOutcome} onClose={() => setReqForOutcomeEditModel(null)} outcomeData={reqForOutcomeEditModel} outcomes={outcomes} mode={!readOnly ? "edit" : "show"} ></OutcomeEditModal> }
        
        {reqForOutputEditModel && <OutputEditModel isOpen={!!reqForOutputEditModel} onClose={() => setReqForOutputEditModel(null)} onSave={handleUpdateOutput} outputData={reqForOutputEditModel} outputs={outputs} mode={!readOnly ? "edit" : "show"} ></OutputEditModel>}
        
      </div>
    </>
  );
};


const cardsBottomButtons = (backBtnOnClick: any, backBtnOnClickFuncInput: string, saveBtnOnClick: any, saveBtnOnClickFuncInput: string | null, nextBtnOnClick: any, nextBtnOnClickFuncInput: string, backBtnDisabled?: boolean, nextBtnDisabled?: boolean, saveBtnDisabled?: boolean) => {

  return (
    <>
      <Button disabled={backBtnDisabled} variant="outline" onClick={() => backBtnOnClick(backBtnOnClickFuncInput)}>Back</Button>
        {!saveBtnDisabled && (
          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Save</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (saveBtnOnClickFuncInput)
                    saveBtnOnClick(saveBtnOnClickFuncInput)

                  else 
                    saveBtnOnClick()
                }}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        )}
      <Button disabled={nextBtnDisabled} onClick={() => nextBtnOnClick(nextBtnOnClickFuncInput)} variant={"outline"}>Next</Button>
    </>
  )

}

// export default withPermission(NewProjectPage, "Project.create");

export default withPermission(ShowProjectPage, "Project.view");
