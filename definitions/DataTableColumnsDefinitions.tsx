import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SELECT_ALL_BUTTON_PROVIDER } from "@/constants/System";
import {
  Role,
  User,
  Permission,
  Project,
  BeneficiaryForm,
  KitFormType,
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
    cell: ({ row }) => (
      <div
        className="capitalize max-w-[100px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
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
    cell: ({ row }) => (
      <div
        className="lowercase max-w-[100px] truncate"
        title={row.getValue("email")}
      >
        {row.getValue("email")}
      </div>
    ),
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
    cell: ({ row }) => row.getValue("updated_by") ?? "Not updated yet !",
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
    cell: ({ row }) => (
      <div
        className="capitalize w-[100px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "active":
          return (
            <div
              className="max-w-[70px] text-center rounded-2xl bg-green-500 text-white truncate"
              title={row.getValue("status")}
            >
              {row.getValue("status")}
            </div>
          );
        case "deactive":
          return (
            <div
              className="max-w-[70px] text-center rounded-2xl bg-amber-300 text-white truncate"
              title={row.getValue("status")}
            >
              {row.getValue("status")}
            </div>
          );
        case "blocked":
          return (
            <div
              className="max-w-[70px] text-center rounded-2xl bg-red-600 text-white truncate"
              title={row.getValue("status")}
            >
              {row.getValue("status")}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-left">Created at</div>,
    cell: ({ row }) => row.getValue("created_at"),
  },
  {
    accessorKey: "updated_at",
    header: () => <div className="text-left">Updated at</div>,
    cell: ({ row }) => row.getValue("updated_at"),
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
    cell: ({ row }) => (
      <div
        className="capitalize max-w-[100px] truncate"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <div
        className="capitalize max-w-[100px] truncate"
        title={row.getValue("label")}
      >
        {row.getValue("label")}
      </div>
    ),
  },
  {
    accessorKey: "group_name",
    header: "Group Name",
    cell: ({ row }) => (
      <div
        className="capitalize max-w-[100px] truncate"
        title={row.getValue("group_name")}
      >
        {row.getValue("group_name")}
      </div>
    ),
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
        id={SELECT_ALL_BUTTON_PROVIDER}
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
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "projectTitle",
    header: "Project Title",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectTitle")}
      >
        {row.getValue("projectTitle")}
      </div>
    ),
  },
  {
    accessorKey: "projectGoal",
    header: "Project Goal",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectGoal")}
      >
        {row.getValue("projectGoal")}
      </div>
    ),
  },
  {
    accessorKey: "projectDonor",
    header: "Project Donor",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectDonor")}
      >
        {row.getValue("projectDonor")}
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("startDate")}>
        {row.getValue("startDate")}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("endDate")}>
        {row.getValue("endDate")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("status")}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "projectManager",
    header: "Project Manager",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectManager")}
      >
        {row.getValue("projectManager")}
      </div>
    ),
  },
  {
    accessorKey: "reportingDate",
    header: "Reporting Date",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("reportingDate")}
      >
        {row.getValue("reportingDate")}
      </div>
    ),
  },
  {
    accessorKey: "reportingPeriod",
    header: "Reporting Period",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("reportingPeriod")}
      >
        {row.getValue("reportingPeriod")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("database")}>
        {row.getValue("database")}
      </div>
    ),
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "focalPoint",
    header: "Focal Point",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("focalPoint")}
      >
        {row.getValue("focalPoint")}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province Name",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("province")}>
        {row.getValue("province")}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("district")}>
        {row.getValue("district")}
      </div>
    ),
  },
  {
    accessorKey: "village",
    header: "Village",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("village")}>
        {row.getValue("village")}
      </div>
    ),
  },
  {
    accessorKey: "siteCode",
    header: "Site Code",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("siteCode")}>
        {row.getValue("siteCode")}
      </div>
    ),
  },
  {
    accessorKey: "healthFacilityName",
    header: "Health Facility Name",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("healthFacilityName")}
      >
        {row.getValue("healthFacilityName")}
      </div>
    ),
  },
  {
    accessorKey: "interventionModality",
    header: "Intervention Modality",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("interventionModality")}
      >
        {row.getValue("interventionModality")}
      </div>
    ),
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
      accessorKey: "programName",
      header: "Program",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("programName")}
        >
          {row.getValue("programName")}
        </div>
      ),
    },
    {
      accessorKey: "dateOfRegistration",
      header: "Date of Registration",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("dateOfRegistration")}
        >
          {row.getValue("dateOfRegistration")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("code")}>
          {row.getValue("code")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("name")}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "fatherHusbandName",
      header: "Father/Husband Name",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("fatherHusbandName")}
        >
          {row.getValue("fatherHusbandName")}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("gender")}>
          {row.getValue("gender")}
        </div>
      ),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("age")}>
          {row.getValue("age")}
        </div>
      ),
    },
    {
      accessorKey: "maritalStatus",
      header: "Marital Status",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("maritalStatus")}
        >
          {row.getValue("maritalStatus")}
        </div>
      ),
    },
    {
      accessorKey: "childCode",
      header: "Child Code",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("childCode")}
        >
          {row.getValue("childCode")}
        </div>
      ),
    },
    {
      accessorKey: "childAge",
      header: "Age of Child",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("childAge")}
        >
          {row.getValue("childAge")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("phone")}>
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "householdStatus",
      header: "Household Status",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("householdStatus")}
        >
          {row.getValue("householdStatus")}
        </div>
      ),
    },
    {
      accessorKey: "literacyLevel",
      header: "Literacy Level",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("literacyLevel")}
        >
          {row.getValue("literacyLevel")}
        </div>
      ),
    },
    {
      accessorKey: "disabilityType",
      header: "Disability Type",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("disabilityType")}
        >
          {row.getValue("disabilityType")}
        </div>
      ),
    },
    {
      accessorKey: "referredForProtection",
      header: "Referred for Protection",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("referredForProtection")}
        >
          {row.getValue("referredForProtection") ? "Yes" : "No"}
        </div>
      ),
    },
];

