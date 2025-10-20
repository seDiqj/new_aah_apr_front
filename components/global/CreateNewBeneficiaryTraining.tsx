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
import { createAxiosInstance } from "@/lib/axios";
import { TrainingBenefeciaryForm } from "@/types/Types";

interface DatabaseSummaryProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
}

const TrainingBeneficiaryForm: React.FC<DatabaseSummaryProps> = ({
  open,
  onOpenChange,
  title,
}) => {
  const { reqForToastAndSetMessage } = useParentContext();

  const axiosInstanse = createAxiosInstance();

  const [formData, setFormData] = useState<TrainingBenefeciaryForm>({
    clientName: "",
    fatherHusbandName: "",
    gender: "male",
    age: 0,
    phone: "",
    email: "",
    participantOrganization: "",
    jobTitle: "",
    dateOfRegistration: "",
  });

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axiosInstanse
      .post("/training_db/beneficiary", formData)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      });
  };

  useEffect(() => console.log(formData), [formData]);

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
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>
        {/* Beneficiary Information Form */}
        <div className="w-full">
          {/* Beneficiary Information Badge */}
          <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
            Beneficiary Information
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* Beneficiary Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {/* Client Name */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Client Name ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Father / Husbend Name */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="fatherHusbandName">Father / Husbend Name</Label>
                <Input
                  id="fatherHusbandName"
                  name="fatherHusbandName"
                  placeholder="Father / Husbend Name ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Gender */}
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
                      target: {
                        name: "gender",
                        value: value,
                      },
                    });
                  }}
                ></SingleSelect>
              </div>

              {/* Age */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Client Phone */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="phone">Client Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="tel"
                  placeholder="Email ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Participant Orgnization */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="participantOrganization">
                  Participant Orgnization
                </Label>
                <Input
                  id="participantOrganization"
                  name="participantOrganization"
                  type="tel"
                  placeholder="Orgnization ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Participant Job Title */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="jobTitle">Participant Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  type="tel"
                  placeholder="Job Title ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <Label htmlFor="dateOfRegistration">Date Of Registration</Label>
                <Input
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  type="date"
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingBeneficiaryForm;
