import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Role,
  User,
  Permission,
  Project,
  BeneficiaryForm,
  KitForm,
} from "@/types/Types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Title</div>,
    cell: ({ row }) => row.getValue("title"),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "active":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-green-500 text-white">
              {row.getValue("status")}
            </div>
          );
        case "deactive":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-amber-300 text-white">
              {row.getValue("status")}
            </div>
          );
        case "blocked":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-red-600 text-white">
              {row.getValue("status")}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "updated_by",
    header: () => <div className="text-left">Updated By</div>,
    cell: ({ row }) => row.getValue("updated_by"),
  },
  {
    accessorKey: "created_date",
    header: () => <div className="text-left">Created at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
  {
    accessorKey: "updated_date",
    header: () => <div className="text-left">Updated at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
  {
    accessorKey: "created_by",
    header: () => <div className="text-left">Created By</div>,
    cell: ({ row }) => row.getValue("created_by"),
  },
];

export const roleColumns: ColumnDef<Role>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "active":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-green-500 text-white">
              {row.getValue("status")}
            </div>
          );
        case "deactive":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-amber-300 text-white">
              {row.getValue("status")}
            </div>
          );
        case "blocked":
          return (
            <div className="max-w-[70px] text-center rounded-2xl bg-red-600 text-white">
              {row.getValue("status")}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "created_date",
    header: () => <div className="text-left">Created at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
  {
    accessorKey: "updated_date",
    header: () => <div className="text-left">Updated at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
];

export const permissionColumns: ColumnDef<Permission>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("label")}</div>
    ),
  },
  {
    accessorKey: "group_name",
    header: "Group Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("group_name")}</div>
    ),
  },
  {
    accessorKey: "created_date",
    header: () => <div className="text-left">Created at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
  {
    accessorKey: "updated_date",
    header: () => <div className="text-left">Updated at</div>,
    cell: ({ row }) => row.getValue("updated_date"),
  },
];

export const projectColumns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: ({ row }) => <div>{row.getValue("projectCode")}</div>,
  },
  {
    accessorKey: "projectTitle",
    header: "Project Title",
    cell: ({ row }) => <div>{row.getValue("projectTitle")}</div>,
  },
  {
    accessorKey: "projectGoal",
    header: "Project Goal",
    cell: ({ row }) => <div>{row.getValue("projectGoal")}</div>,
  },
  {
    accessorKey: "projectDonor",
    header: "Project Donor",
    cell: ({ row }) => <div>{row.getValue("projectDonor")}</div>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => <div>{row.getValue("startDate")}</div>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <div>{row.getValue("endDate")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "projectManager",
    header: "Project Manager",
    cell: ({ row }) => <div>{row.getValue("projectManager")}</div>,
  },
  {
    accessorKey: "reportingDate",
    header: "Reporting Date",
    cell: ({ row }) => <div>{row.getValue("reportingDate")}</div>,
  },
  {
    accessorKey: "reportingPeriod",
    header: "Reporting Period",
    cell: ({ row }) => <div>{row.getValue("reportingPeriod")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
];

export const mainDatabaseAndKitDatabaseProgramColumns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "database",
    header: "Database Name",
    cell: ({ row }) => <div>{row.getValue("database")}</div>,
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: ({ row }) => <div>{row.getValue("projectCode")}</div>,
  },
  {
    accessorKey: "focalPoint",
    header: "Focal Point",
    cell: ({ row }) => <div>{row.getValue("focalPoint")}</div>,
  },
  {
    accessorKey: "province",
    header: "Province Name",
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => <div>{row.getValue("district")}</div>,
  },
  {
    accessorKey: "village",
    header: "Village",
    cell: ({ row }) => <div>{row.getValue("village")}</div>,
  },
  {
    accessorKey: "siteCode",
    header: "Site Code",
    cell: ({ row }) => <div>{row.getValue("siteCode")}</div>,
  },
  {
    accessorKey: "healthFacilityName",
    header: "Health Facility Name",
    cell: ({ row }) => <div>{row.getValue("healthFacilityName")}</div>,
  },
  {
    accessorKey: "interventionModality",
    header: "Intervention Modality",
    cell: ({ row }) => <div>{row.getValue("interventionModality")}</div>,
  },
];

