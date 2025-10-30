import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Dumbbell, Target, Award, RotateCcw, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProgressDashboard() {
  const queryClient = useQueryClient();
  
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const user = userData;

  const { data: stats } = useQuery({
    queryKey: ["progress_stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get total workouts
      const { count: totalWorkouts } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get total sets
      const { count: totalSets } = await supabase
        .from("set_entries")
        .select("*, workout_sessions!inner(user_id)", { count: "exact", head: true })
        .eq("workout_sessions.user_id", user.id);

      // Get total volume (weight * reps)
      const { data: setData } = await supabase
        .from("set_entries")
        .select("weight, reps, workout_sessions!inner(user_id)")
        .eq("workout_sessions.user_id", user.id)
        .not("weight", "is", null)
        .not("reps", "is", null);

      const totalVolume = setData?.reduce(
        (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
        0
      ) || 0;

      // Get personal records
      const { data: prs } = await supabase
        .from("personal_records")
        .select("*, exercises(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(5);

      // Get sets per zone (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: zoneSets } = await supabase
        .from("set_entries")
        .select(`
          zone_id,
          zones(key, name),
          workout_sessions!inner(user_id, date)
        `)
        .eq("workout_sessions.user_id", user.id)
        .eq("completed", true)
        .gte("workout_sessions.date", sevenDaysAgo.toISOString().split('T')[0]);

      const setsPerZone = zoneSets?.reduce((acc, set) => {
        if (set.zone_id && set.zones) {
          const key = set.zones.name;
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      // Calculate e1RM for recent sets (with zones)
      const { data: recentSets } = await supabase
        .from("set_entries")
        .select(`
          *,
          zones(name),
          workout_sessions!inner(user_id, date)
        `)
        .eq("workout_sessions.user_id", user.id)
        .not("weight", "is", null)
        .not("reps", "is", null)
        .not("zone_id", "is", null)
        .order("workout_sessions.date", { ascending: false })
        .limit(100);

      const e1rmData = recentSets?.map(set => {
        // Brzycki formula: weight * (36 / (37 - reps))
        const e1rm = set.reps && set.weight 
          ? set.weight * (36 / (37 - set.reps))
          : null;
        return {
          zone: set.zones?.name || 'Unknown',
          e1rm,
          date: set.workout_sessions?.date,
        };
      }).filter(d => d.e1rm !== null);

      return {
        totalWorkouts,
        totalSets,
        totalVolume: Math.round(totalVolume),
        personalRecords: prs,
        e1rmData,
        setsPerZone,
      };
    },
    enabled: !!user?.id,
  });

  const deleteAllPRsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("personal_records")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress_stats"] });
      toast({ title: "Alle persönlichen Rekorde gelöscht" });
    },
  });

  if (!stats) {
    return <div className="text-center py-8">Lädt...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Fortschritt & Statistiken</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Sätze</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSets || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Volumen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalVolume.toLocaleString()} kg
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Persönliche Bestleistungen (PRs)
            </CardTitle>
            {stats.personalRecords && stats.personalRecords.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alle PRs löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Dies wird alle persönlichen Rekorde permanent löschen. Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAllPRsMutation.mutate()}>
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stats.personalRecords && stats.personalRecords.length > 0 ? (
            <div className="space-y-3">
              {stats.personalRecords.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{pr.exercises?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(pr.date).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-base">
                      {pr.value} kg
                    </Badge>
                    {pr.reps && <div className="text-xs text-muted-foreground mt-1">
                      {pr.reps} Wdh.
                    </div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Noch keine PRs eingetragen. PRs werden automatisch erkannt, wenn du neue Bestleistungen erreichst!
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sätze pro Zone (letzte 7 Tage)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.setsPerZone && Object.keys(stats.setsPerZone).length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {Object.entries(stats.setsPerZone)
                  .sort((a, b) => b[1] - a[1])
                  .map(([zone, sets]) => (
                    <div
                      key={zone}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="font-medium text-sm">{zone}</span>
                      <Badge variant="secondary">{sets} Sätze</Badge>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Keine Trainingsdaten in den letzten 7 Tagen
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geschätzte 1RM (e1RM) - Top Zonen</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.e1rmData && stats.e1rmData.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(
                stats.e1rmData.reduce((acc, item) => {
                  if (!item.zone) return acc;
                  if (!acc[item.zone] || (item.e1rm && item.e1rm > acc[item.zone])) {
                    acc[item.zone] = item.e1rm;
                  }
                  return acc;
                }, {} as Record<string, number | null>)
              )
                .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                .slice(0, 10)
                .map(([zone, e1rm]) => (
                  <div
                    key={zone}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{zone}</span>
                    <Badge variant="outline">
                      ~{Math.round(e1rm || 0)} kg (1RM)
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Führe Sätze mit Gewicht und Wiederholungen aus, um deine geschätzten 1RM-Werte zu sehen.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>e1RM (Estimated 1 Rep Max):</strong> Geschätztes Maximum für eine Wiederholung, berechnet mit der Brzycki-Formel basierend auf deinen ausgeführten Sätzen.</p>
            <p><strong>PR Auto-Detection:</strong> Das System erkennt automatisch neue persönliche Bestleistungen und speichert diese.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
