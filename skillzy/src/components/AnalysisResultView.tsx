import React from "react";
import { ResumeAnalysis } from "@workspace/api-client-react";
import { CheckCircle2, XCircle, AlertCircle, Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";

const TNR = "'Times New Roman', Times, serif";

export function AnalysisResultView({ analysis }: { analysis: ResumeAnalysis }) {
  const score = analysis.atsScore;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const scoreGrade = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  const scoreStroke = score >= 80 ? "#ffffff" : score >= 60 ? "#D1D5DB" : "#6B7280";

  return (
    <div className="space-y-6" style={{ fontFamily: TNR }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Score Card */}
        <div
          className="flex-shrink-0 rounded-lg border flex flex-col items-center justify-center p-8 md:w-64"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <p className="text-sm font-medium mb-6 text-center" style={{ color: "#9CA3AF", fontFamily: TNR }}>
            ATS Match Score
          </p>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#333333"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={scoreStroke}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white" style={{ fontFamily: TNR }}>{score}</span>
              <span className="text-xs mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>/ 100</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
            {scoreGrade}
          </p>
        </div>

        {/* Overview Card */}
        <div
          className="flex-1 rounded-lg border"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: TNR }}>
              Analysis Overview
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {analysis.jobTitle}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(analysis.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-white leading-relaxed" style={{ fontFamily: TNR }}>
              {analysis.overallFeedback}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div
        className="rounded-lg border"
        style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
      >
        <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
          <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
            Skill Match Analysis
          </h3>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
            How your skills align with the job requirements
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {analysis.skillMatches?.map((match, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium transition-colors"
                style={{
                  backgroundColor: match.matched ? "#ffffff" : "transparent",
                  color: match.matched ? "#000000" : "#9CA3AF",
                  border: match.matched ? "1px solid #ffffff" : "1px solid #333333",
                  fontFamily: TNR,
                }}
              >
                {match.matched
                  ? <CheckCircle2 className="w-3 h-3 mr-1.5" />
                  : <XCircle className="w-3 h-3 mr-1.5" />
                }
                {match.skill}
              </span>
            ))}
            {(!analysis.skillMatches || analysis.skillMatches.length === 0) && (
              <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                No specific skills extracted for this analysis.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div
          className="rounded-lg border"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
            <h3 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: TNR }}>
              <CheckCircle2 className="w-5 h-5 text-white" />
              Strengths
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.strengths?.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-3 shrink-0 opacity-80" />
                  <span className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: TNR }}>
                    {strength}
                  </span>
                </li>
              ))}
              {(!analysis.strengths || analysis.strengths.length === 0) && (
                <li className="text-sm italic" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                  No strengths identified.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Improvements */}
        <div
          className="rounded-lg border"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
            <h3 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: TNR }}>
              <AlertCircle className="w-5 h-5" style={{ color: "#9CA3AF" }} />
              Areas for Improvement
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {analysis.improvements?.map((improvement, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0" style={{ backgroundColor: "#6B7280" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#D1D5DB", fontFamily: TNR }}>
                    {improvement}
                  </span>
                </li>
              ))}
              {(!analysis.improvements || analysis.improvements.length === 0) && (
                <li className="text-sm italic" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                  No improvements suggested.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
