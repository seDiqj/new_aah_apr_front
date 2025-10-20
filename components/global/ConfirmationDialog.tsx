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

interface ComponentProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mainText: string;
  details: string;
  onContinue: any;
}

const ConfirmationAlertDialogue: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  mainText,
  details,
  onContinue,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{mainText}</AlertDialogTitle>
          <AlertDialogDescription>{details}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          
          <AlertDialogAction
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
