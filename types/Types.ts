export type User = {
    id: string;
    name: string;
    title: string;
    status: "active" | "deactive" | "blocked";
    email: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
};

export type Role = {
    id: string;
    name: string;
    status: "active" | "deactive";
};

export type Permission = {
    id: string;
    label: string;
    status: "active" | "deactive";
    goupName: string
};

export type Project = {
    projectCode: string
    projectTitle: string
    projectGoal: string
    projectDonor: string
    startDate: string
    endDate: string
    status: "planned" | "ongoing" | "completed" | "onhold" | "canclled"
    projectManager: string
    reportingDate: string
    reportingPeriod: string
    description: string
};

export type MainDatabaseBeneficiary = {
  program: string;
  beneficiaryCode: string;
  clientName: string;
  fatherHusbandName: string;
  gender: "male" | "female" | "other";
  age: number;
  childCode: string;
  childAge: number;
  phone: string;
  householdStatus: string;
  maritalStatus: string;
  literacyLevel: string;
  disabilityType: string;
  referredForProtection: boolean;
  dateOfRegistration: string;
};

export type MainDatabaseProgram = {
    projectCode: string;
    focalPoint: string;
    province: string;
    district: string;
    village: string;
    siteCode: string;
    healthFacilityName: string;
    interventionModality: string;
};

export type BeneficiaryForm = {
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

export type TrainingBenefeciaryForm = {
    name: string;
    fatherHusbandName: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
    participantOrganization: string;
    jobTitle: string;
    dateOfRegistration: string;
};

export type KitFormType = {
    kits: string[],
    distributionDate: string,
    remark: string,
    isReceived: boolean
}

export type TrainingForm = {
    projectCode: string;
    province: string;
    district: string;
    trainingLocation: string;
    name: string;
    participantCatagory: string;
    aprIncluded: boolean;
    trainingModality: string;
    startDate: string;
    endDate: string;
    indicator: string;
}
  
export type ChapterForm = {
    topic: string;
    facilitatorName: string;
    facilitatorJobTitle: string;
    startDate: string;
    endDate: string;
};

export type CommunityDialogBeneficiaryForm = {
    name: string;
    fatherHusbandName: string;
    age: number;
    maritalStatus: string;
    gender: string;
    phone: string;
    nationalId: string;
    jobTitle: string;
    incentiveReceived: boolean;
    incentiveAmount: string;
    dateOfRegistration: string;
};


export type AssessmentFormType = {
    project_id : string,
    province_id: string,
    indicator_id: string,
    councilorName: string,
    raterName: string,
    type: string,
    date: string,
    aprIncluded: boolean
}