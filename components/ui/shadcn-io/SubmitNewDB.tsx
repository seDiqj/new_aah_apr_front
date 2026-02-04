"use client";

import * as React from "react";
import { useEffect, useState } from "react";

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

import { useParentContext } from "@/contexts/ParentContext";
import { SubmitNewDatabaseMessage } from "@/constants/ConfirmationModelsTexts";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import StringHelper from "@/helpers/StringHelpers/StringHelper";
import { AxiosError, AxiosResponse } from "axios";
import { toDateOnly } from "@/components/global/MainDatabaseBeneficiaryCreationForm";
import SubmitNewDBSkeleton from "@/components/skeleton/DatabaseSubmition.skeleton";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit";
  id?: number;
}

const SubmitNewDB: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mode,
  id,
}) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- Date Range ---------- */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------- Data ---------- */
  const [projects, setProjects] = useState<
    { id: string; projectCode: string }[]
  >([]);
  const [databases, setDatabases] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);

  /* ---------- Selected ---------- */
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    projectCode: string;
  } | null>(null);

  const [selectedDatabase, setSelectedDatabase] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedProvince, setSelectedProvince] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedManager, setSelectedManager] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: null });

  const [registrationDateValidRange, setRegistrationDateValidRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  /* ---------- Effects ---------- */
  useEffect(() => {
    requestHandler()
      .get("/projects/projects_for_submition")
      .then((res: any) => setProjects(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error"),
      )
      .finally(() => setInitLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    requestHandler()
      .get(`/projects/project_databases_&_provinces/${selectedProject.id}`)
      .then((res: any) => {
        setDatabases(res.data.data.databases);
        setProvinces(res.data.data.provinces);
      })
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error"),
      );
    requestHandler()
      .get(`/date/project_date_range/${selectedProject.id}`)
      .then((response: AxiosResponse<any, any>) => {
        setRegistrationDateValidRange({
          start: toDateOnly(response.data.data.start),
          end: toDateOnly(response.data.data.end),
        });
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message, "error"),
      );
  }, [selectedProject]);

  useEffect(() => {
    requestHandler()
      .get("/global/managers")
      .then((res: any) => setManagers(res.data.data))
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message, "error"),
      );
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      setInitLoading(true);
      requestHandler()
        .get(`/db_management/get_database_info_for_editing/${id}`)
        .then((res: any) => {
          setSelectedProject(res.data.data.project);
          setSelectedDatabase(res.data.data.database);
          setSelectedProvince(res.data.data.province);
          setSelectedManager(res.data.data.manager);
          setFromDate(res.data.data.fromDate);
          setToDate(res.data.data.toDate);
        })
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message, "error"),
        )
        .finally(() => setInitLoading(false));
    }
  }, [mode]);

  /* ---------- Submit ---------- */
  const handleSubmit = () => {
    if (!fromDate || !toDate) {
      reqForToastAndSetMessage("Please select date range");
      return;
    }

    if (fromDate > toDate) {
      reqForToastAndSetMessage("From date cannot be after To date");
      return;
    }

    setLoading(true);

    if (mode === "create") {
      requestHandler()
        .post("/db_management/submit_new_database", {
          project_id: selectedProject?.id,
          database_id: selectedDatabase?.id,
          province_id: selectedProvince?.id,
          manager_id: selectedManager?.id,
          fromDate,
          toDate,
        })
        .then((res: any) => {
          reqForToastAndSetMessage(res.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message, "error"),
        )
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      requestHandler()
        .put(`/db_management/edit_submitted_database/${id}`, {
          project_id: selectedProject?.id,
          database_id: selectedDatabase?.id,
          province_id: selectedProvince?.id,
          manager_id: selectedManager?.id,
          fromDate,
          toDate,
        })
        .then((res: any) => {
          reqForToastAndSetMessage(res.data.message, "success");
          onOpenChange(false);
          handleReload();
        })
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message, "error"),
        )
        .finally(() => setLoading(false));
    }
  };

  return initLoading ? (
    <SubmitNewDBSkeleton />
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-lg p-8 ml-16">
        <DialogHeader>
          <DialogTitle className="text-left text-xl">
            Submit Database
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Project */}
          <Select
            value={selectedProject?.id ?? ""}
            onValueChange={(id) =>
              setSelectedProject(projects.find((p) => p.id === id) ?? null)
            }
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.projectCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Database */}
          <Select
            value={selectedDatabase?.id ?? ""}
            onValueChange={(id) =>
              setSelectedDatabase(databases.find((d) => d.id === id) ?? null)
            }
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select Database" />
            </SelectTrigger>
            <SelectContent>
              {databases.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {StringHelper.normalize(d.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Province */}
          <Select
            value={selectedProvince?.id ?? ""}
            onValueChange={(id) =>
              setSelectedProvince(provinces.find((p) => p.id === id) ?? null)
            }
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {StringHelper.normalize(p.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Manager */}
          <Select
            value={selectedManager?.id ?? ""}
            onValueChange={(id) =>
              setSelectedManager(
                managers.find((m) => m.id === id) ?? {
                  id: null,
                  name: null,
                },
              )
            }
          >
            <SelectTrigger className="h-14">
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {StringHelper.normalize(m.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* From Date */}
          <div>
            <label className="font-medium mb-1 block">From Date</label>
            <Input
              type="date"
              className="h-14"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              min={registrationDateValidRange.start}
              max={registrationDateValidRange.end}
            />
          </div>

          {/* To Date */}
          <div>
            <label className="font-medium mb-1 block">To Date</label>
            <Input
              type="date"
              className="h-14"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={registrationDateValidRange.start}
              max={registrationDateValidRange.end}
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-end pt-4">
            <Button
              id={SUBMIT_BUTTON_PROVIDER_ID}
              disabled={loading}
              onClick={() =>
                reqForConfirmationModelFunc(
                  SubmitNewDatabaseMessage,
                  handleSubmit,
                )
              }
              className="w-32"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitNewDB;
