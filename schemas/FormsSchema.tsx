import { z } from "zod";

export const MainDatabaseBeneficiaryFormSchema = z.object({
  program: z.number().min(1, {
    error: "Select a valid program !",
  }),
  dateOfRegistration: z.string().min(1, "Date of registration is required !"),
  name: z.string().min(3, "Beneficiary name should be at least 3 characters !"),
  fatherHusbandName: z
    .string()
    .min(3, "Beneficiary father/husband name should be at least 3 characters"),
  gender: z.string().min(4, "Select a valid gender"),
  age: z
    .string()
    .min(1, "Beneficiary age should be greather then or equal to 1"),
  code: z
    .string()
    .min(
      1,
      "Beneficiary code should be at least one character or more then or equal to 1 digit !"
    ),
  childCode: z
    .string()
    .min(
      1,
      "Beneficiary child code should be at least one character or greater then or equal to 1 !"
    ),
  childAge: z.string().min(1, "Beneficiary child age should be at least 1 !"),
  phone: z
    .string()
    .min(
      10,
      "Beneficiary phone number should be at least 10 digits (Afganistan format) !"
    ),
  householdStatus: z.string().min(1, "Select a valid houshold status !"),
  maritalStatus: z.string().min(1, "Select a valid marital status !"),
  literacyLevel: z
    .string()
    .min(1, "Beneficiary litracy level should be at least one character !"),
  disabilityType: z.string().min(1, "Select a valid disability type !"),
  referredForProtection: z.boolean("Select a valid option !"),
});

export const MealToolFormSchema = z.object({
  beneficiary_id: z
    .string()
    .min(1, "Beneficiary is required"),

  type: z
    .string()
    .min(1, "Type is required"),

  baselineDate: z
    .string()
    .min(1, "Baseline date is required"),

  endlineDate: z
    .string()
    .min(1, "Endline date is required"),

  baselineTotalScore: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Baseline total score must be a number"),

  endlineTotalScore: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Endline total score must be a number"),

  improvementPercentage: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Improvement percentage must be a number"),

  isBaselineActive: z.boolean(),

  isEndlineActive: z.boolean(),

  evaluation: z
    .string()
    .min(1, "Evaluation is required"),
});

export const KitDatabaseBeneficiaryFormSchema = z.object({
  program: z.number().min(1, {
    error: "Select a valid program !",
  }),
  // indicators: z.array<string>("").min(1, "Select at least one indicator !"),
  dateOfRegistration: z.string().min(1, "Date of registration is required !"),
  name: z.string().min(3, "Beneficiary name should be at least 3 characters !"),
  fatherHusbandName: z
    .string()
    .min(3, "Beneficiary father/husband name should be at least 3 characters"),
  gender: z.string().min(4, "Select a valid gender"),
  age: z
    .string()
    .min(1, "Beneficiary age should be greather then or equal to 1"),
  code: z
    .string()
    .min(
      1,
      "Beneficiary code should be at least one character or more then or equal to 1 digit !"
    ),
  childCode: z
    .string()
    .min(
      1,
      "Beneficiary child code should be at least one character or greater then or equal to 1 !"
    ),
  childAge: z.string().min(1, "Beneficiary child age should be at least 1 !"),
  phone: z
    .string()
    .min(
      10,
      "Beneficiary phone number should be at least 10 digits (Afganistan format) !"
    ),
  householdStatus: z.string().min(1, "Select a valid houshold status !"),
  maritalStatus: z.string().min(1, "Select a valid marital status !"),
  literacyLevel: z
    .string()
    .min(1, "Beneficiary litracy level should be at least one character !"),
  disabilityType: z.string().min(1, "Select a valid disability type !"),
  referredForProtection: z.boolean("Select a valid option !"),
});

