import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import ExerciseDatabase from "@/components/ExerciseDatabase";
import RecoveryTracker from "@/components/RecoveryTracker";
import TemplateManager from "@/components/TemplateManager";
import ActiveWorkout from "@/components/ActiveWorkout";
import WorkoutHistory from "@/components/WorkoutHistory";
import ProgressDashboard from "@/components/ProgressDashboard";

export default function Index() {
  const { loading } = useAuth();
  const [activeTab, setActiveTab] = useState("workout");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">IronReign</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="exercises">Übungen</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Verlauf</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
            <TabsTrigger value="progress">Fortschritt</TabsTrigger>
          </TabsList>

          <TabsContent value="workout">
            <ActiveWorkout />
          </TabsContent>

          <TabsContent value="exercises">
            <ExerciseDatabase />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>

          <TabsContent value="history">
            <WorkoutHistory />
          </TabsContent>

          <TabsContent value="recovery">
            <RecoveryTracker />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
