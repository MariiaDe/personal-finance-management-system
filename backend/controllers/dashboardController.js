import prisma from "../config/prisma.js";
import {
  buildFinancialAnalysis,
  filterTransactionsByPeriod,
  generateRecommendations
} from "../services/analysisService.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = req.query.period || "month";
    const from = req.query.from;
    const to = req.query.to;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true
      },
      orderBy: {
        date: "desc"
      }
    });

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true
      }
    });

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferredCurrency: true,
        recommendationsEnabled: true
      }
    });

    const periodTransactions = filterTransactionsByPeriod(transactions, period, from, to);
    const analysis = buildFinancialAnalysis(periodTransactions, budgets, goals);
    const recommendations = user?.recommendationsEnabled
      ? generateRecommendations(analysis, user.preferredCurrency)
      : [];

    return res.status(200).json({
      summary: {
        totalIncome: analysis.totalIncome,
        totalExpense: analysis.totalExpense,
        balance: analysis.balance,
        transactionCount: periodTransactions.length,
        budgetCount: budgets.length,
        goalCount: goals.length,
        averageDailyExpense: analysis.averageDailyExpense,
        maxDailyExpense: analysis.maxDailyExpense,
        isNegativeBalance: analysis.balance < 0,
        debtAmount: analysis.balance < 0 ? Math.abs(analysis.balance) : 0,
        overspentBudgetCount: analysis.overspentBudgets.length
      },
      recentTransactions: periodTransactions.slice(0, 5),
      expensesByCategory: analysis.expensesByCategory,
      budgets,
      goals: analysis.goalProgress,
      recommendations,
      settings: {
        preferredCurrency: user?.preferredCurrency || "UAH",
        recommendationsEnabled: user?.recommendationsEnabled ?? true,
        period
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