export const beneficiaryKitListColumns: ColumnDef<KitFormType>[] = [
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
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("kit")}>
        {row.getValue("kit")}
      </div>
    ),
  },
  {
    accessorKey: "distributionDate",
    header: "Distribution Date",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("distributionDate")}
      >
        {row.getValue("distributionDate")}
      </div>
    ),
  },
  {
    accessorKey: "isReceived",
    header: "Is Received",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("isReceived")}
      >
        {row.getValue("isReceived")}
      </div>
    ),
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("remark")}>
        {row.getValue("remark")}
      </div>
    ),
  },
];

export const trainingsListColumns: ColumnDef<KitFormType>[] = [
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
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("province")}>
        {row.getValue("province")}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("district")}>
        {row.getValue("district")}
      </div>
    ),
  },
  {
    accessorKey: "indicator",
    header: "Indicator",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("indicator")}>
        {row.getValue("indicator")}
      </div>
    ),
  },
  {
    accessorKey: "trainingLocation",
    header: "Location",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("trainingLocation")}
      >
        {row.getValue("trainingLocation")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Training Name",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("name")}>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "participantCatagory",
    header: "Participant Catagory",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("participantCatagory")}
      >
        {row.getValue("participantCatagory")}
      </div>
    ),
  },
  {
    accessorKey: "aprIncluded",
    header: "APR Included",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("aprIncluded")}
      >
        {row.getValue("aprIncluded") ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "trainingModality",
    header: "Modality",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("trainingModality")}
      >
        {row.getValue("trainingModality")}
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("startDate")}>
        {row.getValue("startDate")}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("endDate")}>
        {row.getValue("endDate")}
      </div>
    ),
  },
];

