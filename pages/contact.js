// /pages/contact.js
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
    const recaptchaRef = useRef();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const recaptchaValue = recaptchaRef.current.getValue();
        if (!recaptchaValue) {
            setStatus("❌ Please complete the reCAPTCHA.");
            return;
        }

        setStatus("Sending...");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, recaptcha: recaptchaValue }),
            });

            if (response.ok) {
                setStatus("✅ Message sent! We'll get back to you soon.");
                setFormData({ name: "", email: "", message: "" });
                recaptchaRef.current.reset();
            } else {
                setStatus("❌ Failed to send message. Please try again.");
            }
        } catch (error) {
            setStatus("❌ Failed to send message. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Contact Us</h1>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
                        >
                            Send Message
                        </button>
                    </form>

                    {status && (
                        <p className="mt-6 text-center text-lg font-semibold text-green-600">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