export const CdDatabaseBenefciaryFormSchema = z.object({
  dateOfRegistration: z.string("Select a valid date"),
  name: z.string().min(3, "Beneficiary name should be at least 3 characters !"),
  fatherHusbandName: z
    .string()
    .min(3, "Beneficiary father/husband name should be at least 3 characters"),
  gender: z.string().min(4, "Select a valid gender"),
  age: z
    .string()
    .min(1, "Beneficiary age should be greather then or equal to 1"),
  phone: z
    .string()
    .min(
      10,
      "Beneficiary phone number should be at least 10 digits (Afganistan format) !"
    ),
  maritalStatus: z.string().min(1, "Select a valid marital status !"),
  nationalId: z
    .string()
    .min(3, "National id should be at least 3 characters or 3 digits !"),
  jobTitle: z
    .string("Job title is required !")
    .min(1, "Job title is required !"),
  code: z.string().min(1, "Beneficiary code should be at least one character !"),
  incentiveReceived: z.boolean("Incentive received status is required !"),
  incentiveAmount: z
    .string("Incentive amount is required !")
    .min(1, "Incentive amount is required !"),
});

export const CdFormSchema = z.object({
  project_id: z.number().min(1, "Select a valid project !"),
  name: z.string().min(3, "Program name should be atleast 3 characters !"),
  province_id: z
    .number("Select a valid province !")
    .min(1, "Select a valid province !"),
  district_id: z
    .number("select a valid district !")
    .min(1, "select a valid district !"),
  indicator_id: z
    .number("Select a valid indicator !")
    .min(1, "Select a valid indicator !"),
  village: z
    .string("Vlillage name should be at least 2 characters !")
    .min(1, "Vlillage name should be at least 2 characters !"),
  focalPoint: z
    .string()
    .min(3, "focal point should be at least 3 characters of 3 digits !"),
  cdName: z
    .string()
    .min(3, "Community dialogue name should be at least 3 characters !"),
});

export const TrainingFormSchema = z.object({
  project_id: z.number().min(1, "Select a valid project!"),

  province_id: z.number().min(1, "Select a valid province!"),

  district_id: z.number().min(1, "Select a valid district!"),

  indicator_id: z.number().min(1, "Select a valid indicator!"),

  trainingLocation: z
    .string()
    .min(2, "Training location must be at least 2 characters"),

  name: z.string().min(2, "Training name must be at least 2 characters"),

  participantCatagory: z.string().min(1, "Select participant category"),

  aprIncluded: z.boolean(),

  trainingModality: z.string().min(1, "Select training modality"),

  startDate: z.string().min(1, "Start date is required"),

  endDate: z.string().min(1, "End date is required"),
});

export const TrainingDatabaseBenefeciaryFormSchema = z.object({
  dateOfRegistration: z.string("Select a valid date"),
  name: z.string().min(3, "Beneficiary name should be at least 3 characters !"),
  fatherHusbandName: z
    .string()
    .min(3, "Beneficiary father/husband name should be at least 3 characters"),
  gender: z.string().min(4, "Select a valid gender"),
  age: z.string("Beneficiary age should be greather then or equal to 1").min(1),
  phone: z
    .string()
    .min(
      10,
      "Beneficiary phone number should be at least 10 digits (Afganistan format) !"
    ),
  email: z.email("Email feild is required !"),
  code : z.string().min(1, "Beneficiary code should be at least one character !"),
  participantOrganization: z
    .string()
    .min(1, "participant organization is required !"),
  jobTitle: z
    .string("Job title is required !")
    .min(1, "Job title is required !"),
});

export const PsychoeducationFormSchema = z.object({
  programInformation: z.object({
    project_id: z.number("Select a valid project"),
    indicator_id: z.number("Select a valid indicator !"),
    name: z.string().min(3, "Program name should be at least 3 characters !"),
    focalPoint: z
      .string("Focal point must be at least 3 characters or 3 digits !")
      .min(3, "Focal point must be at least 3 characters or 3 digits !"),
    province_id: z.number("Select a valid province !"),
    district_id: z.number("Select a valid district !"),
    siteCode: z
      .string("Site code should be at least 1 character or 1 digit !")
      .min(1, "Site code should be at least 1 character or 1 digit !"),
    village: z
      .string("Village name should be at least 2 characters !")
      .min(2, "Village name should be at least 2 characters !"),
    healthFacilityName: z
      .string("Health facility name is required !")
      .min(1, "Health facility name is required !"),
    interventionModality: z
      .string("Intervention modality is required !")
      .min(1, "Intervention modality is required !"),
  }),
  psychoeducationInformation: z.object({
    awarenessTopic: z.string().min(1, "Awareness topic is required !"),
    awarenessDate: z.string().min(1, "Awareness date is required !"),
  }),
});

