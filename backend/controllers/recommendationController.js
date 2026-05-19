import prisma from "../config/prisma.js";
import {
  buildFinancialAnalysis,
  filterTransactionsByPeriod,
  generateRecommendations
} from "../services/analysisService.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferredCurrency: true,
        recommendationsEnabled: true,
        recommendationPeriod: true,
        recommendationFrom: true,
        recommendationTo: true
      }
    });

    if (!user?.recommendationsEnabled) {
      return res.status(200).json({
        enabled: false,
        recommendations: [],
        settings: {
          period: user?.recommendationPeriod || "month",
          from: user?.recommendationFrom || null,
          to: user?.recommendationTo || null
        }
      });
    }

    const period = req.query.period || user?.recommendationPeriod || "month";
    const from = req.query.from || (user?.recommendationFrom ? user.recommendationFrom.toISOString().slice(0, 10) : undefined);
    const to = req.query.to || (user?.recommendationTo ? user.recommendationTo.toISOString().slice(0, 10) : undefined);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" }
    });

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true }
    });

    const goals = await prisma.goal.findMany({
      where: { userId }
    });

    const periodTransactions = filterTransactionsByPeriod(transactions, period, from, to);
    const analysis = buildFinancialAnalysis(periodTransactions, budgets, goals);
    const recommendations = generateRecommendations(analysis, user.preferredCurrency);

    return res.status(200).json({
      enabled: true,
      period,
      recommendations,
      settings: {
        period,
        from: from || null,
        to: to || null
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
