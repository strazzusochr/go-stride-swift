import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const NutritionPlanner = () => {
  const [weight, setWeight] = useState<number>(80);
  const [bodyFat, setBodyFat] = useState<number>(15);
  const [goal, setGoal] = useState<"bulk" | "cut" | "maintain">("bulk");
  const [showResults, setShowResults] = useState(false);

  const calculateMacros = () => {
    setShowResults(true);
    toast.success("Makros berechnet!");
  };

  const leanMass = weight * (1 - bodyFat / 100);
  const protein = Math.round(leanMass * 2.2);
  const multiplier = goal === "bulk" ? 1.15 : goal === "cut" ? 0.85 : 1.0;
  const calories = Math.round(weight * 35 * multiplier);
  const fat = Math.round(weight * 1);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-2xl font-bold">Ernährung</h2>

      {/* Macro Calculator */}
      <Card className="p-5 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Makro-Rechner</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="weight">Körpergewicht (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bodyfat">Körperfett %</Label>
            <Input
              id="bodyfat"
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Ziel</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                variant={goal === "bulk" ? "default" : "outline"}
                onClick={() => setGoal("bulk")}
                className={goal === "bulk" ? "glow-neon" : ""}
              >
                Aufbau
              </Button>
              <Button
                variant={goal === "maintain" ? "default" : "outline"}
                onClick={() => setGoal("maintain")}
              >
                Halten
              </Button>
              <Button
                variant={goal === "cut" ? "default" : "outline"}
                onClick={() => setGoal("cut")}
              >
                Diät
              </Button>
            </div>
          </div>

          <Button onClick={calculateMacros} className="w-full glow-neon">
            Makros berechnen
          </Button>
        </div>
      </Card>

      {/* Results */}
      {showResults && (
        <Card className="p-5 bg-gradient-metal border-accent/20">
          <h3 className="font-bold text-lg mb-4 text-neon">Deine täglichen Ziele</h3>

          <div className="space-y-3">
            <MacroRow label="Kalorien" value={`${calories} kcal`} color="primary" />
            <MacroRow label="Protein" value={`${protein}g`} color="primary" />
            <MacroRow label="Kohlenhydrate" value={`${carbs}g`} color="primary" />
            <MacroRow label="Fett" value={`${fat}g`} color="primary" />
          </div>

          <div className="mt-4 p-3 bg-secondary/30 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Dies sind Basisempfehlungen. Passe sie basierend auf deiner Trainingsintensität und Ergebnissen an.
            </p>
          </div>
        </Card>
      )}

      {/* Meal Ideas */}
      <Card className="p-5 bg-card">
        <h3 className="font-bold text-lg mb-4">Beispielmahlzeiten</h3>
        <div className="space-y-3">
          <MealCard
            title="Frühstück"
            items={["6 Eier", "100g Haferflocken", "1 Banane", "Proteinshake"]}
            macros="P: 60g | K: 80g | F: 25g"
          />
          <MealCard
            title="Mittagessen"
            items={["200g Hähnchenbrust", "200g Reis", "Gemüse", "Olivenöl"]}
            macros="P: 50g | K: 75g | F: 15g"
          />
          <MealCard
            title="Abendessen"
            items={["250g mageres Rindfleisch", "Süßkartoffel", "Brokkoli", "Avocado"]}
            macros="P: 55g | K: 60g | F: 30g"
          />
        </div>
      </Card>
    </div>
  );
};

const MacroRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
    <span className="font-semibold">{label}</span>
    <span className={`text-lg font-bold text-${color}`}>{value}</span>
  </div>
);

const MealCard = ({
  title,
  items,
  macros,
}: {
  title: string;
  items: string[];
  macros: string;
}) => (
  <div className="p-4 bg-secondary/30 rounded-lg">
    <h4 className="font-bold mb-2">{title}</h4>
    <ul className="text-sm text-muted-foreground space-y-1 mb-2">
      {items.map((item, i) => (
        <li key={i}>• {item}</li>
      ))}
    </ul>
    <p className="text-xs font-mono text-primary">{macros}</p>
  </div>
);

export default NutritionPlanner;
