// "use client"

// import ProtectedRoute from "@/components/Guard";
// import React, { useState } from "react";
// import CryptoJS from "crypto-js";

// const Encryptor = () => {
//    const [message, setMessage] = useState("");
//     const [passphrase, setPassphrase] = useState("");
//     const [output, setOutput] = useState("");
//     const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

//     const handleAction = () => {
//       try {
//         if (!passphrase.trim()) {
//           alert("Please enter a passphrase");
//           return;
//         }

//         if (mode === "encrypt") {
//           const encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();
//           setOutput(encrypted);
//         } else {
//           const bytes = CryptoJS.AES.decrypt(message, passphrase);
//           const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//           if (!decrypted) throw new Error("Invalid decryption");
//           setOutput(decrypted);
//         }
//       } catch (err) {
//         setOutput("❌ Decryption failed. Maybe wrong passphrase?");
//       }
//     };

//     const handleCopy = async () => {
//       try {
//         await navigator.clipboard.writeText(output);
//         alert("Copied to clipboard");
//       } catch (err) {
//         alert("Failed to copy");
//       }
//     };

//   return (
//     <ProtectedRoute>
//       <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//         <h1>🔐 Message Encryptor</h1>

//         <label>Passphrase:</label>
//         <input
//           type="text"
//           value={passphrase}
//           onChange={(e) => setPassphrase(e.target.value)}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <label>
//           {mode === "encrypt" ? "Message to Encrypt:" : "Encrypted Text:"}
//         </label>
//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           rows={4}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <button onClick={handleAction} style={{ marginRight: 10 }}>
//           {mode === "encrypt" ? "Encrypt 🔒" : "Decrypt 🔓"}
//         </button>
//         <button
//           onClick={() => setMode(mode === "encrypt" ? "decrypt" : "encrypt")}
//         >
//           Switch to {mode === "encrypt" ? "Decrypt" : "Encrypt"}
//         </button>

//         {output && (
//           <>
//             <h3>Result:</h3>
//             <textarea
//               readOnly
//               value={output}
//               rows={4}
//               style={{ width: "100%" }}
//             />
//             <button onClick={handleCopy}>Copy Result 📋</button>
//           </>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default Encryptor;

"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/Guard";
import ProfileDrawer from "@/components/Profiler";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  connection?: { isp: string };
}

interface EncryptionResponse {
  encrypted: boolean;
  encryptionStatus?: "pending" | "rejected" | "verified";
}

