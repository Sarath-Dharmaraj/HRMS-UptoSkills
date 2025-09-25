"use client"

import { useState } from "react"
import {
  FaBell,
  FaMoon,
  FaStar,
  FaShareAlt,
  FaLock,
  FaFileAlt,
  FaCookieBite,
  FaEnvelope,
  FaComment,
  FaSignOutAlt,
} from "react-icons/fa"

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)
  return { isDarkMode, toggleDarkMode }
}

// These color mapping functions are essential to this new approach.
// They return the correct class based on the current theme.
const textColor = (isDarkMode) => (isDarkMode ? "text-gray-100" : "text-gray-900")
const backgroundColor = (isDarkMode) => (isDarkMode ? "bg-gray-800" : "bg-white")
const borderColor = (isDarkMode) => (isDarkMode ? "border-gray-700" : "border-gray-200")
const hoverColor = (isDarkMode) => (isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50")
const dividerColor = (isDarkMode) => (isDarkMode ? "divide-gray-700" : "divide-gray-200")
const iconColor = (isDarkMode) => (isDarkMode ? "text-blue-400" : "text-blue-600")

function Modal({ open, title, children, onClose, footer, isDarkMode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"   
        className={`relative z-10 w-full max-w-lg rounded-xl p-4 shadow-lg outline-none ${backgroundColor(isDarkMode)}`}
      >
        <div className={`flex items-center justify-between border-b pb-2 ${borderColor(isDarkMode)}`}>
          <h4 className={`text-lg font-semibold ${textColor(isDarkMode)}`}>{title}</h4>
          <button
            onClick={onClose}
            className={`rounded p-1 text-gray-500 ${hoverColor(isDarkMode)}`}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={`mt-3 text-sm ${textColor(isDarkMode)}`}>{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

function Switch({ checked, onChange, label, isDarkMode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <span className={`text-sm ${textColor(isDarkMode)}`}>{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-blue-600 ${
            isDarkMode ? "bg-gray-600" : ""
          }`}
        />
        <span className="absolute left-1 h-4 w-4 translate-x-0 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function PillButton({ variant = "primary", className = "", isDarkMode, ...props }) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition"
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: `border border-gray-300 ${textColor(isDarkMode)} hover:bg-gray-50 ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : ""}`,
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: `${textColor(isDarkMode)} hover:bg-gray-100 ${isDarkMode ? "hover:bg-gray-700" : ""}`,
    outline: `border border-gray-300 ${textColor(isDarkMode)} hover:bg-gray-50 ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : ""}`,
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [modals, setModals] = useState({})
  const [notification, setNotification] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [toast, setToast] = useState({ show: false, message: "" })

  const toggleModal = (name) => setModals((m) => ({ ...m, [name]: !m[name] }))
  const setRating = (n) => setModals((m) => ({ ...m, ratingValue: n }))

  return (
    <main className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} ${textColor(isDarkMode)}`}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <h3 className={`text-center text-2xl font-bold ${textColor(isDarkMode)}`}>
          <u>Settings</u>
        </h3>

        <ul
          className={`mt-6 divide-y overflow-hidden rounded-xl border shadow-sm ${backgroundColor(
            isDarkMode
          )} ${dividerColor(isDarkMode)} ${borderColor(isDarkMode)}`}
        >
          <li className={`flex items-center justify-between gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}>
            <div className="flex items-center gap-3">
              <FaBell className={`${iconColor(isDarkMode)}`} />
              <span className="font-medium">Notification</span>
            </div>
            <Switch checked={notification} onChange={setNotification} isDarkMode={isDarkMode} />
          </li>

          <li className={`flex items-center justify-between gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}>
            <div className="flex items-center gap-3">
              <FaMoon className={`${iconColor(isDarkMode)}`} />
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch checked={isDarkMode} onChange={toggleDarkMode} isDarkMode={isDarkMode} />
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("rateApp")}
          >
            <FaStar className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Rate App</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("shareApp")}
          >
            <FaShareAlt className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Share App</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("privacyPolicy")}
          >
            <FaLock className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Privacy Policy</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("terms")}
          >
            <FaFileAlt className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Terms and Conditions</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("cookies")}
          >
            <FaCookieBite className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Cookies Policy</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("contact")}
          >
            <FaEnvelope className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Contact</span>
          </li>

          <li
            className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${hoverColor(isDarkMode)}`}
            onClick={() => toggleModal("feedback")}
          >
            <FaComment className={`${iconColor(isDarkMode)}`} />
            <span className="font-medium">Feedback</span>
          </li>

          <li
            className={`flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 ${
              isDarkMode ? "text-red-400 hover:bg-red-900/20" : ""
            }`}
            onClick={() => toggleModal("logout")}
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </li>
        </ul>
      </div>

      {/* Rate App */}
      <Modal
        open={!!modals.rateApp}
        title="Rate App"
        onClose={() => toggleModal("rateApp")}
        isDarkMode={isDarkMode}
        footer={
          <PillButton
            onClick={() => {
              setToast({ show: true, message: `Thank you for rating us ${modals.ratingValue || 0} stars!` })
              toggleModal("rateApp")
              setTimeout(() => setToast({ show: false, message: "" }), 3000)
            }}
            isDarkMode={isDarkMode}
          >
            Submit
          </PillButton>
        }
      >
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              className={`mr-2 text-2xl ${
                n <= (modals.ratingValue || 0) ? "text-yellow-400" : `text-gray-300 ${isDarkMode ? "text-gray-600" : ""}`
              }`}
              onClick={() => setRating(n)}
              role="button"
              aria-label={`Rate ${n} star`}
            />
          ))}
        </div>
      </Modal>

      {/* Share App */}
      <Modal open={!!modals.shareApp} title="Share App" onClose={() => toggleModal("shareApp")} isDarkMode={isDarkMode}>
        <p className="mb-3">Select a platform to share:</p>
        <div className="flex flex-wrap gap-2">
          <PillButton variant="outline" isDarkMode={isDarkMode}>
            WhatsApp
          </PillButton>
          <PillButton variant="outline" isDarkMode={isDarkMode}>
            Facebook
          </PillButton>
          <PillButton variant="outline" isDarkMode={isDarkMode}>
            Telegram
          </PillButton>
        </div>
      </Modal>

      {/* Privacy Policy */}
      <Modal open={!!modals.privacyPolicy} title="Privacy Policy" onClose={() => toggleModal("privacyPolicy")} isDarkMode={isDarkMode}>
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          <p>
            At <b>UPTOSKILLS</b>, your privacy is our top priority. Our HRMS-SOCIAL-CONNECT platform ensures that personal and professional information is handled with utmost care and in compliance with data protection standards.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>No sharing of personal data with third parties.</li>
            <li>Data is collected only to enhance employee engagement and HR functionality.</li>
            <li>All communication is encrypted and secure.</li>
            <li>Employees have full control over their shared data.</li>
          </ul>
          <p>
            For more information, contact us at{" "}
            <a className={`text-blue-600 underline ${isDarkMode ? "text-blue-400" : ""}`} href="mailto:privacy@uptoskills.com">
              privacy@uptoskills.com
            </a>
          </p>
        </div>
      </Modal>

      {/* Terms */}
      <Modal open={!!modals.terms} title="Terms and Conditions" onClose={() => toggleModal("terms")} isDarkMode={isDarkMode}>
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          <p>
            By using <b>UPTOSKILLS - HRMS-SOCIAL-CONNECT</b>, users agree to the following terms:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The platform is intended solely for internal professional use.</li>
            <li>Misuse or sharing of inappropriate content is prohibited.</li>
            <li>Access may be monitored to ensure ethical usage.</li>
            <li>Violation of terms may result in access restriction or legal action.</li>
          </ul>
          <p>Continued use of the platform implies acceptance of these terms and any future updates.</p>
        </div>
      </Modal>

      {/* Cookies */}
      <Modal open={!!modals.cookies} title="Cookies Policy" onClose={() => toggleModal("cookies")} isDarkMode={isDarkMode}>
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          <p>
            <b>UPTOSKILLS</b> uses cookies to improve user experience on the HRMS-SOCIAL-CONNECT platform:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Remember login and preferences for seamless access.</li>
            <li>Track non-personal analytics to optimize features.</li>
            <li>Improve platform performance and responsiveness.</li>
          </ul>
          <p>
            We do <b>not</b> use cookies for advertising or third-party tracking. You can disable cookies in your browser settings, but some features may be limited.
          </p>
        </div>
      </Modal>

      {/* Contact */}
      <Modal open={!!modals.contact} title="Contact" onClose={() => toggleModal("contact")} isDarkMode={isDarkMode}>
        <ul className="space-y-1">
          <li>
            <b>Email:</b>{" "}
            <a className={`text-blue-600 underline ${isDarkMode ? "text-blue-400" : ""}`} href="mailto:support@uptoskills.com">
              support@uptoskills.com
            </a>
          </li>
          <li>
            <b>Phone:</b> +91 98765 43210
          </li>
          <li>
            <b>Office:</b> UPTOSKILLS Pvt. Ltd., Pune, Maharashtra
          </li>
          <li>
            <b>Support Hours:</b> Mon–Fri, 10:00 AM – 6:00 PM
          </li>
        </ul>
      </Modal>

      {/* Feedback */}
      <Modal
        open={!!modals.feedback}
        title="Feedback"
        onClose={() => toggleModal("feedback")}
        isDarkMode={isDarkMode}
        footer={
          <PillButton
            onClick={() => {
              if (feedbackText.trim()) {
                setToast({ show: true, message: "✅ Thank you for your feedback!" })
                setFeedbackText("")
                toggleModal("feedback")
                setTimeout(() => setToast({ show: false, message: "" }), 3000)
              } else {
                alert("Please enter feedback.")
              }
            }}
            isDarkMode={isDarkMode}
          >
            Submit
          </PillButton>
        }
      >
        <div className="space-y-2">
          <label htmlFor="feedback" className={`text-sm font-medium ${textColor(isDarkMode)}`}>
            Your Feedback
          </label>
          <textarea
            id="feedback"
            rows={3}
            placeholder="Write your feedback here..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${borderColor(isDarkMode)} ${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          />
        </div>
      </Modal>

      {/* Logout */}
      <Modal
        open={!!modals.logout}
        title="Logout Confirmation"
        onClose={() => toggleModal("logout")}
        isDarkMode={isDarkMode}
        footer={
          <>
            <PillButton variant="danger" className="mr-2" isDarkMode={isDarkMode}>
              Yes, Logout
            </PillButton>
            <PillButton variant="secondary" onClick={() => toggleModal("logout")} isDarkMode={isDarkMode}>
              Cancel
            </PillButton>
          </>
        }
      >
        <p>Are you sure you want to logout?</p>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <div className="fixed right-3 top-3 z-50 rounded-md bg-green-600 px-4 py-2 text-white shadow">
          <div className="font-semibold">HRMS</div>
          <div className="text-sm">{toast.message}</div>
        </div>
      )}
    </main>
  )
}