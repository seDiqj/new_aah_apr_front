import { Button } from "@/components/ui/button";
import {
  Isp3CreationMessage,
  ProjectCreationMessage,
} from "@/constants/ConfirmationModelsTexts";
import {
  ARROW_LEFT_BUTTON_PROVIDER,
  ARROW_RIGHT_BUTTON_PROVIDER,
  SUBMIT_BUTTON_PROVIDER_ID,
} from "@/constants/System";
import { useParentContext } from "@/contexts/ParentContext";

export const cardsBottomButtons = (
  backBtnOnClick: any,
  backBtnOnClickFuncInput: string,
  saveBtnOnClick: (() => void) | undefined,
  nextBtnOnClick: any,
  nextBtnOnClickFuncInput: string,
  section?: "project" | "isp3",
  backBtnDisabled?: boolean,
  nextBtnDisabled?: boolean
) => {
  const { reqForConfirmationModelFunc } = useParentContext();
  return (
    <>
      <Button
        id={ARROW_LEFT_BUTTON_PROVIDER}
        disabled={backBtnDisabled}
        variant="outline"
        onClick={() => backBtnOnClick(backBtnOnClickFuncInput)}
      >
        Back
      </Button>
      {saveBtnOnClick && section && (
        <Button
          id={SUBMIT_BUTTON_PROVIDER_ID}
          disabled={saveBtnOnClick == null}
          onClick={() =>
            reqForConfirmationModelFunc(
              getConfirmationMessage(section),
              saveBtnOnClick
            )
          }
        >
          Save
        </Button>
      )}
      <Button
        id={ARROW_RIGHT_BUTTON_PROVIDER}
        disabled={nextBtnDisabled}
        onClick={() => nextBtnOnClick(nextBtnOnClickFuncInput)}
        variant={"outline"}
      >
        Next
      </Button>
    </>
  );
};

function getConfirmationMessage(section: string): string {
  switch (section) {
    case "project":
      return ProjectCreationMessage;

    default:
      return Isp3CreationMessage;
  }
}
