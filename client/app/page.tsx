import { FileQuestion, Search, Zap, Sparkles } from 'lucide-react';
import FileUploadComponent from './components/file-upload';

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex bg-[#0a0a0f]">
      {/* Left panel — Upload */}
      <div className="w-[30vw] min-h-screen p-6 flex flex-col justify-center items-center border-r border-zinc-800/60 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <FileUploadComponent />
      </div>

      {/* Right panel — Preview / Empty state */}
      <div className="w-[70vw] min-h-screen flex flex-col relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-purple-500/20 to-transparent" />

        <div className="flex-1 flex flex-col items-center justify-center px-12">
          {/* Decorative icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shadow-2xl">
              <FileQuestion className="w-10 h-10 text-zinc-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-[10px] text-amber-400">?</span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
            No PDF Selected
          </h1>
          <p className="text-zinc-500 text-sm max-w-md text-center leading-relaxed mb-10">
            Upload a PDF document to start querying it with AI.
            Your documents are processed securely and never shared.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            {[
              { icon: Search, label: 'Semantic Search', desc: 'Ask questions in natural language' },
              { icon: Zap, label: 'Instant Answers', desc: 'Get accurate responses from your docs' },
              { icon: Sparkles, label: 'AI-Powered', desc: 'Powered by advanced RAG pipelines' },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-800/50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center mb-3 group-hover:from-violet-500/20 group-hover:to-purple-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white text-sm font-medium mb-1">{label}</h3>
                <p className="text-zinc-500 text-[11px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-8 py-4 border-t border-zinc-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span>System ready</span>
          </div>
          <span className="text-xs text-zinc-700">PDF RAG v1.0</span>
        </div>
      </div>
    </div>
  );
}
