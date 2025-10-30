import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface StopwatchProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function Stopwatch({ initialSeconds = 0, onComplete }: StopwatchProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(initialSeconds > 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  return (
    <div className="text-center space-y-4">
      <div className="text-5xl font-bold font-mono">{formatTime(seconds)}</div>
      <div className="flex justify-center gap-2">
        <Button onClick={toggleTimer} size="lg">
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button onClick={reset} variant="outline" size="lg">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
