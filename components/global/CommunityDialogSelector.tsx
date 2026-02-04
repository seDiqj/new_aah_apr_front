"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useParentContext } from "@/contexts/ParentContext";
import { Checkbox } from "../ui/checkbox";
import { withPermission } from "@/lib/withPermission";
import {
  CommunityDialogues,
  SelectedCommunityDialoguesGroups,
} from "@/types/Types";
import { CommunityDialogueSelectorSubmitMessage } from "@/constants/ConfirmationModelsTexts";
import { CommunityDialogueSelectorInterface } from "@/interfaces/Interfaces";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommunityDialogueSelector: React.FC<
  CommunityDialogueSelectorInterface
> = ({ open, onOpenChange, ids }) => {
  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
  } = useParentContext();

  const [communityDialogues, setCommunityDialogues] =
    useState<CommunityDialogues>([]);

  const [selectedCommunityDialoguesGroup, setSelectedCommunityDialoguesGroup] =
    useState<SelectedCommunityDialoguesGroups>([]);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedCommunityDialoguesGroup.length) {
      reqForToastAndSetMessage("Please select a group !", "warning");
      return;
    }

    setIsLoading(true);

    requestHandler()
      .post("/community_dialogue_db/beneficiaries/add_community_dialogue", {
        communityDialogue: selectedCommunityDialoguesGroup,
        ids: ids,
      })
      .then((response: any) => {
        onOpenChange(false);
        reqForToastAndSetMessage(response.data.message, "success");
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const onCheckedChange = (communityDialogue: any, group: any) => {
    setSelectedCommunityDialoguesGroup((prev) => {
      const exists = prev.some(
        (cd) =>
          cd.communityDialogueId === communityDialogue.id &&
          cd.group.name === group.name,
      );

      return exists
        ? prev.filter(
            (cd) =>
              !(
                cd.communityDialogueId === communityDialogue.id &&
                cd.group.name === group.name
              ),
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
  };

  useEffect(() => {
    if (open) {
      requestHandler()
        .get("/community_dialogue_db/community_dialogues/for_selection")
        .then((response: any) => {
          setCommunityDialogues(response.data.data);
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message, "error"),
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

          <DropdownMenuContent className="w-56" align="center">
            <DropdownMenuLabel>Community Dialogues</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {communityDialogues.map((communityDialogue: any) => (
              <DropdownMenuSub key={communityDialogue.id}>
                <DropdownMenuSubTrigger>
                  {communityDialogue.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    {communityDialogue.groups.map((group: any) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={(e) => {
                          e.preventDefault();
                          onCheckedChange(communityDialogue, group);
                        }}
                      >
                        <Checkbox
                          checked={selectedCommunityDialoguesGroup.some(
                            (cd) =>
                              cd.communityDialogueId === communityDialogue.id &&
                              cd.group.name === group.name,
                          )}
                          onCheckedChange={() =>
                            onCheckedChange(communityDialogue, group)
                          }
                          className="mr-2"
                        />
                        <span>{group.name.toUpperCase()}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Submit */}
        <Button
          id={SUBMIT_BUTTON_PROVIDER_ID}
          disabled={isLoading}
          onClick={() =>
            reqForConfirmationModelFunc(
              CommunityDialogueSelectorSubmitMessage,
              () => handleSubmit(),
            )
          }
          className="w-full rounded-xl mt-6"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default withPermission(CommunityDialogueSelector, "Dialogue.assign");
