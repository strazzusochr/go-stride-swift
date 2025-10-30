import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Minus, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  key: string;
  name: string;
}

interface SelectedExercise {
  zoneId: string;
  zoneName: string;
  zoneKey: string;
  sets: number;
}

interface ExercisePickerProps {
  onConfirm: (exercises: SelectedExercise[]) => void;
  onCancel: () => void;
}

export default function ExercisePicker({ onConfirm, onCancel }: ExercisePickerProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Map<string, SelectedExercise>>(new Map());
  const [loading, setLoading] = useState(true);

  const MAX_SETS = 5;
  const DEFAULT_SETS = 3;

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      setZones(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExercise = (zone: Zone) => {
    const newSelected = new Map(selectedExercises);
    if (newSelected.has(zone.id)) {
      newSelected.delete(zone.id);
    } else {
      newSelected.set(zone.id, {
        zoneId: zone.id,
        zoneName: zone.name,
        zoneKey: zone.key,
        sets: DEFAULT_SETS,
      });
    }
    setSelectedExercises(newSelected);
  };

  const updateSets = (zoneId: string, delta: number) => {
    const newSelected = new Map(selectedExercises);
    const exercise = newSelected.get(zoneId);
    if (exercise) {
      const newSets = Math.max(1, Math.min(MAX_SETS, exercise.sets + delta));
      newSelected.set(zoneId, { ...exercise, sets: newSets });
      setSelectedExercises(newSelected);
    }
  };

  const handleConfirm = () => {
    if (selectedExercises.size === 0) {
      toast({
        title: "Keine Übungen ausgewählt",
        description: "Bitte wähle mindestens eine Übung aus.",
        variant: "destructive",
      });
      return;
    }
    onConfirm(Array.from(selectedExercises.values()));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Lade Übungen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Übungen hinzufügen</h2>
          <p className="text-sm text-muted-foreground">
            Wähle bis zu 30 Übungen und stelle die Satzanzahl ein (1-5 Sätze)
          </p>
        </div>
        <Badge variant="secondary" className="text-base">
          {selectedExercises.size} / 30
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Übungen durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {selectedExercises.size > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3">Ausgewählte Übungen</h3>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {Array.from(selectedExercises.values()).map((ex) => (
                <div
                  key={ex.zoneId}
                  className="flex items-center justify-between p-2 bg-background rounded-lg"
                >
                  <span className="text-sm font-medium">{ex.zoneName}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSets(ex.zoneId, -1)}
                      disabled={ex.sets <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary" className="w-12 justify-center">
                      {ex.sets}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSets(ex.zoneId, 1)}
                      disabled={ex.sets >= MAX_SETS}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredZones.map((zone) => {
            const isSelected = selectedExercises.has(zone.id);
            return (
              <Card
                key={zone.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => toggleExercise(zone)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isSelected} />
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">{zone.key}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary">
                      {selectedExercises.get(zone.id)?.sets} Sätze
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Abbrechen
        </Button>
        <Button onClick={handleConfirm} className="flex-1">
          <Check className="mr-2 h-4 w-4" />
          {selectedExercises.size} Übungen hinzufügen
        </Button>
      </div>
    </div>
  );
}
