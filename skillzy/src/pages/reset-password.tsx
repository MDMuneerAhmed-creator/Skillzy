import React from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPassword } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const TNR = "'Times New Roman', Times, serif";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetMutation = useResetPassword();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Missing token",
        description: "Invalid password reset link. Please request a new one.",
      });
      return;
    }

    resetMutation.mutate(
      { data: { token, password: values.password } },
      {
        onSuccess: () => {
          toast({ title: "Password reset successful! You can now log in." });
          setLocation("/login");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Reset failed",
            description: error.data?.error || "Could not reset password. The link might be expired.",
          });
        },
      }
    );
  }

  if (!token) {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center p-4"
        style={{ backgroundColor: "#000000", fontFamily: TNR }}
      >
        <div
          className="w-full max-w-md rounded-lg border text-center"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-8 space-y-4">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: TNR }}>
              Invalid Link
            </h3>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              This password reset link is invalid or missing a token.
            </p>
            <Link href="/forgot-password">
              <button
                className="mt-4 px-5 py-2.5 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#ffffff", color: "#000000", fontFamily: TNR }}
              >
                Request a new link
              </button>
            </Link>
          </div>
        </div>
      </div>
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
              Set new password
            </h3>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              Enter your new password below.
            </p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                        New Password
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="••••••••"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="••••••••"
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
                  disabled={resetMutation.isPending}
                  className="w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontFamily: TNR,
                  }}
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
