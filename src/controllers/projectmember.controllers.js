import { User } from "../models/auth.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/Api-response.js";
import { ApiError } from "../utils/api-error.js";
import { UserRoleEnum } from "../utils/constants.js";

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

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });

    if (!project) {
      const member = await ProjectMember.findOne({
        user: req.user._id,
        project: projectId,
        $or: [
          { role: UserRoleEnum.PROJECT_ADMIN },
          { role: UserRoleEnum.ADMIN },
        ],
      });

      if (!member) {
        throw new ApiError(401, "You cannot add member to project");
      }
    }

    const member = await User.findOne({ email });

    if (!member) {
      throw new ApiError(404, "Member not found");
    }

    if (
      await ProjectMember.findOne({ user: member._id, project: project._id })
    ) {
      throw new ApiError(401, "Member already added in project");
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

const updateProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(403, "Project Id invalid");
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });

    if (!project) {
      const member = await ProjectMember.findOne({
        user: req.user._id,
        project: projectId,
        $or: [
          { role: UserRoleEnum.PROJECT_ADMIN },
          { role: UserRoleEnum.ADMIN },
        ],
      });

      if (!member) {
        throw new ApiError(401, "You cannot add member to project");
      }
    }

    const { oldMember, newMember } = req.body;

    if (!oldMember || !newMember) {
      throw new ApiError(401, "All fields are required");
    }

    const isOldMember = await User.findOne({ email: oldMember });

    if (!isOldMember) {
      throw new ApiError(401, "Error invalid user");
    }

    const members = await ProjectMember.find({ project: projectId });

    if (!members) {
      throw new ApiError(404, "Not found members in the project");
    }

    console.log(members);

    const existMember = members.filter((user) => user.email === oldMember);

    if (!existMember) {
      throw new ApiError(404, "This member not found in the project");
    }

    console.log(`existMember :- ${existMember}`);

    const isNewMember = await User.findOne({ email: newMember });

    if (!isNewMember) {
      throw new ApiError(401, "Error invalid new user");
    }

    const existNewMember = await ProjectMember.findOne({
      user: isNewMember._id,
      project: projectId,
    });

    if (!existNewMember) {
      throw new ApiError(403, "Member already exist in the project");
    }

    const deletedMember = await ProjectMember.deleteOne({
      user: oldMember._id,
    });

    if (!deletedMember) {
      throw new ApiError(400, "Member deleting failed");
    }

    const addMember = await ProjectMember.create({
      user: isNewMember._id,
      project: projectId,
    });

    if (!addMember) {
      throw new ApiError(401, "New member adding failed");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, addMember, "Update project member successfully"),
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel error for updating project member",
    );
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(403, "Project Id invalid");
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });

    if (!project) {
      const member = await ProjectMember.findOne({
        user: req.user._id,
        project: projectId,
        $or: [
          { role: UserRoleEnum.PROJECT_ADMIN },
          { role: UserRoleEnum.ADMIN },
        ],
      });

      if (!member) {
        throw new ApiError(401, "You cannot add member to project");
      }
    }

    const { email, role } = req.body;

    if (!email || !role) {
      throw new ApiError(401, "All fields are required");
    }

    const findingUser = await User.findOne({ email });

    if (!findingUser) {
      throw new ApiError(404, "User not found for updating member role");
    }

    const updatingMemberRole = await ProjectMember.findOne({
      user: findingUser._id,
      project: projectId,
    });

    if (!updatingMemberRole) {
      throw new ApiError(404, "Not found member in the project");
    }

    updatingMemberRole.role = role;

    await updatingMemberRole.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatingMemberRole,
          "Update member role successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel Error for updating member role",
    );
  }
};

const deleteMember = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(403, "Project Id invalid");
    }

    const { email } = req.body;

    if (!email) {
      throw new ApiError(401, "Email is required");
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });

    if (!project) {
      const member = await ProjectMember.findOne({
        user: req.user._id,
        project: projectId,
        $or: [
          { role: UserRoleEnum.PROJECT_ADMIN },
          { role: UserRoleEnum.ADMIN },
        ],
      });

      if (!member) {
        throw new ApiError(401, "You cannot add member to project");
      }
    }

    const findMember = await User.findOne({ email });

    if (!findMember) {
      throw new ApiError(404, "Error user not found for deleting member");
    }

    const deleteMember = await ProjectMember.deleteOne({
      user: findMember._id,
      project: projectId,
    });

    if (!deleteMember) {
      throw new ApiError(401, "Deleting member failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deleteMember, "Member deletion successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel Error for deleteing member",
    );
  }
};

export {
  addMemberToProject,
  getProjectMembers,
  updateProjectMember,
  updateMemberRole,
  deleteMember,
};
