import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GeneralMessage } from "@/constants/ConfirmationModelsTexts";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/constants/System";

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  details: string;
  onContinue: any;
}

const ConfirmationAlertDialogue: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  details,
  onContinue,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{GeneralMessage}</AlertDialogTitle>
          <AlertDialogDescription>{details}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            id={SUBMIT_BUTTON_PROVIDER_ID}
            type="button"
            onClick={() => {
              if (onContinue) onContinue();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlertDialogue;