export const mainDatabaseAndKitDatabaseBeneficiaryColumns: ColumnDef<BeneficiaryForm>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "focalPoint",
      header: "Program",
      cell: ({ row }) => <div>{row.getValue("focalPoint")}</div>,
    },
    // {
    //   accessorKey: "indicators",
    //   header: "Indicators",
    //   cell: ({ row }) => <div>{(row.getValue("indicators") as []).join(", ")}</div>,
    // },
    {
      accessorKey: "dateOfRegistration",
      header: "Date of Registration",
      cell: ({ row }) => <div>{row.getValue("dateOfRegistration")}</div>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "fatherHusbandName",
      header: "Father/Husband Name",
      cell: ({ row }) => <div>{row.getValue("fatherHusbandName")}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div>{row.getValue("gender")}</div>,
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => <div>{row.getValue("age")}</div>,
    },
    {
      accessorKey: "maritalStatus",
      header: "Marital Status",
      cell: ({ row }) => <div>{row.getValue("maritalStatus")}</div>,
    },
    {
      accessorKey: "childCode",
      header: "Child Code",
      cell: ({ row }) => <div>{row.getValue("childCode")}</div>,
    },
    {
      accessorKey: "childAge",
      header: "Age of Child",
      cell: ({ row }) => <div>{row.getValue("childAge")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "householdStatus",
      header: "Household Status",
      cell: ({ row }) => <div>{row.getValue("householdStatus")}</div>,
    },
    {
      accessorKey: "literacyLevel",
      header: "Literacy Level",
      cell: ({ row }) => <div>{row.getValue("literacyLevel")}</div>,
    },
    {
      accessorKey: "disabilityType",
      header: "Disability Type",
      cell: ({ row }) => <div>{row.getValue("disabilityType")}</div>,
    },
    {
      accessorKey: "referredForProtection",
      header: "Referred for Protection",
      cell: ({ row }) => (
        <div>{row.getValue("referredForProtection") ? "Yes" : "No"}</div>
      ),
    },
  ];

export const beneficiaryKitListColumns: ColumnDef<KitForm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "kit",
    header: "Kit",
    cell: ({ row }) => <div>{row.getValue("kit")}</div>,
  },
  {
    accessorKey: "distributionDate",
    header: "Distribution Date",
    cell: ({ row }) => <div>{row.getValue("distributionDate")}</div>,
  },
  {
    accessorKey: "isReceived",
    header: "Is Received",
    cell: ({ row }) => <div>{row.getValue("isReceived")}</div>,
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: ({ row }) => <div>{row.getValue("remark")}</div>,
  },
];

export const trainingsListColumns: ColumnDef<KitForm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: ({ row }) => <div>{row.getValue("projectCode")}</div>,
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => <div>{row.getValue("district")}</div>,
  },
  {
    accessorKey: "indicator",
    header: "Indicator",
    cell: ({ row }) => <div>{row.getValue("indicator")}</div>,
  },
  {
    accessorKey: "trainingLocation",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("trainingLocation")}</div>,
  },
  {
    accessorKey: "name",
    header: "Training Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "participantCatagory",
    header: "Participant Catagory",
    cell: ({ row }) => <div>{row.getValue("participantCatagory")}</div>,
  },
  {
    accessorKey: "aprIncluded",
    header: "APR Included",
    cell: ({ row }) => <div>{row.getValue("aprIncluded") ? "Yes" : "No"}</div>,
  },
  {
    accessorKey: "trainingModality",
    header: "Modality",
    cell: ({ row }) => <div>{row.getValue("trainingModality")}</div>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => <div>{row.getValue("startDate")}</div>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <div>{row.getValue("endDate")}</div>,
  },
];

export const trainingDatabaseBeneificiaryListColumn: ColumnDef<KitForm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "fatherHusbandName",
    header: "Father / Husband Name",
    cell: ({ row }) => <div>{row.getValue("fatherHusbandName")}</div>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("age")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "participantOrganization",
    header: "Participant Org",
    cell: ({ row }) => <div>{row.getValue("participantOrganization")}</div>,
  },
  {
    accessorKey: "jobTitle",
    header: "Participant Job Title",
    cell: ({ row }) => <div>{row.getValue("jobTitle")}</div>,
  },
];

export const psychoeducationTableListColumn: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => <div>{row.getValue("program")}</div>,
  },
  {
    accessorKey: "indicator",
    header: "Indicator",
    cell: ({ row }) => <div>{row.getValue("indicator")}</div>,
  },
  {
    accessorKey: "awarenessTopic",
    header: "Awareness Topic",
    cell: ({ row }) => <div>{row.getValue("awarenessTopic")}</div>,
  },
  {
    accessorKey: "awarenessDate",
    header: "Awareness Date",
    cell: ({ row }) => <div>{row.getValue("awarenessDate")}</div>,
  },
];

export const beneficiarySessionsTableColumn: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => <div>{row.getValue("topic")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
];

export const enactTableColumn: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectCode",
    header: "Project",
    cell: ({ row }) => <div>{row.getValue("projectCode")}</div>,
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },
  {
    accessorKey: "indicatorRef",
    header: "Indicator",
    cell: ({ row }) => <div>{row.getValue("indicatorRef")}</div>,
  },
  {
    accessorKey: "councilorName",
    header: "Councilor",
    cell: ({ row }) => <div>{row.getValue("councilorName")}</div>,
  },
  {
    accessorKey: "raterName",
    header: "Rater",
    cell: ({ row }) => <div>{row.getValue("raterName")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "aprIncluded",
    header: "APR Included",
    cell: ({ row }) => <div>{row.getValue("aprIncluded") ? "Yes" : "No"}</div>,
  },
];

export const submittedAndFirstApprovedDatabasesTableColumn: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: ({ row }) => <div>{row.getValue("projectCode")}</div>,
  },
  {
    accessorKey: "database",
    header: "Database",
    cell: ({ row }) => <div>{row.getValue("database")}</div>,
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => <div>{row.getValue("fromDate")}</div>,
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => <div>{row.getValue("toDate")}</div>,
  },
];
