"use client";

import { Can } from "@/components/Can";
import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import KitForm from "@/components/global/KitForm";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentContext } from "@/contexts/ParentContext";
import { beneficiaryKitListColumns } from "@/definitions/DataTableColumnsDefinitions";
import { createAxiosInstance } from "@/lib/axios";
import { withPermission } from "@/lib/withPermission";
import { MainDatabaseProgram } from "@/types/Types";
import { use, useEffect, useState } from "react";

interface ComponentProps {
  params: Promise<{
    id: string;
  }>;
}

const KitDbBeneficiaryProfilePage: React.FC<ComponentProps> = (
  params: ComponentProps
) => {
  const { id } = use(params.params);

  const axiosInstance = createAxiosInstance();
  const { reqForToastAndSetMessage } = useParentContext();

  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const [reqForKitCreationForm, setReqForKitCreationForm] =
    useState<boolean>(false);

  const [beneficiaryInfo, setBeneficiaryInfo] = useState<{
    dateOfRegistration: string;
    code: string;
    name: string;
    fatherHusbandName: string;
    gender: string;
    age: number;
    maritalStatus: string;
    childCode: string;
    ageOfChild: number;
    phone: string;
    houseHoldStatus: string;
    literacyLevel: string;
    disablilityType: string;
    referredForProtection: boolean;
  }>();

  const [programInfo, setProgramInfo] = useState<MainDatabaseProgram[]>();

  useEffect(() => {
    // Fitching Beneficiary info.
    axiosInstance
      .get(`/kit_db/beneficiary/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
        const {programs, ...benefciaryDetails} = response.data.data
        if (response.data.status) setBeneficiaryInfo(benefciaryDetails);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );

    // Fitching Program Info.
    axiosInstance
      .get(`kit_db/program/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
        if (response.data.status) setProgramInfo(response.data.data);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14></Navbar14>
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Beneficiary Profile"}>
          <Can permission="Kit.create">
            <div>
              <Button
                onClick={() => setReqForKitCreationForm(!reqForKitCreationForm)}
              >
                Add Kit
              </Button>
            </div>
          </Can>
        </SubHeader>

        {/* Main Content */}
        <div className="flex flex-1 h-[440px] w-full flex-col gap-6">
          <Tabs defaultValue="beneficiaryInfo" className="h-full">
            {/* List of tabs */}
            <TabsList className="w-full">
              <TabsTrigger value="beneficiaryInfo">
                Beneficiary Info
              </TabsTrigger>
              <TabsTrigger value="kit">Kit</TabsTrigger>
            </TabsList>

            {/* Beneficiary Info */}
            <TabsContent value="beneficiaryInfo" className="h-full">
              <Card className="h-full flex flex-col">
                <CardContent>
                  <div className="flex flex-col gap-2 items-start justify-around w-full">
                    {/* Beneficiary information */}
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Beneficiary Information</Label>
                      <div className="flex flex-col w-full max-h-[160px] border-2 border-green-100 rounded-2xl p-4 overflow-y-auto">
                        {beneficiaryInfo &&
                          Object.entries(beneficiaryInfo).map(
                            ([key, value], index) => {
                              if (key == "id" || value == null) return

                              return (
                              <div
                                key={index}
                                className="flex flex-row items-center justify-between gap-6 w-full"
                              >
                                <span>{key}</span>
                                <span>{value}</span>
                              </div>
                            )
                            }
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Program Information</Label>
                      <div className="flex flex-col w-full max-h-[160px] border-2 border-green-100 rounded-2xl p-4 overflow-y-auto">
                        {programInfo &&
                          programInfo.map((programInfo) =>
                            Object.entries(programInfo).map(
                              ([key, value], index) => (
                                <div
                                  key={index}
                                  className="flex flex-row items-center justify-between gap-6 w-full"
                                >
                                  <span>{key}</span>
                                  <span>{value}</span>
                                </div>
                              )
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* kit */}
            <TabsContent value="kit" className="h-full">
              <Card className="relative h-full flex flex-col">
                <CardContent className="flex flex-col gap-4 overflow-auto"></CardContent>
                <DataTableDemo
                  columns={beneficiaryKitListColumns}
                  indexUrl={`/kit_db/bnf_kits/${id}`}
                  deleteUrl="kit_db/delete_kit"
                  searchableColumn="kit"
                  idFeildForEditStateSetter={setIdFeildForEditStateSetter}
                  idFeildForShowStateSetter={setIdFeildForShowStateSetter}
                  showModelOpenerStateSetter={() => {}}
                  filterUrl=""
                  filtersList={[
                    "kit",
                    "distributionDate",
                    "isReceived"
                  ]}
                ></DataTableDemo>
                <CardFooter className="flex flex-row w-full gap-2 items-center justify-end"></CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {reqForKitCreationForm && (
          <KitForm
            open={reqForKitCreationForm}
            onOpenChange={setReqForKitCreationForm}
            mode={"create"}
          ></KitForm>
        )}
      </div>
    </>
  );
};

export default withPermission(KitDbBeneficiaryProfilePage, "Kit.view");
