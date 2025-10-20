"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SingleSelect } from "../single-select";
import { MultiSelect } from "../multi-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { withPermission } from "@/lib/withPermission";

type BeneficiaryForm = {
  id: string;
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
  householdStatus: string;
  literacyLevel: string;
  disabilityType: string;
  referredForProtection: boolean;
};

interface UpdateFormProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  beneficiaryId: string;
}

const KitDatabaseBeneficiaryUpdateForm: React.FC<UpdateFormProps> = ({
  open,
  onOpenChange,
  title,
  beneficiaryId,
}) => {
  const { reqForToastAndSetMessage } = useParentContext();
  const axiosInstanse = createAxiosInstance();

  const [formData, setFormData] = useState<BeneficiaryForm>({
    id: "",
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
    householdStatus: "",
    literacyLevel: "",
    disabilityType: "",
    referredForProtection: false,
  });

  const [programs, setPrograms] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);

  // Fetch beneficiary data
  useEffect(() => {
    if (open && beneficiaryId) {
      axiosInstanse
        .get(`/kit_db/beneficiary/${beneficiaryId}`)
        .then((response: any) => {
          const data = response.data.data;
          setFormData({
            id: beneficiaryId,
            program: data.program || "",
            indicators: data.indicators || [],
            dateOfRegistration: data.dateOfRegistration || "",
            code: data.code || "",
            name: data.name || "",
            fatherHusbandName: data.fatherHusbandName || "",
            gender: data.gender || "",
            age: data.age || 0,
            maritalStatus: data.maritalStatus || "",
            childCode: data.childCode || "",
            ageOfChild: data.childAge || 0, // map backend field
            phone: data.phone || "",
            householdStatus: data.householdStatus || "",
            literacyLevel: data.literacyLevel || "",
            disabilityType: data.disabilityType || "",
            referredForProtection: data.protectionServices || false, // map backend field
          });
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(
            error.response?.data?.message || "Error loading beneficiary"
          );
        });
    }
  }, [open, beneficiaryId]);

  // Fetch programs & indicators
  useEffect(() => {
    if (open) {
      axiosInstanse
        .get(`global/programs/kit_database`)
        .then((res: any) => setPrograms(res.data.data))
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message)
        );

      axiosInstanse
        .get(`global/indicators/kit_database`)
        .then((res: any) => setIndicators(res.data.data))
        .catch((err: any) =>
          reqForToastAndSetMessage(err.response?.data?.message)
        );
    }
  }, [open]);

  const handleFormChange = (e: any) => {
    const name: string = e.target.name;
    let value: any = e.target.value;

    // Handle number inputs
    if (e.target.type === "number") value = Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    axiosInstanse
      .put(`/kit_db/beneficiary/${beneficiaryId}`, formData)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        onOpenChange(false);
      })
      .catch((error: any) => {
        console.log(error.response?.data);
        reqForToastAndSetMessage(
          error.response?.data?.message || "Update failed"
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{ maxHeight: "85vh", padding: "10px 16px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="w-full mt-4">
          <div className="bg-white-200 text-black-800 font-bold text-base text-center px-6 py-2 rounded-xl mb-6 shadow-sm max-w-fit mx-auto">
            Update Beneficiary Information
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col w-full border-2 rounded-2xl">
              <MultiSelect
                options={indicators.map((indicator) => ({
                  value: indicator.indicator,
                  label: indicator.indicator.toUpperCase(),
                }))}
                value={formData.indicators}
                onValueChange={(value: string[]) =>
                  setFormData((prev) => ({ ...prev, indicators: value }))
                }
                placeholder="Assign Indicator"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Of Registration */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="dateOfRegistration">Date Of Registration</Label>
                <Input
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  type="date"
                  className="border w-full"
                  value={formData.dateOfRegistration}
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
                  value={formData.code}
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
                  value={formData.name}
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
                  value={formData.fatherHusbandName}
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
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: { name: "gender", value },
                    })
                  }
                />
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
                  value={formData.age}
                  onChange={handleFormChange}
                />
              </div>

              {/* Child Code */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="childCode">Child Of BNF Code</Label>
                <Input
                  id="childCode"
                  name="childCode"
                  placeholder="Child Code ..."
                  className="border w-full"
                  value={formData.childCode}
                  onChange={handleFormChange}
                />
              </div>

              {/* Age Of Child */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="ageOfChild">Age Of Child OF BNF</Label>
                <Input
                  id="ageOfChild"
                  name="ageOfChild"
                  type="number"
                  placeholder="Age Of Child ..."
                  className="border w-full"
                  value={formData.ageOfChild}
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
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>

              {/* Marital Status */}
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
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: { name: "maritalStatus", value },
                    })
                  }
                />
              </div>

              {/* Household Status */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="householdStatus">HouseHold Status of BNF</Label>
                <SingleSelect
                  options={[
                    { value: "idp_drought", label: "IDP (Drought)" },
                    { value: "idp_conflict", label: "IDP (Conflict)" },
                    { value: "returnee", label: "Returnee" },
                    { value: "host_community", label: "Host Community" },
                    { value: "refugee", label: "Refugee" },
                  ]}
                  value={formData.householdStatus}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: { name: "householdStatus", value },
                    })
                  }
                />
              </div>

              {/* Literacy Level */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="literacyLevel">Literacy Level Of BNF</Label>
                <Input
                  id="literacyLevel"
                  name="literacyLevel"
                  placeholder="Literacy Level ..."
                  className="border w-full"
                  value={formData.literacyLevel}
                  onChange={handleFormChange}
                />
              </div>

              {/* Disability Type */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="disabilityType">Disability Type</Label>
                <SingleSelect
                  options={[
                    {
                      value: "person_with_disability",
                      label: "With Disability",
                    },
                    {
                      value: "person_without_disability",
                      label: "Without Disability",
                    },
                  ]}
                  value={formData.disabilityType}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: { name: "disabilityType", value },
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
                        value: value === "true" ? true : false,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button className="w-full mt-6" onClick={handleSubmit}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(KitDatabaseBeneficiaryUpdateForm, "Kit.edit");
