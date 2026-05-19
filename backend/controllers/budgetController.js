import prisma from "../config/prisma.js";

export const createBudget = async (req, res) => {
  try {
    const { amountLimit, month, year, categoryId } = req.body;
    const userId = req.user.userId;

    if (!amountLimit || !month || !year || !categoryId) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        userId
      }
    });

    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" });
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId: Number(categoryId),
        month: Number(month),
        year: Number(year)
      }
    });

    if (existingBudget) {
      return res.status(400).json({ message: "Бюджет для цієї категорії на цей місяць вже існує" });
    }

    const budget = await prisma.budget.create({
      data: {
        amountLimit: Number(amountLimit),
        month: Number(month),
        year: Number(year),
        userId,
        categoryId: Number(categoryId)
      },
      include: {
        category: true
      }
    });

    return res.status(201).json({
      message: "Бюджет створено",
      budget
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ]
    });

    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amountLimit, month, year, categoryId } = req.body;
    const userId = req.user.userId;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Бюджет не знайдено" });
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: Number(categoryId),
          userId
        }
      });

      if (!category) {
        return res.status(404).json({ message: "Категорію не знайдено" });
      }
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id: Number(id)
      },
      data: {
        amountLimit: amountLimit ? Number(amountLimit) : existingBudget.amountLimit,
        month: month ? Number(month) : existingBudget.month,
        year: year ? Number(year) : existingBudget.year,
        categoryId: categoryId ? Number(categoryId) : existingBudget.categoryId
      },
      include: {
        category: true
      }
    });

    return res.status(200).json({
      message: "Бюджет оновлено",
      budget: updatedBudget
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Бюджет не знайдено" });
    }

    await prisma.budget.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      message: "Бюджет видалено"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
