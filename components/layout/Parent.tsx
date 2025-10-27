// BASE COMPONENT FOR SEEDING COMMON INFORMATIONS INTO ALL SYSTEM.

"use client";

import { ParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { User } from "@/types/Types";
import { AxiosInstance } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationAlertDialogue from "../global/ConfirmationDialog";
import ProfileModal from "../global/UserFormTest";
import { Folder, Clock, CheckCircle, XCircle } from "lucide-react";


interface ComponentProps {
  children: React.ReactNode;
}

const Parent: React.FC<ComponentProps> = ({ children }) => {
  const axiosInstance: AxiosInstance = createAxiosInstance();

  const [reqForConfirmationModel, setReqForConfirmationModel] =
    useState<boolean>(false);
  const [confirmationMainText, setConfirmationMainText] = useState<string>("");
  const [confirmationDetails, setConfirmationDetails] = useState<string>("");
  const [onContinueOnModel, setOnContinueOnModel] = useState<any>();

  const reqForToastAndSetMessage = (
    message: string,
    subMessage?: string,
    action?: {
      label: string;
      onClick: VoidFunction;
    }
  ) =>
    toast(message, {
      description: subMessage,
      action: action,
    });

  const reqForConfirmationDialogue = (
    mainText: string,
    details: string,
    onContinue: any
  ) => {
    setReqForConfirmationModel(true);
    setConfirmationMainText(mainText);
    setConfirmationDetails(details);
    setOnContinueOnModel(onContinue);
  };

  const [reqForProfile, setReqForProfile] = useState<boolean>(false);

  const [reloadFlag, setReloadFlag] = useState<number>(0);

  const handleReload = () => {
    setReloadFlag((prev) => prev + 1);
  }

  const [myProfileDetails, setMyProfileDetails] = useState<User | null>(null);

  useEffect(() => {
    axiosInstance.get("/user_mng/user/me").then((response) => {
      setMyProfileDetails(response.data.data);
    }).catch((error) => {
      reqForToastAndSetMessage(error.response?.data?.message || "Error fetching profile details");
    });
  }, []);

  const [aprsState, setAprsState] = useState<{
    submitted: number,
    firstApproved: number,
    secondApproved: number,
    firstRejected: number,
    reviewed: number,
    secondRejected: number,
  }>({
    submitted: 0,
    firstApproved: 0,
    secondApproved: 0,
    firstRejected: 0,
    reviewed: 0,
    secondRejected: 0,
  });

  const aprStats = [
  {
    title: "Submitted",
    value: aprsState.submitted,
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "First Approved",
    value: aprsState.firstApproved,
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "First Rejected",
    value: aprsState.firstRejected,
    icon: XCircle,
    color: "text-red-500",
  },
  {
    title: "Second Approved",
    value: aprsState.secondApproved,
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  {
    title: "Second Rejected",
    value: aprsState.secondRejected,
    icon: XCircle,
    color: "text-rose-500",
  },
  {
    title: "Reviewed",
    value: aprsState.reviewed,
    icon: Folder,
    color: "text-indigo-500",
  },
  ];


  useEffect(() => {

    axiosInstance.get("/apr_management/get_system_aprs_status")
    .then((response: any) => {
      setAprsState({
        submitted: response.data.data.submitted ?? 0,
        firstApproved: response.data.data.firstApproved ?? 0,
        secondApproved: response.data.data.secondApproved ?? 0,
        firstRejected: response.data.data.firstRejected ?? 0,
        reviewed: response.data.data.reviewed ?? 0,
        secondRejected: response.data.data.secondRejected ?? 0,
      });
    }).catch((error: any) => {
      reqForToastAndSetMessage(error.response.data.message);
    });

  }, []);

  const changeBeneficairyAprIncludedStatus = (id: string) => {
    axiosInstance.post(`/global/beneficiary/change_apr_included/${id}`)
    .then((response: any) => reqForToastAndSetMessage(response.data.message))
    .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
  }

  return (
    <ParentContext.Provider
      value={{
        reqForToastAndSetMessage,
        reqForConfirmationDialogue,
        axiosInstance,
        reloadFlag,
        handleReload,
        myProfileDetails,
        setReqForProfile,
        aprStats,
        changeBeneficairyAprIncludedStatus
      }}
    >
      <div className="w-full h-full">{children}</div>

      {reqForConfirmationModel && (
        <ConfirmationAlertDialogue
          open={reqForConfirmationModel}
          onOpenChange={setReqForConfirmationModel}
          mainText={confirmationMainText}
          details={confirmationDetails}
          onContinue={() => {}}
        ></ConfirmationAlertDialogue>
      )}

      {reqForProfile && (
        <ProfileModal open={reqForProfile} onOpenChange={setReqForProfile} userId={myProfileDetails?.id as unknown as number} mode="show"></ProfileModal>
      )}
      
    </ParentContext.Provider>
  );
};

export default Parent;
