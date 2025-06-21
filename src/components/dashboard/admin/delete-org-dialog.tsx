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

type DeleteOrgDialogProps = {
  orgId: string;
  orgName: string;
  onOrgDeleted: (orgId: string) => void;
  children: React.ReactNode;
}

export function DeleteOrgDialog({ orgId, orgName, onOrgDeleted, children }: DeleteOrgDialogProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    onOrgDeleted(orgId);
    toast({
      variant: "success",
      title: "Organization Deleted",
      description: `The organization "${orgName}" has been successfully deleted.`,
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
            This action cannot be undone. This will permanently delete the organization 
            <span className="font-semibold text-foreground"> {orgName}</span> and all associated data.
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
