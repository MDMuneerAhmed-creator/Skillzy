import React from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const TNR = "'Times New Roman', Times, serif";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { setToken, setUser } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          localStorage.setItem("skillzy_token", data.token);
          setToken(data.token);
          setUser(data.user);
          toast({ title: "Account created successfully!" });
          setLocation("/dashboard");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: error.data?.error || "Could not create account. Please try again.",
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
        {/* Logo + Heading */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/skillzy-logo.png" alt="Skillzy" className="h-12 w-12 mr-3" />
            <span className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: TNR }}>
              Skillzy
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: TNR }}>
            Create your account
          </h2>
          <p className="text-sm mt-2" style={{ color: "#9CA3AF", fontFamily: TNR }}>
            Start analyzing your resume today.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-lg border p-8 space-y-6"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="John Doe"
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

              {/* Email */}
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                      Password
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
                disabled={registerMutation.isPending}
                className="w-full py-2.5 rounded-md text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontFamily: TNR,
                }}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center" style={{ fontFamily: TNR }}>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
