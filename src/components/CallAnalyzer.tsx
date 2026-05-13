import { useState, useRef } from "react";
import { Mic2, Play, Square, Timer, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SentimentScore {
  positive: number;
  neutral: number;
  negative: number;
}

interface CallMetrics {
  talkRatio: number; // 0-100%
  avgPace: number; // words per minute
  fillerWords: number;
  sentiment: SentimentScore;
}

export const CallAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<CallMetrics | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setElapsed(0);
    setMetrics(null);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setMetrics({
        talkRatio: 65,
        avgPace: 142,
        fillerWords: 12,
        sentiment: { positive: 72, neutral: 20, negative: 8 },
      });
      setAnalyzing(false);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Mic2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Call Analyzer</h2>
          <p className="text-sm text-muted-foreground">Record and analyze your sales calls</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Button
                size="lg"
                className={`rounded-full w-20 h-20 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Square className="w-8 h-8" /> : <Mic2 className="w-8 h-8" />}
              </Button>
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(elapsed)}</span>
            </div>

            {isRecording && (
              <p className="text-sm text-muted-foreground animate-pulse">Recording in progress...</p>
            )}
            {analyzing && (
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing call...</p>
            )}
            {!isRecording && !analyzing && elapsed === 0 && (
              <p className="text-sm text-muted-foreground">Tap the microphone to start recording</p>
            )}
          </div>
        </CardContent>
      </Card>

      {metrics && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <CardTitle>Call Metrics</CardTitle>
              </div>
              <CardDescription>Summary of your call performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Talk Ratio (You vs Prospect)</span>
                  <span className="font-medium">{metrics.talkRatio}%</span>
                </div>
                <Progress value={metrics.talkRatio} />
                <p className="text-xs text-muted-foreground mt-1">
                  Aim for 60-70% prospect talk time
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Avg Pace</p>
                  <p className="text-lg font-semibold">{metrics.avgPace} WPM</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Filler Words</p>
                  <p className="text-lg font-semibold">{metrics.fillerWords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">Positive</span>
                    <span>{metrics.sentiment.positive}%</span>
                  </div>
                  <Progress value={metrics.sentiment.positive} className="bg-green-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-600">Neutral</span>
                    <span>{metrics.sentiment.neutral}%</span>
                  </div>
                  <Progress value={metrics.sentiment.neutral} className="bg-yellow-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-500">Negative</span>
                    <span>{metrics.sentiment.negative}%</span>
                  </div>
                  <Progress value={metrics.sentiment.negative} className="bg-red-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
