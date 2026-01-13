import axios, { Axios, AxiosError, AxiosResponse } from "axios";

class RequestHandler {
  // Base configs for request handling.
  private config: Record<string, string | null | undefined | boolean> = {
    baseURL: "http://127.0.0.1:8000/api",
    token: this.getCookie("access_token"),
    withCredentials: true,
  };

  // Lock's the request to prevent repetation of request to a url
  private requestLock: boolean = false;

  // Global axios Instance.
  private axiosInstance: Axios | null = null;

  // Result of request.
  private result: Promise<AxiosResponse<any, any, {}>> | undefined = undefined;

  constructor() {
    this.axiosInstance = this.createAxiosInstance();
  }

  public get(url: string) {
    if (this.isLocked()) return;
    this.lockRequest();

    this.result = this.axiosInstance?.get(url);
    return this;
  }

  public post(url: string, data?: any) {
    if (this.isLocked()) return;
    this.lockRequest();

    this.result = this.axiosInstance?.post(url, data ?? undefined);
    return this;
  }

  public put(url: string, data?: any) {
    if (this.isLocked()) return;
    this.lockRequest();
    this.result = this.axiosInstance?.put(url, data ?? undefined);
    return this;
  }

  public delete(url: string, data?: any) {
    if (this.isLocked()) return;
    this.lockRequest();
    this.result = this.axiosInstance?.delete(url);
    return this;
  }

  public then(handler: (response: AxiosResponse) => void) {
    this.result?.then(handler);
    return this;
  }

  public catch(handler: (error: AxiosError) => void) {
    this.result?.catch(handler);
    return this;
  }

  public finally(handler: VoidFunction) {
    this.result?.finally(() => {
      handler();
      this.releaseRequestLock();
    });
    return this;
  }

  private lockRequest() {
    this.requestLock = true;
  }

  private releaseRequestLock() {
    this.requestLock = false;
  }

  private isLocked() {
    return this.requestLock;
  }

  private createAxiosInstance = () => {
    const token = this.getCookie("access_token");

    return axios.create({
      baseURL: (this.config.baseURL as string) ?? undefined,
      headers: {
        Authorization: token ? `Bearer ${this.config.token}` : "",
      },
      withCredentials: this.config.withCredentials as boolean,
    });
  };

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }
}

export default RequestHandler;
