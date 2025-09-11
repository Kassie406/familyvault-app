import { useState, useRef } from "react";
import { Upload, Zap, Copy, Edit } from "lucide-react";
import "./App.css";

const Button = ({ children, onClick, variant="default", size="default", className="", ...p }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    link: "underline-offset-4 hover:underline text-blue-600",
    ghost: "hover:bg-gray-100"
  };
  const sizes = { default:"h-10 py-2 px-4", sm:"h-8 px-3 text-sm" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...p}>{children}</button>;
};

const Card = ({ children, className="" }) => <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>;

function App() {
  const [uploaded, setUploaded] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("auto"); // auto | id | forms | tables
  const fileRef = useRef(null);

  async function analyzeDocument(file, mode = "auto") {
    // convert to base64
    const fileContent = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result.split(",")[1]);
      r.readAsDataURL(file);
    });

    const r = await fetch("/api/inbox/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, fileContent, mode })
    });

    if (!r.ok) throw new Error("Analysis failed");
    return r.json();
  }

  async function handleUpload(files) {
    const file = files?.[0];
    if (!file) return;
    const row = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      thumb: URL.createObjectURL(file),
      isAnalyzing: true,
      analysis: null
    };
    setUploaded((s) => [row, ...s]);

    try {
      const analysis = await analyzeDocument(file, mode);
      setUploaded((s) => s.map((x) => x.id === row.id ? ({ ...x, isAnalyzing:false, analysis }) : x));
    } catch (e) {
      setUploaded((s) => s.map((x) => x.id === row.id ? ({ ...x, isAnalyzing:false, analysis:{ error:"Analysis failed" } }) : x));
    }
  }

  const open = (f) => { setSelected(f); setShow(true); };
  const copyAll = () => {
    if (!selected?.analysis?.extractedFields) return;
    const txt = Object.entries(selected.analysis.extractedFields).map(([k,v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(txt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Trustworthy.</h1>
        <div className="flex items-center gap-4">
          <input placeholder="Search" className="px-3 py-2 border rounded-md text-sm"/>
          <span className="text-sm text-gray-600">Help</span>
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-medium">KC</div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Inbox */}
        <aside className="w-80 bg-white border-r h-screen overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Inbox ✨</h2>
            {/* Analyze mode */}
            <select className="text-sm border rounded px-2 py-1"
              value={mode}
              onChange={(e)=>setMode(e.target.value)}
              title="Choose analysis mode"
            >
              <option value="auto">Auto</option>
              <option value="id">ID (AnalyzeID)</option>
              <option value="forms">Forms (FORMS)</option>
              <option value="tables">Tables (TABLES)</option>
            </select>
          </div>

          <div className="border-2 border-dashed rounded-lg p-6 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer"
               onClick={()=>fileRef.current?.click()}
               onDrop={(e)=>{e.preventDefault(); handleUpload(e.dataTransfer.files);}}
               onDragOver={(e)=>e.preventDefault()}>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
            <p className="text-sm text-gray-600 mb-2">Drop files here or</p>
            <span className="text-blue-600 text-sm font-medium">Browse files</span>
            <input ref={fileRef} type="file" onChange={(e)=>handleUpload(e.target.files)} className="hidden" accept="image/*,.pdf"/>
          </div>

          <div className="space-y-3">
            {uploaded.map((f)=>(
              <Card key={f.id} className="p-3">
                <div className="flex items-start gap-3">
                  <img src={f.thumb} alt={f.name} className="w-16 h-16 object-cover rounded border"/>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{f.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{(f.size/1024).toFixed(1)} KB</p>
                    {f.isAnalyzing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-blue-600">Analyzing…</span>
                      </div>
                    ) : f.analysis && !f.analysis.error ? (
                      <div className="mt-2 space-y-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={()=>open(f)}>
                          <Zap className="w-3 h-3 mr-1"/>Details {f.analysis.detailsCount ?? Object.keys(f.analysis.extractedFields||{}).length}
                        </Button>
                        {f.analysis.suggestedDestinations?.map((d,i)=>(
                          <div key={i} className="text-xs">
                            <span className="text-purple-600">Suggested destination</span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-medium">{d.name}</span>
                              <Button size="sm" variant="link" className="h-auto p-0 text-xs text-blue-600">Open</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-red-600">Analysis failed</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">camacho Family</h1>
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">KC</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">AQ</span>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-lg p-12 text-center mb-8 hover:border-blue-400 transition-colors cursor-pointer"
                 onClick={()=>fileRef.current?.click()}
                 onDrop={(e)=>{e.preventDefault(); handleUpload(e.dataTransfer.files);}}
                 onDragOver={(e)=>e.preventDefault()}>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
              <span className="text-blue-600 text-lg font-medium">Browse</span>
              <span className="text-gray-600 text-lg"> or drop files</span>
            </div>
          </div>
        </main>
      </div>

      {/* Details modal (simple custom) */}
      {show && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={()=>setShow(false)}></div>
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{selected.name}</h2>
              <Button variant="ghost" size="sm" onClick={()=>setShow(false)}>✕</Button>
            </div>
            <div className="p-6 space-y-4">
              {selected.analysis?.suggestedFilename && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">Suggested filename</p>
                      <p className="font-medium">{selected.analysis.suggestedFilename}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Dismiss</Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {Object.entries(selected.analysis?.extractedFields || {}).map(([k, v])=>(
                  <div key={k} className="border-b pb-3">
                    <p className="text-sm text-gray-600 mb-1">{k}</p>
                    <p className="font-medium text-lg">{v}</p>
                  </div>
                ))}
              </div>

              {selected.analysis?.engine && (
                <div className="text-xs text-gray-500 mt-4">
                  Analyzed with {selected.analysis.engine}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={copyAll} size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-2"/>Copy All
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-2"/>Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;