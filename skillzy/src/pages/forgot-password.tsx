import React, { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

const TNR = "'Times New Roman', Times, serif";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const forgotMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotMutation.mutate(
      { data: values },
      {
        onSuccess: () => setIsSubmitted(true),
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Request failed",
            description: (error as { data?: { error?: string } }).data?.error || "Could not process request. Please try again.",
          });
        },
      }
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4"
      style={{ backgroundColor: "#000000", fontFamily: TNR }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/skillzy-logo.png" alt="Skillzy" className="h-10 w-10 mr-3" />
            <span className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: TNR }}>
              Skillzy
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-lg border"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-6 border-b text-center" style={{ borderColor: "#333333" }}>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: TNR }}>
              Reset your password
            </h3>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              {isSubmitted
                ? "Check your email for a reset link."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <div className="flex flex-col items-center py-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <p className="text-center text-sm mb-6" style={{ color: "#9CA3AF", fontFamily: TNR }}>
                  We've sent a password reset link to{" "}
                  <span className="text-white font-semibold">{form.getValues().email}</span>
                </p>
                <Link href="/login" className="w-full">
                  <button
                    className="w-full py-2.5 rounded-md text-sm font-semibold"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontFamily: TNR,
                    }}
                  >
                    Return to login
                  </button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                          Email
                        </FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-3 py-2 rounded-md text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-white/40 transition-colors"
                            style={{
                              backgroundColor: "#000000",
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

                  <button
                    type="submit"
                    disabled={forgotMutation.isPending}
                    className="w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontFamily: TNR,
                    }}
                  >
                    {forgotMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              </Form>
            )}
          </div>

          {!isSubmitted && (
            <div className="px-6 pb-6 pt-0 border-t flex justify-center" style={{ borderColor: "#333333", paddingTop: "1.5rem" }}>
              <Link href="/login">
                <span
                  className="text-sm flex items-center gap-2 hover:underline cursor-pointer"
                  style={{ color: "#9CA3AF", fontFamily: TNR }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
