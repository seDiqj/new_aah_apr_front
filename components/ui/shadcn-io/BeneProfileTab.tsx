"use client";

import { useState, useEffect, useRef } from "react";
import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { beneficiarySessionsTableColumn, permissionColumns } from "@/definitions/DataTableColumnsDefinitions";
import { useParams } from "next/navigation";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";

export default function BeneProfileTabs() {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const tabs = ["Beneficiary Info", "Sessions"];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  const hasRef = useRef(false);

  const [beneficiaryInfo, setBneficiaryInfo] =
    useState<CommunityDialogBeneficiaryForm>({
      name: "",
      fatherHusbandName: "",
      age: 0,
      maritalStatus: "",
      gender: "",
      phone: "",
      nationalId: "",
      jobTitle: "",
      incentiveReceived: false,
      incentiveAmount: "",
    });

  useEffect(() => {
    if (hasRef.current) return;
    hasRef.current = true;

    axiosInstance
      .get(`/community_dialogue_db/beneficiary/${id}`)
      .then((response: any) => {console.log(response.data.data);  setBneficiaryInfo(response.data.data)})
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  return (
    <div className="w-full px-4">
      <ShadcnTabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs header */}
        <div className="relative w-full border-b border-border mb-2">
          <TabsList className="flex justify-start gap-6 bg-transparent p-0 w-fit [&>*]:flex-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                ref={(el: HTMLButtonElement | null) => {
                  tabRefs.current[tab] = el;
                }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold border-none shadow-none ring-0 focus:outline-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Animated underline */}
          <span
            className="absolute bottom-0 h-[3px] bg-foreground rounded-t-md transition-all duration-300 ease-in-out"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>

        {/* Tab 1 - Beneficiary Information */}
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
                  if (entry[0] == "id" || entry[1] == null) return;
                  return (
                    <InfoItem
                      key={i}
                      label={entry[0].toUpperCase()}
                      value={entry[1].toString()}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2 - DataTable */}
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
                deleteUrl={`community_dialogue_db/delete_beneficiary_sessions/${id}`}
                searchableColumn="name"
                idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                editModelOpenerStateSetter={setReqForPermissionUpdateForm}
              ></DataTableDemo>
            </CardContent>
          </Card>
        </TabsContent>
      </ShadcnTabs>
    </div>
  );
}

// Reusable info item component
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}
