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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { createAxiosInstance } from "@/lib/axios";
import { withPermission } from "@/lib/withPermission";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount from "@/lib/IndicatorProvincesTargetCalculator";
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

const EditProjectPage = () => {

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

  // const [projectProvinces, setProjectProvinces] = useState<string[]>([]);

  let [outcome, setOutcome] = useState<string>("");
  let [outcomeRef, setOutcomeRef] = useState<string>("");

  const [outcomes, setOutcomes] = useState<
    {
      id: string | null;
      outcome: string;
      outcomeRef: string;
    }[]
  >([]);

  let [output, setOutput] = useState<string>("");
  let [outputRef, setOutputRef] = useState<string>("");
  const [outputs, setOutputs] = useState<
    {
      id: string | null;
      outcomeId: string | null;
      outcomeRef: string;
      output: string;
      outputRef: string;
    }[]
  >([]);

  const [indicator, setIndicator] = useState<Indicator>({
    id: null,
    outputId: null,
    outputRef: "",
    indicator: "",
    indicatorRef: "",
    target: 0,
    status: "active",
    provinces: [],
    dessaggregationType: "session",
    description: "",
    database: "main",
    type: null,
    subIndicator: null,
  });

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [reqForSubIndicator, setReqForSubIndicator] = useState<boolean>(false);

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

  const hundleOutPutFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    name == "output" ? setOutput(value) : setOutputRef(value);
  };

  const hundleIndicatorFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    if (name == "dessaggregationType" && value == "enact") 
      if (reqForSubIndicator) setReqForSubIndicator(false);

    if (name == "subIndicatorName") {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: {
          id: prev.subIndicator ? prev.subIndicator.id : null,
          indicatorRef: `sub-${prev.indicatorRef}`,
          type: prev.subIndicator ? prev.subIndicator.type : null,
          dessaggregationType:
            indicator.dessaggregationType == "session"
              ? "indevidual"
              : "session",
          target: prev.subIndicator ? prev.subIndicator.target : 0,
          provinces: prev.subIndicator ? prev.subIndicator.provinces : [],
          name: value,
        },
      }));
      return;
    }

    if (name == "subIndicatorTarget") {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: {
          id: prev.subIndicator ? prev.subIndicator.id : null,
          indicatorRef: `sub-${prev.indicatorRef}`,
          type: prev.subIndicator ? prev.subIndicator.type : null,
          dessaggregationType:
            indicator.dessaggregationType == "session"
              ? "indevidual"
              : "session",

          name: prev.subIndicator ? prev.subIndicator.name : "",
          provinces: prev.subIndicator ? prev.subIndicator.provinces : [],
          target: value as unknown as number,
        },
      }));
      return;
    }

    if (name == "subIndicatorProvinceCouncilorCount") {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: {
          ...prev!.subIndicator!,
          provinces: prev.subIndicator!.provinces.map((province) => {
            if (province == e.target.province) {
              province.councilorCount = value as unknown as number;
              return province;
            }

            return province;
          }),
        },
      }));
      return;
    }

    if (name == "subIndicatorProvinceTarget") {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: {
          ...prev!.subIndicator!,
          provinces: prev.subIndicator!.provinces.map((province) => {
            if (province == e.target.province) {
              province.target = value as unknown as number;
              return province;
            }

            return province;
          }),
        },
      }));
      return;
    }

    setIndicator((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function hasEmptyField(value: any): boolean {
    console.log(value);
    if (value === null || value === undefined) return true;

    console.log("pass", value);
    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (typeof value === "number") {
      return Number.isNaN(value);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return true;
      return value.some((v) => hasEmptyField(v));
    }

    if (typeof value === "object") {
      return Object.values(value).some((v) => hasEmptyField(v));
    }
    return false;
  }

  const addIndicatorToIndicatorsState = (outputRef: string) => {

    if (indicators.some((ind) => ind.indicatorRef == indicator.indicatorRef)) {
      reqForToastAndSetMessage("A project can not have two indicators with same referance !")
      return;
    }

    const updatedIndicator = {
      ...indicator,
      outputRef: outputRef,
    };

    // const error = hasEmptyField(updatedIndicator);
    // if (error) {
    //   reqForToastAndSetMessage("Please fill all fields !");
    //   return;
    // }

    // console.log(updatedIndicator);

    setIndicators((prev) => [...prev, updatedIndicator]);

    setIndicator({
      id: null,
      outputId: null,
      outputRef: "",
      indicator: "",
      indicatorRef: "",
      target: 0,
      status: "notStarted",
      provinces: [],
      dessaggregationType: "indevidual",
      database: "",
      type: null,
      description: "",
      subIndicator: null,
    });

    setReqForSubIndicator(false);
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

  // useEffect(() => {
  //   console.log("formData", formData);
  //   console.log("outcomes", outcomes);
  //   console.log("outputs", outputs);
  //   console.log("indicators", indicators);
  //   console.log("dessaggregations", desaggregations);
  //   console.log(isp3);
  // }, [formData, outcomes, outputs, indicators, desaggregations, isp3]);

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
            "/projects/o/outcome",
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

    console.log(status)

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

  const handleAddOutcome = () => {

    if (!outcome.trim() || !outcomeRef.trim()) {
      reqForToastAndSetMessage("Please fill all the fields !");
      return
    } else if (outcomes.find((outcome) => outcome.outcomeRef == outcomeRef)) {
      reqForToastAndSetMessage("A project can not have two outcomes with same referance !")
      return
    }
    setOutcomes((prev) => [
      ...prev,
      { id: null, outcome, outcomeRef },
    ]);
    setOutcome("");
    setOutcomeRef("");

  }

  const handleAddOutput = (newOutputData: {
    id: string | null,
    outcomeId: string | null,
    outcomeRef: string,
    output: string,
    outputRef: string
  }) => {
    if (!output.trim()) {
      reqForToastAndSetMessage("Please fill all the fields !")
      return
    } else if (outputs.find((outputFromOutputs) => (outputFromOutputs.outputRef == newOutputData.outputRef))) {
      reqForToastAndSetMessage("A project can not have two outputs with same referance !");
      return;
    }


    setOutputs((prev) => [
      ...prev,
      newOutputData,
    ]);
    setOutput("");
    setOutputRef("");
  }

  const handleAddSubIndicator = () => {
     if (
      !indicator.dessaggregationType ||
      indicator.dessaggregationType == "enact"
    ) {
      const errorText: string =
        !indicator.dessaggregationType
          ? "Main indicator dessaggregation type is empty !"
          : "Enact indicator can not have sub indicator";
      reqForToastAndSetMessage(errorText);
      return;
    }

    if (!reqForSubIndicator) {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: {
          id: null,
          indicatorRef: `sub-${prev.indicatorRef}`,
          name: "",
          target: 0,
          type: null,
          dessaggregationType:
            prev.dessaggregationType === "session"
              ? "indevidual"
              : "session",
          provinces: prev.provinces.map(
            (province) => ({
              province: province.province,
              target: 0,
              councilorCount: 0,
            })
          ),
        },
      }));

      setReqForSubIndicator(true);
    } else {
      setIndicator((prev) => ({
        ...prev,
        subIndicator: null,
      }));

      setReqForSubIndicator(false);
    }
  }

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
    console.log(123);
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
        // If backend expects PUT to /projects/outcome/:id to update
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
      console.log(response);
      const {outcomesInfo, ...project} = response.data.data;
      project["provinces"] = project.provinces.map((province: {id: string, name: string, pivo: any}) => province.name);
      console.log(project.provinces )
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

  const mode: "edit" | "show" = "edit";

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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="outcome">Outcome</Label>
                      <Input
                        id="outcome"
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="Enter outcome title..."
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="outcomeRef">Outcome Reference</Label>
                      <Input
                        id="outcomeRef"
                        value={outcomeRef}
                        onChange={(e) => setOutcomeRef(e.target.value)}
                        placeholder="Enter outcome reference..."
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                  {!readOnly && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handleAddOutcome}
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} /> Add Outcome
                      </Button>
                    </div>
                  )}

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
                  <CardTitle>Add Output</CardTitle>
                  <CardDescription>
                    Define each Output with its reference code.
                  </CardDescription>
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`output-${index}`}>Output</Label>
                              <Input
                                id={`output-${index}`}
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                placeholder="Enter output title..."
                                disabled={readOnly}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`outputRef-${index}`}>
                                Output Reference
                              </Label>
                              <Input
                                id={`outputRef-${index}`}
                                value={outputRef}
                                onChange={(e) => setOutputRef(e.target.value)}
                                placeholder="Enter output reference..."
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                          {/* Add Btn */}
                          {!readOnly && (
                            <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={() => handleAddOutput({
                                                                id: null,
                                                                outcomeId: item.id,
                                                                outcomeRef: item.outcomeRef,
                                                                output: output,
                                                                outputRef: outputRef,
                                                              })}
                              className="flex items-center gap-2"
                            >
                              <Plus size={16} /> Add Output
                            </Button>
                          </div>
                          )}

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
                  <CardTitle>Add Indicator</CardTitle>
                  <CardDescription>
                    Define each Indicator with its properties.
                  </CardDescription>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Indicator */}
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`indicator-${index}`}>
                                Indicator
                              </Label>
                              <Input
                                id={`indicator-${index}`}
                                name="indicator"
                                value={indicator.indicator}
                                onChange={hundleIndicatorFormChange}
                                placeholder="Enter indicator"
                                disabled={readOnly}
                              />
                            </div>

                            {/* Indicator Reference */}
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`indicatorRef-${index}`}>
                                Indicator Reference
                              </Label>
                              <Input
                                id={`indicatorRef-${index}`}
                                name="indicatorRef"
                                value={indicator.indicatorRef}
                                onChange={hundleIndicatorFormChange}
                                placeholder="Enter indicator reference..."
                                disabled={readOnly}
                              />
                            </div>

                            {/* Target */}
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`target-${index}`}>
                                Indicator Target
                              </Label>
                              <Input
                                id={`target-${index}`}
                                name="target"
                                value={indicator.target}
                                onChange={hundleIndicatorFormChange}
                                placeholder="Enter indicator target..."
                                disabled={readOnly}
                              />
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`status-${index}`}>
                                Indicator Status
                              </Label>
                              <SingleSelect
                                options={[
                                  { value: "notStarted", label: "Not Started" },
                                  { value: "inProgress", label: "In Progress" },
                                  { value: "achived", label: "Achived" },
                                  { value: "notAchived", label: "Not Achived" },
                                  {
                                    value: "partiallyAchived",
                                    label: "Partially Achived",
                                  },
                                ]}
                                value={indicator.status}
                                onValueChange={(value: string) => {
                                  setIndicator((prev) => ({
                                    ...prev,
                                    status: value,
                                  }));
                                }}
                                placeholder="Indicator Status"
                                disabled={readOnly}
                              />
                            </div>

                            <div className="flex flex-col gap-1 col-span-full">
                              <Label htmlFor={`province-${index}`}>
                                Indicator Provinces
                              </Label>
                              <MultiSelect
                                options={formData.provinces.map((province) => ({
                                  label: province.toLowerCase(),
                                  value:
                                    province.charAt(0).toUpperCase() +
                                    province.slice(1),
                                }))}
                                value={indicator.provinces.map(
                                  (province) => province.province
                                )}
                                onValueChange={(value: string[]) =>
                                {
                                  if (!indicator.subIndicator) {
                                    setIndicator((prev) => {
                                    return {
                                      ...prev,
                                    provinces: value.map((v) => ({
                                      province: v,
                                      target: 0,
                                      councilorCount: 0,
                                    })),
                                    }
                                  })
                                  }else {
                                    setIndicator((prev) => {
                                    return {
                                      ...prev,
                                    provinces: value.map((v) => ({
                                      province: v,
                                      target: 0,
                                      councilorCount: 0,
                                    })),
                                    subIndicator: {
                                      ...prev.subIndicator,
                                      id: prev.subIndicator!.id,
                                      indicatorRef: prev.subIndicator!.indicatorRef,
                                      name: prev.subIndicator!.name,
                                      target: prev.subIndicator!.target,
                                      type: prev.subIndicator!.type,
                                      dessaggregationType:
                                        prev.subIndicator!.dessaggregationType,
                                      provinces: value.map((v) => ({
                                        province: v,
                                        target: 0,
                                        councilorCount: 0,
                                      })),
                                    }
                                    }
                                  })
                                  }
                                }
                                }
                                disabled={readOnly}
                              />
                            </div>

                            {/* Database */}
                            <div className="flex flex-col gap-1 col-span-full">
                              <Label>Database</Label>
                              <SingleSelect
                                options={[
                                  {
                                    value: "main_database",
                                    label: "Main Database",
                                  },
                                  {
                                    value: "main_database_meal_tool",
                                    label: "Main Database (Target: Meal Tool)",
                                  },
                                  {
                                    value: "kit_database",
                                    label: "Kit Database",
                                  },
                                  {
                                    value: "psychoeducation_database",
                                    label: "Psychoeducation Database",
                                  },
                                  {
                                    value: "cd_database",
                                    label: "Community Dialog Database",
                                  },
                                  {
                                    value: "training_database",
                                    label: "Training Database",
                                  },
                                  {
                                    value: "referral_database",
                                    label: "Referral Database",
                                  },
                                  {
                                    value: "enact_database",
                                    label: "Enact Database",
                                  },
                                ].filter((opt) => {
                                  if (opt.value == "main_database") {
                                    if (indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "adult_psychosocial_support") 
                                      && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "child_psychosocial_support")
                                    && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "parenting_skills")
                                  && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "child_care_practices"))
                                      return false;
                                  
                                  }
                                  return true;
                                })}
                                value={indicator.database}
                                onValueChange={(value: string) =>
                                  setIndicator((prev) => ({
                                    ...prev,
                                    database: value,
                                    dessaggregationType: value == "main_database" ? "session" : value == "enact_database"
                                    ? "enact" : "indevidual"
                                  }))
                                }
                                disabled={readOnly}
                              />

                              {/* Type if the database is main database (backend helper) */}
                              {(indicator.database == "main_database") && (
                                <div className="flex flex-col gap-1 col-span-full">
                                  <Label>Type</Label>
                                  <SingleSelect
                                    options={[
                                      {
                                        value: "adult_psychosocial_support",
                                        label: "Adult Psychosocial Support",
                                      },
                                      {
                                        value: "child_psychosocial_support",
                                        label: "Child Psychosocial Support",
                                      },
                                      {
                                        value: "parenting_skills",
                                        label: "Parenting Skills",
                                      },
                                      {
                                        value: "child_care_practices",
                                        label: "Child Care Practices",
                                      },
                                    ].filter((opt) => !indicators.find((indicator) => (indicator.database == "main_database" && indicator.type == opt.value)))}
                                    value={indicator.type as unknown as string}
                                    onValueChange={(value: string) =>
                                      setIndicator((prev) => ({
                                        ...prev,
                                        type: value,
                                      }))
                                    }
                                    disabled={readOnly}
                                  />
                                </div>
                              )}

                              {/* Provinces fields */}
                              {indicator.provinces && (
                                <div className="flex flex-col gap-4 mt-4">
                                  <Separator className="my-2" />
                                  {indicator.provinces.map((province, idx) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                                    >
                                      <div>
                                        <span>{province.province}</span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <Label
                                          htmlFor={`${province.province}-count`}
                                        >
                                          Councular Count
                                        </Label>
                                        <Input
                                          id={`${province.province}-count`}
                                          type="number"
                                          value={province.councilorCount || 0}
                                          onChange={(e) => {
                                            const value = Number(
                                              e.target.value
                                            );

                                            setIndicator((prev) => {
                                              const updatedProvinces =
                                                prev.provinces.map((p) =>
                                                  p.province ===
                                                  province.province
                                                    ? {
                                                        ...p,
                                                        councilorCount: value,
                                                      }
                                                    : p
                                                );

                                              calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
                                                {
                                                  ...prev,
                                                  provinces: updatedProvinces,
                                                }
                                                ,setIndicator
                                              );

                                              return {
                                                ...prev,
                                                provinces: updatedProvinces,
                                              };
                                            });
                                          }}
                                          placeholder={`${
                                            province.province
                                              .charAt(0)
                                              .toUpperCase() +
                                            province.province
                                              .slice(1)
                                              .toLowerCase()
                                          } Councular Count ...`}
                                          disabled={readOnly}
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <Label
                                          htmlFor={`${province.province}-target`}
                                        >
                                          Target
                                        </Label>
                                        <Input
                                          id={`${province.province}-target`}
                                          type="number"
                                          value={province.target || 0}
                                          onChange={(e) => {
                                            const value = Number(
                                              e.target.value
                                            );
                                            setIndicator((prev) => ({
                                              ...prev,
                                              provinces: prev.provinces.map(
                                                (p) =>
                                                  p.province ===
                                                  province.province
                                                    ? {
                                                        ...p,
                                                        target: value,
                                                      }
                                                    : p
                                              ),
                                            }));
                                          }}
                                          placeholder={`${
                                            province.province
                                              .charAt(0)
                                              .toUpperCase() +
                                            province.province
                                              .slice(1)
                                              .toLowerCase()
                                          } Target ...`}
                                          disabled={readOnly}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dessaggregation Type */}
                          <div className="flex flex-col gap-1 col-span-full">
                            <Label htmlFor={`dessaggregationType-${index}`}>
                              Dessagreggation Type
                            </Label>
                            <RadioGroup
                              name="dessaggregationType"
                              value={indicator.dessaggregationType}
                              onValueChange={(value: string) => {
                                const e = {
                                  target: {
                                    name: "dessaggregationType",
                                    value: value,
                                  },
                                };
                                hundleIndicatorFormChange(e);
                              }}
                              className="flex gap-6"
                              disabled={readOnly}
                            >
                              {(indicator.database == "main_database") && 
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="session"
                                  id={`r1-${index}`}
                                  disabled={readOnly}
                                />
                                <Label htmlFor={`r1-${index}`}>Session</Label>
                              </div>}
                              
                              {indicator.database != "enact_database" && (
                                <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="indevidual"
                                  id={`r2-${index}`}
                                  disabled={readOnly}
                                />
                                <Label htmlFor={`r2-${index}`}>
                                  Indevidual
                                </Label>
                              </div>
                              )}  
                              {indicator.database == "enact_database" && (
                                <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value="enact"
                                  id={`r3-${index}`}
                                  disabled={readOnly}
                                />
                                <Label htmlFor={`r3-${index}`}>Enact</Label>
                              </div>
                              )}
                            </RadioGroup>
                          </div>

                          {/* Description */}
                          <div className="flex flex-col gap-1 col-span-full">
                            <Label htmlFor={`description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`description-${index}`}
                              name="description"
                              value={indicator.description}
                              onChange={hundleIndicatorFormChange}
                              placeholder="Enter description..."
                              disabled={readOnly}
                            />
                          </div>

                          {/* Sub Indicator (will be showed by a condition) */}
                          <div
                            className={`flex flex-col gap-2 col-span-full ${
                              reqForSubIndicator ? "block" : "hidden"
                            }`}
                          >
                            <div className="flex flex-row justify-start items-center">
                              <span>Sub Indicator Details</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Sub indicator name */}
                              <div className="flex flex-col gap-1">
                                <Label htmlFor={`sub-name-${index}`}>
                                  Sub Indicator Name
                                </Label>
                                <Input
                                  id={`sub-name-${index}`}
                                  name="subIndicatorName"
                                  value={indicator.subIndicator?.name}
                                  onChange={hundleIndicatorFormChange}
                                  placeholder="Enter sub indicator name..."
                                  disabled={readOnly}
                                />
                              </div>
                              {/* sub indicator target */}
                              <div className="flex flex-col gap-1">
                                <Label htmlFor={`sub-target-${index}`}>
                                  Sub Indicator Target
                                </Label>
                                <Input
                                  id={`sub-target-${index}`}
                                  name="subIndicatorTarget"
                                  value={indicator.subIndicator?.target}
                                  onChange={hundleIndicatorFormChange}
                                  placeholder="Enter sub indicator target..."
                                  disabled={readOnly}
                                />
                              </div>
                            </div>

                            {indicator.provinces &&
                              indicator.subIndicator?.provinces && (
                                <div className="flex flex-col gap-4 mt-4">
                                  <Separator className="my-2" />
                                  {indicator.subIndicator.provinces.map(
                                    (province, idx) => (
                                      <div
                                        key={idx}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                                      >
                                        <div>
                                          <span>{province.province}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <Label
                                            htmlFor={`${province.province}-count`}
                                          >
                                            Councular Count
                                          </Label>
                                          <Input
                                            id={`${province.province}-count`}
                                            type="number"
                                            name="subIndicatorProvinceCouncilorCount"
                                            value={province.councilorCount || 0}
                                            onChange={(e) => {
                                              hundleIndicatorFormChange({
                                                target: {
                                                  province: province,
                                                  name: e.target.name,
                                                  value: e.target.value,
                                                },
                                              });
                                            }}
                                            disabled={readOnly}
                                          />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <Label
                                            htmlFor={`${province.province}-target`}
                                          >
                                            Target
                                          </Label>
                                          <Input
                                            id={`${province.province}-target`}
                                            type="number"
                                            name="subIndicatorProvinceTarget"
                                            value={province.target || 0}
                                            onChange={(e) => {
                                              hundleIndicatorFormChange({
                                                target: {
                                                  province: province,
                                                  name: e.target.name,
                                                  value: e.target.value,
                                                },
                                              });
                                            }}
                                            disabled={readOnly}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Buttons */}
                          {!readOnly && (
                            <div className="flex justify-end mt-4 gap-2">
                            <Button
                              type="button"
                              className="flex items-center gap-2"
                              onClick={handleAddSubIndicator}
                              disabled={
                                indicator.dessaggregationType == "enact" 
                              }
                            >
                              <Plus size={16} />
                              {reqForSubIndicator
                                ? "Remove Sub Indicator"
                                : "Add Sub Indicator"}
                            </Button>

                            <Button
                              type="button"
                              onClick={() =>
                                addIndicatorToIndicatorsState(item.outputRef)
                              }
                              className="flex items-center gap-2"
                            >
                              <Plus size={16} /> Add Indicator
                            </Button>
                          </div>
                          )}

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
                  <CardDescription>
                    Define dessaggregation for your indicators.
                  </CardDescription>
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

                                  // اگر مرحله reject شده، تیک نخورده باشد
                                  const isRejected = step.rejectStatusValue
                                    ? projectAprStatus === step.rejectStatusValue
                                    : false;

                                  return !isRejected && stepIdx !== -1 && currentIdx >= stepIdx;
                                })()}
                                onCheckedChange={() => {}}
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

export default withPermission(EditProjectPage, "Project.edit");

