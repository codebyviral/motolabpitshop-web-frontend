import React, { useState, useEffect, useRef } from "react";
import { Header, Footer } from "../components/index";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PasswordAuth = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Create axios instance with timeout and common headers
    const axiosInstance = axios.create({
        timeout: 10000, // 10 seconds timeout
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Get backend URL from environment variables
    const backendUrl = import.meta.env.VITE_BACKEND || '';

    // Check if backend URL is configured properly
    useEffect(() => {
        if (!backendUrl) {
            console.error("Backend URL environment variable is missing");
            toast.warning("Application configuration incomplete. Some features may not work properly.");
        }
    }, [backendUrl]);

    // Handle countdown timer for OTP resend
    useEffect(() => {
        let interval = null;
        if (isOtpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, isOtpSent]);

    // Handle network errors consistently
    const handleNetworkError = (error, defaultMessage = "An error occurred") => {
        console.error("API Error:", error);

        // Check if it's a network connectivity issue
        if (error.message === "Network Error" || !error.response) {
            setError("Network error. Please check your internet connection and try again.");
            toast.error("Network error. Please check your internet connection and try again.");
            return;
        }

        // Handle timeout errors
        if (error.code === "ECONNABORTED") {
            setError("Request timed out. Server may be experiencing issues.");
            toast.error("Request timed out. Server may be experiencing issues.");
            return;
        }

        // Handle server errors
        if (error.response) {
            // Get specific error message from API if available
            const errorMessage = error.response.data?.message ||
                (error.response.status === 500 ? "Server error. Please try again later." : defaultMessage);
            setError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        // Fallback for any other errors
        setError(defaultMessage);
        toast.error(defaultMessage);
    };

    // Check prerequisites before making API calls
    const checkPrerequisites = () => {
        if (!backendUrl) {
            toast.error("Application configuration error. Please contact support.");
            return false;
        }
        return true;
    };

    const handleSendOtp = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!checkPrerequisites()) return;

        setIsLoading(true);
        setError("");

        try {
            const otpResponse = await axiosInstance.post(`${backendUrl}/api/auth/otp-for-password`, { email });

            if (otpResponse && otpResponse.data) {
                setIsOtpSent(true);
                setTimer(30);
                localStorage.setItem("email", email);
                toast.success("OTP sent successfully!");

                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            handleNetworkError(error, "Failed to send OTP. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = () => {
        setOtp(["", "", "", ""]);
        handleSendOtp();
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
        setOtp(newOtp);
        if (value && index < 3 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmitOtp = async () => {
        const otpString = otp.join("");

        if (otpString.length !== 4) {
            toast.error("Please enter all 4 digits");
            return;
        }

        if (!checkPrerequisites()) return;

        setIsLoading(true);
        setError("");

        try {
            const verifyOtpResponse = await axiosInstance.post(`${backendUrl}/api/auth/verify-email`, {
                email,
                userOtp: otpString,
            });

            if (verifyOtpResponse && verifyOtpResponse.data) {
                if (verifyOtpResponse.data.success) {
                    setIsVerified(true);
                    toast.success("OTP verified successfully!");
                } else {
                    setError(verifyOtpResponse.data.message || "Invalid OTP. Please try again.");
                    toast.error(verifyOtpResponse.data.message || "Invalid OTP. Please try again.");
                }
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            handleNetworkError(error, "Failed to verify OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        // Password validation
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!checkPrerequisites()) return;

        setIsLoading(true);
        setError("");

        try {
            const resetResponse = await axiosInstance.post(`${backendUrl}/api/auth/reset-password`, {
                email,
                newPassword,
            });

            if (resetResponse && resetResponse.data) {
                if (resetResponse.data.success) {
                    setIsPasswordReset(true);
                    toast.success("Password reset successfully!");
                } else {
                    setError(resetResponse.data.message || "Failed to reset password. Please try again.");
                    toast.error(resetResponse.data.message || "Failed to reset password. Please try again.");
                }
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            handleNetworkError(error, "Failed to reset password. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Component for showing network error with retry button
    const NetworkErrorMessage = ({ message, onRetry, isRetrying }) => (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-red-600">Connection Problem</span>
            </div>
            <p className="text-sm text-red-600 mb-3">{message || "Unable to connect to the server. Please check your internet connection."}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="w-full flex justify-center items-center py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors text-sm font-medium">
                    {isRetrying ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></span>
                            Retrying...
                        </>
                    ) : "Retry Connection"}
                </button>
            )}
        </div>
    );

    // Function to retry the current operation
    const handleRetry = () => {
        setError("");
        if (isVerified) {
            handleResetPassword();
        } else if (isOtpSent) {
            handleSubmitOtp();
        } else {
            handleSendOtp();
        }
    };

    // Check if we have a network error
    const hasNetworkError = error.includes("Network error") ||
        error.includes("timed out") ||
        error.includes("connection");

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />
            <main className="flex-1 flex flex-col justify-center items-center py-8 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 border border-gray-100">
                    <div className="w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-lg -mt-6 -mx-6 sm:-mx-8 mb-6"></div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                            {isPasswordReset ? "Success" : isVerified ? "Reset Password" : isOtpSent ? "Verification" : "Password Recovery"}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {isPasswordReset
                                ? "Your password has been reset successfully"
                                : isVerified
                                    ? "Create a new password for your account"
                                    : isOtpSent
                                        ? "Enter the 4-digit code sent to your email"
                                        : "Enter your email to receive the verification code"}
                        </p>
                    </div>

                    {hasNetworkError && (
                        <NetworkErrorMessage
                            message={error}
                            onRetry={handleRetry}
                            isRetrying={isLoading}
                        />
                    )}

                    {!isOtpSent && !isVerified && !isPasswordReset && (
                        <div className="mb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500 transition"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {!isOtpSent && !isVerified && !isPasswordReset && (
                        <button
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className="w-full bg-yellow-500 text-white py-3 sm:py-4 rounded-lg font-medium tracking-wide hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 focus:outline-none transition duration-200 flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            {isLoading && (
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            )}
                            {isLoading ? "Sending..." : "Send Recovery Code"}
                        </button>
                    )}

                    {isOtpSent && !isVerified && (
                        <>
                            <div className="flex justify-center gap-2 mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        className="w-12 sm:w-14 h-12 sm:h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all duration-200 shadow-sm"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            {error && !hasNetworkError && (
                                <div className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500">
                                    {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
                                </span>
                                <button
                                    onClick={handleResendOtp}
                                    className={`text-sm font-medium ${timer > 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-yellow-600 hover:text-yellow-700"
                                        }`}
                                    disabled={timer > 0 || isLoading}
                                >
                                    Resend Code
                                </button>
                            </div>

                            <button
                                onClick={handleSubmitOtp}
                                disabled={otp.join("").length !== 4 || isLoading}
                                className={`w-full py-3 sm:py-4 rounded-lg font-medium tracking-wide transition duration-200 flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 ${otp.join("").length === 4 && !isLoading
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isLoading && (
                                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                )}
                                {isLoading ? "Verifying..." : "Verify Code"}
                            </button>
                        </>
                    )}

                    {isVerified && !isPasswordReset && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500 transition"
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500 transition"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && !hasNetworkError && (
                                <div className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleResetPassword}
                                disabled={!newPassword || !confirmPassword || isLoading}
                                className={`w-full py-3 sm:py-4 rounded-lg font-medium tracking-wide transition duration-200 flex justify-center items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 ${newPassword && confirmPassword && !isLoading
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isLoading && (
                                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                )}
                                {isLoading ? "Updating..." : "Reset Password"}
                            </button>
                        </div>
                    )}

                    {isPasswordReset && (
                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4 shadow-sm">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Password Reset Successful!</h3>
                            <p className="text-gray-600 mb-6">
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>
                            <button
                                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                onClick={() => navigate("/login")}
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PasswordAuth;