"use client";

import GenerateTicket from "@/components/GenerateTicket";
import UserService from "@/firebase/services/UserService";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function TicketContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Participant";
  const email = searchParams.get("email") || "";
  const faculty = searchParams.get("faculty") || "";

  const [isValidating, setIsValidating] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const validateRegistration = async () => {
      if (!email) {
        setIsValidating(false);
        setShowError(true);
        setTimeout(() => router.push("/registerpage"), 2000);
        return;
      }

      try {
        const registered = await UserService.isEmailRegistered(email);
        if (!registered) {
          setIsValidating(false);
          setShowError(true);
          setTimeout(() => router.push("/registerpage"), 2000);
          return;
        }
        setIsRegistered(true);
      } catch (error) {
        console.error("Error validating registration:", error);
        setIsValidating(false);
        setShowError(true);
        setTimeout(() => router.push("/registerpage"), 2000);
        return;
      }
      setIsValidating(false);
    };

    validateRegistration();
  }, [email, router]);

  if (isValidating) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#191b1f] p-4">
        <div className="w-full max-w-2xl bg-[#1f2227] rounded-xl shadow-xl border border-[#333842]/20 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Validating Registration
            </h2>
            <p className="text-gray-400">
              Please wait while we verify your registration...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (showError) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#191b1f] p-4">
        <div className="w-full max-w-2xl bg-[#1f2227] rounded-xl shadow-xl border border-red-500/20 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-red-400 text-lg font-semibold mb-2">
              You are not registered!!!
            </p>
            <p className="text-gray-400">Redirecting to registration page...</p>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isRegistered) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#191b1f] p-4">
      <div className="w-full max-w-2xl bg-[#1f2227] rounded-xl shadow-xl border border-[#333842]/20 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Fusion X 1.0 Ticket
          </h1>
          <p className="text-gray-400">
            Congratulations! Your registration was successful. Download your
            ticket below.
          </p>
        </div>

        <GenerateTicket name={name} email={email} faculty={faculty} />

        <div className="mt-6 text-center">
          <a
            href="https://chat.whatsapp.com/BiPi3RaJmiiAt9OfmzVbIM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Join Our WhatsApp Group
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Please bring this ticket to the event entrance. The QR code will be
            scanned for check-in.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function TicketPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#191b1f]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Loading Ticket</h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </main>
      }
    >
      <TicketContent />
    </Suspense>
  );
}
