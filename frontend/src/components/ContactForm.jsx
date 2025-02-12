import { useState } from "react"
import { Send, User, Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

const ContactForm = () => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
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
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setErrors({ submit: "Failed to send message. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" flex items-center justify-center py-4 px-6">
      <div className="card w-full max-w-2xl bg-base-300 ">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center mb-8">Get in Touch</h2>

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

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered focus:outline-none w-full pl-10 ${errors.name ? "input-error" : ""}`}
                    placeholder="Your full name"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                </div>
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input input-bordered focus:outline-none w-full pl-10 ${errors.email ? "input-error" : ""}`}
                    placeholder="your.email@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Subject</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input input-bordered focus:outline-none w-full ${errors.subject ? "input-error" : ""}`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.subject}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Message</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`textarea textarea-bordered focus:outline-none h-32 w-full pl-10 ${errors.message ? "textarea-error" : ""}`}
                    placeholder="Your message here..."
                  />
                  <MessageSquare className="absolute left-3 top-3 text-base-content/50 w-5 h-5" />
                </div>
                {errors.message && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.message}</span>
                  </label>
                )}
              </div>

              <div className="card-actions justify-end mt-6">
                <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? (
                    "Sending..."
                  ) : (
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
  )
}

export default ContactForm;

