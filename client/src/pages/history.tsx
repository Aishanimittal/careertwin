import { useState } from "react";
import { usePredictionHistory } from "@/hooks/use-predictions";
import { AppLayout } from "@/components/layout/app-layout";
import { PredictionResult } from "@/components/predictions/prediction-result";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { api } from "@shared/routes";

type HistoryItem = z.infer<typeof api.predictions.history.responses[200]>[0];

export default function History() {
  const { data: history, isLoading } = usePredictionHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Prediction History
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Review your past career path generation results.
            </p>
          </div>
          {selectedItem && (
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Back to List
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedItem ? (
          <div className="animate-in-fade">
            <div className="mb-6 p-4 rounded-xl bg-accent/20 border border-accent/30 inline-flex items-center gap-2 text-sm font-medium text-accent-foreground">
              <Calendar className="h-4 w-4" /> 
              Generated on {selectedItem.prediction.date ? format(new Date(selectedItem.prediction.date), "MMMM d, yyyy") : "Unknown date"}
            </div>
            <PredictionResult result={selectedItem} />
          </div>
        ) : history?.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <h3 className="text-xl font-bold text-muted-foreground">No history found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Generate a prediction from the dashboard first.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history?.map((item) => (
              <Card 
                key={item.prediction.id} 
                className="p-6 cursor-pointer hover-elevate border-border/50 bg-card/50 transition-all group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {Math.round(item.prediction.confidence * 100)}% Match
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.prediction.date ? format(new Date(item.prediction.date), "MMM d, yyyy") : ""}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">
                  {item.career.careerName}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {item.career.domain}
                </p>
                <div className="mt-6 flex items-center justify-between text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View full roadmap <ChevronRight className="h-4 w-4" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