export const trainingDatabaseBeneificiaryListColumn: ColumnDef<KitFormType>[] =
  [
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
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("name")}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "fatherHusbandName",
      header: "Father / Husband Name",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("fatherHusbandName")}
        >
          {row.getValue("fatherHusbandName")}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("gender")}>
          {row.getValue("gender")}
        </div>
      ),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("age")}>
          {row.getValue("age")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("phone")}>
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate" title={row.getValue("email")}>
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "participantOrganization",
      header: "Participant Org",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("participantOrganization")}
        >
          {row.getValue("participantOrganization")}
        </div>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: "Participant Job Title",
      cell: ({ row }) => (
        <div
          className="max-w-[100px] truncate"
          title={row.getValue("jobTitle")}
        >
          {row.getValue("jobTitle")}
        </div>
      ),
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
    accessorKey: "programName",
    header: "Program",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("programName")}
      >
        {row.getValue("programName")}
      </div>
    ),
  },
  {
    accessorKey: "indicator",
    header: "Indicator",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("indicator")}>
        {row.getValue("indicator")}
      </div>
    ),
  },
  {
    accessorKey: "awarenessTopic",
    header: "Awareness Topic",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("awarenessTopic")}
      >
        {row.getValue("awarenessTopic")}
      </div>
    ),
  },
  {
    accessorKey: "awarenessDate",
    header: "Awareness Date",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("awarenessDate")}
      >
        {row.getValue("awarenessDate")}
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("type")}>
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("topic")}>
        {row.getValue("topic")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("date")}>
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "isPresent",
    header: "Is Present",
    cell: ({ row }) => (
      <div>
        {row.getValue("isPresent") ? (
          <span className="rounded border bg-green-500">Yes</span>
        ) : (
          <span className="rounded border bg-red-500">No</span>
        )}
      </div>
    ),
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
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("province")}>
        {row.getValue("province")}
      </div>
    ),
  },
  {
    accessorKey: "indicatorRef",
    header: "Indicator",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("indicatorRef")}
      >
        {row.getValue("indicatorRef")}
      </div>
    ),
  },
  {
    accessorKey: "councilorName",
    header: "Councilor",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("councilorName")}
      >
        {row.getValue("councilorName")}
      </div>
    ),
  },
  {
    accessorKey: "raterName",
    header: "Rater",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("raterName")}>
        {row.getValue("raterName")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("type")}>
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("date")}>
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "aprIncluded",
    header: "APR Included",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate">
        {row.getValue("aprIncluded") ? "Yes" : "No"}
      </div>
    ),
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
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "database",
    header: "Database",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("database")}>
        {row.getValue("database")}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("province")}>
        {row.getValue("province")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("status")}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("fromDate")}>
        {row.getValue("fromDate")}
      </div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("toDate")}>
        {row.getValue("toDate")}
      </div>
    ),
  },
];

export const communityDialoguesSessionTableColumns: ColumnDef<any>[] = [
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
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("type")}>
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("topic")}>
        {row.getValue("topic")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("date")}>
        {row.getValue("date")}
      </div>
    ),
  },
];

export const communityDialoguesTableColumns: ColumnDef<any>[] = [
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
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("projectCode")}
      >
        {row.getValue("projectCode")}
      </div>
    ),
  },
  {
    accessorKey: "focalPoint",
    header: "Focal Point",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("focalPoint")}
      >
        {row.getValue("focalPoint")}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("province")}>
        {row.getValue("province")}
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("district")}>
        {row.getValue("district")}
      </div>
    ),
  },
  {
    accessorKey: "village",
    header: "Village",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("village")}>
        {row.getValue("village")}
      </div>
    ),
  },
  {
    accessorKey: "numOfSessions",
    header: "Number Of Sessions",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("numOfSessions")}
      >
        {row.getValue("numOfSessions")}
      </div>
    ),
  },
  {
    accessorKey: "numOfGroups",
    header: "Number Of Groups",
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate"
        title={row.getValue("numOfGroups")}
      >
        {row.getValue("numOfGroups")}
      </div>
    ),
  },
  {
    accessorKey: "indicator",
    header: "Indicator",
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate" title={row.getValue("indicator")}>
        {row.getValue("indicator")}
      </div>
    ),
  },
];
