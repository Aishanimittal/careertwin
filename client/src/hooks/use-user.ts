import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type UpdateProfileInput = z.infer<typeof api.users.updateProfile.input>;

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProfileInput }) => {
      const url = buildUrl(api.users.updateProfile.path, { id });
      const validated = api.users.updateProfile.input.parse(data);
      
      const res = await fetch(url, {
        method: api.users.updateProfile.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    },
    onError: (err: Error) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });
}
