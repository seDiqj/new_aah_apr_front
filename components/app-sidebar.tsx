"use client";

import {
  ChevronUp,
  Database,
  LogOut,
  User,
  User2,
  Settings,
  ChevronDown,
  BookOpenCheck,
  Boxes,
  FolderOpen,
  GraduationCap,
  HandCoins,
  LayoutDashboard,
  MessageSquareMore,
  Share2,
  UserCog,
  Users,
  ShieldCheck,
  UserRound,
  CheckCircle2,
  FileBarChart,
  FileCheck2,
  FileSearch,
  ServerCog,
  UploadCloud,
  Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { useRouter } from "next/navigation";
import { SignoutButtonMessage } from "@/constants/ConfirmationModelsTexts";
import { AxiosError, AxiosResponse } from "axios";
import { usePermissions } from "@/contexts/PermissionContext";

const AppSidebar = () => {
  const {
    myProfileDetails,
    setReqForProfile,
    reqForConfirmationModelFunc,
    axiosInstance,
    reqForToastAndSetMessage,
  } = useParentContext();

  const { permissions, loading } = usePermissions();

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      subOptions: null,
    },
    {
      title: "Grants Management",
      url: "/grants_mng",
      icon: HandCoins,
      subOptions: [
        {
          title: "Projects",
          url: "/projects",
          icon: FolderOpen,
        },
      ],
      permissions: [
        "Project.create",
        "Project.view",
        "Project.edit",
        "Project.delete",
        "Project.submit",
        "Project.grantFinalize",
        "Project.HQFinalize",
      ],
    },
    {
      title: "My Space",
      icon: FolderOpen,
      subOptions: [
        {
          title: "Main Database",
          url: "/main_database",
          icon: Database,
          permission: [
            "Maindatabase.create",
            "Maindatabase.view",
            "Maindatabase.edit",
            "Maindatabase.delete",
          ],
        },
        {
          title: "Kit Distribution",
          url: "/kit_database",
          icon: Boxes,
          permission: [
            "Kit.create",
            "Kit.view",
            "Kit.edit",
            "Kit.delete",
            "Kit.assign",
          ],
        },
        {
          title: "Psychoeducation",
          url: "/psychoeducation_database",
          icon: BookOpenCheck,
          permission: [
            "Psychoeducation.create",
            "Psychoeducation.view",
            "Psychoeducation.edit",
            "Psychoeducation.delete",
          ],
        },
        {
          title: "Community Dialogue",
          url: "/community_dialogue_database",
          icon: MessageSquareMore,
          permission: [
            "Dialogue.create",
            "Dialogue.view",
            "Dialogue.edit",
            "Dialogue.delete",
            "Dialogue.assign",
            "Dialogue.create_beneficiary",
          ],
        },
        {
          title: "Training",
          url: "/training_database",
          icon: GraduationCap,
          permission: [
            "Training.create",
            "Training.edit",
            "Training.view",
            "Training.delete",
            "Training.assign_training",
          ],
        },
        {
          title: "Referral",
          url: "/referral_database",
          icon: Share2,
          permission: [
            "Referral.create",
            "Referral.view",
            "Referral.edit",
            "Referral.delete",
          ],
        },
        { title: "Enact", url: "/enact_database", icon: Star },
      ],
    },
    {
      title: "User Management",
      url: "/user_mng",
      icon: UserCog,
      subOptions: [
        {
          title: "Users",
          url: "/users",
          icon: Users,
          permission: [
            "List User",
            "Create User",
            "Edit User",
            "View User",
            "Delete User",
          ],
        },
        {
          title: "Roles",
          url: "/roles",
          icon: UserRound,
          permission: [
            "List Role",
            "Create Role",
            "Edit Role",
            "View Role",
            "Delete Role",
          ],
        },
        { title: "Permissions", url: "/permissions", icon: ShieldCheck },
      ],
    },
    {
      title: "Database Management",
      icon: ServerCog,
      subOptions: [
        {
          title: "Submitted Databases",
          url: "/submitted_databases",
          icon: UploadCloud,
          permission: [
            "Database_submission.create",
            "Database_submission.view",
            "Database_submission.edit",
            "Database_submission.delete",
            "Database_submission.approve",
          ],
        },
        {
          title: "Approved Databases",
          url: "/approved_databases",
          icon: CheckCircle2,
          permission: ["Database_submission.generate_apr"],
        },
      ],
    },
    {
      title: "APR Management",
      url: "/apr_management",
      icon: FileBarChart,
      subOptions: [
        {
          title: "Review APR",
          url: "/review_aprs",
          icon: FileSearch,
          permission: ["Apr.review", "Apr.view/list", "Apr.mark_as_reviewed"],
        },
        {
          title: "Approve APR",
          url: "/approve_aprs",
          icon: FileCheck2,
          permission: ["Apr.validate"],
        },
      ],
    },
  ];

  const router = useRouter();

  const handleSignout = () => {
    axiosInstance
      .post("/authentication/logout")
      .then((response: AxiosResponse<any, any, any>) => {
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
      })
      .catch((error: AxiosError<any, any>) => {
        reqForToastAndSetMessage(error.response?.data.message);
      });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link href={"/"} />
                <Image
                  className="rounded-full"
                  src={"/logo.jpg"}
                  alt={"Componey Logo"}
                  width={50}
                  height={50}
                ></Image>
                <span>Action Agaunst Hunger</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Seperator */}
        <SidebarSeparator></SidebarSeparator>

        {/* Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .map((item) => {
                    if (
                      item.subOptions != null
                    ) {
                      return (
                        <>
                          <Collapsible
                            key={item.title}
                            defaultOpen
                            className="group/collapsible"
                          >
                            <SidebarGroup>
                              <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                  <SidebarMenuButton>
                                    <item.icon />
                                    {item.title}
                                  </SidebarMenuButton>
                                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                              </SidebarGroupLabel>
                              <CollapsibleContent className="pl-10">
                                {item.subOptions.map((item, indx) => (
                                  <SidebarMenuItem key={indx}>
                                    <SidebarMenuButton asChild>
                                      <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </CollapsibleContent>
                            </SidebarGroup>
                          </Collapsible>
                        </>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url!}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {myProfileDetails?.name}{" "}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setReqForProfile(true)}>
                    <User></User> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      reqForConfirmationModelFunc(
                        SignoutButtonMessage,
                        handleSignout
                      )
                    }
                  >
                    <LogOut></LogOut> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
