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
import { TrainingDatabaseBenefeciaryFormSchema } from "@/schemas/FormsSchema";
import { TrainingBeneficiaryDefault } from "@/constants/FormsDefaultValues";
import { TrainingBeneficiaryCreationMessage } from "@/constants/ConfirmationModelsTexts";
import { TrainingBeneficiaryFormInterface } from "@/interfaces/Interfaces";
import { GenderOptions } from "@/constants/SingleAndMultiSelectOptionsList";
import { IsEditMode, IsNotANullOrUndefinedValue } from "@/constants/Constants";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";

const TrainingBeneficiaryForm: React.FC<TrainingBeneficiaryFormInterface> = ({
  open,
  onOpenChange,
  title,
  mode,
  editId,
}) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    handleReload,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<TrainingBenefeciaryForm>(
    TrainingBeneficiaryDefault(),
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (IsEditMode(mode) && IsNotANullOrUndefinedValue(editId)) {
      setLoading(true);
      requestHandler()
        .get(`/training_db/beneficiary/${editId}`)
        .then((response: any) => {
          setFormData(response.data.data);
        })
        .catch(() => {
          reqForToastAndSetMessage("Failed to load beneficiary data!", "error");
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

    const result = TrainingDatabaseBenefeciaryFormSchema.safeParse(formData);

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

    setLoading(true);

    try {
      const url = IsEditMode(mode)
        ? `/training_db/beneficiary/${editId}`
        : "/training_db/beneficiary";
      const method = IsEditMode(mode) ? "put" : "post";

      const response =
        method === "put"
          ? await requestHandler().put(url, formData)
          : await requestHandler().post(url, formData);

      reqForToastAndSetMessage(response.data.message, "success");
      handleReload();
      onOpenChange(false);
    } catch (error: any) {
      reqForToastAndSetMessage(
        error.response?.data?.message || "Something went wrong!",
        "error"
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
                  className={`border p-2 rounded ${
                    formErrors.name ? "!border-red-500" : ""
                  }`}
                  title={formErrors.name}
                />
              </div>

              {/* Father / Husband Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fatherHusbandName">Father / Husband Name</Label>
                <Input
                  id="fatherHusbandName"
                  name="fatherHusbandName"
                  placeholder="Father / Husband Name ..."
                  value={formData.fatherHusbandName}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.fatherHusbandName ? "!border-red-500" : ""
                  }`}
                  title={formErrors.fatherHusbandName}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
                <SingleSelect
                  options={GenderOptions}
                  value={formData.gender}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                  error={formErrors.gender}
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
                  className={`border p-2 rounded ${
                    formErrors.age ? "!border-red-500" : ""
                  }`}
                  title={formErrors.age}
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
                  className={`border p-2 rounded ${
                    formErrors.phone ? "!border-red-500" : ""
                  }`}
                  title={formErrors.phone}
                />
              </div>

              {/* Code */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Beneficiary Code</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Code ..."
                  value={formData.code}
                  onChange={handleFormChange}
                  className={`border p-2 rounded ${
                    formErrors.code ? "!border-red-500" : ""
                  }`}
                  title={formErrors.code}
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
                  className={`border p-2 rounded ${
                    formErrors.email ? "!border-red-500" : ""
                  }`}
                  title={formErrors.email}
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
                  className={`border p-2 rounded ${
                    formErrors.participantOrganization ? "!border-red-500" : ""
                  }`}
                  title={formErrors.participantOrganization}
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
                  className={`border p-2 rounded ${
                    formErrors.jobTitle ? "!border-red-500" : ""
                  }`}
                  title={formErrors.jobTitle}
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
                  className={`border p-2 rounded ${
                    formErrors.dateOfRegistration ? "!border-red-500" : ""
                  }`}
                  title={formErrors.dateOfRegistration}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            id={SUBMIT_BUTTON_PROVIDER_ID}
            type="button"
            disabled={loading}
            className="w-full mt-6"
            onClick={(e) =>
              reqForConfirmationModelFunc(
                TrainingBeneficiaryCreationMessage,
                () => handleSubmit(e),
              )
            }
          >
            {loading
              ? "Please wait..."
              : IsEditMode(mode)
                ? "Update Beneficiary"
                : "Create Beneficiary"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingBeneficiaryForm;
