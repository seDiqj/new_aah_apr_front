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
import { withPermission } from "@/lib/withPermission";
import CreateNewProgramMain from "./CreateNewProgramMain";
import { MainDatabaseBeneficiaryFormSchema } from "@/schemas/FormsSchema";
import { MainDatabaseBeneficiary } from "@/types/Types";
import { MainDbBeneficiaryDefault } from "@/lib/FormsDefaultValues";
import { MainDatabaseBeneficiaryCreationMessage } from "@/lib/ConfirmationModelsTexts";
import {
  DisabilityTypeOptions,
  GenderOptions,
  HousholdStatusOptions,
  MaritalStatusOptions,
  ReferredForProtectionOptions,
} from "@/lib/SingleAndMultiSelectOptionsList";
import { MainDatabaseBeneficiaryCreation } from "@/interfaces/Interfaces";

const MainDatabaseBeneficiaryForm: React.FC<
  MainDatabaseBeneficiaryCreation
> = ({ open, onOpenChange, title, createdProgramStateSetter }) => {
  const {
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    axiosInstance,
    handleReload,
  } = useParentContext();

  const [formData, setFormData] = useState<MainDatabaseBeneficiary>(
    MainDbBeneficiaryDefault()
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [reqForProgramCreationForm, setReqForProgramCreationForm] =
    useState<boolean>(false);

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

    const result = MainDatabaseBeneficiaryFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errors[field as string] = issue.message;
      });

      setFormErrors(errors);
      reqForToastAndSetMessage(
        "Please fix validation errors before submitting."
      );
      return;
    }

    setFormErrors({});

    axiosInstance
      .post("/main_db/beneficiary", formData)
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);

        handleReload();
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      });
  };

  const [programs, setPrograms] = useState<
    {
      focalPoint: number;
    }[]
  >([]);

  useEffect(() => {
    // Fetching kit database programs
    axiosInstance
      .get(`global/programs/main_database`)
      .then((response: any) => {
        setPrograms(response.data.data);
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
                error={formErrors.program}
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
              <Button
                onClick={() =>
                  setReqForProgramCreationForm(!reqForProgramCreationForm)
                }
                className="w-full"
              >
                Create New Program
              </Button>
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
            {/* Beneficiary Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {/* Date Of Registration */}
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
                  title={
                    formErrors.dateOfRegistration
                      ? formErrors["dateOfRegistration"]
                      : undefined
                  }
                />
              </div>

              {/* Beneficiary Code */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="code">Beneficiary Code</Label>
                <Input
                  title={formErrors.code ? formErrors["code"] : undefined}
                  id="code"
                  name="code"
                  placeholder="Code ..."
                  className={`border p-2 rounded ${
                    formErrors.code ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Client Name */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  title={
                    formErrors.name ? formErrors["name"] : undefined
                  }
                  id="name"
                  name="name"
                  placeholder="Client Name ..."
                  className={`border p-2 rounded ${
                    formErrors.name ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Father / Husbend Name */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="fatherHusbandName">Father / Husbend Name</Label>
                <Input
                  title={
                    formErrors.fatherHusbandName
                      ? formErrors["fatherHusbandName"]
                      : undefined
                  }
                  id="fatherHusbandName"
                  name="fatherHusbandName"
                  placeholder="Father / Husbend Name ..."
                  className={`border p-2 rounded ${
                    formErrors.fatherHusbandName ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="gender">Gender</Label>
                <SingleSelect
                  options={GenderOptions}
                  value={formData.gender}
                  onValueChange={(value: string) => {
                    handleFormChange({
                      target: {
                        name: "gender",
                        value: value,
                      },
                    });
                  }}
                  error={formErrors.gender}
                ></SingleSelect>
              </div>

              {/* Age */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="age">Age</Label>
                <Input
                  title={formErrors.age ? formErrors["age"] : undefined}
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age ..."
                  className={`border p-2 rounded ${
                    formErrors.age ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Child Of BNF Code */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="childCode">Child Of BNF Code</Label>
                <Input
                  title={
                    formErrors.childCode ? formErrors["childCode"] : undefined
                  }
                  id="childCode"
                  name="childCode"
                  placeholder="Child Code ..."
                  className={`border p-2 rounded ${
                    formErrors.childCode ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Age Of Child OF BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="childAge">Age Of Child OF BNF</Label>
                <Input
                  title={
                    formErrors.childAge ? formErrors["childAge"] : undefined
                  }
                  id="childAge"
                  name="childAge"
                  type="number"
                  placeholder="Age Of Child ..."
                  className={`border p-2 rounded ${
                    formErrors.childAge ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Client Phone */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="phone">Client Phone</Label>
                <Input
                  title={formErrors.phone ? formErrors["phone"] : undefined}
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone ..."
                  className={`border p-2 rounded ${
                    formErrors.phone ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Marital status */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <SingleSelect
                  options={MaritalStatusOptions}
                  value={formData.maritalStatus}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "maritalStatus",
                        value: value,
                      },
                    })
                  }
                  error={formErrors.maritalStatus}
                />
              </div>

              {/* HouseHold Status of BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="householdStatus">Household Status of BNF</Label>
                <SingleSelect
                  options={HousholdStatusOptions}
                  value={formData.householdStatus}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "householdStatus",
                        value: value,
                      },
                    })
                  }
                  error={formErrors.householdStatus}
                />
              </div>

              {/* Literacy Level Of BNF */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="literacyLevel">Literacy Level Of BNF</Label>
                <Input
                  title={
                    formErrors.literacyLevel
                      ? formErrors["literacyLevel"]
                      : undefined
                  }
                  id="literacyLevel"
                  name="literacyLevel"
                  placeholder="Literacy Level ..."
                  className={`border p-2 rounded ${
                    formErrors.literacyLevel ? "!border-red-500" : ""
                  } w-full`}
                  onChange={handleFormChange}
                />
              </div>

              {/* Disablility Type */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="disabilityType">Disablility Type</Label>
                <SingleSelect
                  options={DisabilityTypeOptions}
                  value={formData.disabilityType}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "disabilityType",
                        value: value,
                      },
                    })
                  }
                  error={formErrors.disabilityType}
                />
              </div>

              {/* Referred For Protection */}
              <div className="flex flex-col gap-4">
                <Label htmlFor="referredForProtection">
                  Referred For Protection
                </Label>
                <SingleSelect
                  options={ReferredForProtectionOptions}
                  value={formData.referredForProtection ? "true" : "false"}
                  onValueChange={(value: string) =>
                    handleFormChange({
                      target: {
                        name: "referredForProtection",
                        value: value == "true" ? true : false,
                      },
                    })
                  }
                  error={formErrors.referredForProtection}
                />
              </div>
            </div>
          </div>

          {/* Program create form */}
          {reqForProgramCreationForm && (
            <CreateNewProgramMain
              open={reqForProgramCreationForm}
              onOpenChange={setReqForProgramCreationForm}
              mode="create"
              createdProgramStateSetter={handleFormChange}
              programsListStateSetter={setPrograms}
            ></CreateNewProgramMain>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={(e) =>
            reqForConfirmationModelFunc(
              MainDatabaseBeneficiaryCreationMessage,
              () => handleSubmit(e)
            )
          }
          className="w-full mt-6"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(
  MainDatabaseBeneficiaryForm,
  "Maindatabase.create"
);
