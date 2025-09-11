import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"

type Mode = "auto" | "id" | "forms"

export type AIResult = {
  mode: Mode
  documentType: string
  fields: { key: string; value: string; confidence: number; pii?: boolean }[]
  meta?: { api_used?: string; elapsed_ms?: number }
  warning?: string
}

export function UploadCenterAIActions({
  file,                                     // File | null (selected upload)
  onApply,                                  // (fields) => void   // push into your form
}: {
  file: File | null
  onApply: (fields: AIResult["fields"]) => void
}) {
  const [mode, setMode] = useState<Mode>("auto")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIResult | null>(null)

  async function runAnalysis() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    try {
      // POST to your backend with timeout
      const body = new FormData()
      body.append("file", file)
      body.append("mode", mode)

      const res = await fetch("/api/inbox/analyze", { 
        method: "POST", 
        body,
        signal: controller.signal 
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json() as { ok: boolean; result?: AIResult; error?: string }
      if (!json.ok || !json.result) throw new Error(json.error || "Unknown analysis error")
      setResult(json.result)
      setOpen(true)
    } catch (e: any) {
      clearTimeout(timeoutId)
      if (e.name === 'AbortError') {
        setError("Analysis timed out - please try again")
      } else {
        setError(e.message || "Failed to analyze document")
      }
    } finally {
      setLoading(false)
    }
  }

  const Status = () => {
    if (loading) return (
      <Badge variant="secondary" className="gap-1"><Loader2 className="h-3 w-3 animate-spin"/>Processing</Badge>
    )
    if (error) return (
      <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3"/>Error</Badge>
    )
    if (result) return (
      <Badge variant="outline" className="gap-1 text-green-700 border-green-300">
        <CheckCircle2 className="h-3 w-3"/>Ready
      </Badge>
    )
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={mode} onValueChange={(v: Mode) => setMode(v)}>
        <SelectTrigger className="w-[160px]" data-testid="select-analysis-mode">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto (Hybrid)</SelectItem>
          <SelectItem value="id">ID (AnalyzeID)</SelectItem>
          <SelectItem value="forms">Forms (Queries)</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={runAnalysis} disabled={!file || loading} className="gap-2" data-testid="button-analyze-ai">
        <Sparkles className="h-4 w-4" />
        Analyze with AI
      </Button>

      <Status />

      {/* Results drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>AI Analysis</DrawerTitle>
            <DrawerDescription>
              {result?.meta?.api_used ? `Using ${result.meta.api_used}` : "Structured extraction"}
              {result?.warning ? ` • ${result.warning}` : ""}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6">
            {result && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Mode: <span className="font-medium">{result.mode}</span> • Type: <span className="font-medium">{result.documentType}</span>
                </div>

                <ScrollArea className="h-[48vh] rounded border p-3 bg-background">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.fields.map((f, i) => (
                      <div key={i} className="rounded border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {f.key.replace(/_/g," ").toLowerCase().replace(/\b\w/g, c=>c.toUpperCase())}
                          </span>
                          <Badge variant="outline">
                            {Math.round(f.confidence)}%
                          </Badge>
                        </div>
                        <div className="text-sm font-mono break-words">{f.value || "—"}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-close-results">Close</Button>
                  <Button onClick={() => { onApply(result.fields); setOpen(false) }} data-testid="button-apply-results">
                    Apply to form
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}