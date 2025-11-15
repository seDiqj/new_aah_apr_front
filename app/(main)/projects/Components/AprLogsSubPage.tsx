"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParentContext } from "@/contexts/ParentContext";
import { useEffect, useState } from "react";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { useProjectContext } from "../create_new_project/page";
import { Logs } from "@/types/Types";

interface ComponentProps {
  mode: "create" | "edit" | "show";
}

const AprLogsSubPage: React.FC<ComponentProps> = ({mode}) => {

    const {axiosInstance, reqForToastAndSetMessage} = useParentContext();
    const {projectId} = mode == "create" ? useProjectContext() : mode == "show" ? useProjectShowContext() : useProjectEditContext();
    const [selectedComment, setSelectedComment] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const [logs, setLogs] = useState<Logs>([]);

    useEffect(() => {
        axiosInstance
            .get(`/projects/logs/${projectId}`)
            .then((response: any) => setLogs(response.data.data))
            .catch((error: any) =>
                reqForToastAndSetMessage(error.response.data.message)
            );
    }, []);

    const readOnly: boolean = mode == "show";

    return (
        <>
        
            <Card className="h-full">
                <CardHeader>
                  <CardTitle>Apr Finalization</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 overflow-y-auto">
                  <>
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Action</TableHead>
                          <TableHead className="w-[120px]">Doer</TableHead>
                          <TableHead className="w-[250px]">Comment</TableHead>
                          <TableHead className="w-[120px]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.action}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => {
                                  setSelectedComment(item.comment);
                                  setOpen(true);
                                }}
                                className="block max-w-[220px] truncate text-left hover:underline"
                                title={"Click for check full comment"}
                              >
                                {item.comment}
                              </button>
                            </TableCell>
                            <TableCell>{item.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Comment</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2 text-sm text-gray-700">
                          {selectedComment}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button onClick={() => setOpen(false)}>Close</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                </CardContent>
            </Card>

        </>
    )
}

export default AprLogsSubPage;