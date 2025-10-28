"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParentContext } from "@/contexts/ParentContext";
import { SingleSelect } from "@/components/single-select";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";

interface DatabaseSummaryProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  beneficiaryId: number;
}

const CommunityDialogueUpdateCD: React.FC<DatabaseSummaryProps> = ({
  open,
  onOpenChange,
  beneficiaryId,
}) => {
  const { axiosInstance, reqForToastAndSetMessage } = useParentContext();

  const [formData, setFormData] = useState<CommunityDialogBeneficiaryForm>({
    name: "",
    fatherHusbandName: "",
    age: 0,
    maritalStatus: "",
    gender: "",
    phone: "",
    nationalId: "",
    jobTitle: "",
    incentiveReceived: false,
    incentiveAmount: "",
    dateOfRegistration: ""
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && beneficiaryId) {
      setLoading(true);
      axiosInstance
        .get(`/community_dialogue_db/beneficiary/${beneficiaryId}`)
        .then((res: any) => {
          const data = res.data;

          setFormData({
            name: data.name ?? "",
            fatherHusbandName: data.fatherHusbandName ?? "",
            age: data.age ?? 0,
            maritalStatus: data.maritalStatus ?? "",
            gender: data.gender ?? "",
            phone: data.phone ?? "",
            nationalId: data.nationalId ?? "",
            jobTitle: data.jobTitle ?? "",
            incentiveReceived: data.incentiveReceived ?? false,
            incentiveAmount: data.incentiveAmount ?? "",
            dateOfRegistration: data.dateOfRegistration ?? ""
          });
        })
        .catch((err: any) => {
          reqForToastAndSetMessage(err.response?.data?.message || "Error loading data");
        })
        .finally(() => setLoading(false));
    }
  }, [open, beneficiaryId]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axiosInstance
      .put(`/community_dialogue_db/beneficiary/${beneficiaryId}`, formData)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        onOpenChange(false);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || "Update failed")
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Update</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          padding: "16px",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg text-center mb-4">
            Update Beneficiary Information
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                id="clientName"
                placeholder="Client Name"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="fatherName">Father/Husband Name</Label>
              <Input
                name="fatherHusbandName"
                value={formData.fatherHusbandName}
                onChange={handleFormChange}
                id="fatherName"
                placeholder="Father/Husband Name"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                name="age"
                value={formData.age}
                onChange={handleFormChange}
                id="age"
                type="number"
                placeholder="Age"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <SingleSelect
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                  { value: "widower", label: "Widower" },
                  { value: "separated", label: "Separated" },
                ]}
                value={formData.maritalStatus}
                onValueChange={(value: string) =>
                  handleFormChange({
                    target: { name: "maritalStatus", value },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <SingleSelect
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={formData.gender}
                onValueChange={(value: string) =>
                  handleFormChange({
                    target: { name: "gender", value },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                id="phone"
                type="tel"
                placeholder="Phone"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="nid">NID Number</Label>
              <Input
                name="nationalId"
                value={formData.nationalId}
                onChange={handleFormChange}
                id="nid"
                placeholder="NID Number"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleFormChange}
                id="jobTitle"
                placeholder="Job Title"
                className="border w-full mt-4"
              />
            </div>

            <div>
              <Label htmlFor="incentiveReceived">Incentive Received</Label>
              <SingleSelect
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={formData.incentiveReceived.toString()}
                onValueChange={(value: string) =>
                  handleFormChange({
                    target: {
                      name: "incentiveReceived",
                      value: value === "true",
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="incentiveAmount">Incentive Amount</Label>
              <Input
                name="incentiveAmount"
                value={formData.incentiveAmount}
                onChange={handleFormChange}
                id="incentiveAmount"
                placeholder="Incentive Amount"
                className="border w-full mt-4"
              />
            </div>
          </div>
        )}

        {!loading && (
          <Button className="w-full mt-6" onClick={handleSubmit}>
            Update
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommunityDialogueUpdateCD;
