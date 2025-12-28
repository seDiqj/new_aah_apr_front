"use client";

import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParentContext } from "@/contexts/ParentContext";
import DataTableDemo from "@/components/global/MulitSelectTable";
import {
  communityDialoguesSessionTableColumns,
  mainDatabaseAndKitDatabaseBeneficiaryColumns,
} from "@/definitions/DataTableColumnsDefinitions";
import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import SessionForm from "@/components/global/CommunityDialogueSessionForm";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/Can";
import { withPermission } from "@/lib/withPermission";
import { IsIdFeild } from "@/constants/Constants";
import ChromeTabs from "@/app/(main)/projects/Components/ChromeTab";

const CommunityDialogueProfilePage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const router = useRouter();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForSessionCreationForm, setReqForSessionCreationForm] =
    useState<boolean>(false);

  const [reqForSessionEditionForm, setReqForSessionEditionForm] =
    useState<boolean>(false);

  const [reqForSessionShowForm, setReqForSessionShowForm] =
    useState<boolean>(false);

  const [communityDialogue, setCommunityDialogue] = useState<{
    id: string;
    program: Record<string, string>;
    groups: {
      id: string;
      name: string;
    }[];
    remark: string;
  }>();

  let [groupId, setGroupId] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value == "programInfo" || value == "cdSessions") return;

    const currnetGroup = communityDialogue?.groups.find(
      (group: { id: string; name: string }) => group.name == value
    );

    setGroupId(currnetGroup?.id ?? null);
  };

  useEffect(() => {
    axiosInstance
      .get(`/community_dialogue_db/community_dialogue/${id}`)
      .then((response: any) => {
        setCommunityDialogue(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>("programInfo");

  const openBeneficiaryProfile = (value: boolean, id: number) => {
    router.push(`/community_dialogue_database/beneficiary_profile/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openBeneficiaryProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div>
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <div className="mt-2">
          <SubHeader pageTitle={"Community Dialogue Profile"}></SubHeader>
        </div>

        <div className="w-full h-full">
          <div className="w-full overflow-x-auto">
            <Tabs
              defaultValue="programInfo"
              value={selectedTab}
              onValueChange={handleTabChange}
              className="h-full"
            >
              {/* List of tabs */}
              <ChromeTabs
                initialTabs={[
                  {
                    value: "programInfo",
                    title: "Program Info",
                    stateSetter: handleTabChange,
                  },
                  {
                    value: "cdSessions",
                    title: "Sessions",
                    stateSetter: handleTabChange,
                  },

                  ...(communityDialogue?.groups.map((group) => ({
                    value: group.name,
                    title: group.name.toUpperCase(),
                    stateSetter: handleTabChange,
                  })) ?? []),
                ]}
              ></ChromeTabs>

              {/* Program information */}
              <TabsContent
                value="programInfo"
                className="h-full overflow-hidden"
              >
                <Card className="shadow-sm border border-border w-full bg-background">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Program Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto">
                    <div>
                      {communityDialogue ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(communityDialogue.program).map(
                            ([key, value], index) => {
                              if (IsIdFeild(key)) return;
                              return (
                                <div
                                  key={index}
                                  className="flex flex-col rounded-xl border p-3 transition-all hover:shadow-sm"
                                >
                                  <span className="text-xs font-medium uppercase opacity-70 tracking-wide">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </span>
                                  <span className="text-sm font-semibold truncate">
                                    {value?.toString() || "-"}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-[56px] w-full rounded-xl animate-pulse bg-muted/30"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sessions */}
              <TabsContent value="cdSessions" className="h-full">
                <Card className="shadow-sm border border-border w-full bg-background">
                  <CardHeader>
                    <CardTitle className="flex flex-row items-center justify-between px-2text-xl font-semibold text-foreground">
                      <span>Community Dialogue Sessions List</span>
                      <Can permission="Dialogue.create">
                        <Button
                          onClick={() =>
                            setReqForSessionCreationForm(
                              !reqForSessionCreationForm
                            )
                          }
                        >
                          Add New Session
                        </Button>
                      </Can>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTableDemo
                      columns={communityDialoguesSessionTableColumns}
                      indexUrl={`/community_dialogue_db/community_dialogue/sessions/${id}`}
                      deleteUrl="/community_dialogue_db/community_dialogue/sessions/delete_sessions"
                      searchableColumn="type"
                      idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                      editModelOpenerStateSetter={setReqForSessionEditionForm}
                      idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                      showModelOpenerStateSetter={setReqForSessionShowForm}
                    ></DataTableDemo>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Each group content */}
              <TabsContent
                value={
                  communityDialogue?.groups.find(
                    (group: { id: string; name: string }) => group.id == groupId
                  )?.name ?? ""
                }
                className="h-full"
              >
                <Card className="shadow-sm border border-border w-full bg-background">
                  <CardContent>
                    <DataTableDemo
                      columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
                      indexUrl={`community_dialogue_db/community_dialogue/groups/beneficiaries/${groupId}`}
                      deleteUrl="/community_dialogue_db/community_dialogue/sessions/delete_sessions"
                      searchableColumn="name"
                      idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                      idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                      showModelOpenerStateSetter={() => {}}
                    ></DataTableDemo>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {reqForSessionCreationForm && (
            <SessionForm
              open={reqForSessionCreationForm}
              onOpenChange={setReqForSessionCreationForm}
              mode={"create"}
            ></SessionForm>
          )}
          {reqForSessionEditionForm && (
            <SessionForm
              open={reqForSessionEditionForm}
              onOpenChange={setReqForSessionEditionForm}
              mode={"edit"}
              sessionId={idFeildForEditStateSetter as unknown as string}
            ></SessionForm>
          )}
          {reqForSessionShowForm && (
            <SessionForm
              open={reqForSessionShowForm}
              onOpenChange={setReqForSessionShowForm}
              mode={"show"}
              sessionId={idFeildForShowStateSetter as unknown as string}
            ></SessionForm>
          )}
        </div>
      </div>
    </>
  );
};
export default withPermission(CommunityDialogueProfilePage, "Dialogue.view");
