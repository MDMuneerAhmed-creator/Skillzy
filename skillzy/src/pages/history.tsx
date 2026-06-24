import React from "react";
import { Link } from "wouter";
import { useListResumeAnalyses, getListResumeAnalysesQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowRight, Calendar, Search } from "lucide-react";
import { format } from "date-fns";

const TNR = "'Times New Roman', Times, serif";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#ffffff" : score >= 60 ? "#D1D5DB" : "#6B7280";
  const bg = score >= 80 ? "rgba(255,255,255,0.10)" : score >= 60 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)";
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-sm text-xs font-semibold"
      style={{
        backgroundColor: bg,
        color,
        border: `1px solid ${color}30`,
        fontFamily: TNR,
      }}
    >
      {score}%
    </span>
  );
}

export default function History() {
  const { data: analyses, isLoading } = useListResumeAnalyses({
    query: { queryKey: getListResumeAnalysesQueryKey() }
  });

  return (
    <Layout title="Analysis History">
      <div className="space-y-6" style={{ fontFamily: TNR }}>
        <div className="rounded-lg border" style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}>
          <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
            <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
              Previous Scans
            </h3>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              A complete log of all your resume analyses
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-12 w-full rounded" style={{ backgroundColor: "#333333" }} />
                ))}
              </div>
            ) : analyses && analyses.length > 0 ? (
              <div className="rounded-md border overflow-hidden" style={{ borderColor: "#333333" }}>
                <table className="w-full text-sm" style={{ fontFamily: TNR }}>
                  <thead>
                    <tr style={{ backgroundColor: "#111111", borderBottom: "1px solid #333333" }}>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-wider" style={{ color: "#9CA3AF" }}>
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-wider" style={{ color: "#9CA3AF" }}>
                        Job Title
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-semibold tracking-wider" style={{ color: "#9CA3AF" }}>
                        ATS Score
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold tracking-wider" style={{ color: "#9CA3AF" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.map((analysis, idx) => (
                      <tr
                        key={analysis.id}
                        className="transition-colors hover:bg-white/3"
                        style={{
                          borderBottom: idx < analyses.length - 1 ? "1px solid #222222" : "none",
                        }}
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            {format(new Date(analysis.createdAt), "MMM d, yyyy")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-white">
                          {analysis.jobTitle}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <ScoreBadge score={analysis.atsScore} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link href={`/analysis/${analysis.id}`}>
                            <button
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline transition-opacity"
                              style={{ fontFamily: TNR }}
                            >
                              View
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed"
                style={{ borderColor: "#333333", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <Search className="h-8 w-8" style={{ color: "#6B7280" }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: TNR }}>
                  No analyses yet
                </h3>
                <p className="text-sm max-w-sm mb-6" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                  You haven't scanned any resumes yet. Start your first analysis to see your ATS score and get feedback.
                </p>
                <Link href="/analyze">
                  <button
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontFamily: TNR,
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    Analyze Resume
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
