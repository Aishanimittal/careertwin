import { useState } from "react";
import { useSkills, useCreateSkill, useDeleteSkill } from "@/hooks/use-skills";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Code2 } from "lucide-react";

export default function Skills() {
  const { data: skills, isLoading } = useSkills();
  const { mutateAsync: addSkill, isPending: isAdding } = useCreateSkill();
  const { mutateAsync: deleteSkill, isPending: isDeleting } = useDeleteSkill();
  
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;
    
    await addSkill({ skillName, skillLevel });
    setSkillName("");
    setSkillLevel("Beginner");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
            My Skills
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Add your technical and soft skills to improve prediction accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Form */}
          <Card className="md:col-span-1 p-6 border-border/50 bg-card/50 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Skill
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input 
                  id="skillName" 
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Python, React"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Proficiency Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isAdding || !skillName}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Skill"}
              </Button>
            </form>
          </Card>

          {/* List */}
          <Card className="md:col-span-2 p-6 border-border/50 bg-card/50 min-h-[400px]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" /> Current Stack
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : skills?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center p-4 border-2 border-dashed rounded-xl">
                <p>No skills added yet.</p>
                <p className="text-sm">Add some on the left to get better career matches.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills?.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors group">
                    <div>
                      <h4 className="font-semibold text-foreground">{skill.skillName}</h4>
                      <p className="text-xs text-muted-foreground">{skill.skillLevel}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      onClick={() => deleteSkill(skill.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
