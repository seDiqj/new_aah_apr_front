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

  const handleSubmit = () => {
    if (!selectedCommunityDialoguesGroup.length) {
      reqForToastAndSetMessage("Please select a group !");
      return;
    }

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
      });
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
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          padding: "10px 16px",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">
            Select Community Dialogue
          </DialogTitle>
        </DialogHeader>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" variant="outline">
              {selectedCommunityDialoguesGroup.length
                ? `Selected: ${selectedCommunityDialoguesGroup
                    .map((s) => s.group.name)
                    .join(", ")}`
                : "Open to select training"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[860px] max-w-none" align="start">
            <DropdownMenuLabel>Community Dialogues</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Code</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Focal Point</TableHead>
                  <TableHead>Database</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Village</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-visible">
                {communityDialogues.map((communityDialogue) => (
                  <TableRow
                    key={communityDialogue.id}
                    className="cursor-pointer hover:bg-accent"
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      const rect = target.getBoundingClientRect();
                      const containerRect =
                        dialogContentRef.current!.getBoundingClientRect();

                      setHoveredRowTopRectPosision(
                        rect.top - containerRect.top - 90
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
                      (item, i) => {
                        if (item[0] == "id") return null;
                        return (
                          <TableCell key={i}>
                            {item[1].toString().toUpperCase()}
                          </TableCell>
                        );
                      }
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {hoveredCd &&
              hoveredId &&
              subDropDownGenerator(hoveredCd, hoveredRowTopRectPosision)}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() =>
            reqForConfirmationModelFunc(
              CommunityDialogueSelectorSubmitMessage,
              () => handleSubmit()
            )
          }
          className="w-full mt-6"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );

  function subDropDownGenerator(
    communityDialogue: {
      id: string;
      program: {
        projectCode: string;
        focalPoint: string;
        province: string;
        district: string;
        village: string;
        location: string;
        indicator: string;
      };
      groups: {
        name: string;
        id: string;
      }[];
    },
    top: number
  ) {
    return (
      <div
        className="absolute left-full ml-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 min-w-[100px]"
        style={{ top: top + "px" }}
        onMouseEnter={() => setAreWeInSubDropDown(true)}
        onMouseLeave={() => {
          setAreWeInSubDropDown(false);
          setHoveredId(null);
        }}
      >
        {communityDialogue.groups.map((group) => (
          <div
            key={group.id}
            className="block w-full px-3 py-2 hover:bg-accent"
          >
            <label className="flex items-center gap-2 cursor-pointer">
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

                    if (exists) {
                      return prev.filter(
                        (cd) =>
                          !(
                            cd.communityDialogueId === communityDialogue.id &&
                            cd.group.name === group.name
                          )
                      );
                    } else {
                      return [
                        ...prev,
                        {
                          communityDialogueId: communityDialogue.id,
                          group: {
                            name: group.name,
                            id: group.id,
                          },
                        },
                      ];
                    }
                  });
                }}
              />
              <span>{group.name.toUpperCase()}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }
};

export default withPermission(CommunityDialogueSelector, "Dialogue.assign");
