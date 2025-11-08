"use client";

import { useState, useEffect, useRef } from "react";
import {
  TabsList,
  TabsTrigger,
  TabsContent,
  Tabs,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTableDemo from "@/components/global/MulitSelectTable";
import { beneficiarySessionsTableColumn } from "@/definitions/DataTableColumnsDefinitions";
import { useParams } from "next/navigation";
import { useParentContext } from "@/contexts/ParentContext";
import { CommunityDialogBeneficiaryForm } from "@/types/Types";
import { Button } from "../button";
import { ToggleRight } from "lucide-react";

export default function BeneProfileTabs() {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage, reqForConfirmationModelFunc, axiosInstance, handleReload } = useParentContext();

  let [reqForPermissionUpdateForm, setReqForPermissionUpdateForm] =
    useState<boolean>(false);

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  const tabs = ["Beneficiary Info", "Sessions"];

  const [activeTab, setActiveTab] = useState(tabs[0]);

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
      dateOfRegistration: ""
    });

  useEffect(() => {
    if (hasRef.current) return;
    hasRef.current = true;

    axiosInstance
      .get(`/community_dialogue_db/beneficiary/${id}`)
      .then((response: any) => {setBneficiaryInfo(response.data.data)})
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  const [selectedRows, setSelectedRows] = useState<any>();

  const togglePresence = () => {
    axiosInstance.post(`/community_dialogue_db/beneficiaries/toggle_presence/${id}`, {
      selectedRows: Object.keys(selectedRows)
    })
    .then((response: any) => {reqForToastAndSetMessage(response.data.message); handleReload()})
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
  }

  return (
    <div className="w-full px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs header */}
        <div className="relative w-full border-b border-border mb-2">
          <TabsList className="flex justify-start gap-6 bg-transparent p-0 w-fit [&>*]:flex-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
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
                selectedRowsIdsStateSetter={setSelectedRows}
                injectedElement={
                  <div className="flex flex-row items-center justify-end gap-2">
                    <Button onClick={() => reqForConfirmationModelFunc(
                      "Ary you compleatly sure ?",
                      "This action will change the presence status of beneficiary for selected session !",
                      togglePresence
                    )} variant={"outline"} title="Toggle precence for selected sessions">
                      <ToggleRight 
                      />
                    </Button>
                  </div>
                }
              ></DataTableDemo>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
