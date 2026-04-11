import { CircularProgress } from "@/components/ui/circular-progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, BookOpen, Layers, Zap, GraduationCap, ChevronRight, Briefcase } from "lucide-react";
import { api } from "@shared/routes";
import { z } from "zod";

type PredictResult = z.infer<typeof api.predictions.predict.responses[200]>;

export function PredictionResult({ result }: { result: PredictResult }) {
  const { prediction, career, roadmap } = result;
  const confidencePct = Math.round(prediction.confidence * 100);
  const totalTrackedSkills = prediction.matchingSkills.length + prediction.gaps.length;

  return (
    <div className="space-y-8 animate-in-slide-up opacity-0">
      
      {/* Header Card */}
      <Card className="glass-card overflow-hidden relative border-none bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Briefcase className="w-64 h-64 text-primary" />
        </div>
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <CircularProgress value={confidencePct} size={160} strokeWidth={14} />
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-3">
                <Trophy className="mr-2 h-4 w-4" />
                Top Recommendation
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {career.careerName}
              </h2>
              <p className="text-lg text-muted-foreground mt-2 font-medium">
                {career.domain} • Expected Entry: {career.avgSalaryEntry}
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              This recommendation is computed using your CGPA, declared skills, and interests. 
              Current market outlook for this track is <span className="font-semibold text-foreground">{career.growthRate}</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Match Score</p>
                <p className="text-lg font-bold text-foreground">{confidencePct}%</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Matched Skills</p>
                <p className="text-lg font-bold text-foreground">{prediction.matchingSkills.length}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Skill Gaps</p>
                <p className="text-lg font-bold text-foreground">{prediction.gaps.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Skills Analysis */}
        <div className="space-y-8">
          <Card className="p-6 h-full hover-elevate border-border/60 bg-card/75">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Matching Skills</h3>
            </div>
            {prediction.matchingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {prediction.matchingSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-success/10 text-success hover:bg-success/20 border-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No direct matching technical skills found yet.</p>
            )}

            <div className="mt-8 flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Skill Gaps to Fill</h3>
            </div>
            {prediction.gaps.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {prediction.gaps.map((gap, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm border-dashed border-destructive/30 text-destructive">
                    {gap}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">You have all the core baseline skills needed!</p>
            )}

            <div className="mt-8 rounded-xl border border-border/60 bg-background/70 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">How this score is calculated</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Score combines profile signals: <span className="font-medium text-foreground">skills (60%)</span>,
                <span className="font-medium text-foreground"> interests (20%)</span>, and
                <span className="font-medium text-foreground"> CGPA (20%)</span>. 
                You currently match {prediction.matchingSkills.length} out of {totalTrackedSkills || 0} tracked skills for this role.
              </p>
            </div>
          </Card>
        </div>

        {/* Roadmap */}
        <Card className="p-6 hover-elevate border-border/60 bg-card/75">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold font-display">Recommended Roadmap</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Courses
              </h4>
              <ul className="space-y-2">
                {roadmap.courses.map((course, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" /> Certifications
              </h4>
              <ul className="space-y-2">
                {roadmap.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Progression Timeline */}
      <Card className="p-6 md:p-8 border-border/60 bg-card/75 overflow-hidden">
        <h3 className="text-2xl font-bold font-display mb-8 text-center">Career Progression</h3>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-8 relative">
            {prediction.progression.map((stage, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:text-right">
                  {i % 2 === 0 && (
                    <div className="bg-background border border-border/50 p-5 rounded-xl shadow-sm inline-block w-full md:w-auto text-left hover:border-primary/50 transition-colors">
                      <h4 className="font-bold text-lg text-foreground">{stage.level}</h4>
                      <p className="text-primary font-medium text-sm mt-1">{stage.salary}</p>
                    </div>
                  )}
                </div>
                
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground border-4 border-background shrink-0 z-10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                
                <div className="flex-1 w-full text-left">
                  {i % 2 !== 0 && (
                    <div className="bg-background border border-border/50 p-5 rounded-xl shadow-sm inline-block w-full md:w-auto hover:border-primary/50 transition-colors">
                      <h4 className="font-bold text-lg text-foreground">{stage.level}</h4>
                      <p className="text-primary font-medium text-sm mt-1">{stage.salary}</p>
                    </div>
                  )}
                  {i % 2 === 0 && <p className="text-sm font-semibold text-muted-foreground hidden md:block pl-6">{stage.years}</p>}
                  {i % 2 !== 0 && <p className="text-sm font-semibold text-muted-foreground hidden md:block pr-6 text-right">{stage.years}</p>}
                  {/* Mobile year display */}
                  <p className="text-sm font-semibold text-muted-foreground md:hidden mt-2 ml-12">{stage.years}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
    </div>
  );
}
