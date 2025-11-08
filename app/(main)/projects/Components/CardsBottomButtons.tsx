import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"


export const cardsBottomButtons = (backBtnOnClick: any, backBtnOnClickFuncInput: string, saveBtnOnClick: (() => void) | undefined, nextBtnOnClick: any, nextBtnOnClickFuncInput: string, backBtnDisabled?: boolean, nextBtnDisabled?: boolean) => {

    return (
            <>
                <Button disabled={backBtnDisabled} variant="outline" onClick={() => backBtnOnClick(backBtnOnClickFuncInput)}>Back</Button>
                {saveBtnOnClick && (
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button disabled={saveBtnOnClick == null}>Save</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={saveBtnOnClick}
                        >
                        OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                )}
                <Button disabled={nextBtnDisabled} onClick={() => nextBtnOnClick(nextBtnOnClickFuncInput)} variant={"outline"}>Next</Button>
            </>
    )

}
            