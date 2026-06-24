import React from "react";
import { useParams, Link } from "wouter";
import { useGetResumeAnalysis, getGetResumeAnalysisQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AnalysisResultView } from "@/components/AnalysisResultView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id || "0", 10);

  const { data: analysis, isLoading, isError } = useGetResumeAnalysis(numericId, {
    query: {
      enabled: !!numericId,
      queryKey: getGetResumeAnalysisQueryKey(numericId),
    }
  });

  return (
    <Layout title="Analysis Results">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center">
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-6">
              <Skeleton className="h-64 w-64 rounded-xl" />
              <Skeleton className="h-64 flex-1 rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        ) : isError || !analysis ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load the analysis results. It may have been deleted or doesn't exist.
            </AlertDescription>
          </Alert>
        ) : (
          <AnalysisResultView analysis={analysis} />
        )}
      </div>
    </Layout>
  );
}