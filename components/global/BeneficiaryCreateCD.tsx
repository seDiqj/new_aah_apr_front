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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SingleSelect } from "@/components/single-select";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";
import { withPermission } from "@/lib/withPermission";
import { CdDatabaseBenefciaryFormSchema } from "@/schemas/FormsSchema";
import { CommunityDialogueBeneficiaryDefault } from "@/lib/FormsDefaultValues";
import { CdDatabaseBeneficiaryCreationMessage } from "@/lib/ConfirmationModelsTexts";
import { CdDatabaseBeneficiaryCreationFormInterface } from "@/interfaces/Interfaces";

const BeneficiaryCreateCD: React.FC<CdDatabaseBeneficiaryCreationFormInterface> = ({
  open,
  onOpenChange,
}) => {
  const { reqForToastAndSetMessage, axiosInstance, handleReload, reqForConfirmationModelFunc } = useParentContext();

  const [formData, setFormData] = useState<CommunityDialogBeneficiaryForm>(CommunityDialogueBeneficiaryDefault());

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {

    const result = CdDatabaseBenefciaryFormSchema.safeParse(formData);

    if (!result.success) {
    const errors: { [key: string]: string } = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field) errors[field as string] = issue.message;
    });

    setFormErrors(errors);
      reqForToastAndSetMessage("Please fix validation errors before submitting.");
      return;
    }

    setFormErrors({});

    axiosInstance
      .post("/community_dialogue_db/beneficiary", formData)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Create</Button>
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
        {/* Top Bar with title and centered search */}
        <div className="flex items-center justify-between mb-2 relative">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Create New Beneficiary
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Beneficiary Information Badge */}
        <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
          Beneficiary Information
        </div>

        {/* Beneficiary Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <div className="flex flex-col gap-4">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              id="clientName"
              placeholder="Client Name"
              className={`border rounded-xl p-2 rounded ${formErrors.name ? "!border-red-500" : ""} w-full`}
              title={formErrors.name}
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
              className={`border rounded-xl p-2 rounded ${formErrors.fatherHusbandName ? "!border-red-500" : ""} w-full`}
              title={formErrors.fatherHusbandName}
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
              className={`border rounded-xl p-2 rounded ${formErrors.age ? "!border-red-500" : ""} w-full`}
              title={formErrors.age}
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
              error={formErrors.maritalStatus}
            ></SingleSelect>
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
              error={formErrors.gender}
            ></SingleSelect>
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
              className={`border rounded-xl p-2 rounded ${formErrors.phone ? "!border-red-500" : ""} w-full`}
              title={formErrors.phone}
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
              className={`border rounded-xl p-2 rounded ${formErrors.nationalId ? "!border-red-500" : ""} w-full`}
              title={formErrors.nationalId}
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
              className={`border rounded-xl p-2 rounded ${formErrors.jobTitle ? "!border-red-500" : ""} w-full`}
              title={formErrors.jobTitle}
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
                    value: value == "true" ? true : false,
                  },
                });
              }}
              error={formErrors.incentiveReceived}
            ></SingleSelect>
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
              className={`border rounded-xl p-2 rounded ${formErrors.incentiveAmount ? "!border-red-500" : ""} w-full`}
              title={formErrors.incentiveAmount}
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <Label htmlFor="dateOfRegistration">Date Of Registration</Label>
            <Input
              id="dateOfRegistration"
              name="dateOfRegistration"
              type="date"
              onChange={handleFormChange}
              className={`border rounded-xl p-2 rounded ${formErrors.dateOfRegistration ? "!border-red-500" : ""} w-full`}
              title={formErrors.dateOfRegistration}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full mt-6" onClick={() => reqForConfirmationModelFunc(
          CdDatabaseBeneficiaryCreationMessage,
          () => handleSubmit()
        )}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(BeneficiaryCreateCD, "Dialogue.create");
