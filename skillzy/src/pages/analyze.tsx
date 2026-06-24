import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  CloudUpload,
  FileText,
  X,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const TNR = "'Times New Roman', Times, serif";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  jobDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ANALYSIS_STEPS = [
  "Extracting resume content...",
  "Parsing skills and experience...",
  "Matching keywords...",
  "Calculating ATS compatibility score...",
  "Generating recommendations...",
];

export default function Analyze() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobTitle: "", jobDescription: "" },
  });

  function validateAndSetFile(f: File) {
    setFileError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError("Only PDF and DOCX files are supported.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError("File exceeds the 10 MB limit.");
      return;
    }
    setFile(f);
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
    e.target.value = "";
  }

  function removeFile() {
    setFile(null);
    setFileError(null);
  }

  async function onSubmit(values: FormValues) {
    if (!file) return;

    setIsAnalyzing(true);
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((p) => {
        if (p >= ANALYSIS_STEPS.length - 1) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 900);

    const token = localStorage.getItem("skillzy_token");
    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("jobTitle", values.jobTitle);
    if (values.jobDescription) formData.append("jobDescription", values.jobDescription);

    try {
      const res = await fetch("/api/resume/analyze-upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error || "Analysis failed");
      }

      const data = await res.json();
      setProgressStep(ANALYSIS_STEPS.length - 1);
      setTimeout(() => setLocation(`/analysis/${data.id}`), 400);
    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Could not complete analysis. Please try again.",
      });
    }
  }

  // Full-screen analyzing overlay
  if (isAnalyzing) {
    return (
      <Layout title="Analyzing Resume">
        <div className="max-w-2xl mx-auto" style={{ fontFamily: TNR }}>
          <div
            className="rounded-lg border p-12 flex flex-col items-center justify-center text-center space-y-8"
            style={{
              backgroundColor: "#111111",
              borderColor: "#333333",
            }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-10"
                style={{ backgroundColor: "#ffffff" }}
              />
              <div
                className="relative h-20 w-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                <img src="/skillzy-logo.png" alt="Skillzy" className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: TNR }}>
                Analyzing Your Resume
              </h2>
              <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Our ATS engine is scanning your resume
              </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              {ANALYSIS_STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="flex-shrink-0">
                    {i < progressStep ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : i === progressStep ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-white/20" />
                    )}
                  </div>
                  <span
                    style={{
                      color: i <= progressStep ? "#ffffff" : "#6B7280",
                      fontFamily: TNR,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="w-full max-w-sm h-px overflow-hidden rounded-full"
              style={{ backgroundColor: "#333333" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${((progressStep + 1) / ANALYSIS_STEPS.length) * 100}%`,
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Resume Analyzer">
      <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: TNR }}>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: TNR }}>
            ATS Resume Analyzer
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
            Upload your resume and get an instant ATS compatibility score with actionable feedback.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Upload Zone */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                Resume File
              </p>

              {!file ? (
                <div
                  role="button"
                  tabIndex={0}
                  data-testid="upload-dropzone"
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className="cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center gap-4 select-none focus:outline-none"
                  style={{
                    borderColor: isDragOver
                      ? "#ffffff"
                      : fileError
                      ? "#EF4444"
                      : "#333333",
                    backgroundColor: isDragOver
                      ? "rgba(255,255,255,0.04)"
                      : "#111111",
                  }}
                >
                  <div
                    className="h-16 w-16 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isDragOver
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <CloudUpload className="h-8 w-8 text-white" />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-white" style={{ fontFamily: TNR }}>
                      {isDragOver ? "Drop your resume here" : "Drag & Drop Resume Here"}
                    </p>
                    <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                      or{" "}
                      <span className="text-white font-semibold underline-offset-2 hover:underline">
                        click to browse
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs" style={{ color: "#6B7280", fontFamily: TNR }}>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> PDF
                    </span>
                    <span className="w-px h-3" style={{ backgroundColor: "#333333" }} />
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> DOCX
                    </span>
                    <span className="w-px h-3" style={{ backgroundColor: "#333333" }} />
                    <span>Max 10 MB</span>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg border p-4 flex items-center gap-4"
                  style={{ backgroundColor: "#111111", borderColor: "rgba(255,255,255,0.3)" }}
                  data-testid="file-preview"
                >
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold text-white truncate"
                      data-testid="file-name"
                      style={{ fontFamily: TNR }}
                    >
                      {file.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      data-testid="file-size"
                      style={{ color: "#9CA3AF", fontFamily: TNR }}
                    >
                      {formatBytes(file.size)} &middot; {file.name.split(".").pop()?.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <button
                      type="button"
                      onClick={removeFile}
                      data-testid="button-remove-file"
                      className="h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ color: "#9CA3AF" }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileInput}
                data-testid="input-file"
              />

              {fileError && (
                <div className="flex items-center gap-2 text-sm text-red-400" data-testid="file-error" style={{ fontFamily: TNR }}>
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {fileError}
                </div>
              )}
            </div>

            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                    Target Job Title
                  </FormLabel>
                  <FormControl>
                    <input
                      placeholder="e.g. Senior Frontend Engineer"
                      data-testid="input-job-title"
                      className="w-full px-3 py-2 rounded-md text-sm text-white placeholder-gray-600 outline-none transition-colors focus:ring-1 focus:ring-white/40"
                      style={{
                        backgroundColor: "#111111",
                        border: "1px solid #333333",
                        fontFamily: TNR,
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ fontFamily: TNR }} />
                </FormItem>
              )}
            />

            {/* Job Description */}
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                    Job Description{" "}
                    <span className="font-normal text-xs" style={{ color: "#9CA3AF" }}>
                      (Optional — improves keyword matching)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Paste the job description here to get more targeted keyword matching..."
                      className="w-full px-3 py-2 rounded-md text-sm text-white placeholder-gray-600 outline-none transition-colors focus:ring-1 focus:ring-white/40 resize-y min-h-[120px]"
                      style={{
                        backgroundColor: "#111111",
                        border: "1px solid #333333",
                        fontFamily: TNR,
                      }}
                      data-testid="input-job-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ fontFamily: TNR }} />
                </FormItem>
              )}
            />

            {/* Analyze Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!file}
                data-testid="button-analyze"
                className="w-full py-3 px-6 rounded-md text-base font-semibold transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: file ? "#ffffff" : "#333333",
                  color: file ? "#000000" : "#9CA3AF",
                  fontFamily: TNR,
                  cursor: file ? "pointer" : "not-allowed",
                }}
              >
                <Zap className="h-5 w-5" />
                Analyze Resume
              </button>

              {!file && (
                <p
                  className="text-center text-xs mt-3"
                  style={{ color: "#6B7280", fontFamily: TNR }}
                >
                  Upload a resume file above to enable analysis
                </p>
              )}
            </div>
          </form>
        </Form>

        {/* Info strip */}
        <div
          className="rounded-lg border p-4 grid grid-cols-3 gap-4 text-center"
          style={{ backgroundColor: "#111111", borderColor: "#333333" }}
        >
          {[
            { label: "ATS Score", desc: "Compatibility rating" },
            { label: "Skill Analysis", desc: "Keyword matching" },
            { label: "Recommendations", desc: "Actionable feedback" },
          ].map(({ label, desc }) => (
            <div key={label} className="space-y-1">
              <p className="text-xs font-bold text-white" style={{ fontFamily: TNR }}>{label}</p>
              <p className="text-xs" style={{ color: "#9CA3AF", fontFamily: TNR }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
