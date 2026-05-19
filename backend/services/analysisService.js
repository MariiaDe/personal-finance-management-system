const PERIOD_RANGES = {
  day: 1,
  week: 7,
  month: 31,
  year: 365
};

function buildDateRange(period = "month", from, to) {
  const now = new Date();

  if (period === "custom" && from && to) {
    return {
      start: new Date(from),
      end: new Date(to)
    };
  }

  if (period === "all") {
    return {
      start: new Date("1970-01-01T00:00:00.000Z"),
      end: now
    };
  }

  const days = PERIOD_RANGES[period] ?? PERIOD_RANGES.month;
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  return { start, end: now };
}

export function filterTransactionsByPeriod(transactions, period = "month", from, to) {
  const { start, end } = buildDateRange(period, from, to);

  return transactions.filter((item) => {
    const transactionDate = new Date(item.date);
    return transactionDate >= start && transactionDate <= end;
  });
}

export function sanitizeTransactions(transactions) {
  return transactions.filter(
    (item) =>
      Number.isFinite(Number(item.amount)) &&
      Number(item.amount) >= 0 &&
      item.category &&
      item.type &&
      ["income", "expense"].includes(item.type)
  );
}

export function buildFinancialAnalysis(transactions, budgets, goals) {
  const validTransactions = sanitizeTransactions(transactions);
  const incomeTransactions = validTransactions.filter((item) => item.type === "income");
  const expenseTransactions = validTransactions.filter((item) => item.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategoryMap = {};
  const expensesByDayMap = {};

  expenseTransactions.forEach((item) => {
    const categoryName = item.category?.name || "Інше";
    const dayKey = new Date(item.date).toISOString().slice(0, 10);

    expensesByCategoryMap[categoryName] = (expensesByCategoryMap[categoryName] || 0) + Number(item.amount);
    expensesByDayMap[dayKey] = (expensesByDayMap[dayKey] || 0) + Number(item.amount);
  });

  const expensesByCategory = Object.entries(expensesByCategoryMap).map(([category, amount]) => ({
    category,
    amount: Number(amount.toFixed(2))
  }));

  const dayEntries = Object.values(expensesByDayMap);
  const averageDailyExpense = dayEntries.length
    ? Number((dayEntries.reduce((sum, value) => sum + value, 0) / dayEntries.length).toFixed(2))
    : 0;
  const maxDailyExpense = dayEntries.length ? Math.max(...dayEntries) : 0;

  const categoryShares = expensesByCategory.map((item) => ({
    ...item,
    sharePercent: totalExpense > 0 ? Number(((item.amount / totalExpense) * 100).toFixed(2)) : 0
  }));

  const midpoint = Math.floor(expenseTransactions.length / 2);
  const firstHalf = expenseTransactions.slice(0, midpoint).reduce((sum, item) => sum + Number(item.amount), 0);
  const secondHalf = expenseTransactions.slice(midpoint).reduce((sum, item) => sum + Number(item.amount), 0);
  const spendingTrend = secondHalf > firstHalf ? "up" : secondHalf < firstHalf ? "down" : "stable";

  const budgetsWithStatus = budgets.map((budget) => {
    const spent = expenseTransactions
      .filter((item) => item.categoryId === budget.categoryId)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const exceededBy = spent - Number(budget.amountLimit);
    return {
      ...budget,
      spent,
      exceeded: exceededBy > 0,
      exceededBy: exceededBy > 0 ? Number(exceededBy.toFixed(2)) : 0,
      usagePercent: budget.amountLimit > 0 ? Number(((spent / budget.amountLimit) * 100).toFixed(2)) : 0
    };
  });

  const overspentBudgets = budgetsWithStatus.filter((item) => item.exceeded);
  const goalProgress = goals.map((goal) => ({
    ...goal,
    progressPercent:
      goal.targetAmount > 0 ? Number(((goal.savedAmount / goal.targetAmount) * 100).toFixed(2)) : 0
  }));

  return {
    totalIncome,
    totalExpense,
    balance,
    averageDailyExpense,
    maxDailyExpense,
    expensesByCategory,
    categoryShares,
    budgetsWithStatus,
    overspentBudgets,
    spendingTrend,
    goalProgress
  };
}

export function generateRecommendations(analysis, currencyLabel = "UAH") {
  const recommendations = [];

  analysis.overspentBudgets.forEach((budget) => {
    recommendations.push({
      type: "budget",
      icon: "budget",
      title: `Перевищення бюджету: ${budget.category?.name || "Категорія"}`,
      message: `Витрати перевищили ліміт на ${budget.exceededBy} ${currencyLabel}. Варто скоротити витрати або переглянути ліміт на наступний період.`
    });
  });

  if (analysis.spendingTrend === "up") {
    recommendations.push({
      type: "trend",
      icon: "statistics",
      title: "Негативний тренд витрат",
      message: "Протягом останнього інтервалу витрати зростали. Перевірте категорії, які дали найбільший приріст, і встановіть контрольний ліміт."
    });
  }

  analysis.categoryShares
    .filter((item) => item.sharePercent > 40)
    .forEach((item) => {
      recommendations.push({
        type: "category-share",
        icon: "categories",
        title: `Дисбаланс витрат: ${item.category}`,
        message: `Категорія займає ${item.sharePercent}% усіх витрат. Рекомендовано зменшити її на 10–15% для покращення балансу.`
      });
    });

  if (analysis.balance < 0) {
    recommendations.push({
      type: "balance",
      icon: "profile",
      title: "Від'ємний баланс",
      message: "За поточний період витрати перевищили доходи. Варто переглянути найбільші категорії витрат і скоригувати бюджет."
    });
  }

  analysis.goalProgress
    .filter((goal) => goal.progressPercent < 35)
    .forEach((goal) => {
      recommendations.push({
        type: "goal",
        icon: "goals",
        title: `Повільний прогрес цілі: ${goal.title}`,
        message: `Поточний прогрес лише ${goal.progressPercent}%. Збільшіть регулярні внески або оновіть дедлайн.`
      });
    });

  if (recommendations.length === 0) {
    recommendations.push({
      type: "positive",
      icon: "dashboard",
      title: "Баланс стабільний",
      message: "Ключові показники в межах норми. Продовжуйте дотримуватись поточного плану витрат і накопичень."
    });
  }

  return recommendations.slice(0, 6);
}
