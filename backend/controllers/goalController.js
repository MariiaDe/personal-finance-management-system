import prisma from "../config/prisma.js";

export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline, status } = req.body;
    const userId = req.user.userId;

    if (!title || !targetAmount) {
      return res.status(400).json({ message: "Назва і цільова сума обов'язкові" });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount: Number(targetAmount),
        savedAmount: savedAmount ? Number(savedAmount) : 0,
        deadline: deadline ? new Date(deadline) : null,
        status: status ?? "active",
        userId
      }
    });

    return res.status(201).json({
      message: "Ціль створено",
      goal
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, savedAmount, deadline, status } = req.body;
    const userId = req.user.userId;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Ціль не знайдено" });
    }

    const updatedGoal = await prisma.goal.update({
      where: {
        id: Number(id)
      },
      data: {
        title: title ?? existingGoal.title,
        targetAmount: targetAmount ? Number(targetAmount) : existingGoal.targetAmount,
        savedAmount: savedAmount !== undefined ? Number(savedAmount) : existingGoal.savedAmount,
        deadline: deadline ? new Date(deadline) : existingGoal.deadline,
        status: status ?? existingGoal.status
      }
    });

    return res.status(200).json({
      message: "Ціль оновлено",
      goal: updatedGoal
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Ціль не знайдено" });
    }

    await prisma.goal.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      message: "Ціль видалено"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
