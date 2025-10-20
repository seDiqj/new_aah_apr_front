"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const startYear = 2000;
const years = Array.from(
  { length: currentYear - startYear + 6 },
  (_, i) => startYear + i
);

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const SubmitNewDB: React.FC<ComponentProps> = ({ open, onOpenChange }) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [fromMonth, setFromMonth] = React.useState<string | undefined>();
  const [fromYear, setFromYear] = React.useState<number | undefined>();
  const [toMonth, setToMonth] = React.useState<string | undefined>();
  const [toYear, setToYear] = React.useState<number | undefined>();

  const formatMonthYear = (m?: string, y?: number) =>
    m && y ? `${m} / ${y}` : "";

  const [projects, setProjects] = useState<
    {
      id: string;
      projectCode: string;
    }[]
  >([]);

  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    projectCode: string;
  } | null>(null);

  const [databases, setDatabases] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const [selectedDatabase, setSelectedDatabase] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [provinces, setProvinces] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const [selectedProvince, setSelectedProvince] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (projects.length == 0)
      axiosInstance
        .get("/projects/projects_for_submition")
        .then((response: any) => {
          console.log(response.data.data);
          setProjects(response.data.data);
        })
        .catch((error: any) => {
          console.log(error.response.data);
          reqForToastAndSetMessage(error.response.data.message);
        });

    if (selectedProject)
      axiosInstance
        .get(`/projects/project_databases_&_provinces/${selectedProject.id}`)
        .then((response: any) => {
          console.log(response.data.data);
          setDatabases(response.data.data.databases);
          setProvinces(response.data.data.provinces);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
  }, [selectedProject]);

  const handleSubmit = () => {
    let error: boolean = false;

    // [
    //   selectedProject,
    //   selectedDatabase,
    //   selectedProvince,
    //   fromMonth,
    //   fromYear,
    //   toMonth,
    //   toYear,
    // ].forEach((value: any, index: number) => {
    //   if (value && value.trim() != "") error = true;
    // });

    // if (error) {
    //   reqForToastAndSetMessage("Please fill all fields !");
    // }

    axiosInstance
      .post("/db_management/submit_new_database", {
        project_id: selectedProject?.id,
        database_id: selectedDatabase?.id,
        province_id: selectedProvince?.id,
        fromDate: `${fromYear}-${fromMonth}`,
        toDate: `${toYear}-${toMonth}`,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg p-8 ml-16">
        <DialogHeader>
          <DialogTitle className="text-left text-xl">
            Submit Database
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Project */}
          <Select
            onValueChange={(value: string) =>
              setSelectedProject(
                projects.find((project) => project.id == value) ?? {
                  projectCode: "",
                  id: "",
                }
              )
            }
            value={selectedProject?.id ?? ""}
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p, i) => (
                <SelectItem key={i} value={p.id}>
                  {p.projectCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Database */}
          <Select
            onValueChange={(value: string) =>
              setSelectedDatabase(
                databases.find((database) => database.id == value) ?? {
                  id: "",
                  name: "",
                }
              )
            }
            value={selectedDatabase?.id ?? ""}
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Select Database" />
            </SelectTrigger>
            <SelectContent>
              {databases.map((db, i) => (
                <SelectItem key={i} value={db.id}>
                  {db.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Province */}
          <Select
            onValueChange={(value: string) =>
              setSelectedProvince(
                provinces.find((province) => province.id == value) ?? {
                  id: "",

                  name: "",
                }
              )
            }
            value={selectedProvince?.id ?? ""}
          >
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p, i) => (
                <SelectItem key={i} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ---------- Date Range Inputs ---------- */}
          <div className="flex gap-2 w-full">
            {/* From */}
            <div className="flex flex-col w-1/2">
              <label className=" font-medium mb-1">Date Range</label>
              <div className="relative">
                <Input
                  readOnly
                  placeholder="From"
                  value={formatMonthYear(fromMonth, fromYear)}
                  className="h-14 pr-12"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center">
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="flex gap-2">
                      <Select value={fromMonth} onValueChange={setFromMonth}>
                        <SelectTrigger className="w-36 h-10">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={fromYear ? String(fromYear) : undefined}
                        onValueChange={(y) => setFromYear(Number(y))}
                      >
                        <SelectTrigger className="w-28 h-10">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* To */}
            <div className="flex flex-col w-1/2">
              <label className="text-gray-700 font-medium mb-1 invisible">
                Date Range
              </label>
              <div className="relative">
                <Input
                  readOnly
                  placeholder="To"
                  value={formatMonthYear(toMonth, toYear)}
                  className="h-14 pr-12"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center">
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="flex gap-2">
                      <Select value={toMonth} onValueChange={setToMonth}>
                        <SelectTrigger className="w-36 h-10">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={toYear ? String(toYear) : undefined}
                        onValueChange={(y) => setToYear(Number(y))}
                      >
                        <SelectTrigger className="w-28 h-10">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {/* -------------------------------------- */}

          {/* Manager */}
          {/* <Select onValueChange={setManager} value={manager}>
            <SelectTrigger className="h-14 w-full text-lg">
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* Submit button */}
          <div className="flex flex-row items-center justify-end w-full px-2">
            <Button onClick={handleSubmit} className="mt-4 w-32">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitNewDB;
