"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { useParams } from "next/navigation";

const userSchema = z.object({
  name: z.string().min(3),
  title: z.string().min(3),
  email: z.string().email(),
  department: z.string().min(1),
  role: z.string().min(1),
  status: z.string().min(1),
  password: z.string().optional(),
  photo_path: z.any().optional(),
  permissions: z.array(z.string()).optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface ComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
}

const PreAndPostTestForm: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  chapterId,
}) => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage } = useParentContext();

  const { axiosInstance } = useParentContext();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    preTestScore: number;
    postTestScore: number;
    remark: string;
  }>({
    preTestScore: 0,
    postTestScore: 0,
    remark: "",
  });

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axiosInstance
      .put(
        `training_db/beneficiary/chapter/setPreAndPostTest/${id}/${chapterId}`,
        formData
      )
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  useEffect(() => {
    axiosInstance
      .get(`/training_db/beneficiary/chapter/preAndPostTest/${id}/${chapterId}`)
      .then((response: any) => {
        console.log(response.data.data);
        setFormData(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Beneficiary Pre & Post</DialogTitle>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Pre Test Score</Label>
              <Input
                type="text"
                name="preTestScore"
                value={formData.preTestScore}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Post Test Score</Label>
              <Input
                type="text"
                name="postTestScore"
                value={formData.postTestScore}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Remark</Label>
              <Input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" onClick={handleSubmit}>
              {loading ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreAndPostTestForm;
