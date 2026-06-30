"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // State to track the generated token from Google
  const [captchaToken, setCaptchaToken] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Callback when a user completes the reCAPTCHA challenge
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    // Clear any previous captcha validation error if it exists
    if (token) {
      setErrors((prev) => {
        const { captcha, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    // Check if the captcha has been checked
    if (!captchaToken) {
      newErrors.captcha = "Please complete the captcha verification";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Append the token to the request payload for your backend controller
          body: JSON.stringify({
            ...formData,
            captchaToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Inquiry submitted successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        // Reset the reCAPTCHA widget UI and clear state token
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        setErrorMessage(data.message || "Verification failed.");
        // Reset captcha on failure so users can retry a clean session
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };
// Add this inside your component to test:
console.log("My Site Key is:", import.meta.env.VITE_RECAPTCHA_SITE_KEY);
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-3xl p-8 shadow-sm text-black"
        >
          <h2 className="text-3xl font-bold text-[#1D3549]">
            Send Inquiry
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Subject Input */}
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="mt-6">
            <textarea
              rows="6"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Google reCAPTCHA v2 Display Box */}
          <div className="mt-6 flex flex-col items-start">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
            {errors.captcha && (
              <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-[#1CA16B] text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Inquiry"}
          </button>

          {/* Status Messages */}
          {successMessage && (
            <p className="text-green-600 mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}