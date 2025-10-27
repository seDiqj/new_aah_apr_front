import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


type Outcome = {
    id: string,
    outcome: string,
    outcomeRef: string
}

type Outcomes = {
    id: string | null,
    outcome: string,
    outcomeRef: string
}[]

interface ComponentProps {
    isOpen: boolean,
    onClose: VoidFunction,
    onSave: (local: {id: string, outcome: string, outcomeRef: string}) => void,
    outcomeData: Outcome,
    outcomes: Outcomes,
    mode: "edit" | "show"
}

const OutcomeEditModal: React.FC<ComponentProps> = ({
    isOpen,
    onClose,
    onSave,
    outcomeData,
    mode
}) => {

const [localOutcome, setLocalOutcome] = useState<string>(
    outcomeData!.outcome || ""
);
const [localOutcomeRef, setLocalOutcomeRef] = useState<string>(
    outcomeData!.outcomeRef || ""
);

return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
    <DialogContent className="max-w-lg">
        <DialogHeader>
        <DialogTitle>{mode == "edit" ? "Edit Outcome" : "Show Outcome"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
        <div className="flex flex-col gap-1">
            <Label htmlFor="edit-outcome">Outcome</Label>
            <Input
            id="edit-outcome"
            value={localOutcome}
            onChange={(e) => setLocalOutcome(e.target.value)}
            disabled={mode == "show"}
            />
        </div>

        <div className="flex flex-col gap-1">
            <Label htmlFor="edit-outcome-ref">Outcome Reference</Label>
            <Input
            id="edit-outcome-ref"
            value={localOutcomeRef}
            onChange={(e) => setLocalOutcomeRef(e.target.value)}
            disabled={mode == "show"}
            />
        </div>
        </div>

        {mode != "show" && (
            <DialogFooter>
        <div className="flex gap-2 w-full justify-end">
            <Button
            variant="outline"
            onClick={() => onClose()}
            >
            Cancel
            </Button>
            <Button onClick={() => onSave({
                id: outcomeData.id,
                outcome: localOutcome,
                outcomeRef: localOutcomeRef
            })}>
                Save
            </Button>
        </div>
        </DialogFooter>
        )}
    </DialogContent>
    </Dialog>
);
};


export default OutcomeEditModal;