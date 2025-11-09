import html2canvas from "html2canvas";
import { Download, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function GenerateTicket({
  name = "Participant",
  email,
  faculty,
  backgroundPosition = "90% 50%",
}: {
  name: string;
  email: string;
  faculty: string;
  backgroundPosition?: string;
}) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("ticket");
    if (!element) return;

    await document.fonts.ready;

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      allowTaint: true,
      backgroundColor: "#581c87",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    setImageData(imgData);

    // Trigger the download
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "fusion-x-ticket.png";
    link.click();
  };

  const handleEmail = async () => {
    setIsEmailSending(true);
    try {
      const response = await fetch("/api/send-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          faculty,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        alert("Ticket sent successfully to your email!");
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsEmailSending(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleDownload();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Ticket Preview */}
      <div className="relative bg-[#262930] p-4 rounded-xl shadow-lg border border-[#333842] mb-6 w-[330px] md:w-[430px] h-[510px] md:h-[690px]">
        <div className="inline-block">
          <div
            className="relative rounded-lg scale-75 md:scale-100 origin-top-left"
            id="ticket"
            style={{
              width: "400px",
              height: "650px",
              backgroundImage: `url(/ticket-background.png)`,
              backgroundSize: "cover",
              backgroundPosition: backgroundPosition,
              backgroundColor: "#581c87", // fallback color
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {/* Dark overlay */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                {/* Logo */}
                <div className="flex relative -top-5 items-center justify-center">
                  <Image
                    src={logo}
                    alt="Fusion X Logo"
                    width={180}
                    height={180}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* <p style={{ fontSize: "18px", color: "#d1d5db" }}>Event Ticket</p> */}
              </div>

              {/* QR Code */}
              <div
                style={{ marginBottom: "10px" }}
                className="relative -top-5"
              >
                <QRCodeCanvas
                  id="myqr"
                  value={email}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  includeMargin={true}
                  marginSize={1}
                />
              </div>

              {/* User Details */}
              <div
                style={{
                  textAlign: "center",
                  gap: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="relative -top-5"
              >
                <p style={{ fontSize: "24px", fontWeight: "semibold" }}>
                  {name}
                </p>
                <p style={{ color: "#d1d5db" }}>{email}</p>
                <p style={{ color: "#d1d5db" }}>{faculty}</p>
              </div>

              {/* Footer */}
              <div
                className="relative -top-5"
                style={{
                  marginTop: "32px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#9ca3af",
                }}
              >
                <p>Present this ticket at the entrance</p>
                <p>Valid for one entry only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 disabled:opacity-70"
        >
          {!imageData ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Download className="mr-2 h-5 w-5" />
          )}
          Download Ticket
        </button>

        <button
          onClick={handleEmail}
          disabled={isEmailSending || emailSent}
          className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-70 text-white font-medium rounded-lg shadow-md transition-all duration-300"
        >
          {isEmailSending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : emailSent ? (
            <Mail className="mr-2 h-5 w-5" />
          ) : (
            <Mail className="mr-2 h-5 w-5" />
          )}
          {isEmailSending
            ? "Sending..."
            : emailSent
            ? "Link Sent!"
            : "Email Access Link"}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center bg-[#262930] p-4 rounded-lg border border-[#333842] w-full max-w-md">
        <p className="text-gray-300 text-sm">
          Your ticket has been automatically downloaded. You can download it
          again, email an access link to yourself, or share it via WhatsApp.
          Bring this ticket to the event entrance.
        </p>
      </div>
    </div>
  );
}
