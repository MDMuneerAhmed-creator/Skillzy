import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

const TNR = "'Times New Roman', Times, serif";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({ fullName: user.fullName, email: user.email });
    }
  }, [user, form]);

  function onSubmit(_values: z.infer<typeof profileSchema>) {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 1000);
  }

  return (
    <Layout title="Account Settings">
      <div className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: TNR }}>
        <div
          className="rounded-lg border"
          style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#333333" }}>
            <h3 className="text-base font-bold text-white" style={{ fontFamily: TNR }}>
              Profile Information
            </h3>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: TNR }}>
              Update your personal details and how we contact you.
            </p>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                {/* Email (disabled) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-white" style={{ fontFamily: TNR }}>
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          disabled
                          className="w-full px-3 py-2 rounded-md text-sm placeholder-gray-600 outline-none cursor-not-allowed opacity-50"
                          style={{
                            backgroundColor: "#000000",
                            border: "1px solid #333333",
                            color: "#9CA3AF",
                            fontFamily: TNR,
                          }}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs mt-1" style={{ color: "#6B7280", fontFamily: TNR }}>
                        Your email address cannot be changed at this time.
                      </p>
                      <FormMessage style={{ fontFamily: TNR }} />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontFamily: TNR,
                    }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
