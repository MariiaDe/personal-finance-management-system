import prisma from "../config/prisma.js";
import { importMockTransactions } from "../services/mockBankService.js";

export const getBankAccounts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bankName: true,
        accountName: true,
        accountNumber: true,
        iban: true,
        isActive: true,
        createdAt: true
      }
    });

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const createBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bankName, accountName, iban, accountNumber } = req.body;

    if (!bankName) {
      return res.status(400).json({ message: "Назва банку обов'язкова" });
    }

    const stamp = Date.now();
    const bankAccount = await prisma.bankAccount.create({
      data: {
        bankName,
        accountName: accountName || null,
        iban: iban || null,
        accountNumber: accountNumber || null,
        providerUserId: `mock-user-${stamp}`,
        accessToken: `mock-token-${stamp}`,
        isActive: true,
        userId
      },
      select: {
        id: true,
        bankName: true,
        accountName: true,
        accountNumber: true,
        iban: true,
        isActive: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: "Банк підключено в режимі симуляції",
      bankAccount
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const syncBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!bankAccount) {
      return res.status(404).json({ message: "Підключення банку не знайдено" });
    }

    const importedCount = await importMockTransactions(prisma, userId, bankAccount.id);

    return res.status(200).json({
      message: "Симуляцію синхронізації виконано",
      importedCount
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const deleteBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        id: Number(id),
        userId
      }
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Підключення банку не знайдено" });
    }

    await prisma.bankAccount.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      message: "Підключення банку видалено"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
