import { CreateProjectOptions, DeleteProjectOptions } from "core";
import { nanoid } from "nanoid";
import { prisma } from "../prisma";

export const listProjects = async () => {
	return prisma.project.findMany();
};

export const createProject = async (project: CreateProjectOptions) => {
	return prisma.project.create({
		data: {
			name: project.name,
			connection: {
				create: {
					providerId: project.providerId,
					token: nanoid(48),
				},
			},
		},
		include: {
			connection: true,
		},
	});
};

export const deleteProject = async (project: DeleteProjectOptions) => {
	return prisma.project.delete({ where: { name: project.name } });
};

const getProjectByName = (name: string) => {
	return prisma.project.findFirst({ where: { name } });
};

const getProjectByProviderId = (providerId: number) => {
	return prisma.project.findFirst({ where: { connection: { providerId } } });
};

const getProjectByToken = (token: string) => {
	return prisma.project.findFirst({ where: { connection: { token } } });
};

export const projectWithNameExists = async (projectName: string) => {
	return (await getProjectByName(projectName)) !== null;
};

export const projectWithProviderIdExists = async (id: number) => {
	return (await getProjectByProviderId(id)) !== null;
};

export const projectWithTokenExists = async (token: string) => {
	return (await getProjectByToken(token)) !== null;
};
