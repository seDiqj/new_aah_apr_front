"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useParentContext } from "@/contexts/ParentContext";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash } from "lucide-react";
import { BeneficiarySessionDeleteMessage } from "@/constants/ConfirmationModelsTexts";
import { IsANullOrUndefinedValue } from "@/constants/Constants";
import { AxiosError, AxiosResponse } from "axios";

type Session = {
  id: number | null;
  group: string | null;
  session: string;
  date: string;
  topic: string;
};

type Dessaggregation = {
  id: string;
  description: string;
};

type IndicatorState = {
  id: number;
  indicatorRef: string;
  type: string;
  sessions: Session[];
  dessaggregations: Dessaggregation[];
};

export default function SessionsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [indicators, setIndicators] = useState<IndicatorState[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch indicators from backend
  useEffect(() => {
    axiosInstance
      .get(`/main_db/indicators/${id}`)
      .then((response: any) => {
        const mapped = response.data.data.map((ind: any) => ({
          id: ind.id,
          type: ind.type,
          sessions: ind.sessions.map((session: any) => ({
            id: session.id,
            group: session.group,
            session: session.session,
            date: session.date,
            topic: session.topic,
          })),
          dessaggregations:
            ind.dessaggregations.map((d: any) => ({
              id: d.id,
              description: d.description,
            })) || [],
        }));
        setIndicators(mapped);
      })
      .catch((error: any) => {
        console.log(error);
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error fetching indicators"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const addSessionRow = (indicatorId: number) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === indicatorId
          ? {
              ...ind,
              sessions: [
                ...ind.sessions,
                { id: null, group: null, session: "", date: "", topic: "" },
              ],
            }
          : ind
      )
    );
  };

  const addGroupRow = (indicatorId: number) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === indicatorId
          ? {
              ...ind,
              sessions: [
                ...ind.sessions,
                { id: null, group: "", session: "", date: "", topic: "" },
              ],
            }
          : ind
      )
    );
  };

  const handleSubmit = () => {
    axiosInstance
      .post(`/main_db/sessions/${id}`, {
        indicators: indicators,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const handleDeleteSession = (
    indicatorId: number | null,
    sessionId: number | null
  ) => {
    if (
      IsANullOrUndefinedValue(indicatorId) ||
      IsANullOrUndefinedValue(sessionId)
    )
      return;

    axiosInstance
      .delete(`/main_db/beneficiary/sessions/delete_session/${sessionId}`)
      .then((response: AxiosResponse<any, any, any>) => {
        setIndicators((prev: IndicatorState[]) =>
          prev.map((indicator: IndicatorState) =>
            indicator.id == indicatorId
              ? {
                  ...indicator,
                  sessions: indicator.sessions.filter(
                    (session: Session) => session.id != sessionId
                  ),
                }
              : indicator
          )
        );
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: AxiosError<any, any>) =>
        reqForToastAndSetMessage(error.response?.data.message)
      );
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 gap-8 animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin opacity-70" />
        <div className="w-full max-w-4xl space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-10 w-1/3 rounded-xl" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className="h-10 w-full rounded-xl bg-muted/30"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {indicators.map((indicator, i) => {
        if (!indicator.type) return null;
        return (
          <div key={indicator.id} className="mb-10">
            {/* Full-width Title per Indicator */}
            <div className="text-center h-[51px] flex items-center justify-center mx-4 mt-4 rounded-2xl select-none border">
              <h1 className="text-xl font-bold">{indicator.type}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-4">
              {/* Sessions Table */}
              <div>
                <div className="border rounded-2xl shadow overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-white h-14 pointer-events-none">
                        <TableHead className="text-center">Session</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-center">
                          Session Topic
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicator.sessions.map((session, index) => {
                        if (session.group != null) return;
                        return (
                          <TableRow key={index} className="border-b">
                            <TableCell className="text-center">
                              <Input
                                className="border-none focus-visible:ring-0"
                                placeholder="Session"
                                value={indicator.sessions[index].session}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].session =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="date"
                                className="border-none focus-visible:ring-0"
                                value={indicator.sessions[index].date}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].date =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                className="border-none focus-visible:ring-0"
                                placeholder="Topic"
                                value={indicator.sessions[index].topic}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].topic =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            {session.id && (
                              <TableCell>
                                <Trash
                                  onClick={() =>
                                    reqForConfirmationModelFunc(
                                      BeneficiarySessionDeleteMessage,
                                      () =>
                                        handleDeleteSession(
                                          indicator.id,
                                          session.id
                                        )
                                    )
                                  }
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  size={18}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <span
                            onClick={() => addSessionRow(indicator.id)}
                            className="cursor-pointer hover:underline"
                          >
                            + Add Session
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Groups Table */}
              <div>
                <div className="border rounded-2xl shadow overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-white h-14 pointer-events-none">
                        <TableHead className="text-center">Group</TableHead>
                        <TableHead className="text-center">Session</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-center">Topic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicator.sessions
                        .map((session, index) => ({ session, index }))
                        .filter((s) => s.session.group != null)
                        .map((item) => (
                          <TableRow key={item.index} className="border-b">
                            <TableCell className="text-center">
                              <Input
                                placeholder="Group"
                                className="border-none focus-visible:ring-0"
                                value={item.session.group!}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id === indicator.id) {
                                        ind.sessions[item.index].group =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                placeholder="Session"
                                className="border-none focus-visible:ring-0"
                                value={item.session.session}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id === indicator.id) {
                                        ind.sessions[item.index].session =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="date"
                                className="border-none focus-visible:ring-0"
                                value={item.session.date}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id === indicator.id) {
                                        ind.sessions[item.index].date =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                placeholder="Topic"
                                className="border-none focus-visible:ring-0"
                                value={item.session.topic}
                                onChange={(e) =>
                                  setIndicators((prev) =>
                                    prev.map((ind) => {
                                      if (ind.id === indicator.id) {
                                        ind.sessions[item.index].topic =
                                          e.target.value;
                                      }
                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                            {item.session.id && (
                              <TableCell>
                                <Trash
                                  onClick={() =>
                                    reqForConfirmationModelFunc(
                                      BeneficiarySessionDeleteMessage,
                                      () =>
                                        handleDeleteSession(
                                          indicator.id,
                                          item.session.id
                                        )
                                    )
                                  }
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  size={18}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <span
                            onClick={() => addGroupRow(indicator.id)}
                            className="cursor-pointer hover:underline"
                          >
                            + Add Session
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end w-full pr-4 mt-6">
        <Button onClick={() => reqForConfirmationModelFunc("", handleSubmit)}>
          Submit
        </Button>
      </div>
    </div>
  );
}
