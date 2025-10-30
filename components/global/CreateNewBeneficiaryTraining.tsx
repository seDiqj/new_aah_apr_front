"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleSelect } from "../single-select";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { TrainingBenefeciaryForm } from "@/types/Types";

interface TrainingBeneficiaryFormProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  mode: "create" | "edit";
  editId?: number | string;
}

const TrainingBeneficiaryForm: React.FC<TrainingBeneficiaryFormProps> = ({
  open,
  onOpenChange,
  title,
  mode,
  editId,
}) => {
  const { reqForToastAndSetMessage, axiosInstance, handleReload } = useParentContext();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<TrainingBenefeciaryForm>({
    name: "",
    fatherHusbandName: "",
    gender: "male",
    age: 0,
    phone: "",
    email: "",
    participantOrganization: "",
    jobTitle: "",
    dateOfRegistration: "",
  });

  useEffect(() => {
    if (mode === "edit" && editId) {
      setLoading(true);
      axiosInstance
        .get(`/training_db/beneficiary/${editId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch(() => {
          reqForToastAndSetMessage("Failed to load beneficiary data!");
        })
        .finally(() => setLoading(false));
    }
  }, [mode, editId]);

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/training_db/beneficiary/${editId}`
          : "/training_db/beneficiary";
      const method = mode === "edit" ? "put" : "post";

      const response =
        method === "put"
          ? await axiosInstance.put(url, formData)
          : await axiosInstance.post(url, formData);

      reqForToastAndSetMessage(response.data.message);
      handleReload()
      onOpenChange(false);
    } catch (error: any) {
      reqForToastAndSetMessage(
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          padding: "10px 16px",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        {/* فرم */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
              Beneficiary Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Client Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Client Name ..."
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              {/* Father / Husband Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fatherHusbandName">
                  Father / Husband Name
                </Label>
                <Input
                  id="fatherHusbandName"
                  name="fatherHusbandName"
                  placeholder="Father / Husband Name ..."
                  value={formData.fatherHusbandName}
                  onChange={handleFormChange}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
                <SingleSelect
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  value={formData.gender}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age ..."
                  value={formData.age}
                  onChange={handleFormChange}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Phone ..."
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email ..."
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              {/* Organization */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="participantOrganization">
                  Participant Organization
                </Label>
                <Input
                  id="participantOrganization"
                  name="participantOrganization"
                  placeholder="Organization ..."
                  value={formData.participantOrganization}
                  onChange={handleFormChange}
                />
              </div>

              {/* Job Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Job Title ..."
                  value={formData.jobTitle}
                  onChange={handleFormChange}
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateOfRegistration">Date of Registration</Label>
                <Input
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  type="date"
                  value={formData.dateOfRegistration}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading
              ? "Please wait..."
              : mode === "edit"
              ? "Update Beneficiary"
              : "Create Beneficiary"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingBeneficiaryForm;
