"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  aprFinalizationSteps,
  projectAprStatusList,
} from "../utils/OptionLists";
import { useEffect, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { useProjectContext } from "../create_new_project/page";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import {
  IsCreateMode,
  IsEnteredStatusCallingToBeApproveAtLevelAboveTheAllowedLevel,
  IsEnteredStatusCallsToRejectAtTheLevelAboveTheCurrentLimit,
  IsEnteredStatusLocaltedAtTheLowerLevelThenTheCurrentStatus,
  IsShowMode,
  IsValidAprStatus,
} from "@/constants/Constants";
import { AprFinalizationSubPageInterface } from "@/interfaces/Interfaces";
import {
  AcceptFinalizationMessage,
  RejectFinalizationMessage,
} from "@/constants/ConfirmationModelsTexts";
import { usePermissions } from "@/contexts/PermissionContext";

const AprFinalizationSubPage: React.FC<AprFinalizationSubPageInterface> = ({
  mode,
}) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const {
    projectId,
    actionLogs,
    setActionLogs,
    projectAprStatus,
    setProjectAprStatus,
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const { permissions } = usePermissions();

  const [comment, setComment] = useState<string>("");

  const [reqForCreationModel, setReqForCreationModel] = useState(false);
  const [reqForSubmitionModel, setReqForSubmitionModel] = useState(false);
  const [reqForGrantFinalizationModel, setReqForGrantFinalizationModel] =
    useState(false);
  const [reqForHqFinalizationModel, setReqForHqFinalizationModel] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const changeProjectAprStatus = (status: string) => {
    if (!IsValidAprStatus(status)) {
      reqForToastAndSetMessage("Wronge status !");
      return;
    } else if (
      IsEnteredStatusLocaltedAtTheLowerLevelThenTheCurrentStatus(
        projectAprStatus,
        status
      )
    ) {
      reqForToastAndSetMessage(
        `You can not set the project status to ${status} while its ${projectAprStatus}!`
      );
      return;
    } else if (
      IsEnteredStatusCallsToRejectAtTheLevelAboveTheCurrentLimit(
        projectAprStatus,
        status
      )
    ) {
      reqForToastAndSetMessage(
        `You can not reject a project at the ${status} stage while its on ${projectAprStatus}!`
      );
      return;
    } else if (
      IsEnteredStatusCallingToBeApproveAtLevelAboveTheAllowedLevel(
        projectAprStatus,
        status
      )
    ) {
      reqForToastAndSetMessage(
        `You can not approve this step before previous levels!`
      );
      return;
    }

    setIsLoading(true);

    requestHandler()
      .post(`projects/status/change_apr_status/${projectId}`, {
        newStatus: status,
        comment,
      })
      .then((response: any) => {
        setComment("");
        reqForToastAndSetMessage(response.data.message);
        setProjectAprStatus(response.data.data);
        [
          setReqForCreationModel,
          setReqForSubmitionModel,
          setReqForGrantFinalizationModel,
          setReqForHqFinalizationModel,
        ].forEach((fn) => fn(false));
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    requestHandler()
      .get(`/projects/get_project_finalizers_details/${projectId}`)
      .then((response: any) => setActionLogs(response.data.data))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  }, [projectAprStatus]);

  const readOnly = IsShowMode(mode);

  return (
    <Card className="h-full w-full max-w-full overflow-hidden flex flex-col">
      {/* ================= Header ================= */}
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold">
          APR Finalization Workflow
        </CardTitle>
      </CardHeader>

      {/* ================= Content ================= */}
      <CardContent className="flex flex-col gap-6 overflow-auto max-w-full">
        {aprFinalizationSteps
          .filter((step) => permissions.includes(step.permission))
          .map((step, index) => {
            const canReject = index !== 0;

            return (
              <div
                key={step.id}
                className="rounded-xl border bg-muted/30 p-4 hover:bg-muted/40 transition"
              >
                <div className="flex items-center gap-4">
                  <AlertDialog
                    open={
                      step.id === "create"
                        ? reqForCreationModel
                        : step.id === "submit"
                        ? reqForSubmitionModel
                        : step.id === "grantFinalize"
                        ? reqForGrantFinalizationModel
                        : reqForHqFinalizationModel
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Checkbox
                        id={step.id}
                        checked={
                          (() => {
                            const currentIdx =
                              projectAprStatusList.indexOf(projectAprStatus);
                            const stepIdx = projectAprStatusList.indexOf(
                              step.acceptStatusValue!
                            );
                            const isRejected = step.rejectStatusValue
                              ? projectAprStatus === step.rejectStatusValue
                              : false;

                            return (
                              !isRejected &&
                              stepIdx !== -1 &&
                              currentIdx >= stepIdx
                            );
                          })() || projectAprStatus === step.acceptStatusValue
                        }
                        onCheckedChange={() =>
                          step.id === "create"
                            ? setReqForCreationModel(true)
                            : step.id === "submit"
                            ? setReqForSubmitionModel(true)
                            : step.id === "grantFinalize"
                            ? setReqForGrantFinalizationModel(true)
                            : setReqForHqFinalizationModel(true)
                        }
                        disabled={readOnly}
                      />
                    </AlertDialogTrigger>

                    <AlertDialogContent className="space-y-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {canReject
                            ? "Accept or Reject this step?"
                            : `Confirm ${step.label}?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {step.description}
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-2">
                        <Label>Comment</Label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your comment..."
                          disabled={readOnly}
                        />
                      </div>

                      <AlertDialogFooter className="justify-between">
                        <AlertDialogCancel
                          onClick={() => {
                            setReqForCreationModel(false);
                            setReqForGrantFinalizationModel(false);
                            setReqForHqFinalizationModel(false);
                            setReqForSubmitionModel(false);
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>

                        {canReject ? (
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              disabled={readOnly || isLoading}
                              onClick={() =>
                                reqForConfirmationModelFunc(
                                  RejectFinalizationMessage,
                                  () =>
                                    comment.trim()
                                      ? changeProjectAprStatus(
                                          step.rejectStatusValue!
                                        )
                                      : reqForToastAndSetMessage(
                                          "Comment is required!"
                                        )
                                )
                              }
                            >
                              Reject
                            </Button>

                            <Button
                              disabled={readOnly || isLoading}
                              onClick={() =>
                                reqForConfirmationModelFunc(
                                  AcceptFinalizationMessage,
                                  () =>
                                    comment.trim()
                                      ? changeProjectAprStatus(
                                          step.acceptStatusValue!
                                        )
                                      : reqForToastAndSetMessage(
                                          "Comment is required!"
                                        )
                                )
                              }
                            >
                              Accept
                            </Button>
                          </div>
                        ) : (
                          <Button
                            disabled={readOnly || isLoading}
                            onClick={() =>
                              comment.trim()
                                ? changeProjectAprStatus(
                                    step.acceptStatusValue!
                                  )
                                : reqForToastAndSetMessage(
                                    "Comment is required!"
                                  )
                            }
                          >
                            {step.buttonLabel}
                          </Button>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex justify-between w-full">
                    <Label>{step.label}</Label>
                    <span className="text-sm text-muted-foreground">
                      {actionLogs.find((log: any) => log.action === step.id)
                        ?.name ?? "Pending"}{" "}
                      •{" "}
                      {actionLogs.find((log: any) => log.action === step.id)
                        ?.date ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {/* ================= Timeline ================= */}
        <div className="pt-6">
          <h3 className="text-sm font-semibold mb-3">Action Timeline</h3>

          <div className="flex gap-6 overflow-x-auto p-4 rounded-xl bg-muted/40">
            {actionLogs.map((log: any, i: number) => (
              <div key={log.id} className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={log.avatar}
                    className="w-10 h-10 rounded-full border"
                  />
                  <span className="text-xs font-medium mt-1">{log.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                      log.action === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.action}
                  </span>
                </div>

                {i < actionLogs.length - 1 && (
                  <div className="w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AprFinalizationSubPage;
