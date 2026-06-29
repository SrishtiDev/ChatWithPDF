'use client';
import * as React from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

const FileUploadComponent: React.FC = () => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const pdfFiles = files.filter((f) => f.type === 'application/pdf');
        if (pdfFiles.length > 0) {
            setIsUploading(true);
            setTimeout(() => setIsUploading(false), 2000);
        }
    };

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const pdfFiles = files.filter((f) => f.type === 'application/pdf');
        if (pdfFiles.length > 0) {
            setIsUploading(true);
            setTimeout(() => setIsUploading(false), 2000);
        }
        // Reset so the same file can be selected again
        e.target.value = '';
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-violet-500/25 mb-4">
                    <FileText className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    PDF RAG
                </h2>
                <p className="text-sm text-zinc-400 mt-1.5">
                    Upload documents to start querying
                </p>
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFilesSelected}
                className="hidden"
                aria-hidden="true"
            />

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label="Upload PDF file"
                className={`
                    relative overflow-hidden rounded-2xl border-2 border-dashed
                    transition-all duration-300 ease-out cursor-pointer
                    outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]
                    ${
                        isDragging
                            ? 'border-violet-400 bg-violet-500/10 scale-[1.02]'
                            : isHovered
                              ? 'border-violet-500/60 bg-white/[0.04]'
                              : 'border-zinc-700 hover:border-zinc-600 bg-white/[0.02]'
                    }
                `}
            >
                {/* Gradient glow on drag */}
                <div
                    className={`
                        absolute inset-0 bg-gradient-to-br from-violet-600/0 via-purple-600/0 to-fuchsia-600/0
                        transition-all duration-500
                        ${isDragging ? 'from-violet-600/10 via-purple-600/5 to-fuchsia-600/10' : ''}
                    `}
                />

                <div className="relative px-8 py-14 flex flex-col items-center gap-5">
                    {/* Animated icon container */}
                    <div
                        className={`
                            relative flex items-center justify-center w-16 h-16 rounded-xl
                            transition-all duration-300
                            ${
                                isDragging
                                    ? 'bg-violet-500/20 scale-110'
                                    : isHovered
                                      ? 'bg-violet-500/10'
                                      : 'bg-zinc-800'
                            }
                        `}
                    >
                        {isUploading ? (
                            <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
                        ) : (
                            <Upload
                                className={`
                                    w-7 h-7 transition-all duration-300
                                    ${
                                        isDragging
                                            ? 'text-violet-300 -translate-y-1'
                                            : isHovered
                                              ? 'text-violet-400'
                                              : 'text-zinc-400'
                                    }
                                `}
                            />
                        )}

                        {/* Ripple effect on drag */}
                        {isDragging && (
                            <>
                                <span className="absolute inset-0 rounded-xl animate-ping bg-violet-400/20" />
                                <span className="absolute inset-0 rounded-xl animate-pulse bg-violet-400/10" />
                            </>
                        )}
                    </div>

                    {/* Text content */}
                    <div className="text-center space-y-2">
                        {isUploading ? (
                            <p className="text-violet-300 font-medium text-sm">
                                Uploading your PDF...
                            </p>
                        ) : (
                            <>
                                <p className="text-white font-medium text-sm">
                                    {isDragging
                                        ? 'Drop your PDF here'
                                        : 'Drop your PDF here, or'}
                                </p>
                                <span
                                    className={`
                                        inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                                        transition-all duration-200
                                        ${
                                            isDragging
                                                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                                : 'bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200'
                                        }
                                    `}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Browse Files
                                </span>
                            </>
                        )}
                    </div>

                    {/* Upload progress bar */}
                    {isUploading && (
                        <div className="w-full max-w-[200px] h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-progress" />
                        </div>
                    )}
                </div>
            </div>

            {/* File type hints */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                    <FileText className="w-3 h-3" />
                    <span>PDF only</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                    <span>Max 10MB</span>
                </div>
            </div>
        </div>
    );
};

export default FileUploadComponent;
