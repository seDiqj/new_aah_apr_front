"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { withPermission } from "@/lib/withPermission";
import {
  CommunityDialogues,
  SelectedCommunityDialoguesGroups,
} from "@/types/Types";
import { CommunityDialogueSelectorSubmitMessage } from "@/constants/ConfirmationModelsTexts";
import { CommunityDialogueSelectorInterface } from "@/interfaces/Interfaces";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";

const CommunityDialogueSelector: React.FC<
  CommunityDialogueSelectorInterface
> = ({ open, onOpenChange, ids }) => {
  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [communityDialogues, setCommunityDialogues] =
    useState<CommunityDialogues>([]);

  const [selectedCommunityDialoguesGroup, setSelectedCommunityDialoguesGroup] =
    useState<SelectedCommunityDialoguesGroups>([]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredRowTopRectPosision, setHoveredRowTopRectPosision] =
    useState<number>(0);
  const [hoveredCd, setHoveredCd] = useState<any>();
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [areWeInSubDropDown, setAreWeInSubDropDown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedCommunityDialoguesGroup.length) {
      reqForToastAndSetMessage("Please select a group !");
      return;
    }

    setIsLoading(true);

    axiosInstance
      .post("/community_dialogue_db/beneficiaries/add_community_dialogue", {
        communityDialogue: selectedCommunityDialoguesGroup,
        ids: ids,
      })
      .then((response: any) => {
        onOpenChange(false);
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (open) {
      axiosInstance
        .get("/community_dialogue_db/community_dialogues/for_selection")
        .then((response: any) => {
          setCommunityDialogues(response.data.data);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-4xl rounded-2xl p-6 shadow-xl"
        style={{ maxHeight: "85vh" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Community Dialogue
          </DialogTitle>
        </DialogHeader>

        {/* Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-xl"
            >
              <span className="truncate">
                {selectedCommunityDialoguesGroup.length
                  ? selectedCommunityDialoguesGroup
                      .map((s) => s.group.name)
                      .join(", ")
                  : "Select community dialogue"}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[850px] rounded-xl p-0 shadow-lg"
            align="start"
          >
            <div className="p-4">
              <DropdownMenuLabel className="text-sm font-semibold">
                Community Dialogues
              </DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />

            <div className="max-h-[420px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 w-full w-full">
                  <TableRow>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Focal Point</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Database</TableHead>
                    <TableHead>Project Code</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Province</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {communityDialogues.map((communityDialogue) => (
                    <TableRow
                      key={communityDialogue.id}
                      className="cursor-pointer transition-colors hover:bg-muted"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect =
                          dialogContentRef.current!.getBoundingClientRect();

                        setHoveredRowTopRectPosision(
                          rect.top - containerRect.top - 80
                        );
                        setHoveredCd(communityDialogue);
                        setHoveredId(communityDialogue.id);
                      }}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          if (!areWeInSubDropDown) setHoveredId(null);
                        }, 2000);
                      }}
                    >
                      {Object.entries(communityDialogue.program).map(
                        (item, i) =>
                          item[0] !== "id" && (
                            <TableCell
                              key={i}
                              className="text-sm text-muted-foreground"
                            >
                              {item[1].toString().toUpperCase()}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {hoveredCd &&
              hoveredId &&
              subDropDownGenerator(hoveredCd, hoveredRowTopRectPosision)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Submit */}
        <Button
          id={SUBMIT_BUTTON_PROVIDER_ID}
          disabled={isLoading}
          onClick={() =>
            reqForConfirmationModelFunc(
              CommunityDialogueSelectorSubmitMessage,
              () => handleSubmit()
            )
          }
          className="w-full rounded-xl mt-6"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );

  function subDropDownGenerator(communityDialogue: any, top: number) {
    return (
      <div
        className="absolute left-full ml-3 bg-background border rounded-xl shadow-xl z-50 min-w-[200px]"
        style={{ top }}
        onMouseEnter={() => setAreWeInSubDropDown(true)}
        onMouseLeave={() => {
          setAreWeInSubDropDown(false);
          setHoveredId(null);
        }}
      >
        {communityDialogue.groups.map((group: any) => (
          <label
            key={group.id}
            className="flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-muted rounded-lg"
          >
            <Checkbox
              checked={selectedCommunityDialoguesGroup.some(
                (cd) =>
                  cd.communityDialogueId === communityDialogue.id &&
                  cd.group.name === group.name
              )}
              onCheckedChange={() => {
                setSelectedCommunityDialoguesGroup((prev) => {
                  const exists = prev.some(
                    (cd) =>
                      cd.communityDialogueId === communityDialogue.id &&
                      cd.group.name === group.name
                  );

                  return exists
                    ? prev.filter(
                        (cd) =>
                          !(
                            cd.communityDialogueId === communityDialogue.id &&
                            cd.group.name === group.name
                          )
                      )
                    : [
                        ...prev,
                        {
                          communityDialogueId: communityDialogue.id,
                          group: {
                            name: group.name,
                            id: group.id,
                          },
                        },
                      ];
                });
              }}
            />
            <span>{group.name.toUpperCase()}</span>
          </label>
        ))}
      </div>
    );
  }
};

export default withPermission(CommunityDialogueSelector, "Dialogue.assign");
