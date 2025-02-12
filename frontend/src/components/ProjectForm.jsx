import { X, Save, Loader2, AlertCircle, Upload, Link, Github } from "lucide-react"

const ProjectForm = ({ isVisible, projectData, errors, loading, onClose, onChange, onSubmit }) => {
  if (!isVisible) return null

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        onChange("imageError", "Please upload an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        onChange("imageError", "Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        onChange("imagePreview", reader.result)
      }
      reader.readAsDataURL(file)

      onChange("imageFile", file)
      onChange("imageError", null)
    }
  }

  const handleRemoveImage = () => {
    onChange("imageFile", null)
    onChange("imagePreview", null)
    onChange("imageError", null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-base-100 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-base-200">
          <h3 className="text-2xl font-semibold text-base-content">
            {projectData._id ? "Edit Project" : "Create New Project"}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.submit && (
          <div className="bg-error text-error-content p-4 text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Project Title <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                value={projectData.title}
                onChange={(e) => onChange("title", e.target.value)}
                className={`input input-bordered focus:outline-none w-full ${errors.title ? "input-error" : ""}`}
                placeholder="Enter project title"
              />
              {errors.title && <span className="text-error text-xs mt-1">{errors.title}</span>}
            </div>

            <div className="form-control ">
              <label className="label">
                <span className="label-text font-medium">
                  Description <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => onChange("description", e.target.value)}
                className={`textarea w-full focus:outline-none textarea-bordered h-24 ${errors.description ? "textarea-error" : ""}`}
                placeholder="Enter project description"
              />
              {errors.description && <span className="text-error text-xs mt-1">{errors.description}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Technologies</span>
              </label>
              <input
                type="text"
                value={projectData.technologies}
                onChange={(e) => onChange("technologies", e.target.value)}
                className="input input-bordered w-full focus:outline-none"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Project Image</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {projectData.imagePreview ? (
                        <img
                          src={projectData.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-base-content opacity-50" />
                          <p className="text-sm text-base-content/70">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-base-content/50 mt-1">PNG, JPG, GIF (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                {projectData.imagePreview && (
                  <button type="button" onClick={handleRemoveImage} className="btn btn-sm btn-outline btn-error">
                    Remove
                  </button>
                )}
              </div>
              {errors.imageError && <span className="text-error text-xs mt-1">{errors.imageError}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Live URL</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectData.liveUrl}
                    onChange={(e) => onChange("liveUrl", e.target.value)}
                    className={`input input-bordered focus:outline-none pl-10 w-full ${errors.liveUrl ? "input-error" : ""}`}
                    placeholder="https://example.com"
                  />
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                </div>
                {errors.liveUrl && <span className="text-error text-xs mt-1">{errors.liveUrl}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">GitHub URL</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectData.githubUrl}
                    onChange={(e) => onChange("githubUrl", e.target.value)}
                    className={`input input-bordered focus:outline-none pl-10 w-full ${errors.githubUrl ? "input-error" : ""}`}
                    placeholder="https://github.com/username/repo"
                  />
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                </div>
                {errors.githubUrl && <span className="text-error text-xs mt-1">{errors.githubUrl}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {projectData._id ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm

