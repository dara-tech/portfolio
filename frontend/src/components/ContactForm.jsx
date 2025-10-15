import { useState } from "react"
import { Send, User, Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { useAdminProfile } from "../hooks/useAdminProfile"

const ContactForm = () => {
  const { formData: admin, loading: adminLoading } = useAdminProfile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setErrors({ submit: "Failed to send message. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch max-w-7xl mx-auto">
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
            <img 
              src={admin?.profilePic || "/default-profile.jpg"} 
              alt="Admin Profile" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">{admin?.username || "Admin"}</h3>
              <p className="text-lg opacity-90">{admin?.describe || "Contact me for any inquiries"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 shadow-2xl h-[600px] flex flex-col justify-center">
          {submitted ? (
            <div className="bg-green-500/20 backdrop-blur-sm text-green-400 px-6 py-4 rounded-xl border border-green-500/30 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Thank you! Your message has been sent successfully.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-6 py-4 rounded-xl border border-red-500/30 flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-lg">{errors.submit}</span>
                </div>
              )}
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <InputField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
              />
              <TextAreaField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="space-y-2">
    <label className="block">
      <span className="text-lg font-semibold text-white">{label}</span>
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 ${error ? "border-red-500/50 focus:ring-red-500/30" : ""}`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
    {error && (
      <p className="text-red-400 text-sm mt-1">{error}</p>
    )}
  </div>
)

const TextAreaField = ({ label, name, value, onChange, error, onSubmit, loading }) => (
  <div className="space-y-2">
    <label className="block">
      <span className="text-lg font-semibold text-white">{label}</span>
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-4 pr-14 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 h-32 resize-none ${error ? "border-red-500/50 focus:ring-red-500/30" : ""}`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      <button 
        type="button"
        onClick={onSubmit}
        className={`absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? (
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
    {error && (
      <p className="text-red-400 text-sm mt-1">{error}</p>
    )}
  </div>
)

export default ContactForm
