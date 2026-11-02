"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Info, Loader2, Sparkles } from "lucide-react";
import { DocumentFileType } from "@/types/documents.types";

interface DocumentUploadAreaProps {
  onFileUpload: (fileData: { name: string; size: string; type: DocumentFileType }) => Promise<void>;
  isUploading: boolean;
}

export default function DocumentUploadArea({
  onFileUpload,
  isUploading,
}: DocumentUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocumentType = (fileName: string): DocumentFileType => {
    const ext = fileName.split(".").pop()?.toUpperCase() || "";
    if (ext === "PDF") return "PDF";
    if (ext === "DOCX" || ext === "DOC") return "DOCX";
    if (ext === "XLSX" || ext === "XLS") return "XLSX";
    if (ext === "CSV") return "CSV";
    return "TXT";
  };

  const processFile = async (file: File) => {
    const validExtensions = ["pdf", "docx", "doc", "xlsx", "xls", "csv", "txt"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(ext)) {
      setFeedback({
        type: "error",
        message: "نوع الملف غير مدعوم (الصيغ المقبولة: PDF, Word DOCX, Excel XLSX, CSV, TXT).",
      });
      return;
    }

    try {
      await onFileUpload({
        name: file.name,
        size: formatFileSize(file.size),
        type: getDocumentType(file.name),
      });

      setFeedback({
        type: "success",
        message: `تم رفع «${file.name}» وبدء التجزئة اللغوية والفهرسة في Vector Database بنجاح.`,
      });

      // إخفاء الرسالة بعد 4 ثوانٍ
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء رفع ومعالجة المستند.",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = ""; // إعادة تعيين الحقل
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. الترويسة والتنبيه الأمني */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>رفع مستند إلى قاعدة المعرفة (RAG Ingestion)</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            أضف ملفات السياسات، العقود، أو البيانات التقنية لتحليلها دلالياً والبحث فيها
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-semibold self-start sm:self-auto font-mono">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Chunking + OpenAI Embeddings Pipeline</span>
        </div>
      </div>

      {/* 2. منطقة السحب والإفلات مع التوهج التفاعلي الفاخر */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-7 sm:p-10 text-center transition-all duration-300 cursor-pointer select-none group ${
          isDragOver
            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_35px_rgba(59,130,246,0.35)] scale-[0.99] ring-4 ring-blue-500/20"
            : "border-slate-200 dark:border-white/10 hover:border-blue-500/50 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04]"
        }`}
      >
        {/* خلفية الإضاءة عند التحويم / السحب */}
        <div
          className={`absolute inset-0 bg-radial from-blue-500/15 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
            isDragOver ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="relative z-10 max-w-md mx-auto space-y-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
              isDragOver
                ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/40"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {isUploading ? (
                "جاري تقسيم المستند وتوليد الفهارس الشعاعية..."
              ) : isDragOver ? (
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  أفلت الملف هنا لبدء الفهرسة الفورية 🚀
                </span>
              ) : (
                <>
                  اسحب الملف وأفلته هنا، أو{" "}
                  <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-500/40 underline-offset-4">تصفح من جهازك</span>
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              الصيغ المدعومة: PDF, Word (DOCX), Excel (XLSX), CSV, TXT (الحد الأقصى التقديري 25 MB)
            </p>
          </div>
        </div>
      </div>

      {/* 3. رسالة النتيجة التفاعلية */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs leading-relaxed animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
