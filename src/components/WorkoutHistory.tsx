import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Clock, Dumbbell, RotateCcw } from "lucide-react";
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

export default function WorkoutHistory() {
  const queryClient = useQueryClient();
  
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["workout_sessions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workout_sessions")
        .select(`
          *,
          set_entries (
            *,
            exercises (name)
          )
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const deleteAllSessionsMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("workout_sessions")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout_sessions"] });
      toast({ title: "Gesamter Workout-Verlauf gelöscht" });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Lädt...</div>;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Noch keine Workouts</h3>
          <p className="text-muted-foreground">
            Starte dein erstes Workout im "Workout"-Tab!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workout-Verlauf</h2>
        {sessions && sessions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Verlauf löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Gesamten Verlauf löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dies wird alle {sessions.length} Workout-Sessions und alle zugehörigen Sätze permanent löschen. 
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteAllSessionsMutation.mutate()}>
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <Accordion type="single" collapsible className="space-y-4">
        {sessions.map((session) => {
          const exerciseGroups = session.set_entries.reduce((acc, set) => {
            const exerciseName = set.exercises?.name || "Unbekannt";
            if (!acc[exerciseName]) {
              acc[exerciseName] = [];
            }
            acc[exerciseName].push(set);
            return acc;
          }, {} as Record<string, any[]>);

          const totalSets = session.set_entries.length;
          const duration = session.end_time
            ? Math.round(
                (new Date(session.end_time).getTime() -
                  new Date(session.start_time).getTime()) /
                  60000
              )
            : null;

          return (
            <AccordionItem key={session.id} value={session.id}>
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <div className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.date).toLocaleDateString("de-DE", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.start_time).toLocaleTimeString("de-DE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {duration && <span>{duration} Min.</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {Object.keys(exerciseGroups).length} Übungen
                      </Badge>
                      <Badge variant="outline">{totalSets} Sätze</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-4">
                    {Object.entries(exerciseGroups).map(([exerciseName, sets]) => (
                      <div key={exerciseName} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center justify-between">
                          {exerciseName}
                          <Badge variant="secondary">{sets.length} Sätze</Badge>
                        </h4>
                        <div className="space-y-2">
                          {sets.map((set, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                            >
                              <span className="font-medium">Satz {set.set_number}</span>
                              <div className="flex gap-4 text-muted-foreground">
                                {set.weight && <span>{set.weight} kg</span>}
                                {set.reps && <span>{set.reps} Wdh.</span>}
                                {set.rpe && <span>RPE {set.rpe}</span>}
                                {set.rir !== null && <span>RIR {set.rir}</span>}
                                {set.tempo && <span>{set.tempo}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {session.notes && (
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-semibold mb-2">Notizen</h4>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
