"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useParentContext } from "./ParentContext";

type PermissionContextType = string[];

const PermissionContext = createContext<PermissionContextType>([]);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider = ({ children }: PermissionProviderProps) => {
  const { axiosInstance, reqForToastAndSetMessage } = useParentContext();
  const [permissions, setPermissions] = useState<PermissionContextType>([]);

  useEffect(() => {
    axiosInstance
      .get("/user_mng/permissionsForAuth")
      .then((response: any) => {
        setPermissions(response.data.data)
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, []);

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