export const AssessmentFormSchema = z.object({
  project_id: z.number("Select a valid project"),
  indicator_id: z
    .number("Select a valid indicator !")
    .min(1, "Select a valid indicator !"),
  province_id: z
    .number("Select a valid province !")
    .min(1, "Select a valid province !"),
  councilorName: z
    .string("Councilor name should be at least 3 characters !")
    .min(3, "Councilor name should be at least 3 characters !"),
  raterName: z
    .string("Rater name should be at least 3 characters !")
    .min(3, "Rater name should be at least 3 characters !"),
  type: z.string("Select a valid type !").min(1, "Select a valid type !"),
  // date: z.date(),
});

export const UserCreateFormSchema = z.object({
  name: z
    .string("The name field should be at least 3 characters !")
    .min(3, "The name should be at least 3 characters !"),
  title: z
    .string("Title field should be at least 3 characters !")
    .min(3, "Title field should be at least 3 characters !"),
  email: z.email("Enter a valid email address !"),
  password: z
    .string("Password must be at least 7 characters !")
    .min(7, "Password must be at least 7 characters !"),
  // department: z.string("Select a valid department !"),
  role: z.string("Select a valid role !"),
  status: z.string("Select a valid status"),
});

export const UserEditFormSchema = z.object({
  name: z
    .string("The name field should be at least 3 characters !")
    .min(3, "The name should be at least 3 characters !"),
  title: z
    .string("Title field should be at least 3 characters !")
    .min(3, "Title field should be at least 3 characters !"),
  email: z.email("Enter a valid email address !"),
  role: z.string("Select a valid role !"),
  status: z.string("Select a valid status"),
});

export const RoleFormSchema = z.object({
  name: z
    .string("The name field should be at least 3 characters !")
    .min(3, "The name should be at least 3 characters !"),
});

export const SubmittNewDatabaseFormSchema = z.object({
  project_id: z.number("Select a valid project"),
  database_id: z.number("Select a valid database !"),
  province_id: z.number("Select a valid province !"),
  fromMonth: z.string("Select a valid date"),
  fromYear: z.string("Select a valid date"),
  toMonth: z.string("Select a valid date"),
  toYear: z.string("Select a valid date"),
});

export const ProjectFormSchema = z.object({
  projectCode: z.string().min(1, "Project code is required!"),
  projectTitle: z.string().min(1, "Project title is required!"),
  projectGoal: z.string().min(1, "Project goal is required!"),
  projectDonor: z.string().min(1, "Project donor is required!"),
  startDate: z.string().min(1, "Start date is required!"),
  endDate: z.string().min(1, "End date is required!"),
  status: z.string().min(1, "Select a valid status!"),
  projectManager: z.string().min(1, "Project manager is required!"),
  provinces: z
    .array(z.string())
    .min(1, { message: "Select at least one valid province!" }),
  thematicSector: z
    .array(z.string())
    .min(1, { message: "Select at least one thematic sector!" }),
  reportingPeriod: z.string().min(1, "Reporting period is required!"),
  reportingDate: z.string().min(1, "Reporting date is required!"),
  aprStatus: z.string().min(1, "Select a valid APR status!"),
  description: z.string().min(1, "Description is required!"),
});

export const OutcomeFormSchema = z.object({
  outcome: z.string().min(1, "Outcome is requried !"),
  outcomeRef: z.string().min(1, "Outcome referance is required!"),
});

export const OutputFormSchema = z.object({
  outcomeId: z.number().min(1, "Outcome referance is required !"),
  output: z.string().min(1, "Output is requried !"),
  outputRef: z.string().min(1, "Output referance is required!"),
});

const ProvinceSchema = z.object({
  province: z.string().min(1, "Province name is required"),
  target: z.number().min(0, "Target must be non-negative"),
  councilorCount: z.number().min(0, "Councilor count must be non-negative"),
});

