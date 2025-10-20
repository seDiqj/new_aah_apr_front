// BASE COMPONENT FOR SEEDING COMMON INFORMATIONS INTO ALL SYSTEM.

"use client";

import { ParentContext } from "@/contexts/ParentContext";
import { createAxiosInstance } from "@/lib/axios";
import { Permission, Role, User } from "@/types/Types";
import { AxiosInstance } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationAlertDialogue from "../global/ConfirmationDialog";

interface ComponentProps {
  children: React.ReactNode;
}

const Parent: React.FC<ComponentProps> = ({ children }) => {
  const axiosInstance: AxiosInstance = createAxiosInstance();

  const [userData, setUserData] = useState<User>();

  const [userRoles, setUserRoles] = useState<Role[]>();

  const [userPermissions, setUserPermissions] = useState<Permission[]>();

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

  const can = (permission: string) => {
    userPermissions?.find(
      (userPermission) => userPermission.label == permission
    )
      ? true
      : false;
  };

  const hasRole = (role: string) =>
    userRoles?.find((userRole) => userRole.name == role) ? true : false;

  useEffect(() => {
    axiosInstance
      .get(`/user_mng/user/me`)
      .then((response: any) => {
        let { roles, ...userWithoutRoles } = response.data.data;
        const { permissions, ...userWithoutPermissoins } = userWithoutRoles;
        setUserData(userWithoutPermissoins);
        setUserRoles(roles);
        setUserPermissions(permissions);
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.messaeg)
      );
  }, []);

  return (
    <ParentContext.Provider
      value={{
        reqForToastAndSetMessage,
        reqForConfirmationDialogue,
        axiosInstance,
        userData,
        userRoles,
        userPermissions,
        can,
        hasRole,
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
    </ParentContext.Provider>
  );
};

export default Parent;
