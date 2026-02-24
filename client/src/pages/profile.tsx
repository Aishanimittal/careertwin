import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-user";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserCircle } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cgpa: "",
    interests: "",
    goals: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        cgpa: user.cgpa?.toString() || "",
        interests: user.interests?.join(", ") || "",
        goals: user.goals || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await updateProfile({
      id: user.id,
      data: {
        name: formData.name,
        email: formData.email,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
        goals: formData.goals
      }
    });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your personal information and academic baseline.
          </p>
        </div>

        <Card className="p-8 border-border/50 bg-card/50 shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/50">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
              {user?.name?.charAt(0) || user?.username.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-muted-foreground">Base information used for predictions</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA (out of 4.0 or 10.0)</Label>
                <Input 
                  id="cgpa" 
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input 
                  id="interests" 
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  placeholder="AI, Design, Marketing"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Long-term Career Goals</Label>
              <Textarea 
                id="goals" 
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                placeholder="Where do you see yourself in 5 years?"
                className="min-h-[100px] bg-background"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="px-8 bg-primary hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
