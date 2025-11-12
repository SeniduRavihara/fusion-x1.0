"use client";

import { useEffect, useRef, useState } from "react";
import QrScan from "react-qr-reader";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useAuth } from "../../context/AuthContext";
import AdminService, {
  RegistrationRecord,
} from "../../firebase/services/AdminService";

export default function AdminPage() {
  const [items, setItems] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    whatsapp: true,
    faculty: true,
    year: true,
    registeredAt: false,
    arrived: true,
    actions: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scannerReady, setScannerReady] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [processingScan, setProcessingScan] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const qrRef = useRef<QrScan | null>(null);

  useEffect(() => {
    const unsub = AdminService.listenRegistrations((list) => {
      setItems(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (scanning) {
      setTimeout(() => setScannerReady(true), 500); // Delay by 500ms to ensure component is mounted
    } else {
      setScannerReady(false);
    }
  }, [scanning]);

  // Cleanup effect for when component unmounts or when scanning stops
  useEffect(() => {
    return () => {
      // Cleanup handled by react-qr-reader component
    };
  }, []);

  const toggleArrival = async (id: string, current: boolean | undefined) => {
    try {
      setUpdating(id);
      setSuccess("");
      setError("");
      await AdminService.setArrival(id, !current);
      setSuccess("Arrival status updated successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error(err);
      setError("Failed to update arrival status. Check console for details.");
      setTimeout(() => setError(""), 5000); // Clear error message after 5 seconds
    } finally {
      setUpdating(null);
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanResult("");
    setScannerModalOpen(true);
    setScannerKey((prev) => prev + 1); // Force re-mount of scanner
    // Delay scanner initialization to ensure modal is fully rendered
    setTimeout(() => setScannerReady(true), 1000);
  };

  const stopScanning = () => {
    setScanning(false);
    setScannerReady(false);
    setScannerModalOpen(false);
    setProcessingScan(false);
    setScanResult(""); // Clear scan result
    setScannerKey((prev) => prev + 1); // Force re-mount on next start
  };

  const handleScan = async (data: string | null) => {
    if (data && !scanResult && !processingScan) {
      // Only process if we haven't scanned anything yet and not currently processing
      setScanResult(data);
      setProcessingScan(true);
      await handleScanResult(data);
      setProcessingScan(false);
    }
  };

  const handleError = (err: Error) => {
    console.error("QR Scan Error:", err);
    const errorMessage = err.message.toLowerCase();
    const errorName = err.name.toLowerCase();

    // Handle video stream interruption errors gracefully
    if (
      errorName === "aborterror" ||
      errorMessage.includes("interrupted by a new load request")
    ) {
      console.log(
        "Video stream interrupted - this is normal when stopping/starting scanner"
      );
      return; // Don't show error to user for normal interruptions
    }

    if (
      errorMessage.includes("permission denied") ||
      errorMessage.includes("notallowederror")
    ) {
      setError(
        "Camera access denied. Please allow camera permissions and try again."
      );
      setTimeout(() => setError(""), 5000);
    } else if (
      errorMessage.includes("notfounderror") ||
      errorMessage.includes("not found")
    ) {
      setError("No camera found. Please connect a camera and try again.");
      setTimeout(() => setError(""), 5000);
    } else if (errorMessage.includes("notsupportederror")) {
      setError("Camera not supported on this device.");
      setTimeout(() => setError(""), 5000);
    } else {
      setError("QR Scan Error: " + err.message);
      setTimeout(() => setError(""), 5000);
    }

    // Stop scanning on error
    stopScanning();
  };

  // ✅ Trigger file input for image upload scanning
  const handleUpload = () => {
    if (qrRef.current) {
      qrRef.current.openImageDialog(); // This works only when `legacyMode` is enabled
    }
  };

  const handleScanResult = async (email: string) => {
    try {
      // Find the registration by email
      const registration = items.find((item) => item.email === email);
      if (!registration) {
        setError(`No registration found for email: ${email}`);
        setTimeout(() => setError(""), 5000);
        // Reset scan state to allow next scan
        setTimeout(() => {
          setScanResult("");
          setProcessingScan(false);
        }, 2000);
        return;
      }

      if (registration.is_arrived) {
        setError(`${registration.name} has already checked in!`);
        setTimeout(() => setError(""), 5000);
        // Reset scan state to allow next scan
        setTimeout(() => {
          setScanResult("");
          setProcessingScan(false);
        }, 2000);
        return;
      }

      // Update arrival status
      await AdminService.setArrival(registration.id, true);
      setSuccess(`✅ ${registration.name} checked in successfully!`);
      setTimeout(() => setSuccess(""), 3000);

      // Reset scan state to allow next scan instead of closing
      setTimeout(() => {
        setScanResult("");
        setProcessingScan(false);
      }, 1500);
    } catch (err) {
      console.error("Error processing scan:", err);
      setError("Failed to process ticket scan. Check console for details.");
      setTimeout(() => setError(""), 5000);
      // Reset scan state to allow retry
      setTimeout(() => {
        setScanResult("");
        setProcessingScan(false);
      }, 2000);
    }
  };

  function fmt(ts: unknown) {
    if (!ts) return "-";
    // Firestore serverTimestamp is an object with toDate()
    if (typeof (ts as { toDate?: () => Date }).toDate === "function") {
      return (ts as { toDate: () => Date }).toDate().toLocaleString();
    }
    try {
      const d = new Date(String(ts));
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch {}
    return String(ts);
  }

  const { signOut, user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. See console for details.");
    } finally {
      setSigningOut(false);
    }
  };

  const downloadExcel = () => {
    const data = items.map((r) => ({
      ID: r.id,
      Name: r.name || "",
      Email: r.email || "",
      Whatsapp: r.whatsapp || "",
      Faculty: r.faculty || "",
      Year: r.year || "",
      "Registered At": fmt(r.createdAt),
      Arrived: r.is_arrived ? "Yes" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(
      wb,
      `registrations_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[#05060a] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Admin — Registrations
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              Total Registered Students: {items.length}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="w-full sm:w-auto rounded-full bg-blue-600 px-3 sm:px-4 py-2 text-white font-medium hover:bg-blue-700 text-sm sm:text-base"
              >
                Columns
              </button>
              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <div className="space-y-2">
                      {Object.entries(visibleColumns).map(([key, visible]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 text-white text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={visible}
                            onChange={(e) =>
                              setVisibleColumns((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="rounded"
                          />
                          {key === "registeredAt"
                            ? "Registered At"
                            : key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={downloadExcel}
              className="w-full sm:w-auto rounded-full bg-green-600 px-3 sm:px-4 py-2 text-white font-medium hover:bg-green-700 text-sm sm:text-base"
            >
              Download Excel
            </button>
            {user && (
              <div className="text-xs sm:text-sm text-white/80 truncate max-w-[120px] sm:max-w-none">
                {user.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="w-full sm:w-auto rounded-full bg-neutral-800/60 px-3 sm:px-4 py-2 text-white/90 hover:bg-neutral-800 text-sm sm:text-base"
            >
              {signingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>

        {success && (
          <p className="mt-4 text-green-400 text-center">{success}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* QR Scanner Section */}
            <div className="mb-6 bg-neutral-900/30 rounded-lg border border-neutral-800 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Ticket Scanner
              </h2>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <Dialog
                    open={scannerModalOpen}
                    onOpenChange={setScannerModalOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        onClick={startScanning}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base"
                      >
                        📱 Start Scanning Tickets
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-5 flex flex-col items-center justify-center sm:rounded-xl rounded-xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="w-full">
                        <DialogTitle className="text-center text-lg sm:text-xl">
                          QR Code Scanner
                        </DialogTitle>
                      </DialogHeader>

                      {/* 📷 Real-time QR Code Scanner */}
                      {scannerReady && scanning ? (
                        <QrScan
                          key={`scanner-${scannerKey}`}
                          delay={300}
                          onError={handleError}
                          onScan={handleScan}
                          style={{
                            width: "100%",
                            maxWidth: "320px",
                            height: "240px",
                          }}
                          facingMode="environment"
                        />
                      ) : scanning ? (
                        <div className="flex items-center justify-center w-full max-w-[320px] h-48 sm:h-60 bg-gray-800 rounded-lg">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                            <p className="text-white text-xs sm:text-sm">
                              Initializing camera...
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {/* 🖼 Hidden scanner for image upload */}
                      {scannerReady && scanning && (
                        <QrScan
                          key={`hidden-scanner-${scannerKey}`}
                          ref={qrRef}
                          onError={handleError}
                          onScan={handleScan}
                          legacyMode // ✅ Needed for manual trigger
                          style={{ display: "none" }} // Hide the secondary scanner
                        />
                      )}

                      <div className="mt-20  text-lg text-center">
                        {processingScan && scanResult && (
                          <div className="space-y-2">
                            <div className="text-blue-400">
                              Scanned: {scanResult}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                              <span>Processing...</span>
                            </div>
                          </div>
                        )}
                        {scanResult && !processingScan && (
                          <div className="text-green-400">
                            Scanned: {scanResult}
                          </div>
                        )}
                      </div>

                      {/* Upload Image Button */}
                      <button
                        onClick={handleUpload}
                        className="w-full sm:w-auto mt-4 sm:mt-5 px-4 py-3 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        📷 Upload QR Image
                      </button>

                      {/* Stop Scanning Button */}
                      <button
                        onClick={stopScanning}
                        className="w-full sm:w-auto mt-2 px-4 py-3 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                      >
                        Stop Scanning
                      </button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 sm:px-4 sm:py-2 rounded-lg bg-neutral-800/60 border border-neutral-700 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              />
            </div>
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900/30">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-neutral-900/50">
                  <tr>
                    {visibleColumns.name && (
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Name
                      </th>
                    )}
                    {visibleColumns.email && (
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Email
                      </th>
                    )}
                    {visibleColumns.whatsapp && (
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Whatsapp
                      </th>
                    )}
                    {visibleColumns.faculty && (
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Faculty
                      </th>
                    )}
                    {visibleColumns.year && (
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Year
                      </th>
                    )}
                    {visibleColumns.registeredAt && (
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Registered At
                      </th>
                    )}
                    {visibleColumns.arrived && (
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Arrived
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredItems = items.filter((item) =>
                      item.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    );
                    const visibleCount =
                      Object.values(visibleColumns).filter(Boolean).length;
                    return (
                      <>
                        {filteredItems.length === 0 && (
                          <tr>
                            <td
                              colSpan={visibleCount}
                              className="px-2 sm:px-4 py-4 sm:py-6 text-center text-white/70 text-sm sm:text-base"
                            >
                              No registrations found.
                            </td>
                          </tr>
                        )}

                        {filteredItems.map((r) => (
                          <tr
                            key={r.id}
                            className="border-t border-neutral-800/40 hover:bg-neutral-900/20"
                          >
                            {visibleColumns.name && (
                              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {r.name || "-"}
                              </td>
                            )}
                            {visibleColumns.email && (
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm break-all">
                                {r.email || "-"}
                              </td>
                            )}
                            {visibleColumns.whatsapp && (
                              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {r.whatsapp || "-"}
                              </td>
                            )}
                            {visibleColumns.faculty && (
                              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {r.faculty || "-"}
                              </td>
                            )}
                            {visibleColumns.year && (
                              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {r.year || "-"}
                              </td>
                            )}
                            {visibleColumns.registeredAt && (
                              <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {fmt(r.createdAt)}
                              </td>
                            )}
                            {visibleColumns.arrived && (
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                {r.is_arrived ? "Yes" : "No"}
                              </td>
                            )}
                            {visibleColumns.actions && (
                              <td className="px-2 sm:px-4 py-2 sm:py-3">
                                <button
                                  className={`inline-flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                                    r.is_arrived
                                      ? "bg-green-600"
                                      : "bg-purple-600"
                                  }`}
                                  onClick={() =>
                                    toggleArrival(r.id, r.is_arrived)
                                  }
                                  disabled={updating === r.id}
                                >
                                  {updating === r.id
                                    ? "Updating..."
                                    : r.is_arrived
                                    ? "Mark not arrived"
                                    : "Mark arrived"}
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
