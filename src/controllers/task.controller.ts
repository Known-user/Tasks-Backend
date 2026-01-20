import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { requireUser } from "../utils/assertUser";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
    const user = requireUser(req);
    const userId = user.id;

    if (!title) {
        throw new AppError(400, "Title is required");
    }

    const task = await prisma.task.create({
        data: {
            title,
            userId,
        },
    });

    return res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = requireUser(req);
    const userId = user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const where: any = {
        userId,
    };

    if (status === "completed") {
        where.completed = true;
    }

    if (status === "pending") {
        where.completed = false;
    }

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    const tasks = await prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });

    const total = await prisma.task.count({ where });

    return res.json({
        page,
        limit,
        total,
        tasks,
    });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
        throw new AppError(400, "Invalid task id");
    }

    const user = requireUser(req);
    const userId = user.id;
    const { title } = req.body;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
    });

    if (!task) {
        throw new AppError(404, "Task not found");
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { title },
    });

    return res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
        throw new AppError(400, "Invalid task id");
    }

    const user = requireUser(req);
    const userId = user.id;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
    });

    if (!task) {
        throw new AppError(404, "Task not found");
    }

    await prisma.task.delete({
        where: { id: taskId },
    });

    return res.status(204).send();
});

export const toggleTask = asyncHandler(async (req: AuthRequest, res: Response) => {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
        throw new AppError(400, "Invalid task id");
    }

    const user = requireUser(req);
    const userId = user.id;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
    });

    if (!task) {
        throw new AppError(404, "Task not found");
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { completed: !task.completed },
    });

    return res.json(updatedTask);
});
