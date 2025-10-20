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
import { SingleSelect } from "../single-select";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { MultiSelect } from "../multi-select";
import { withPermission } from "@/lib/withPermission";

type BeneficiaryForm = {
  program: string;
  indicators: string[];
  dateOfRegistration: string;
  code: string;
  name: string;
  fatherHusbandName: string;
  gender: string;
  age: number;
  maritalStatus: string;
  childCode: string;
  ageOfChild: number;
  phone: string;
  houseHoldStatus: string;
  literacyLevel: string;
  disablilityType: string;
  referredForProtection: boolean;
};

interface DatabaseSummaryProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
}

const KitDatabaseBeneficiaryForm: React.FC<DatabaseSummaryProps> = ({
  open,
  onOpenChange,
  title,
}) => {
  const { reqForToastAndSetMessage } = useParentContext();

  const axiosInstanse = createAxiosInstance();

  const [formData, setFormData] = useState<BeneficiaryForm>({
    program: "",
    indicators: [],
    dateOfRegistration: "",
    code: "",
    name: "",
    fatherHusbandName: "",
    gender: "",
    age: 0,
    maritalStatus: "",
    childCode: "",
    ageOfChild: 0,
    phone: "",
    houseHoldStatus: "",
    literacyLevel: "",
    disablilityType: "",
    referredForProtection: false,
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
      .post("/kit_db/beneficiary", formData)
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        {
          reqForToastAndSetMessage(error.response.data.message)
        }
      );
  };

  useEffect(() => console.log(formData), [formData]);

  const [programs, setPrograms] = useState<
    {
      focalPoint: number;
    }[]
  >([]);

  const [indicators, setIndicators] = useState<
    {
      indicator: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetching kit database programs
    axiosInstanse
      .get(`global/programs/kit_database`)
      .then((response: any) => {
        setPrograms(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
    // Fetching kit database indicators
    axiosInstanse
      .get(`global/indicators/kit_database`)
      .then((response: any) => {
        console.log(response.data.data);
        setIndicators(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, [open]);

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
        {/* Program Selector AND Form */}
        <div className="w-full">
          <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
            Program Information
          </div>

          <div className="flex flex-col gap-2">
            {/* Program Selector */}
            <div className="flex flex-col w-full border-2 rounded-2xl">
              <SingleSelect
                options={programs.map((program) => ({
                  value: program.focalPoint.toString(),
                  label: program.focalPoint.toString().toUpperCase(),
                }))}
                value={formData.program}
                onValueChange={(value: string) => {
                  handleFormChange({
                    target: {
                      name: "program",
                      value: value,
                    },
                  });
                }}
                placeholder="Select Exising Program"
              ></SingleSelect>
            </div>
            {/* Seperator */}
            <div>
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            </div>

            {/* Create New Program Button */}
            <div className="w-full border-2 rounded-2xl">
              <Button className="w-full">Create New Program</Button>
            </div>
          </div>
        </div>

        {/* Beneficiary Information Form */}
        <div className="w-full">
          {/* Beneficiary Information Badge */}
          <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
            Beneficiary Information
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* Indicator Selector */}
            <div className="flex flex-col w-full border-2 rounded-2xl">
              <MultiSelect
                options={indicators.map((indicator) => ({
                  value: indicator.indicator,
                  label: indicator.indicator.toUpperCase(),
                }))}
                value={formData.indicators}
                onValueChange={(value: string[]) => {
                  handleFormChange({
                    target: {
                      name: "indicators",
                      value: value,
                    },
                  });
                }}
                placeholder="Assign Indicator"
              ></MultiSelect>
            </div>

            {/* Beneficiary Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {/* Date Of Registration */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="dateOfRegistration">Date Of Registration</Label>
                <Input
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  type="date"
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Beneficiary Code */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="code">Beneficiary Code</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Code ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

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

              {/* Child Of BNF Code */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="childCode">Child Of BNF Code</Label>
                <Input
                  id="childCode"
                  name="childCode"
                  placeholder="Child Code ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Age Of Child OF BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="ageOfChild">Age Of Child OF BNF</Label>
                <Input
                  id="ageOfChild"
                  name="ageOfChild"
                  type="number"
                  placeholder="Age Of Child ..."
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

              {/* Marital status */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="houseHoldStatus">HouseHold Status of BNF</Label>
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
                      target: {
                        name: "maritalStatus",
                        value: value,
                      },
                    })
                  }
                />
              </div>

              {/* HouseHold Status of BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="houseHoldStatus">HouseHold Status of BNF</Label>
                <SingleSelect
                  options={[
                    { value: "idp_drought", label: "IDP (IDP Drought)" },
                    { value: "idp_conflict", label: "IDP (IDP Conflict)" },
                    { value: "returnee", label: "Returnee" },
                    { value: "host_community", label: "Host Community" },
                    { value: "refugee", label: "Refugee" },
                  ]}
                  value={formData.houseHoldStatus}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "houseHoldStatus",
                        value: value,
                      },
                    })
                  }
                />
              </div>

              {/* Literacy Level Of BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="literacyLevel">Literacy Level Of BNF</Label>
                <Input
                  id="literacyLevel"
                  name="literacyLevel"
                  placeholder="Literacy Level ..."
                  className="border w-full"
                  onChange={handleFormChange}
                />
              </div>

              {/* Disablility Type */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="disablilityType">Disablility Type</Label>
                <SingleSelect
                  options={[
                    {
                      value: "person_with_disability",
                      label: "Person With Disablility",
                    },
                    {
                      value: "person_without_disability",
                      label: "Person Without Disablility",
                    },
                  ]}
                  value={formData.disablilityType}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "disablilityType",
                        value: value,
                      },
                    })
                  }
                />
              </div>

              {/* Referred For Protection */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="referredForProtection">
                  Referred For Protection
                </Label>
                <SingleSelect
                  options={[
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                  ]}
                  value={formData.referredForProtection ? "true" : "false"}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "referredForProtection",
                        value: value == "true" ? true : false,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full mt-6" onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(KitDatabaseBeneficiaryForm, "Kit.create");
