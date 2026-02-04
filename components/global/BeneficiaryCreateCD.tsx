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
import { useEffect, useState } from "react";
import { SingleSelect } from "@/components/single-select";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";
import { withPermission } from "@/lib/withPermission";
import { CdDatabaseBenefciaryFormSchema } from "@/schemas/FormsSchema";
import { CommunityDialogueBeneficiaryDefault } from "@/constants/FormsDefaultValues";
import { CdDatabaseBeneficiaryCreationMessage } from "@/constants/ConfirmationModelsTexts";
import { CdDatabaseBeneficiaryCreationFormInterface } from "@/interfaces/Interfaces";
import {
  GenderOptions,
  incentiveReceivedOptions,
  MaritalStatusOptions,
} from "@/constants/SingleAndMultiSelectOptionsList";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import { toDateOnly } from "./MainDatabaseBeneficiaryCreationForm";
import { AxiosError, AxiosResponse } from "axios";

const BeneficiaryCreateCD: React.FC<
  CdDatabaseBeneficiaryCreationFormInterface
> = ({ open, onOpenChange }) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [formData, setFormData] = useState<CommunityDialogBeneficiaryForm>(
    CommunityDialogueBeneficiaryDefault(),
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [registrationDateValidRange, setRegistrationDateValidRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "2025-1-1",
    end: "2025-2-1",
  });

  const handleSubmit = () => {
    const result = CdDatabaseBenefciaryFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errors[field as string] = issue.message;
      });

      setFormErrors(errors);
      reqForToastAndSetMessage(
        "Please fix validation errors before submitting.",
        "warning"
      );
      return;
    }

    setFormErrors({});

    setIsLoading(true);

    requestHandler()
      .post("/community_dialogue_db/beneficiary", formData)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message, "success");
        onOpenChange(false);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message, "error"),
      )
      .finally(() => setIsLoading(false));
  };

  // useEffect(() => {
  //   if (!formData) return;

  //   requestHandler()
  //     .get(`/date/project_date_range_acc_to_program/${formData.program}`)
  //     .then((response: AxiosResponse<any, any>) => {
  //       setRegistrationDateValidRange({
  //         start: toDateOnly(response.data.data.start),
  //         end: toDateOnly(response.data.data.end),
  //       });
  //     })
  //     .catch((error: AxiosError<any, any>) =>
  //       reqForToastAndSetMessage(error.response?.data.message)
  //     );
  // }, [formData.program]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.name ? "!border-red-500" : ""
              } w-full`}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.fatherHusbandName ? "!border-red-500" : ""
              } w-full`}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.age ? "!border-red-500" : ""
              } w-full`}
              title={formErrors.age}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <SingleSelect
              options={MaritalStatusOptions}
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
              options={GenderOptions}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.phone ? "!border-red-500" : ""
              } w-full`}
              title={formErrors.phone}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="code">Code</Label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleFormChange}
              id="code"
              placeholder="Beneficiary Code ..."
              className={`border rounded-xl p-2 rounded ${
                formErrors.code ? "!border-red-500" : ""
              } w-full`}
              title={formErrors.code}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="nid">NID Number</Label>
            <Input
              name="nationalId"
              value={formData.nationalId}
              onChange={handleFormChange}
              id="nid"
              placeholder="NID Number ..."
              className={`border rounded-xl p-2 rounded ${
                formErrors.nationalId ? "!border-red-500" : ""
              } w-full`}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.jobTitle ? "!border-red-500" : ""
              } w-full`}
              title={formErrors.jobTitle}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="incentiveReceived">Incentive Received</Label>
            <SingleSelect
              options={incentiveReceivedOptions}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.incentiveAmount ? "!border-red-500" : ""
              } w-full`}
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
              className={`border rounded-xl p-2 rounded ${
                formErrors.dateOfRegistration ? "!border-red-500" : ""
              } w-full`}
              title={formErrors.dateOfRegistration}
              min={registrationDateValidRange.start}
              max={registrationDateValidRange.end}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          id={SUBMIT_BUTTON_PROVIDER_ID}
          disabled={isLoading}
          className="w-full mt-6"
          onClick={() =>
            reqForConfirmationModelFunc(
              CdDatabaseBeneficiaryCreationMessage,
              () => handleSubmit(),
            )
          }
        >
          {isLoading ? "Saving ..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(BeneficiaryCreateCD, "Dialogue.create");