const SubIndicatorSchema = z.object({
  indicatorRef: z.string().min(1, "Indicator reference is required"),
  name: z.string().min(1, "SubIndicator name is required"),
  target: z.number().min(0, "Target must be non-negative"),
  dessaggregationType: z.enum(["session", "indevidual"]).or(z.string()),
  provinces: z
    .array(ProvinceSchema)
    .min(1, "At least one province is required"),
});

export const IndicatorFormSchema = z.object({
  id: z.string().nullable(),
  outputId: z.string().nullable(),
  outputRef: z.string().min(1, "Output reference is required!"),
  indicator: z.string().min(1, "Indicator name is required!"),
  indicatorRef: z.string().min(1, "Indicator reference is required!"),
  target: z.number().min(0, "Target must be a non-negative number!"),
  status: z.enum([
    "notStarted",
    "inProgress",
    "achived",
    "notAchived",
    "partiallyAchived",
  ]),
  database: z.string().min(1, "Database field is required!"),
  type: z.string().nullable(),
  provinces: z
    .array(ProvinceSchema)
    .min(1, "Select at least one valid province!"),
  dessaggregationType: z.enum(["session", "indevidual", "enact"]),
  description: z.string().min(1, "Description is required!"),
  subIndicator: SubIndicatorSchema.nullable(),
});

export const MainDatabaseProgramFormSchema = z.object({
  project_id: z.number().min(1, "Project code is required"),
  name: z.string().min(3, "Program name should be at least 3 characters !"),
  focalPoint: z
    .string()
    .min(3, "Focal point must be at least 3 characters or 3 digits"),
  province: z.string().min(1, "Select a valid province"),
  district: z.string().min(1, "Select a valid district"),
  village: z.string().min(1, "Village name should be at least 2 characters"),
  siteCode: z.string().min(1, "Site code should be at least 1 characters !"),
  healthFacilityName: z.string().min(3, "Health facility name is required"),
  interventionModality: z.string().min(1, "Intervention modality is required"),
});

export const KitDatabaseProgramFormSchema = z.object({
  project_id: z.number().min(1, "Project code is required"),
  name: z.string().min(3, "Program name should be at least 3 characters !"),
  focalPoint: z
    .string()
    .min(3, "Focal point must be at least 3 characters or 3 digits"),
  province: z.string().min(1, "Select a valid province"),
  district: z.string().min(1, "Select a valid district"),
  village: z.string().min(1, "Village name should be at least 2 characters"),
  siteCode: z.string().min(1, "Site code should be at least 1 characters !"),
  healthFacilityName: z.string().min(3, "Health facility name is required"),
  interventionModality: z.string().min(1, "Intervention modality is required"),
});

export const IndicatorSchema = z
  .object({
    outputId: z.number(),
    indicator: z.string().min(1, "Indicator name is required"),
    indicatorRef: z.string().min(1, "Indicator reference is required"),
    target: z.number().min(0, "Target must be non-negative"),
    status: z.string().min(1, "Status is required"),
    database: z.string().min(1, "Database name is required"),
    type: z.string().nullable(),
    provinces: z
      .array(ProvinceSchema)
      .min(1, "At least one province is required"),
    dessaggregationType: z
      .enum(["session", "indevidual", "enact"])
      .or(z.string()),
    description: z.string().min(1, "Description is required"),
    subIndicator: SubIndicatorSchema.nullable(),
    parent_indicator: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.database === "main_database" &&
      (!data.type || data.type.trim() === "")
    ) {
      ctx.addIssue({
        path: ["type"],
        code: z.ZodIssueCode.custom,
        message: "Type is required when database is 'main_database'",
      });
    }
  });

// Dessaggregation Schema
export const DessaggregationSchema = z.object({
  id: z.string().nullable(),
  indicatorId: z.string().nullable(),
  indicatorRef: z.string().min(1, "Indicator reference is required"),
  dessaggration: z.string().min(1, "Dessaggregation type is required"),
  province: z.string().min(1, "Province name is required"),
  target: z.number().min(0, "Target must be non-negative"),
});

// Isp3 Schema
export const Isp3Schema = z.object({
  name: z.string().min(1, "Name is required"),
  indicators: z.array(z.string()).min(1, "At least one indicator is required"),
});
