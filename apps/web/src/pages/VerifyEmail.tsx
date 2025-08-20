import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface VerificationState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [state, setState] = useState<VerificationState>({
        loading: true,
        success: false,
        error: null,
    });
    const [resendEmail, setResendEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const verificationAttempted = useRef(false);

    useEffect(() => {
        if (token && !verificationAttempted.current) {
            verificationAttempted.current = true;
            verifyEmail(token);
        } else if (!token) {
            setState({
                loading: false,
                success: false,
                error: 'Invalid verification link',
            });
        }
    }, [token]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await fetch(`/api/v1/auth/verify-email/${verificationToken}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setState({
                    loading: false,
                    success: true,
                    error: null,
                });
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setState({
                    loading: false,
                    success: false,
                    error: data.message || 'Verification failed',
                });
            }
        } catch (error) {
            setState({
                loading: false,
                success: false,
                error: 'Network error. Please try again.',
            });
        }
    };

    const handleResendVerification = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resendEmail) {
            setResendMessage('Please enter your email address');
            return;
        }

        setResendLoading(true);
        setResendMessage('');

        try {
            const response = await fetch('/api/v1/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email: resendEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendMessage('Verification email sent successfully! Please check your inbox.');
                setResendEmail('');
            } else {
                setResendMessage(data.message || 'Failed to resend verification email');
            }
        } catch (error) {
            setResendMessage('Network error. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Email Verification
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {state.loading && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                Verifying your email...
                            </p>
                        </div>
                    )}

                    {state.success && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                                <svg
                                    className="h-6 w-6 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Email Verified Successfully!
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Your email has been verified. You can now log in to your account.
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                                Redirecting to login page in 3 seconds...
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </div>
                    )}

                    {state.error && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <svg
                                    className="h-6 w-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Verification Failed
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {state.error}
                            </p>

                            {/* Resend verification form */}
                            <div className="mt-6 border-t dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Resend Verification Email
                                </h4>
                                <form onSubmit={handleResendVerification} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="sr-only">
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 sm:text-sm sm:leading-6"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resendLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </form>
                                {resendMessage && (
                                    <p className={`mt-2 text-sm ${resendMessage.includes('successfully')
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {resendMessage}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                <Link
                                    to="/login"
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
