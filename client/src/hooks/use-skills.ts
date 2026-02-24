import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type Skill = z.infer<typeof api.skills.list.responses[200]>[0];
type CreateSkillInput = z.infer<typeof api.skills.create.input>;

export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      const res = await fetch(api.skills.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch skills");
      return res.json() as Promise<Skill[]>;
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSkillInput) => {
      const validated = api.skills.create.input.parse(data);
      const res = await fetch(api.skills.create.path, {
        method: api.skills.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add skill");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.skills.list.path] });
      toast({ title: "Skill added", description: "Your skill has been added successfully." });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.skills.delete.path, { id });
      const res = await fetch(url, { method: api.skills.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete skill");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.skills.list.path] });
      toast({ title: "Skill removed", description: "The skill has been deleted." });
    },
  });
}
