// BASE COMPONENT FOR SEEDING COMMON INFORMATIONS INTO ALL SYSTEM.

"use client";

import { ParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { Permission, Role, User } from "@/types/Types";
import { AxiosInstance } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationAlertDialogue from "../global/ConfirmationDialog";
import ProfileModal from "../global/UserFormTest";

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
