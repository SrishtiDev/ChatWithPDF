import FileUploadComponent from './components/file-upload';
import ChatComponent from './components/chat';

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex bg-[#0a0a0f]">
      {/* Left panel — Upload */}
      <div className="w-[30vw] min-h-screen flex flex-col border-r border-zinc-800/60 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        {/* Logo / Header */}
        <div className="flex items-center gap-2 px-6 pt-6 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <span className="text-sm font-medium text-white">PDF RAG</span>
        </div>

        {/* Upload section */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <FileUploadComponent />
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-4 border-t border-zinc-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span>System ready</span>
          </div>
          <span className="text-xs text-zinc-700">v1.0</span>
        </div>
      </div>

      {/* Right panel — Chat */}
      <div className="w-[70vw] min-h-screen flex flex-col relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-purple-500/20 to-transparent" />
        
        <ChatComponent />
      </div>
    </div>
  );
}
