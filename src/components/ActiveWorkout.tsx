import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Play, Plus, Save, X, Dumbbell, Clock } from "lucide-react";
import ExercisePicker from "./ExercisePicker";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WorkoutSet {
  id: string;
  set_number: number;
  weight: number | null;
  reps: number | null;
  rir: number | null;
  completed: boolean;
}

interface WorkoutExercise {
  zoneId: string;
  zoneName: string;
  zoneKey: string;
  targetSets: number;
  sets: WorkoutSet[];
}

export default function ActiveWorkout() {
  const { user } = useAuth();
  const [workoutActive, setWorkoutActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startWorkout = async () => {
    try {
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user?.id,
          date: new Date().toISOString().split("T")[0],
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setWorkoutActive(true);
      setStartTime(new Date());
      toast({ title: "Workout gestartet!" });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addExercises = (selectedExercises: any[]) => {
    const newExercises: WorkoutExercise[] = selectedExercises.map((ex) => ({
      zoneId: ex.zoneId,
      zoneName: ex.zoneName,
      zoneKey: ex.zoneKey,
      targetSets: ex.sets,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        id: `temp-${ex.zoneId}-${i}`,
        set_number: i + 1,
        weight: null,
        reps: null,
        rir: null,
        completed: false,
      })),
    }));

    setExercises([...exercises, ...newExercises]);
    setShowPicker(false);
    toast({
      title: "Übungen hinzugefügt",
      description: `${selectedExercises.length} Übungen mit insgesamt ${selectedExercises.reduce((sum, ex) => sum + ex.sets, 0)} Sätzen`,
    });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setExercises(newExercises);
  };

  const completeSet = async (exerciseIndex: number, setIndex: number) => {
    const exercise = exercises[exerciseIndex];
    const set = exercise.sets[setIndex];

    if (!set.weight || !set.reps) {
      toast({
        title: "Fehlende Daten",
        description: "Bitte Gewicht und Wiederholungen eingeben",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("set_entries").insert([{
        session_id: sessionId!,
        zone_id: exercise.zoneId,
        set_number: set.set_number,
        weight: set.weight,
        reps: set.reps,
        rir: set.rir || 0,
        completed: true,
      }]);

      if (error) throw error;

      updateSet(exerciseIndex, setIndex, "completed", true);
      toast({ title: "Satz gespeichert!" });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const finishWorkout = async () => {
    try {
      const { error } = await supabase
        .from("workout_sessions")
        .update({
          end_time: new Date().toISOString(),
          notes: notes,
        })
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Workout beendet!",
        description: `Dauer: ${formatDuration(duration)}`,
      });

      setWorkoutActive(false);
      setSessionId(null);
      setExercises([]);
      setStartTime(null);
      setDuration(0);
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  const completedSets = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  if (!workoutActive) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Kein aktives Workout</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Starte ein neues Workout und füge Übungen hinzu
            </p>
          </div>
          <Button onClick={startWorkout} size="lg" className="w-full max-w-md">
            <Play className="mr-2 h-4 w-4" />
            Workout starten
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <Card className="bg-primary/5 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Aktives Workout</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-base">
              {completedSets} / {totalSets} Sätze
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Button onClick={() => setShowPicker(true)} className="w-full" size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Übungen hinzufügen
      </Button>

      {exercises.map((exercise, exerciseIdx) => (
        <Card key={`${exercise.zoneId}-${exerciseIdx}`}>
          <CardHeader>
            <CardTitle className="text-lg">{exercise.zoneName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exercise.sets.map((set, setIdx) => (
              <div
                key={set.id}
                className={`p-4 border rounded-lg ${
                  set.completed ? "bg-primary/5 border-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={set.completed ? "default" : "outline"}>
                    Satz {set.set_number}
                  </Badge>
                  {set.completed && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      ✓ Fertig
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Gewicht (kg)</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSet(exerciseIdx, setIdx, "weight", parseFloat(e.target.value))
                      }
                      disabled={set.completed}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Wdh.</label>
                    <Input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSet(exerciseIdx, setIdx, "reps", parseInt(e.target.value))
                      }
                      disabled={set.completed}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">RIR</label>
                    <Input
                      type="number"
                      value={set.rir || ""}
                      onChange={(e) =>
                        updateSet(exerciseIdx, setIdx, "rir", parseInt(e.target.value))
                      }
                      disabled={set.completed}
                    />
                  </div>
                </div>

                {!set.completed && (
                  <Button
                    onClick={() => completeSet(exerciseIdx, setIdx)}
                    className="w-full"
                    size="sm"
                  >
                    Satz abschließen
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Wie war das Workout? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {exercises.length > 0 && (
        <Button onClick={finishWorkout} className="w-full" size="lg" variant="default">
          <Save className="mr-2 h-4 w-4" />
          Workout beenden
        </Button>
      )}

      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <ExercisePicker onConfirm={addExercises} onCancel={() => setShowPicker(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
