"use client"

import { useEffect } from "react"
import useManageProjects from "../hooks/useProjects"
import useProjectForm from "../hooks/useProjectForm"
import ProjectForm from "../components/ProjectForm"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"

const AdminProjects = () => {
  const {
    projects = [],
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    loading,
    error,
  } = useManageProjects()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const { isVisible, projectData, errors, openModal, closeModal, handleChange, handleSubmit } = useProjectForm({
    onSubmit: async (data) => {
      if (data._id) {
        await updateProject(data._id, data)
      } else {
        await createProject(data)
      }
      fetchProjects() // Refresh the list after create/update
    },
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Project Management</h2>
        <button onClick={() => openModal({})} className="btn btn-primary">
          <Plus className="w-5 h-5" />
        
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70">No projects found. Add a new project to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="card bg-base-300">
            <div className="card-body">
              <h3 className="card-title">{project.title}</h3>
              <p className="text-base-content/70">{project.description}</p>
              <div className="card-actions justify-end mt-4">
                <button onClick={() => openModal(project)} className="btn btn-sm btn-outline btn-info">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project._id).then(fetchProjects)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectForm
        isVisible={isVisible}
        projectData={projectData}
        errors={errors}
        loading={loading}
        onClose={closeModal}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AdminProjects

