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
import { InfoItem } from "@/app/(main)/(my_space)/referral_database/beneficiary_profile/[id]/page";
import { Can } from "@/components/Can";
import { withPermission } from "@/lib/withPermission";

const CommunityDialogueProfilePage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage, axiosInstance, reqForConfirmationModelFunc } = useParentContext();

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
        console.log(response.data.data);
        setCommunityDialogue(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>("programInfo");

  return (
    <>
      <Navbar14 />
      <div className="flex flex-row items-center justify-start my-2">
        <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
      </div>
      <div className="mt-4 ml-6">
        <SubHeader pageTitle={"Community Dialogue Profile"}>
          {selectedTab == "cdSessions" && (
            <Can permission="Dialogue.create">
              <div>
              <Button
                onClick={() =>
                  setReqForSessionCreationForm(!reqForSessionCreationForm)
                }
              >
                Add New Session
              </Button>
            </div>
            </Can>
          )}
        </SubHeader>
      </div>

      <div className="w-full h-full">
        <div className="w-full overflow-x-auto">
          <Tabs
            defaultValue="programInfo"
            onValueChange={handleTabChange}
            className="h-full"
          >
            {/* List of tabs */}
            <TabsList className="w-full">
              <TabsTrigger value="programInfo">Program Info</TabsTrigger>
              <TabsTrigger value="cdSessions">Sessions</TabsTrigger>

              {/* Community Dialogue groups tabs */}
              {communityDialogue?.groups.map((group) => (
                <TabsTrigger key={group.id} value={group.name}>
                  {group.name.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Program information */}
            <TabsContent value="programInfo" className="h-full">
              <Card className="shadow-sm border border-border w-full bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Program Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {communityDialogue &&
                      Object.entries(communityDialogue.program).map(
                        (entry, i) => {
                          if (entry[0] == "id") return;
                          return (
                            <InfoItem
                              key={i}
                              label={entry[0].toUpperCase()}
                              value={entry[1].toString()}
                            />
                          );
                        }
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions */}
            <TabsContent value="cdSessions" className="h-full">
              <Card className="shadow-sm border border-border w-full bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Community Dialogue Sessions List
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
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {}
                  </CardTitle>
                </CardHeader>
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
    </>
  );
};
export default withPermission(CommunityDialogueProfilePage, "Dialogue.view");
