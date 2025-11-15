export const MainDatabaseBeneficiariesFilterUrl: string =
  "/filter/main_database/beneficiaries";
export const MainDatabaseBeneficiariesFilters: string[] = [
  "projectCode",
  "indicator",
  "focalPoint",
  "province",
  "siteCode",
  "healthFacilitator",
  "dateOfRegistration",
  "age",
  "maritalStatus",
  "householdStatus",
  "baselineDate",
  "endlineDate",
];

export const MainDatabaseProgramsFitlterUrl: string =
  "/filter/main_database/program";
export const MainDatabaseProgramsFilters: string[] = [
  "projectCode",
  "focalPoint",
  "province",
  "district",
  "village",
  "siteCode",
  "healthFacilityName",
  "interventionModality",
];

export const KitDatabaseBeneficiaryFiltersUrl: string =
  "/filter/kit_database/beneficiaries";
export const KitDatabaseBeneficiaryFiltersList: string[] = [
  "projectCode",
  "indicator",
  "focalPoint",
  "province",
  "siteCode",
  "healthFacilitator",
  "dateOfRegistration",
  "age",
  "maritalStatus",
  "householdStatus",
  "baselineDate",
  "endlineDate",
];

export const KitDatabaseProgramsFilterUrl: string =
  "/filter/kit_database/program";
export const KitDatabaseProgramsFiltersList: string[] = [
  "projectCode",
  "focalPoint",
  "province",
  "district",
  "village",
  "siteCode",
  "healthFacilityName",
  "interventionModality",
];

export const KitDatabaseBeneficiaryKitsTableFilterUrl: string = "";
export const KitDatabaseBeneficiaryKitsTableFiltersList: string[] = [
  "kit",
  "distributionDate",
  "isReceived",
];

export const PsychoeducationFilterUrl: string =
  "filter/psychoeducation_db/psychoeducations";
export const PsychoeducationsFiltersList: string[] = [
  "indicator",
  "awarenessTopic",
  "awarenessDate",
];

export const TrainingDatabaseBeneficiaryFilterUrl: string =
  "/filter/training_database/beneficiaries";
export const TrainingDatabaseBeneficiaryFiltersList: string[] = [
  "projectCode",
  "indicator",
  "province",
  "age",
  "gender",
];

export const TrainingFilterUrl: string = "/filter/training_database/trainings";
export const TrainingFiltersList: string[] = [
  "projectCode",
  "indicatorRef",
  "province",
];

export const ReferralsFilterUrl: string =
  "/filter/refferal_database/beneficiaries";
export const ReferralsFiltersList: string[] = [
  "projectCode",
  "province",
  "age",
  "gender",
  "dateOfRegistration",
];

export const CommunityDialogueBeneficiariesFilterUrl: string =
  "/filter/cd_database/beneficiaries";
export const CommunityDialogueBeneficiariesFiltersList: string[] = [
  "projectCode",
  "province",
  "indicator",
  "age",
  "gender",
  "dateOfRegistration",
];

export const CommunityDialoguesFilterUrl: string = "/filter/cd_database/cds";
export const CommunityDialoguesFiltersList: string[] = [
  "projectCode",
  "focalPoint",
  "province",
  "indicator",
];

export const AssessmentsFilterUrl: string = "/filter/enact_database/enacts";
export const AssessmentsFiltersList: string[] = [
  "projectCode",
  "province",
  "indicator",
  "date",
];

export const UserFilterUrl: string = "/filter/users";
export const UserFiltersList: string[] = [
  "name",
  "email",
  "title",
  "status",
  "create_at",
];

export const RoleFilterUrl: string = "/filter/roles";
export const RoleFiltersList: string[] = ["name", "status"];

export const PermissionFilterUrl: string = "/filter/permissions";
export const PermissionFiltersList: string[] = ["group_name"];

export const ApprovedAprsFilterUrl: string = "/filter/aprroved_aprs";
export const ApprovedAprsFiltersList: string[] = [
  "projectCode",
  "province",
  "database",
  "fromDate",
  "toDate",
];

export const ApprovedDatabasesFilterUrl: string = "/filter/approved_databases";
export const ApprovedDatabasesFiltersList: string[] = ["projectCode", "province", "database", "fromDate", "toDate"];

export const SubmittedDatabasesFilterUrl: string = "/filter/submitted_databases";
export const SubmittedDatabasesFiltersList: string[] = ["projectCode", "province", "database", "fromDate", "toDate"];