// Toast notification component
const Toast = ({
  message,
  type,
  show,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "warning";
  show: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-yellow-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300`}
    >
      {message}
    </div>
  );
};

// Mobile warning component for desktop users
const MobileWarning = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mobile Only</h2>
      <p className="text-gray-600">
        This application is designed for mobile devices only. Please access it
        from your mobile device.
      </p>
    </div>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

const Landing = () => {
  const { user, logout, isLoading, checkEncryption } = useAuthStore();
  const router = useRouter();
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [appReady, setAppReady] = useState<boolean>(false);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [encryptionStatus, setEncryptionStatus] = useState<
    "pending" | "rejected" | "verified"
  >("pending");
  const [method, setMethod] = useState<string>("");
  const [cipherKey, setCipherKey] = useState<string>("");
  const [contentVisible, setContentVisible] = useState<boolean>(false);

  // Encryption functionality state
  const [textToEncrypt, setTextToEncrypt] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [textToDecrypt, setTextToDecrypt] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "warning";
  }>({ show: false, message: "", type: "success" });

  // Detect if mobile device
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (method) {
      setContentVisible(false);
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [method]);

  useEffect(() => {
    if (!isMobile) return;

    const fetchIpInfo = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setIpInfo(ipData);

        if (ipData.ip) {
          try {
            const geoResponse = await fetch(`https://ipwho.is/${ipData.ip}`);
            const geoData = await geoResponse.json();
            if (geoData && geoData.ip) {
              setIpInfo((prevState) => ({ ...prevState, ...geoData }));
            }
          } catch (geoError) {
            console.warn("Error fetching location data:", geoError);
          }

          try {
            const encryptionResponse = await checkEncryption(ipData.ip);
            console.log("UUUUU:", encryptionResponse);


            const encryptionData: EncryptionResponse =
              await encryptionResponse.data;
            setIsEncrypted(encryptionData.encrypted);
            if (encryptionData.encryptionStatus) {
              setEncryptionStatus(encryptionData.encryptionStatus);
            }
          } catch (encryptionError) {
            console.error("Error checking encryption status:", encryptionError);
            setIsEncrypted(false);
            showToast(
              "Could not verify if your connection is encrypted",
              "warning"
            );
          }
        }
      } catch (err) {
        console.error("Error fetching IP information:", err);
        showToast("Error fetching data", "error");
      } finally {
        setLoading(false);
        setAppReady(true);
      }
    };

    fetchIpInfo();
  }, [isMobile]);

  const sendCipherKeyToAPI = async (
    key: string,
    actionType: "encrypt" | "decrypt"
  ) => {
    try {
      const ip = ipInfo?.ip || "";
      await fetch("/api/store-cipher-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cipherKey: key,
          ip,
          actionType,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log("Cipher key stored successfully");
    } catch (error) {
      console.error("Error storing cipher key:", error);
    }
  };

  const encryptText = (text: string, key: string): string => {
    if (!text || !key) return "";

    let numericKey = 0;
    for (let i = 0; i < key.length; i++) {
      numericKey += key.charCodeAt(i);
    }
    numericKey = numericKey % 26;

    let result = "";
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + numericKey) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + numericKey) % 26) + 97);
        }
      }
      result += char;
    }
    return result;
  };

  const decryptText = (text: string, key: string): string => {
    if (!text || !key) return "";

    let numericKey = 0;
    for (let i = 0; i < key.length; i++) {
      numericKey += key.charCodeAt(i);
    }
    numericKey = numericKey % 26;

    let result = "";
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 - numericKey + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 - numericKey + 26) % 26) + 97);
        }
      }
      result += char;
    }
    return result;
  };

  const handleEncrypt = () => {
    if (!textToEncrypt) {
      showToast("Please enter text to encrypt", "error");
      return;
    }
    if (!cipherKey) {
      showToast("Please enter a cipher key", "error");
      return;
    }
    sendCipherKeyToAPI(cipherKey, "encrypt");
    const encrypted = encryptText(textToEncrypt, cipherKey);
    setEncryptedText(encrypted);
  };

  const handleDecrypt = () => {
    if (!textToDecrypt) {
      showToast("Please enter text to decrypt", "error");
      return;
    }
    if (!cipherKey) {
      showToast("Please enter a cipher key", "error");
      return;
    }
    sendCipherKeyToAPI(cipherKey, "decrypt");
    const decrypted = decryptText(textToDecrypt, cipherKey);
    setDecryptedText(decrypted);
  };

  const handleClearEncrypt = () => {
    setTextToEncrypt("");
    setEncryptedText("");
  };

  const handleClearDecrypt = () => {
    setTextToDecrypt("");
    setDecryptedText("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        showToast("Text copied to clipboard", "success");
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        showToast("Failed to copy text", "error");
      }
    );
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <>
        <div className="h-[100dvh] overflow-hidden px-4 py-4 bg-cover bg-center relative flex flex-col">
          <div className="back-image" />
          <div className="flex justify-between items-center gap-3 flex-shrink-0 mb-4">
            <div className="flex gap-4 items-center">
              {/* <Link href="/dashboard"> */}
              <ChevronLeft onClick={() => router.back()} />

              {/* </Link> */}

              <span
                className={`text-[1rem] text-[#003883]`}
                style={{ fontFamily: "Lobster" }}
              >
                Encryptor
              </span>
            </div>

            <ProfileDrawer user={user} onLogout={logout} />
          </div>

          <div className="flex flex-col items-start w-full space-y-4">
            <div className="flex items-center space-x-2">
              <span>Device Status:</span>
              <div
                className={`flex items-center px-3 py-1 rounded-full ${
                  isEncrypted
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isEncrypted ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isEncrypted ? "Encrypted" : "Unencrypted"}
              </div>
            </div>

            {ipInfo && (
              <div className="w-full p-3 mt-4 text-white bg-gray-800 rounded-md">
                <p className="text-sm">IP: {ipInfo.ip}</p>
                {ipInfo.city && (
                  <>
                    <p className="text-sm">
                      Location: {ipInfo.city}, {ipInfo.region},{" "}
                      {ipInfo.country_name}
                    </p>
                    {ipInfo.connection && (
                      <p className="text-sm">ISP: {ipInfo.connection.isp}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {!isEncrypted && (
              <div className="flex flex-col items-start w-full mt-4 space-y-4">
                <hr className="w-full border-gray-300" />
                {encryptionStatus === "pending" && (
                  <div className="w-full p-4 bg-yellow-50 rounded-md">
                    <p className="font-bold text-yellow-800">
                      Pending Verification
                    </p>
                    <p className="text-sm text-gray-600">
                      Your encryption request is being reviewed.
                    </p>
                  </div>
                )}
                <a
                  href="https://device-encryption.vercel.app/"
                  className="w-full"
                >
                  <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Go To Encryptor
                  </button>
                </a>
              </div>
            )}

            {isEncrypted && (
              <>
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium">
                    Cipher Key: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter cipher here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cipherKey}
                    onChange={(e) => setCipherKey(e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium">
                    Type:
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option value="">Select method</option>
                    <option value="encrypt">Encrypt</option>
                    <option value="decrypt">Decrypt</option>
                  </select>
                </div>
              </>
            )}

            {cipherKey.trim() && (
              <div
                className={`w-full mt-3 transition-opacity duration-300 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                } ${method ? "h-auto" : "h-0 overflow-hidden"}`}
              >
                {method === "encrypt" && (
                  <div className="w-full p-4 bg-white border rounded-md shadow-sm">
                    <h3 className="mb-4 font-bold">Encryption Panel</h3>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Enter text to encrypt
                      </label>
                      <textarea
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={textToEncrypt}
                        onChange={(e) => setTextToEncrypt(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-center mb-4 space-x-4">
                      <button
                        className="px-4 py-2 text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-md hover:from-blue-500 hover:to-blue-700"
                        onClick={handleEncrypt}
                      >
                        Encrypt
                      </button>
                      <button
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                        onClick={handleClearEncrypt}
                      >
                        Clear
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Encrypted Text:
                        </span>
                        <button
                          onClick={() =>
                            encryptedText && handleCopy(encryptedText)
                          }
                          disabled={!encryptedText}
                          className={`${
                            encryptedText
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          <Copy
                            className={`w-4 h-4 ${
                              isCopied ? "text-green-500" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <textarea
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={encryptedText}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {method === "decrypt" && (
                  <div className="w-full p-4 bg-white border rounded-md shadow-sm">
                    <h3 className="mb-4 font-bold">Decryption Panel</h3>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Enter text to decrypt
                      </label>
                      <textarea
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={textToDecrypt}
                        onChange={(e) => setTextToDecrypt(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-center mb-4 space-x-4">
                      <button
                        className="px-4 py-2 text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-md hover:from-blue-500 hover:to-blue-700"
                        onClick={handleDecrypt}
                      >
                        Decrypt
                      </button>
                      <button
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                        onClick={handleClearDecrypt}
                      >
                        Clear
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Decrypted Text:
                        </span>
                        <button
                          onClick={() =>
                            decryptedText && handleCopy(decryptedText)
                          }
                          disabled={!decryptedText}
                          className={`${
                            decryptedText
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          <Copy
                            className={`w-4 h-4 ${
                              isCopied ? "text-green-500" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <textarea
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={decryptedText}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
};

export default Landing;
