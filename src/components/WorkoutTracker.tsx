import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

const EXERCISE_LIBRARY = [
  "Barbell Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-ups",
  "Dumbbell Curl",
  "Tricep Dips",
  "Leg Press",
  "Romanian Deadlift",
];

const WorkoutTracker = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseSelect, setShowExerciseSelect] = useState(false);

  const addExercise = (name: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
      sets: [{ id: Date.now().toString(), reps: 0, weight: 0, completed: false }],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseSelect(false);
    toast.success(`Added ${name}`);
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [...ex.sets, { id: Date.now().toString(), reps: 0, weight: 0, completed: false }],
            }
          : ex
      )
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: "reps" | "weight", value: number) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set)),
            }
          : ex
      )
    );
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : ex
      )
    );
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
    toast.success("Exercise removed");
  };

  const finishWorkout = () => {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );
    toast.success(`Workout complete! ${completedSets}/${totalSets} sets finished`);
  };

  return (
    <div className="pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workout</h2>
        <Button onClick={() => setShowExerciseSelect(!showExerciseSelect)} size="sm" className="glow-neon">
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {showExerciseSelect && (
        <Card className="p-4 bg-secondary border-accent/20">
          <h3 className="font-bold mb-3 text-sm text-muted-foreground">Select Exercise</h3>
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_LIBRARY.map((exercise) => (
              <Button
                key={exercise}
                variant="secondary"
                size="sm"
                onClick={() => addExercise(exercise)}
                className="text-xs"
              >
                {exercise}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {exercises.length === 0 ? (
        <Card className="p-12 text-center bg-card/50">
          <p className="text-muted-foreground">No exercises yet. Add one to start!</p>
        </Card>
      ) : (
        <>
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="p-4 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{exercise.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExercise(exercise.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {exercise.sets.map((set, index) => (
                  <div key={set.id} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8 text-muted-foreground">#{index + 1}</span>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSet(exercise.id, set.id, "reps", parseInt(e.target.value) || 0)
                      }
                      className="w-20 text-center"
                    />
                    <span className="text-muted-foreground">×</span>
                    <Input
                      type="number"
                      placeholder="kg"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSet(exercise.id, set.id, "weight", parseInt(e.target.value) || 0)
                      }
                      className="w-24 text-center"
                    />
                    <Button
                      size="sm"
                      variant={set.completed ? "default" : "outline"}
                      onClick={() => toggleSetComplete(exercise.id, set.id)}
                      className={set.completed ? "glow-neon" : ""}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => addSet(exercise.id)}
                className="w-full mt-3 text-primary"
              >
                + Add Set
              </Button>
            </Card>
          ))}

          <Button onClick={finishWorkout} className="w-full glow-neon" size="lg">
            Finish Workout
          </Button>
        </>
      )}
    </div>
  );
};

export default WorkoutTracker;
