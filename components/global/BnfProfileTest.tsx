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
import { Checkbox } from "@/components/ui/checkbox";
import { useParentContext } from "@/contexts/ParentContext";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

type Session = {
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
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const [indicators, setIndicators] = useState<IndicatorState[]>([]);

  // Fetch indicators from backend
  useEffect(() => {
    axiosInstance
      .get(`/main_db/indicators/${id}`)
      .then((response: any) => {
        console.log(response.data.data);
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

        console.log(mapped);
        setIndicators(mapped);
      })
      .catch((error: any) => {
        console.log(error);
        reqForToastAndSetMessage(
          error.response?.data?.message || "Error fetching indicators"
        );
      });
  }, []);

  // Add session row
  const addSessionRow = (indicatorId: number) => {
    const indicator = indicators.find((i) => i.id === indicatorId);

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

  // Add group row
  const addGroupRow = (indicatorId: number) => {
    const indicator = indicators.find((i) => i.id === indicatorId);

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

  // Handle submit
  const handleSubmit = () => {
    // console.log(indicators);
    // return
    axiosInstance
      .post(`/main_db/sessions/${id}`, {
        indicators: indicators,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  useEffect(() => console.log(indicators), [indicators]);

  return (
    <div className="w-full">
      {indicators.map((indicator, i) => {
        if (!indicator.type) return null;
        return (
          <div key={indicator.id} className="mb-10">
            {/* Full-width Title per Indicator */}
            <div className="bg-blue-600 text-center h-[51px] flex items-center justify-center mx-4 mt-4 rounded-2xl select-none">
              <h1 className="text-xl font-bold">{indicator.type}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-4">
              {/* Sessions Table */}
              <div>
                <div className="border rounded-2xl shadow overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-600 text-white h-14 pointer-events-none">
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
                                    prev.map((ind, i) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].session =
                                          e.target.value;
                                        return ind;
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
                                    prev.map((ind, i) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].date =
                                          e.target.value;
                                        return ind;
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
                                    prev.map((ind, i) => {
                                      if (ind.id == indicator.id) {
                                        ind.sessions[index].topic =
                                          e.target.value;
                                        return ind;
                                      }

                                      return ind;
                                    })
                                  )
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="border-b">
                        <TableCell colSpan={3} className="text-center">
                          <span
                            onClick={() => {
                              addSessionRow(indicator.id);
                            }}
                            className={`text-blue-600 cursor-pointer hover:underline`}
                          >
                            + Add Session
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={3}
                          className="text-center font-semibold"
                        >
                          Total Sessions:{" "}
                          {
                            indicator.sessions.filter(
                              (session) => session.group == null
                            ).length
                          }
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
                      <TableRow className="bg-blue-600 text-white h-14 pointer-events-none">
                        <TableHead className="text-center">Group</TableHead>
                        <TableHead className="text-center">Session</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-center">
                          Session Topic
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicator.sessions
                        .map((session, index) => {
                          return { session, index };
                        })
                        .filter((session) => session.session.group != null)
                        .map((item) => {
                          console.log(item);
                          return item;
                        })
                        .map((sessionWithIndix) => {
                          return (
                            <TableRow
                              key={sessionWithIndix.index}
                              className="border-b"
                            >
                              <TableCell className="text-center">
                                <Input
                                  className="border-none focus-visible:ring-0"
                                  placeholder="Group"
                                  value={
                                    indicator.sessions[sessionWithIndix.index]
                                      .group!
                                  }
                                  onChange={(e) =>
                                    setIndicators((prev) =>
                                      prev.map((ind, i) => {
                                        if (ind.id == indicator.id) {
                                          ind.sessions[
                                            sessionWithIndix.index
                                          ].group = e.target.value;

                                          return ind;
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
                                  placeholder="Session"
                                  value={
                                    indicator.sessions[sessionWithIndix.index]
                                      .session
                                  }
                                  onChange={(e) =>
                                    setIndicators((prev) =>
                                      prev.map((ind, i) => {
                                        if (ind.id == indicator.id) {
                                          ind.sessions[
                                            sessionWithIndix.index
                                          ].session = e.target.value;

                                          return ind;
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
                                  value={
                                    indicator.sessions[sessionWithIndix.index]
                                      .date
                                  }
                                  onChange={(e) =>
                                    setIndicators((prev) =>
                                      prev.map((ind, i) => {
                                        if (ind.id == indicator.id) {
                                          indicator.sessions[
                                            sessionWithIndix.index
                                          ].date = e.target.value;

                                          return ind;
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
                                  value={
                                    indicator.sessions[sessionWithIndix.index]
                                      .topic
                                  }
                                  onChange={(e) =>
                                    setIndicators((prev) =>
                                      prev.map((ind, i) => {
                                        if (ind.id == indicator.id) {
                                          ind.sessions[
                                            sessionWithIndix.index
                                          ].topic = e.target.value;

                                          return ind;
                                        }

                                        return ind;
                                      })
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      <TableRow className="border-b">
                        <TableCell colSpan={4} className="text-center">
                          <span
                            onClick={() => addGroupRow(indicator.id)}
                            className={`text-blue-600 cursor-pointer hover:underline`}
                          >
                            + Add Session
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={4}
                          className="text-center font-semibold"
                        >
                          Total Sessions:{" "}
                          {
                            indicator.sessions.filter(
                              (session) => session.group != null
                            ).length
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex flex-row items-center justify-end">
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
