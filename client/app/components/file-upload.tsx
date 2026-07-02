"use client";
import * as React from "react";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

const FileUploadComponent: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFileUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setUploading(true);
    setUploaded(false);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });
      setUploaded(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setUploaded(false);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploaded && fileName) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-xs rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-6 text-center backdrop-blur-sm transition-all duration-300">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="mb-1 text-base font-medium text-white">Document Ready</h3>
          <p className="mb-1 truncate text-sm text-zinc-400">{fileName}</p>
          <p className="mb-4 text-xs text-zinc-500">Uploaded successfully</p>
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-700/50 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
          >
            Upload another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & drop zone */}
      <div
        onClick={handleFileUploadButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`group relative w-72 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragOver
            ? "border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/10"
            : "border-zinc-700/50 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60"
        }`}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:from-violet-500/5 group-hover:to-purple-500/5 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-200 ${
              dragOver
                ? "scale-110 bg-violet-500/20"
                : "bg-zinc-800 group-hover:bg-zinc-700/80"
            }`}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            ) : (
              <Upload
                className={`h-6 w-6 transition-all duration-200 ${
                  dragOver
                    ? "translate-y-[-2px] text-violet-300"
                    : "text-zinc-400 group-hover:text-violet-400"
                }`}
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {uploading ? "Uploading..." : dragOver ? "Drop your PDF here" : "Upload PDF File"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {uploading ? (
                <span className="flex items-center justify-center gap-1">
                  <span>Processing</span>
                  <span className="flex items-center gap-0.5">
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '150ms' }} />
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '300ms' }} />
                  </span>
                </span>
              ) : fileName ? (
                fileName
              ) : (
                "Click to browse or drag & drop"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* File type hint */}
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <FileText className="h-3.5 w-3.5" />
        <span>PDF files only &middot; Max file size depends on server</span>
      </div>
    </div>
  );
};

export default FileUploadComponent;
