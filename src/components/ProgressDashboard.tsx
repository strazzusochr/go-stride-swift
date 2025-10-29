import { TrendingUp, Activity, Flame, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const ProgressDashboard = () => {
  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-2xl font-bold">Progress</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Volume"
          value="12,450 kg"
          change="+8%"
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="Workouts"
          value="23"
          change="+3"
        />
        <MetricCard
          icon={<Flame className="w-5 h-5" />}
          label="Streak"
          value="7 days"
          change="🔥"
        />
        <MetricCard
          icon={<Award className="w-5 h-5" />}
          label="PR's Hit"
          value="5"
          change="+2"
        />
      </div>

      {/* Personal Records */}
      <Card className="p-5 bg-card">
        <h3 className="font-bold mb-4 text-lg">Personal Records</h3>
        <div className="space-y-3">
          <PRItem exercise="Bench Press" weight="120 kg" date="2 days ago" />
          <PRItem exercise="Squat" weight="180 kg" date="1 week ago" />
          <PRItem exercise="Deadlift" weight="220 kg" date="1 week ago" />
        </div>
      </Card>

      {/* Weekly Volume Chart Placeholder */}
      <Card className="p-5 bg-card">
        <h3 className="font-bold mb-4 text-lg">Weekly Volume</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[65, 80, 75, 90, 85, 95, 70].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-neon rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-5 bg-secondary/30">
        <h3 className="font-bold mb-4 text-lg">Recent Achievements</h3>
        <div className="space-y-3">
          <Achievement
            title="Volume Beast"
            description="Completed 20,000 kg total volume"
            icon="🏆"
          />
          <Achievement
            title="Consistency King"
            description="7 day workout streak"
            icon="🔥"
          />
          <Achievement
            title="PR Master"
            description="Set 5 new personal records"
            icon="💪"
          />
        </div>
      </Card>
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) => (
  <Card className="p-4 bg-secondary/50">
    <div className="flex items-center gap-2 mb-2 text-primary">{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <div className="flex items-center justify-between mt-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-primary">{change}</p>
    </div>
  </Card>
);

const PRItem = ({ exercise, weight, date }: { exercise: string; weight: string; date: string }) => (
  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
    <div>
      <p className="font-semibold">{exercise}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
    </div>
    <p className="text-lg font-bold text-primary">{weight}</p>
  </div>
);

const Achievement = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
    <span className="text-3xl">{icon}</span>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default ProgressDashboard;
