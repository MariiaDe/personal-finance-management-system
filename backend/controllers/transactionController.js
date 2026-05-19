import prisma from "../config/prisma.js";

export const createTransaction = async (req, res) => {
  try {
    const { amount, description, date, categoryId, type } = req.body;
    const userId = req.user.userId;

    if (!amount || !description || !date || !categoryId || !type) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Невірний тип транзакції" });
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

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        description,
        date: new Date(date),
        type,
        source: "manual",
        userId,
        categoryId: Number(categoryId)
      },
      include: {
        category: true
      }
    });

    return res.status(201).json({
      message: "Транзакцію створено",
      transaction
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true
      },
      orderBy: {
        date: "desc"
      }
    });

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, categoryId, type } = req.body;
    const userId = req.user.userId;

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Транзакцію не знайдено" });
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

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Невірний тип транзакції" });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: Number(id)
      },
      data: {
        amount: amount ? Number(amount) : existingTransaction.amount,
        description: description ?? existingTransaction.description,
        date: date ? new Date(date) : existingTransaction.date,
        categoryId: categoryId ? Number(categoryId) : existingTransaction.categoryId,
        type: type ?? existingTransaction.type
      },
      include: {
        category: true
      }
    });

    return res.status(200).json({
      message: "Транзакцію оновлено",
      transaction: updatedTransaction
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Транзакцію не знайдено" });
    }

    await prisma.transaction.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      message: "Транзакцію видалено"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
