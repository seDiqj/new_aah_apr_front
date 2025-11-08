import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


type Output = {
    id: string,
    output: string,
    outputRef: string
}

type Outputs = {
    id: string | null,
    output: string,
    outputRef: string
}[]

interface ComponentProps {
    isOpen: boolean,
    onClose: VoidFunction,
    onSave: (local: Output) => void,
    outputData: Output,
    outputs: Outputs,
    mode: "edit" | "show"
}

const OutputEditModel: React.FC<ComponentProps> = ({
    isOpen,
    onClose,
    onSave,
    outputData,
    mode
}) => {

const [localOutput, setLocalOutput] = useState<string>(
    outputData!.output || ""
);
const [localOutputRef, setLocalOutputRef] = useState<string>(
    outputData!.outputRef || ""
);

return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
    <DialogContent className="max-w-lg">
        <DialogHeader>
        <DialogTitle>{mode == "edit" ? "Edit Output" : "Show Output"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
        <div className="flex flex-col gap-1">
            <Label htmlFor="edit-outcome">Output</Label>
            <Input
            id="edit-outcome"
            value={localOutput}
            onChange={(e) => setLocalOutput(e.target.value)}
            disabled={mode == "show"}
            />
        </div>

        <div className="flex flex-col gap-1">
            <Label htmlFor="edit-outcome-ref">Output Reference</Label>
            <Input
            id="edit-outcome-ref"
            value={localOutputRef}
            onChange={(e) => setLocalOutputRef(e.target.value)}
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
                id: outputData.id,
                output: localOutput,
                outputRef: localOutputRef
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


export default OutputEditModel;