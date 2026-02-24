import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type PredictInput = z.infer<typeof api.predictions.predict.input>;
type PredictResult = z.infer<typeof api.predictions.predict.responses[200]>;
type HistoryItem = z.infer<typeof api.predictions.history.responses[200]>[0];

export function usePredict() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: PredictInput) => {
      const validated = api.predictions.predict.input.parse(data);
      const res = await fetch(api.predictions.predict.path, {
        method: api.predictions.predict.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to generate prediction");
      }
      return res.json() as Promise<PredictResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.history.path] });
    },
    onError: (err: Error) => {
      toast({ title: "Prediction failed", description: err.message, variant: "destructive" });
    },
  });
}

export function usePredictionHistory() {
  return useQuery({
    queryKey: [api.predictions.history.path],
    queryFn: async () => {
      const res = await fetch(api.predictions.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prediction history");
      return res.json() as Promise<HistoryItem[]>;
    },
  });
}
