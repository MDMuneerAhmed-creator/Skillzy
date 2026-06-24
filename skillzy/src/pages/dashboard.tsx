import React from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboardStats, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, TrendingUp, Award, ArrowRight, Zap, Target } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TNR = "'Times New Roman', Times, serif";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });

  return (
    <Layout title="Dashboard">
      <div className="space-y-6" style={{ fontFamily: TNR }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: TNR }}>
              Welcome back, {user?.fullName.split(" ")[0]}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              Here is an overview of your career analytics.
            </p>
          </div>
          <Link href="/analyze">
            <Button
              className="shrink-0 font-semibold transition-colors"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
                fontFamily: TNR,
              }}
            >
              <Zap className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Analyses */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Total Analyses
              </p>
              <FileText className="h-4 w-4" style={{ color: "#ffffff" }} />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" style={{ backgroundColor: "#333333" }} />
            ) : (
              <div className="text-3xl font-bold text-white" style={{ fontFamily: TNR }}>
                {stats?.totalAnalyses || 0}
              </div>
            )}
          </div>

          {/* Average ATS Score */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Average ATS Score
              </p>
              <TrendingUp className="h-4 w-4" style={{ color: "#D1D5DB" }} />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" style={{ backgroundColor: "#333333" }} />
            ) : (
              <div className="text-3xl font-bold text-white" style={{ fontFamily: TNR }}>
                {stats?.averageAtsScore || 0}%
              </div>
            )}
          </div>

          {/* Top Skills */}
          <div
            className="rounded-lg border p-6 md:col-span-2 lg:col-span-1"
            style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Top Skill Matches
              </p>
              <Award className="h-4 w-4" style={{ color: "#D1D5DB" }} />
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" style={{ backgroundColor: "#333333" }} />
                <Skeleton className="h-5 w-3/4" style={{ backgroundColor: "#333333" }} />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {stats?.topSkills && stats.topSkills.length > 0 ? (
                  stats.topSkills.slice(0, 5).map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "#ffffff",
                        border: "1px solid #333333",
                        fontFamily: TNR,
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                    No data yet
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          {/* Chart */}
          <div
            className="md:col-span-4 lg:col-span-5 rounded-lg border"
            style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
          >
            <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
                ATS Score Trend
              </h3>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Your resume score progression over time
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <Skeleton className="w-full h-[300px]" style={{ backgroundColor: "#333333" }} />
              ) : stats?.scoreHistory && stats.scoreHistory.length > 1 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.scoreHistory}
                      margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), "MMM d")}
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily={TNR}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily={TNR}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1A1A",
                          borderColor: "#333333",
                          color: "#ffffff",
                          fontFamily: TNR,
                          fontSize: "13px",
                          borderRadius: "4px",
                        }}
                        labelStyle={{ color: "#9CA3AF", fontFamily: TNR }}
                        labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#ffffff"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#ffffff", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#ffffff", strokeWidth: 2, stroke: "#555555" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div
                  className="h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed"
                  style={{ borderColor: "#333333", backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <Target className="h-10 w-10 mb-4 opacity-30" style={{ color: "#9CA3AF" }} />
                  <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
                    Not enough data
                  </h3>
                  <p className="text-sm max-w-[250px] mt-2" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                    Analyze more resumes to see your score trends over time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Analyses */}
          <div
            className="md:col-span-3 lg:col-span-2 rounded-lg border flex flex-col"
            style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
          >
            <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
                Recent Scans
              </h3>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                Your latest resume analyses
              </p>
            </div>
            <div className="p-6 flex-1">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" style={{ backgroundColor: "#333333" }} />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" style={{ backgroundColor: "#333333" }} />
                        <Skeleton className="h-3 w-2/3" style={{ backgroundColor: "#333333" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                <div className="space-y-5">
                  {stats.recentAnalyses.map((analysis) => (
                    <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
                      <div className="flex items-center cursor-pointer group">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.08)",
                            color: "#ffffff",
                            border: "1px solid #333333",
                            fontFamily: TNR,
                          }}
                        >
                          {analysis.atsScore}
                        </div>
                        <div className="ml-4 space-y-1 overflow-hidden flex-1">
                          <p
                            className="text-sm font-semibold leading-none truncate text-white group-hover:underline"
                            style={{ fontFamily: TNR }}
                          >
                            {analysis.jobTitle}
                          </p>
                          <p className="text-xs truncate" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                            {format(new Date(analysis.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "#ffffff" }} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-sm mb-4" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                    No analyses found
                  </p>
                  <Link href="/analyze">
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        fontFamily: TNR,
                        border: "1px solid #ffffff",
                      }}
                    >
                      Create your first
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
