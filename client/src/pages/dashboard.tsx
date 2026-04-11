import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSkills } from "@/hooks/use-skills";
import { usePredict } from "@/hooks/use-predictions";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictionResult } from "@/components/predictions/prediction-result";
import { Loader2, Compass, AlertCircle } from "lucide-react";
import { z } from "zod";
import { api } from "@shared/routes";

type PredictResult = z.infer<typeof api.predictions.predict.responses[200]>;

export default function Dashboard() {
  const { user } = useAuth();
  const { data: skills } = useSkills();
  const { mutateAsync: predict, isPending } = usePredict();
  
  const [result, setResult] = useState<PredictResult | null>(null);
  
  // Local form state overriding profile defaults for the current prediction
  const [cgpa, setCgpa] = useState<string>(user?.cgpa?.toString() || "");
  const [interests, setInterests] = useState<string>(user?.interests?.join(", ") || "");

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cgpa) return;

    try {
      const activeSkills = skills?.map(s => s.skillName) || [];
      const interestsArray = interests.split(",").map(i => i.trim()).filter(Boolean);

      const res = await predict({
        cgpa: parseFloat(cgpa),
        skills: activeSkills,
        interests: interestsArray
      });
      setResult(res);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="animate-in-slide-up opacity-0 stagger-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
            Welcome back, {user?.name || user?.username}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Let's discover the best path for your career.
          </p>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in-fade opacity-0 stagger-2">
            <Card className="panel-shine hover-elevate lg:col-span-1 h-fit border-border/60 bg-card/75 p-6 shadow-sm">
              <div className="mb-6 pb-6 border-b border-border/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-display font-bold">New Prediction</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We evaluate your skills, interests, and CGPA to generate a focused career recommendation and roadmap.
                </p>
              </div>

              <form onSubmit={handlePredict} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">Current CGPA</Label>
                  <Input 
                    id="cgpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 3.8"
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Active Skills</Label>
                  <div className="p-3 bg-background border border-border rounded-lg min-h-[60px] text-sm text-muted-foreground">
                    {skills && skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map(s => (
                          <span key={s.id} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        No skills added yet. Go to My Skills.
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (comma separated)</Label>
                  <Input 
                    id="interests" 
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. AI, Web Dev, Finance"
                    className="bg-background"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
                  disabled={isPending || !skills?.length}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Building your roadmap...
                    </>
                  ) : (
                    "Generate Path"
                  )}
                </Button>
                {isPending && (
                  <p className="text-xs text-muted-foreground text-center">
                    This can take a few seconds while we evaluate your profile and generate recommendations.
                  </p>
                )}
              </form>
            </Card>

            <div className="lg:col-span-2 flex flex-col justify-center items-center p-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20 animate-in-slide-up opacity-0 stagger-3">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Compass className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="classic-hover text-2xl font-display font-bold text-muted-foreground">Ready to explore?</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Fill out the form to generate a recommendation based on transparent scoring logic and role-specific requirements.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
                <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Weight 1</p>
                  <p className="text-sm font-semibold text-foreground">Skills: 60%</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Weight 2</p>
                  <p className="text-sm font-semibold text-foreground">Interests: 20%</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Weight 3</p>
                  <p className="text-sm font-semibold text-foreground">CGPA: 20%</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Your Prediction Result</h2>
              <Button variant="outline" onClick={() => setResult(null)}>
                Run Another
              </Button>
            </div>
            <PredictionResult result={result} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
