"use client";

import { useState, useEffect, useRef } from "react";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { beneficiarySessionsTableColumn } from "@/definitions/DataTableColumnsDefinitions";
import { useParams } from "next/navigation";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";
import { Button } from "../button";
import { ToggleRight } from "lucide-react";
import { IsANullValue, IsIdFeild } from "@/constants/Constants";
import { CommunityDialogueBeneficiaryFormDefault } from "@/constants/FormsDefaultValues";
import { BeneficiarySessionPresenceTogglerButtonMessage } from "@/constants/ConfirmationModelsTexts";
import ChromeTabs from "@/app/(main)/projects/Components/ChromeTab";

export default function BeneProfileTabs() {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    reqForToastAndSetMessage,
    reqForConfirmationModelFunc,
    axiosInstance,
    handleReload,
  } = useParentContext();

  const tabs = ["Beneficiary Info", "Sessions"];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const hasRef = useRef(false);

  const [beneficiaryInfo, setBneficiaryInfo] =
    useState<CommunityDialogBeneficiaryForm>(
      CommunityDialogueBeneficiaryFormDefault()
    );

  useEffect(() => {
    if (hasRef.current) return;
    hasRef.current = true;

    axiosInstance
      .get(`/community_dialogue_db/beneficiary/${id}`)
      .then((response: any) => {
        setBneficiaryInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const [selectedRows, setSelectedRows] = useState<any>();

  const togglePresence = () => {
    axiosInstance
      .post(`/community_dialogue_db/beneficiaries/toggle_presence/${id}`, {
        selectedRows: Object.keys(selectedRows),
      })
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
        handleReload();
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  return (
    <div className="w-full px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs header */}
        <ChromeTabs
          initialTabs={tabs.map((tab) => ({
            value: tab,
            title: tab,
            stateSetter: setActiveTab,
          }))}
        ></ChromeTabs>

        {/* Beneficiary Information */}
        <TabsContent value={tabs[0]} className="w-full">
          <Card className="shadow-sm border border-border w-full bg-background">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Beneficiary Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(beneficiaryInfo).map((entry, i) => {
                  if (IsIdFeild(entry[0]) || IsANullValue(entry[1])) return;
                  return (
                    <div
                      key={i}
                      className="flex flex-col rounded-xl border p-3 transition-all hover:shadow-sm"
                    >
                      <span className="text-xs font-medium uppercase opacity-70 tracking-wide">
                        {entry[0].toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold truncate">
                        {entry[1]?.toString() || "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions */}
        <TabsContent value={tabs[1]} className="w-full">
          <Card className="shadow-sm border border-border w-full bg-background">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Community Dialogue Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableDemo
                columns={beneficiarySessionsTableColumn}
                indexUrl={`/community_dialogue_db/beneficiary/sessions/${id}`}
                searchUrl=""
                searchableColumn="Topic"
                selectedRowsIdsStateSetter={setSelectedRows}
                injectedElement={
                  <div className="flex flex-row items-center justify-end gap-2">
                    <Button
                      onClick={() =>
                        reqForConfirmationModelFunc(
                          BeneficiarySessionPresenceTogglerButtonMessage,
                          togglePresence
                        )
                      }
                      variant={"outline"}
                      title="Toggle precence for selected sessions"
                    >
                      <ToggleRight />
                    </Button>
                  </div>
                }
                filtersList={["type", "date"]}
              ></DataTableDemo>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
