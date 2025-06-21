import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

type DeleteUserDialogProps = {
  userId: string;
  userName: string;
  onUserDeleted: (userId: string) => void;
  children: React.ReactNode;
}

export function DeleteUserDialog({ userId, userName, onUserDeleted, children }: DeleteUserDialogProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    onUserDeleted(userId);
    toast({
      variant: "success",
      title: "User Deleted",
      description: `The user "${userName}" has been successfully deleted.`,
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user <span className="font-semibold text-foreground">{userName}</span> and all of their associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
