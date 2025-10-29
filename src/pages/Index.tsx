import { useState } from "react";
import { Dumbbell, TrendingUp, Utensils, Timer, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorkoutTracker from "@/components/WorkoutTracker";
import ProgressDashboard from "@/components/ProgressDashboard";
import NutritionPlanner from "@/components/NutritionPlanner";

type Tab = "home" | "workout" | "progress" | "nutrition";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gradient-neon flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-2xl font-bold text-neon">IronReign</h1>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">Pro Edition</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "home" && <HomeView onNavigate={setActiveTab} />}
        {activeTab === "workout" && <WorkoutTracker />}
        {activeTab === "progress" && <ProgressDashboard />}
        {activeTab === "nutrition" && <NutritionPlanner />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <NavButton
              icon={<Dumbbell className="w-5 h-5" />}
              label="Home"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <NavButton
              icon={<Timer className="w-5 h-5" />}
              label="Workout"
              active={activeTab === "workout"}
              onClick={() => setActiveTab("workout")}
            />
            <NavButton
              icon={<TrendingUp className="w-5 h-5" />}
              label="Progress"
              active={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
            />
            <NavButton
              icon={<Utensils className="w-5 h-5" />}
              label="Nutrition"
              active={activeTab === "nutrition"}
              onClick={() => setActiveTab("nutrition")}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

const HomeView = ({ onNavigate }: { onNavigate: (tab: Tab) => void }) => {
  return (
    <div className="pb-24 space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden gradient-metal p-8 border-accent/20">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-neon">Welcome Back, Warrior</h2>
          <p className="text-muted-foreground mb-6">Ready to dominate your limits?</p>
          <Button onClick={() => onNavigate("workout")} className="bg-primary hover:bg-primary/90 text-background font-bold glow-neon">
            Start Workout
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Target />} label="This Week" value="5 Workouts" />
        <StatCard icon={<Award />} label="Total Volume" value="12,450 kg" />
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <FeatureCard
          icon={<Timer className="w-6 h-6" />}
          title="Workout Tracker"
          description="Log exercises, sets, reps, and track your training volume"
          onClick={() => onNavigate("workout")}
        />
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Progress Analytics"
          description="Visualize your strength gains and muscle growth"
          onClick={() => onNavigate("progress")}
        />
        <FeatureCard
          icon={<Utensils className="w-6 h-6" />}
          title="Nutrition Planner"
          description="Calculate macros and plan meals for optimal gains"
          onClick={() => onNavigate("nutrition")}
        />
      </div>
    </div>
  );
};

const NavButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Card className="p-4 bg-secondary/50 border-border">
    <div className="flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const FeatureCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <Card
    className="p-5 hover:border-primary/50 transition-all cursor-pointer bg-card"
    onClick={onClick}
  >
    <div className="flex items-start gap-4">
      <div className="text-primary mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
);

export default Index;
