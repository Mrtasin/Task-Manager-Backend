import { User } from "../models/auth.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/Api-response.js";
import { ApiError } from "../utils/api-error.js";

const addMemberToProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project id is required");
    }

    const email = req.body?.email;

    if (!email) {
      throw new ApiError(400, "Member is required");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // if (project.createdBy !== req.user?._id) {
    //   throw new ApiError(401, "You cannot add member in the project");
    // }

    const member = await User.findOne({ email });

    if (!member) {
      throw new ApiError(404, "Member not found");
    }

    const newProjectMember = await ProjectMember.create({
      user: member._id,
      project: project._id,
    });

    if (!newProjectMember) {
      throw new ApiError(401, "Adding member to project failed");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newProjectMember,
          "Adding member to project successfullt",
        ),
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Error adding member to project");
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(401, "Project id invalid");
    }

    const members = await ProjectMember.find({ project: projectId });

    if (!members) {
      throw new ApiError(404, "Not found any members in the project");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, members, "Membes Finding Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error Finding Members");
  }
};

const updateProjectMembers = async (req, res) => {

  try {
  } catch (error) {}
};

const updateMemberRole = async (req, res) => {
  const { email, username, password, fullname } = req.body;

  try {
  } catch (error) {}
};

const deleteMembers = async (req, res) => {
  const { email, username, password, fullname } = req.body;

  try {
  } catch (error) {}
};

export {
  addMemberToProject,
  getProjectMembers,
  updateProjectMembers,
  updateMemberRole,
  deleteMembers,
};
