"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";
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
        message: "عذراً، نوع الملف غير مدعوم في النموذج التجريبي (يدعم PDF, DOCX, XLSX, CSV, TXT).",
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
        message: `تم اختيار الملف «${file.name}» وإضافته للمعاينة التجريبية بنجاح (محاكاة).`,
      });

      // إخفاء الرسالة بعد 4 ثوانٍ
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback({
        type: "error",
        message: "حدث خطأ غير متوقع أثناء المعاينة.",
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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. الترويسة والتنبيه الأمني */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            رفع مستند تجريبي جديد (محاكاة الواجهة)
          </h3>
          <p className="text-xs text-slate-500">
            اختر ملفاً من جهازك لتجربة ظهوره وحالات معالجته في الواجهة
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>المعاينة محلية • لا يُرفع الملف لأي خادم</span>
        </div>
      </div>

      {/* 2. منطقة السحب والإفلات */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
          isDragOver
            ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
            : "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {isUploading ? (
                "جاري محاكاة تسجيل الملف..."
              ) : (
                <>
                  اسحب الملف وأفلته هنا، أو{" "}
                  <span className="text-blue-600 underline">تصفح من جهازك</span>
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-400">
              الملفات المدعومة في النموذج: PDF, Word (DOCX), Excel (XLSX), CSV, TXT (الحد الأقصى التقديري 25 MB)
            </p>
          </div>
        </div>
      </div>

      {/* 3. رسالة النتيجة التفاعلية */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs leading-relaxed animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
