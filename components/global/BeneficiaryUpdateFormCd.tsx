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
import { SingleSelect } from "@/components/single-select";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";
import { withPermission } from "@/lib/withPermission";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  beneficiaryId: number;
}

const BeneficiaryUpdateCD: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  beneficiaryId,
}) => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();
  console.log(234);

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

  useEffect(() => {
    if (open && beneficiaryId) {
      axiosInstance
        .get(`/community_dialogue_db/beneficiary/${beneficiaryId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(
            error.response?.data?.message || "Failed to load beneficiary data"
          );
        });
    }
  }, [open, beneficiaryId]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    axiosInstance
      .put(`/community_dialogue_db/beneficiary/${beneficiaryId}`, formData)
      .then((response: any) => {
        reqForToastAndSetMessage(
          response.data.message || "Updated successfully"
        );
        onOpenChange(false);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(
          error.response?.data?.message || "Update failed"
        )
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Edit</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Update Beneficiary</DialogTitle>
        </DialogHeader>

        <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
          Beneficiary Information
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              id="clientName"
              placeholder="Client Name"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="fatherName">Father/Husband Name</Label>
            <Input
              name="fatherHusbandName"
              value={formData.fatherHusbandName}
              onChange={handleFormChange}
              id="fatherName"
              placeholder="Father/Husband Name"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="age">Age</Label>
            <Input
              name="age"
              value={formData.age}
              onChange={handleFormChange}
              id="age"
              type="number"
              placeholder="Age"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
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
              onValueChange={(value: string) => {
                handleFormChange({
                  target: { name: "maritalStatus", value: value },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="gender">Gender</Label>
            <SingleSelect
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={formData.gender}
              onValueChange={(value: string) => {
                handleFormChange({
                  target: { name: "gender", value: value },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              id="phone"
              type="tel"
              placeholder="Phone"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="nid">NID Number</Label>
            <Input
              name="nationalId"
              value={formData.nationalId}
              onChange={handleFormChange}
              id="nid"
              placeholder="NID Number"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleFormChange}
              id="jobTitle"
              placeholder="Job Title"
              className="border w-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="incentiveReceived">Incentive Received</Label>
            <SingleSelect
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={formData.incentiveReceived.toString()}
              onValueChange={(value: string) => {
                handleFormChange({
                  target: {
                    name: "incentiveReceived",
                    value: value === "true" ? true : false,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="incentiveAmount">Incentive Amount</Label>
            <Input
              name="incentiveAmount"
              value={formData.incentiveAmount}
              onChange={handleFormChange}
              id="incentiveAmount"
              type="text"
              placeholder="Incentive Amount"
              className="border w-full"
            />
          </div>
        </div>

        <Button className="w-full mt-6" onClick={handleUpdate}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(BeneficiaryUpdateCD, "Dialogue.edit");
