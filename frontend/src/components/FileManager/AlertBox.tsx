import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface AlertBoxProps {
    title: string
    desc: string
    onCancel: any
    onContinue: any
    open: boolean
    onOpenChange: any
}

const AlertBox = ({ title, desc, onCancel, onContinue, open, onOpenChange }: AlertBoxProps) => {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onCancel()} >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onContinue()} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertBox