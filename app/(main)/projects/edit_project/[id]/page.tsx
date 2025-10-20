"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { Plus, Trash } from "lucide-react";

type Indicator = {
  id: string | null;
  outputId: string | null;
  outputRef: string;
  indicator: string;
  indicatorRef: string;
  target: number;
  status: string;
  database: string;
  type: string | null;
  provinces: { province: string; target: number; councilorCount: number }[];
  dessaggregationType: "session" | "indevidual" | "iniac";
  description: string;
  subIndicator: {
    id: string | null;
    indicatorRef: string;
    name: string;
    target: number;
    dessaggregationType: string;
    type: null | string;
    provinces: { province: string; target: number; councilorCount: number }[];
  } | null;
};

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

export default function EditProjectPage() {
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
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [desaggregations, setDessaggregations] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`/projects/${id}`)
      .then((res) => {
        const data = res.data.data;

        console.log(res.data.data);

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

        console.log(allDessaggregations);
        setDessaggregations(allDessaggregations);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(
          error.response?.data?.message || "Something went wrong"
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = () => {
    if (!id) return reqForToastAndSetMessage("Project ID is missing!");

    axiosInstance
      .put(`/projects/${id}`, {
        ...formData,
        outcomes: outcomes,
        outputs: outputs,
        indicators: indicators,
        desaggregations: desaggregations,
      })
      .then((res) => {
        reqForToastAndSetMessage(
          res.data.message || "Project updated successfully!"
        );
      })
      .catch((err) => {
        console.log(err.response.data.message);
        reqForToastAndSetMessage("Failed to update project!");
      });
  };

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
      <SubHeader pageTitle={"Edit Project"} />
      <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
        <Tabs defaultValue="project" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="outcome">OutCome</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="indicator">Indicator</TabsTrigger>
            <TabsTrigger value="dessaggregation">Dessaggregation</TabsTrigger>
            <TabsTrigger value="aprPreview">APR Preview</TabsTrigger>
          </TabsList>

          {/* Project Tab */}
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectCode: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectTitle: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="projectGoal">Project Goal</Label>
                    <Input
                      id="projectGoal"
                      name="projectGoal"
                      value={formData.projectGoal}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectGoal: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="projectDonor">Donor</Label>
                    <Input
                      id="projectDonor"
                      name="projectDonor"
                      value={formData.projectDonor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectDonor: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="status">Status</Label>
                    <SingleSelect
                      options={[
                        { value: "planed", label: "Planed" },
                        { value: "ongoing", label: "On Going" },
                        { value: "completed", label: "Completed" },
                        { value: "onhold", label: "On Hold" },
                        { value: "canclled", label: "Cancelled" },
                      ]}
                      value={formData.status}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value,
                        }))
                      }
                      placeholder="Project Status"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="projectManager">Project Manager</Label>
                    <Input
                      id="projectManager"
                      name="projectManager"
                      value={formData.projectManager}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectManager: e.target.value,
                        }))
                      }
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
                      onValueChange={(value: string[]) =>
                        setFormData((prev) => ({
                          ...prev,
                          provinces: value,
                        }))
                      }
                      placeholder="Project Provinces ..."
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
                      onValueChange={(value: string[]) =>
                        setFormData((prev) => ({
                          ...prev,
                          thematicSector: value,
                        }))
                      }
                      placeholder="Select thematic sectors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="reportingPeriod">Reporting Period</Label>
                    <Input
                      id="reportingPeriod"
                      name="reportingPeriod"
                      value={formData.reportingPeriod}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reportingPeriod: e.target.value,
                        }))
                      }
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="reportingDate">Reporting Date</Label>
                    <Input
                      id="reportingDate"
                      name="reportingDate"
                      value={formData.reportingDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reportingDate: e.target.value,
                        }))
                      }
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1 col-span-full">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      placeholder="Project description..."
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Save Changes</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to update this project?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        OK
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Outcome Tab */}
          <TabsContent value="outcome" className="h-full">
            <Card className="relative h-full flex flex-col">
              <CardHeader className="w-full">
                <CardTitle>Edit Outcomes</CardTitle>
                <CardDescription>
                  Update outcomes and references.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {outcomes.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No outcomes found.
                  </p>
                )}

                {outcomes.map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-4 border p-3 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <Label>Outcome</Label>
                      <Input
                        value={item.outcome}
                        onChange={(e) =>
                          setOutcomes((prev) =>
                            prev.map((o, i) =>
                              i === index
                                ? { ...o, outcome: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Outcome Ref</Label>
                      <Input
                        value={item.outcomeRef}
                        onChange={(e) =>
                          setOutcomes((prev) =>
                            prev.map((o, i) =>
                              i === index
                                ? { ...o, outcomeRef: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    axiosInstance
                      .put(`/projects/${id}/outcomes`, { outcomes })
                      .then((res) => reqForToastAndSetMessage(res.data.message))
                      .catch(() =>
                        reqForToastAndSetMessage("Failed to update outcomes!")
                      );
                  }}
                >
                  Save Outcomes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Output Tab */}
          <TabsContent value="output" className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Edit Outputs</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {outputs.map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-2 gap-4 border p-3 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <Label>Output</Label>
                      <Input
                        value={item.output}
                        onChange={(e) =>
                          setOutputs((prev) =>
                            prev.map((o, i) =>
                              i === index ? { ...o, output: e.target.value } : o
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Output Ref</Label>
                      <Input
                        value={item.outputRef}
                        onChange={(e) =>
                          setOutputs((prev) =>
                            prev.map((o, i) =>
                              i === index
                                ? { ...o, outputRef: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    axiosInstance
                      .put(`/projects/${id}/outputs`, { outputs })
                      .then((res) => reqForToastAndSetMessage(res.data.message))
                      .catch(() =>
                        reqForToastAndSetMessage("Failed to update outputs!")
                      );
                  }}
                >
                  Save Outputs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Indicator Tab */}
          <TabsContent value="indicator" className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Edit Indicators</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {indicators.map((item, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-lg grid md:grid-cols-2 gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <Label>Indicator</Label>
                      <Input
                        value={item.indicator}
                        onChange={(e) =>
                          setIndicators((prev) =>
                            prev.map((o, i) =>
                              i === index
                                ? { ...o, indicator: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Indicator Ref</Label>
                      <Input
                        value={item.indicatorRef}
                        onChange={(e) =>
                          setIndicators((prev) =>
                            prev.map((o, i) =>
                              i === index
                                ? { ...o, indicatorRef: e.target.value }
                                : o
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    axiosInstance
                      .put(`/projects/${id}/indicators`, { indicators })
                      .then((res) => reqForToastAndSetMessage(res.data.message))
                      .catch(() =>
                        reqForToastAndSetMessage("Failed to update indicators!")
                      );
                  }}
                >
                  Save Indicators
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Dessaggregation Tab */}
          <TabsContent value="dessaggregation" className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Edit Dessaggregations</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {desaggregations.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No dessaggregations found.
                  </p>
                ) : (
                  desaggregations.map((d, index) => (
                    <div
                      key={d.id || index}
                      className="flex flex-col gap-2 border p-2 rounded"
                    >
                      <Input
                        value={d.description} // استفاده از فیلد description واقعی
                        onChange={(e) => {
                          const newDess = [...desaggregations];
                          newDess[index].description = e.target.value;
                          setDessaggregations(newDess);
                        }}
                      />
                      <Input
                        type="number"
                        value={d.target}
                        onChange={(e) => {
                          const newDess = [...desaggregations];
                          newDess[index].target = parseInt(e.target.value, 10);
                          setDessaggregations(newDess);
                        }}
                        placeholder="Target"
                      />
                    </div>
                  ))
                )}
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    axiosInstance
                      .put(`/projects/${id}/dessaggregations`, {
                        desaggregations,
                      })
                      .then((res) => reqForToastAndSetMessage(res.data.message))
                      .catch(() =>
                        reqForToastAndSetMessage(
                          "Failed to update dessaggregations!"
                        )
                      );
                  }}
                >
                  Save Dessaggregations
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* APR Preview */}
          <TabsContent value="aprPreview" className="h-full">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
