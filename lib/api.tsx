import { AxiosError, AxiosResponse } from "axios";
import { createAxiosInstance } from "./axios";
import { useParentContext } from "@/contexts/ParentContext";

const axiosInstance = createAxiosInstance();

const { reqForToastAndSetMessage } = useParentContext();

export const GetIndicator = (id: number) =>
  axiosInstance
    .get(`projects/indicator/${id}`)
    .then((response: AxiosResponse<any, any, {}>) => response.data.data)
    .catch((error: AxiosError<any, any>) =>
      reqForToastAndSetMessage(error.response?.data.message)
    );
