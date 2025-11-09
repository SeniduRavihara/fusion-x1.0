"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserService from "../../firebase/services/UserService";
import NetworkBackground from "@/components/ui/network-background";

type FormState = {
  email: string;
  name: string;
  whatsapp: string;
  faculty: string;
  year: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    whatsapp: "",
    faculty: "",
    year: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [success, setSuccess] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const validate = async (): Promise<boolean> => {
    const e: Partial<FormState> = {};
    if (!form.email) e.email = "Email is required.";
    else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(form.email))
      e.email = "Enter a valid email.";
    else {
      // Check if email is already registered
      setIsCheckingEmail(true);
      try {
        const isRegistered = await UserService.isEmailRegistered(form.email);
        if (isRegistered) {
          e.email = "This email is already registered.";
        }
      } catch (error) {
        console.error("Error checking email:", error);
        e.email = "Unable to verify email. Please try again.";
      } finally {
        setIsCheckingEmail(false);
      }
    }

    if (!form.name) e.name = "Name is required.";

    if (!form.whatsapp) e.whatsapp = "Whatsapp number is required.";
    else if (!/^[+\d][\d\s()-]{6,}$/i.test(form.whatsapp))
      e.whatsapp = "Enter a valid phone number.";

    if (!form.faculty) e.faculty = "Faculty is required.";
    if (!form.year) e.year = "Year is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((s) => ({ ...s, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await validate())) return;

    setIsLoading(true);
    setOpenDialog(true);

    try {
      const res = await UserService.register(form);
      console.log("Registration saved:", res);

      // Show success animation for 2 seconds
      setTimeout(() => {
        setSubmited(true);

        // Redirect to ticket page after another 2 seconds
        setTimeout(() => {
          router.push(
            `/ticket?name=${encodeURIComponent(
              form.name
            )}&email=${encodeURIComponent(
              form.email
            )}&faculty=${encodeURIComponent(form.faculty)}`
          );
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setOpenDialog(false);
      setErrors((prev) => ({
        ...prev,
        email: "Failed to submit. Try again later.",
      }));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F text-white py-12">
      <div className="w-full max-w-2xl mx-auto p-8 bg-neutral-900/40 rounded-2xl border border-purple-800/30 shadow-lg">
        <h1 className="text-3xl font-extrabold">Register for FusionX 1.0</h1>
        <p className="mt-2 text-white/80">
          Fill in the details below and we&apos;ll reach out with next steps.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-2 w-full h-12 rounded-xl bg-neutral-900/60 border-2 py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-purple-600/50 hover:border-purple-500/70"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Name{" "}
              <span className="text-sm text-white/70">
                (this will appear on your certificate)
              </span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`mt-2 w-full h-12 rounded-xl bg-neutral-900/60 border-2 py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-purple-600/50 hover:border-purple-500/70"
              }`}
              placeholder="Your name as it should appear on the certificate"
            />
            {errors.name && (
              <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Whatsapp
            </label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className={`mt-2 w-full h-12 rounded-xl bg-neutral-900/60 border-2 py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                errors.whatsapp
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-purple-600/50 hover:border-purple-500/70"
              }`}
              placeholder="e.g. +94771234567"
            />
            {errors.whatsapp && (
              <p className="mt-1 text-red-400 text-sm">{errors.whatsapp}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90">
                Faculty
              </label>
              <input
                type="text"
                value={form.faculty}
                onChange={(e) => handleChange("faculty", e.target.value)}
                className={`mt-2 w-full h-12 rounded-xl bg-neutral-900/60 border-2 py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                  errors.faculty
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-purple-600/50 hover:border-purple-500/70"
                }`}
                placeholder="Faculty or Department"
              />
              {errors.faculty && (
                <p className="mt-1 text-red-400 text-sm">{errors.faculty}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90">
                Year
              </label>
              <select
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className={`mt-2 w-full h-12 rounded-xl bg-neutral-900/60 border-2 px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                  errors.year
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-purple-600/50 hover:border-purple-500/70"
                }`}
              >
                <option value="">Select year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              {errors.year && (
                <p className="mt-1 text-red-400 text-sm">{errors.year}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-10 mt-2">
            <button
              type="submit"
              disabled={isCheckingEmail}
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingEmail ? "Checking..." : "Submit Registration"}
            </button>

            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>

          {success && <p className="mt-4 text-green-400">{success}</p>}
        </form>

        {/* Success Animation Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md bg-[#1f2227] border-[#333842]/20">
            <DialogTitle className="text-center text-white text-lg font-medium">
              {submited ? "Registration Complete" : "Please Wait..."}
            </DialogTitle>

            <div className="py-6 flex justify-center items-center">
              {isLoading && !submited && (
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#262930] border-t-[#4079ff] animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full border-4 border-[#262930] border-b-[#40ffaa] animate-spin animate-delay-150"></div>
                  </div>
                </div>
              )}

              {/* ✅ Success Animation */}
              {submited && (
                <div className="relative">
                  <div className="w-16 h-16 bg-[#262930] rounded-full flex items-center justify-center">
                    <svg
                      className="checkmark w-8 h-8 text-[#40ffaa]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                    >
                      <circle
                        className="checkmark__circle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="#262930"
                        strokeWidth="2"
                      />
                      <path
                        className="checkmark__check"
                        fill="none"
                        stroke="#40ffaa"
                        strokeWidth="4"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        strokeDasharray="48"
                        strokeDashoffset="48"
                        style={{
                          animation: "dash 0.8s ease-in-out forwards",
                        }}
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-gray-400 text-sm px-4">
              {isLoading && !submited
                ? "Please wait while we process your registration..."
                : "Your registration is complete! Redirecting to ticket download..."}
            </p>

            <style jsx>{`
              @keyframes dash {
                from {
                  stroke-dashoffset: 48;
                }
                to {
                  stroke-dashoffset: 0;
                }
              }

              @keyframes delay-spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }

              .animate-delay-150 {
                animation-delay: 150ms;
                animation-direction: reverse;
              }
            `}</style>
          </DialogContent>
        </Dialog>
      </div>

      <NetworkBackground />
    </main>
  );
}
