import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintLayout } from "@/components/blueprint/BlueprintLayout";
import { useBlueprintSession } from "@/hooks/useBlueprintSession";
import { ArrowRight, Pencil, Eraser, Square, Type, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = "pen" | "eraser" | "rectangle" | "text";

export default function BlueprintDiscovery() {
  const navigate = useNavigate();
  const { session, updateSession, hasActiveSession, setCurrentPage } = useBlueprintSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [notes, setNotes] = useState(session.canvasNotes || "");
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!hasActiveSession) {
      navigate("/blueprint");
    } else {
      setCurrentPage(6);
    }
  }, [hasActiveSession, navigate, setCurrentPage]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial styles
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0A1628";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setLastPos(coords);
    setIsDrawing(true);
  };

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coords = getCanvasCoords(e);

    if (currentTool === "pen") {
      ctx.strokeStyle = "#0A1628";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (currentTool === "eraser") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    setLastPos(coords);
  }, [isDrawing, currentTool, lastPos]);

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleContinue = () => {
    // Save canvas as image
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL("image/png");
      updateSession({ 
        canvasImageUrl: imageData,
        canvasNotes: notes 
      });
    }
    navigate("/blueprint/presentation");
  };

  const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
    { id: "pen", icon: Pencil, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "rectangle", icon: Square, label: "Shape" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <BlueprintLayout
      title="Discovery Canvas"
      subtitle="Map out the system architecture and flow"
      currentPage={6}
      backPath="/blueprint/qualification"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 p-2 bg-background border rounded-lg">
        <div className="flex gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTool(tool.id)}
              className={cn(
                "flex items-center gap-1",
                tool.id === "rectangle" || tool.id === "text" ? "opacity-50 cursor-not-allowed" : ""
              )}
              disabled={tool.id === "rectangle" || tool.id === "text"}
            >
              <tool.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Canvas */}
      <Card className="mb-6">
        <CardContent className="p-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-[400px] cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Discovery Notes</h3>
          <Textarea
            placeholder="Document key insights, requirements, and technical considerations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {notes.length}/2000
          </p>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button onClick={handleContinue} className="w-full" size="lg">
        Continue to Presentation
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Tip */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Tip:</strong> Use the canvas to visually map out their business flow, 
          pain points, and where your solution fits in. Visual diagrams increase understanding and close rates.
        </p>
      </div>
    </BlueprintLayout>
  );
}
