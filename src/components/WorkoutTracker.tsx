import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Play, Square, Plus, Trash2, Timer } from "lucide-react";
import Stopwatch from "./Stopwatch";

interface WorkoutSet {
  id?: string;
  exercise_id: string;
  exercise_name: string;
  set_number: number;
  set_type: string;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
  rir: number | null;
  tempo: string | null;
  rest_planned_sec: number | null;
  rest_actual_sec: number | null;
  completed: boolean;
}

export default function WorkoutTracker() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [currentRestTimer, setCurrentRestTimer] = useState<number | null>(null);

  const { data: exercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split("T")[0],
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSessionId(data.id);
      toast({ title: "Workout gestartet!" });
    },
  });

  const endWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No active session");

      const { error } = await supabase
        .from("workout_sessions")
        .update({
          end_time: new Date().toISOString(),
          notes,
        })
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Workout beendet!" });
      setSessionId(null);
      setSets([]);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["workout_sessions"] });
    },
  });

  const saveSetMutation = useMutation({
    mutationFn: async (set: WorkoutSet) => {
      if (!sessionId) throw new Error("No active session");

      const insertData: any = {
        session_id: sessionId,
        exercise_id: set.exercise_id,
        set_number: set.set_number,
        set_type: set.set_type || "normal",
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
        rir: set.rir,
        tempo: set.tempo,
        rest_planned_sec: set.rest_planned_sec,
        rest_actual_sec: set.rest_actual_sec,
        completed: set.completed,
      };

      const { error } = await supabase.from("set_entries").insert(insertData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Satz gespeichert!" });
    },
  });

  const addExercise = () => {
    if (!selectedExerciseId) {
      toast({ title: "Fehler", description: "Bitte wähle eine Übung", variant: "destructive" });
      return;
    }

    const exercise = exercises?.find((e) => e.id === selectedExerciseId);
    if (!exercise) return;

    const newSet: WorkoutSet = {
      exercise_id: selectedExerciseId,
      exercise_name: exercise.name,
      set_number: sets.filter((s) => s.exercise_id === selectedExerciseId).length + 1,
      set_type: "normal",
      reps: null,
      weight: null,
      rpe: null,
      rir: null,
      tempo: null,
      rest_planned_sec: 120,
      rest_actual_sec: null,
      completed: false,
    };

    setSets([...sets, newSet]);
  };

  const updateSet = (index: number, updates: Partial<WorkoutSet>) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], ...updates };
    setSets(newSets);
  };

  const completeSet = async (index: number) => {
    const set = sets[index];
    updateSet(index, { completed: true });
    await saveSetMutation.mutateAsync({ ...set, completed: true });
    
    // Auto-start rest timer
    if (set.rest_planned_sec) {
      setCurrentRestTimer(set.rest_planned_sec);
    }
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const groupedSets = sets.reduce((acc, set) => {
    if (!acc[set.exercise_name]) {
      acc[set.exercise_name] = [];
    }
    acc[set.exercise_name].push(set);
    return acc;
  }, {} as Record<string, WorkoutSet[]>);

  if (!sessionId) {
    return (
      <div className="text-center py-12">
        <Play className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Bereit für dein Workout?</h2>
        <p className="text-muted-foreground mb-6">
          Starte ein neues Workout mit erweiterten Tracking-Features
        </p>
        <Button size="lg" onClick={() => startWorkoutMutation.mutate()}>
          <Play className="mr-2 h-5 w-5" />
          Workout starten
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Aktives Workout</h2>
          <p className="text-sm text-muted-foreground">
            Session gestartet um {new Date().toLocaleTimeString("de-DE")}
          </p>
        </div>
        <Button variant="destructive" onClick={() => endWorkoutMutation.mutate()}>
          <Square className="mr-2 h-4 w-4" />
          Beenden
        </Button>
      </div>

      {currentRestTimer && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="pt-6">
            <Stopwatch
              initialSeconds={currentRestTimer}
              onComplete={() => setCurrentRestTimer(null)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Übung hinzufügen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Übung wählen..." />
              </SelectTrigger>
              <SelectContent>
                {exercises?.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedSets).map(([exerciseName, exerciseSets]) => (
        <Card key={exerciseName}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {exerciseName}
              <Badge variant="secondary">{exerciseSets.length} Sätze</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exerciseSets.map((set, index) => {
              const globalIndex = sets.findIndex(
                (s) => s === set
              );
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg space-y-3 ${
                    set.completed ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Satz {set.set_number}</Badge>
                      <Select
                        value={set.set_type}
                        onValueChange={(value) =>
                          updateSet(globalIndex, { set_type: value })
                        }
                        disabled={set.completed}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="warmup">Warm-up</SelectItem>
                          <SelectItem value="dropset">Dropset</SelectItem>
                          <SelectItem value="amrap">AMRAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!set.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSet(globalIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Gewicht (kg)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={set.weight ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, {
                            weight: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                        disabled={set.completed}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Wdh.</Label>
                      <Input
                        type="number"
                        value={set.reps ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, {
                            reps: e.target.value ? parseInt(e.target.value) : null,
                          })
                        }
                        disabled={set.completed}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">RPE (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={set.rpe ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, {
                            rpe: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                        disabled={set.completed}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">RIR</Label>
                      <Input
                        type="number"
                        min="0"
                        value={set.rir ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, {
                            rir: e.target.value ? parseInt(e.target.value) : null,
                          })
                        }
                        disabled={set.completed}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Tempo (z.B. 3110)</Label>
                      <Input
                        value={set.tempo ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, { tempo: e.target.value })
                        }
                        placeholder="3110"
                        disabled={set.completed}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        <Timer className="inline h-3 w-3 mr-1" />
                        Pause (Sek.)
                      </Label>
                      <Input
                        type="number"
                        value={set.rest_planned_sec ?? ""}
                        onChange={(e) =>
                          updateSet(globalIndex, {
                            rest_planned_sec: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          })
                        }
                        disabled={set.completed}
                      />
                    </div>
                  </div>

                  {!set.completed && (
                    <Button
                      className="w-full"
                      onClick={() => completeSet(globalIndex)}
                    >
                      Satz abschließen
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Notizen</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Wie hast du dich gefühlt? Besonderheiten?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
