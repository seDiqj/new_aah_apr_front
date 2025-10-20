"use client";

import SubHeader from "@/components/global/SubHeader";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, RefObject } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddBeneInCDProfile from "@/components/ui/shadcn-io/AddBeneInCDProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoItem } from "../../../../referral_database/beneficiary_profile/[id]/page";
import { useParentContext } from "@/contexts/ParentContext";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { mainDatabaseAndKitDatabaseBeneficiaryColumns } from "@/definitions/DataTableColumnsDefinitions";
import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";

const CommunityDialogueProfilePage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const router = useRouter();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForBeneficiaryCreationForm, setReqForBeneficiaryCreationForm] =
    useState<boolean>(false);

    const openBeneficiaryProfile = (value: boolean, id: number) => {
      router.push(`/community_dialogue_database/beneficiary_profile/${id}`);
    };
  
    useEffect(() => {
      if (idFeildForShowStateSetter)
        openBeneficiaryProfile(true, idFeildForShowStateSetter);
    }, [idFeildForShowStateSetter]);

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

  return (
    <>
      <Navbar14 />
      <div className="flex flex-row items-center justify-start my-2">
        <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
      </div>
      <div className="mt-4 ml-6">
        <SubHeader pageTitle={"Community Dialogue(Name)Profile"}></SubHeader>
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
                    columns={mainDatabaseAndKitDatabaseBeneficiaryColumns}
                    indexUrl={`/community_dialogue_db/community_dialogue/sessions/${id}`}
                    deleteUrl="/community_dialogue_db/community_dialogue/sessions/delete_sessions"
                    searchableColumn="name"
                    idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                    idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                    showModelOpenerStateSetter={() => {}}
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
      </div>
    </>
  );
};
export default CommunityDialogueProfilePage;
