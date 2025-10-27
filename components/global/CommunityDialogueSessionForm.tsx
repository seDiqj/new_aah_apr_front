"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParentContext } from "@/contexts/ParentContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  sessionId?: string;
  mode: "create" | "edit" | "show";
}

const SessionForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  sessionId,
  mode,
}) => {
  const { id } = useParams();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [formData, setFormData] = useState({
    community_dialogue_id: id,
    topic: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleSubmit = () => {
    if (!formData.date || !formData.topic)
      return reqForToastAndSetMessage("Please fill all fields.");

    setLoading(true);

    const request =
      mode === "create"
        ? axiosInstance.post(
            "/community_dialogue_db/community_dialogue/session",
            formData
          )
        : axiosInstance.put(
            `/community_dialogue_db/community_dialogue/session/${sessionId}`,
            formData
          );

    request
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error occurred."
        )
      )
      .finally(() => setLoading(false));
  };

  const handleFormChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (mode === "edit" || mode === "show") {
      setFetching(true);
      axiosInstance
        .get(`/community_dialogue_db/community_dialogue/session/${sessionId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(
            error.response?.data?.message || "Error fetching data."
          )
        )
        .finally(() => setFetching(false));
    }
  }, [mode, sessionId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add New Session"
              : mode === "edit"
              ? "Update Session"
              : "Session Information"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Topic */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Topic
            </Label>
            {fetching ? (
              <Skeleton className="h-10 col-span-3 rounded-md" />
            ) : (
              <Input
                id="topic"
                value={formData.topic}
                onChange={handleFormChange}
                className="col-span-3"
                placeholder="Enter topic"
                disabled={mode === "show"}
              />
            )}
          </div>

          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            {fetching ? (
              <Skeleton className="h-10 col-span-3 rounded-md" />
            ) : (
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                className="col-span-3"
                disabled={mode === "show"}
              />
            )}
          </div>
        </div>

        {mode !== "show" && !fetching && (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Save" : "Update"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
