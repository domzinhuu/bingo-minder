import { useToast } from "@/components/ui/use-toast";

export function useCustomToast() {
  const { toast } = useToast();

  function toastSuccess(description: string, title?: string) {
    toast({ title, description, variant: "success" });
  }

  function toastError(description: string, title?: string) {
    toast({ title, description, variant: "destructive" });
  }

  function toastInfo(description: string, title?: string) {
    toast({ title, description, variant: "info" });
  }

  return {
    toastSuccess,
    toastError,
    toastInfo,
  };
}
