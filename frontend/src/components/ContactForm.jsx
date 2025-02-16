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
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

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
    <div className="container w-full max-w-6xl mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-full h-full pb-[100%] rounded-lg overflow-hidden shadow-2xl">
            <img 
              src={admin?.profilePic || "/default-profile.jpg"} 
              alt="Admin Profile" 
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{admin?.username || "Admin"}</h3>
              <p className="text-sm opacity-75">{admin?.describe || "Contact me for any inquiries"}</p>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold text-center mb-8">Contact {admin?.username || "Admin"}</h2>
            {submitted ? (
              <div className="alert alert-success shadow-lg">
                <CheckCircle className="stroke-current flex-shrink-0 h-6 w-6" />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                  <div className="alert alert-error shadow-lg">
                    <AlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />
                    <span>{errors.submit}</span>
                  </div>
                )}
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />}
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
                  icon={<MessageSquare className="absolute left-3 top-3 text-base-content/50 w-5 h-5" />}
                />
                <div className="card-actions justify-end mt-6">
                  <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                    {loading ? "Sending..." : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, name, type = "text", value, onChange, error, icon }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-base font-medium">{label}</span>
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`input input-bordered focus:outline-none w-full ${icon ? "pl-10" : ""} ${error ? "input-error" : ""}`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {icon}
    </div>
    {error && (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    )}
  </div>
)

const TextAreaField = ({ label, name, value, onChange, error, icon }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-base font-medium">{label}</span>
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`textarea textarea-bordered focus:outline-none h-32 w-full ${icon ? "pl-10" : ""} ${error ? "textarea-error" : ""}`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {icon}
    </div>
    {error && (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    )}
  </div>
)

export default ContactForm
