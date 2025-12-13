import { BeneficiaryForm } from "@/types/Types";
import { ColumnDef } from "@tanstack/react-table";

export interface DataTableInterface {
  columns: ColumnDef<any>[];
  indexUrl: string;
  filterUrl?: string;
  deleteUrl?: string;
  searchableColumn: string;

  // For Edit modal
  idFeildForEditStateSetter?: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  editModelOpenerStateSetter?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | VoidFunction;

  // For Show modal
  idFeildForShowStateSetter?: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  showModelOpenerStateSetter?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | VoidFunction;

  selectedRowsIdsStateSetter?: React.Dispatch<React.SetStateAction<{}>>;

  // Injected element
  injectedElement?: React.ReactNode;

  // Filters List.
  filtersList?: string[];

  deleteBtnPermission?: string;

  editBtnPermission?: string;

  viewPermission?: string;
}

export interface PsychoeducationFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  psychoeducationId?: string;
}

export interface KitDatabaseBeneficiaryFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
}

export interface KitDatabaseBenficiaryUpdateForm {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  beneficiaryId: string;
}

export interface KitFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  kitId?: number;
}

export interface MainDatabaseBeneficiaryCreation {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  createdProgramStateSetter?: any;
}

export interface MainDatabaseBeneficiaryUpdate {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  beneficiaryId: string;
}

export interface MealToolInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSubmit: (e: any) => void;
  mealToolsStateSetter: any;
  mealToolsState: any;
  mode: "create" | "edit" | "show";
  mealtoolId?: number | null;
}

export interface OutcomeInterface {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit" | "show";
  pageIdentifier: "create" | "edit" | "show";
  outcomeId?: number;
}

export interface OutputInterface {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit" | "show";
  pageIdentifier: "create" | "edit" | "show";
  outputId?: number | null;
}

export interface PreAndPostTestsInterface {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
}

export interface ReferralInterface {
  beneficiaryInfo: BeneficiaryForm | null;
  referralInfo: any;
}

export interface RoleInterface {
  open: boolean;
  openStateSetter: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  idFeildForEditStateSetter?: number | null;
}

export interface TrainingEvaluationInterface {
  previosTrainingEvaluations?: {
    evaluations: {
      informative: number;
      usefulness: number;
      understanding: number;
      relevance: number;
      applicability: number;
    };
    remark: string;
  } | null;
}

export interface TrainingSelectorInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  ids: {};
  trainingsData?: string;
}

export interface CommunityDialogueUpdateInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  beneficiaryId: number;
}

export interface UpdatePsychoeducationInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  psychoId: string;
}

export interface TrainingUpdateInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  trainingId: number;
}

export interface UserInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode?: "create" | "edit" | "show";
  permission?: "";
  userId?: number;
  reloader?: () => void;
}

export interface IndicatorFormInterface {
  mode: "create" | "edit" | "show";
}

export interface IndicatorModelInterface {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "show";
  pageIdentifier: "create" | "edit" | "show";
  indicatorId?: number | null;
}

export interface MainDatabaseProgramFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  programId?: number;

  // Only for creation mode, temp
  createdProgramStateSetter?: any;

  // temp
  programsListStateSetter?: any;
}

export interface KitDatabaseBeneficiaryProfileInterface {
  params: Promise<{
    id: string;
  }>;
}

export interface TrainingBeneficiaryFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  mode: "create" | "edit";
  editId?: number | string;
}

export interface TrainingFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  mode: "create" | "edit" | "show";
  id?: number;
}

export interface TrainingProfileInterface {
  params: Promise<{
    id: string;
  }>;
}

export interface ChapterFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
}

export interface OutputFormInterface {
  mode: "create" | "edit" | "show";
}

export interface DessaggregationFromInterface {
  mode: "create" | "edit" | "show";
}

export interface AssessmentFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  projectId?: number;
}

export interface AssessmentScoreFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  projectId?: number;
  assessmentId?: number;
}

export interface ConfirmationModelInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  message: string;
  onOk: any;
}

export interface SubmitSummaryInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  databaseId: string | null;
}

export interface CdDatabaseBeneficiaryCreationFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export interface CommunityDialogueSelectorInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  ids: string[];
}

export interface CommunityDialogueSessionFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  sessionId?: string;
  mode: "create" | "edit" | "show";
}

export interface CommunityDialogueFormInterface {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update" | "show";
  dialogueId?: number;
}

export interface MainDatabaseBeneficiaryProfileInterface {
  params: Promise<{
    id: string;
  }>;
}

export interface Isp3SubPageInterface {
  mode: "create" | "edit" | "show";
}

export interface MonitoringTablePageInterface {
  mode: "create" | "edit" | "show";
}

export interface AprFinalizationSubPageInterface {
  mode: "create" | "edit" | "show";
}

export interface OutcomeFormInterface {
  mode: "create" | "edit" | "show";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  unread?: boolean;
  time: string;
  type:
    | "project"
    | "submittedDatabase"
    | "approvedDatabase"
    | "reviewdApr"
    | "approvedApr";
  database_id?: string;
  project_id?: string;
  apr_id?: string;
}

// Types
export interface Navbar14Props extends React.HTMLAttributes<HTMLElement> {
  searchPlaceholder?: string;
  searchValue?: string;
  testMode?: boolean;
  showTestMode?: boolean;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    unread?: boolean;
  }>;
  onSearchChange?: (value: string) => void;
  onTestModeChange?: (enabled: boolean) => void;
  onLayoutClick?: () => void;
  onAddClick?: () => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationClick?: (notificationId: string) => void;
  onSettingsItemClick?: (item: string) => void;
}

export interface KitDatabaseProgramFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit" | "show";
  programId?: number;

  // Only for creation mode, temp
  createdProgramStateSetter?: any;

  // temp
  programsListStateSetter?: any;
}

export interface CdDatabaseBeneficiaryUpdateFormInterface {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  beneficiaryId: number;
}

export interface ProjectFormInterface {
  mode: "create" | "edit" | "show";
}

export interface AprLogsSubPageInterface {
  mode: "create" | "edit" | "show";
}
