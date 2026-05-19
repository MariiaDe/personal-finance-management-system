import prisma from "../config/prisma.js";

export const createCategory = async (req, res) => {
  try {
    const { name, type, icon } = req.body;
    const userId = req.user.userId;

    if (!name || !type) {
      return res.status(400).json({ message: "Назва і тип категорії обов'язкові" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Тип категорії має бути income або expense" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        icon: icon || "categories",
        userId
      }
    });

    return res.status(201).json({
      message: "Категорію створено",
      category
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: {
        id: "asc"
      }
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, icon } = req.body;
    const userId = req.user.userId;

    const existingCategory = await prisma.category.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Категорію не знайдено" });
    }

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Тип категорії має бути income або expense" });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(id)
      },
      data: {
        name: name ?? existingCategory.name,
        type: type ?? existingCategory.type,
        icon: icon ?? existingCategory.icon
      }
    });

    return res.status(200).json({
      message: "Категорію оновлено",
      category: updatedCategory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingCategory = await prisma.category.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Категорію не знайдено" });
    }

    await prisma.category.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      message: "Категорію видалено"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
