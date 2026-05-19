function buildSampleTransactions(bankAccountId) {
  const today = new Date();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      amount: 15200,
      description: "Зарплата (імпорт з банку)",
      type: "income",
      date: new Date(today.getTime() - day * 3),
      externalId: `mock-${bankAccountId}-salary`,
      categoryName: "Зарплата",
      categoryIcon: "wallet"
    },
    {
      amount: 420,
      description: "Супермаркет (імпорт з банку)",
      type: "expense",
      date: new Date(today.getTime() - day * 2),
      externalId: `mock-${bankAccountId}-groceries`,
      categoryName: "Продукти",
      categoryIcon: "categories"
    },
    {
      amount: 180,
      description: "Транспорт (імпорт з банку)",
      type: "expense",
      date: new Date(today.getTime() - day),
      externalId: `mock-${bankAccountId}-transport`,
      categoryName: "Транспорт",
      categoryIcon: "transactions"
    }
  ];
}

async function ensureCategory(prisma, userId, type, name, icon) {
  const existing = await prisma.category.findFirst({
    where: { userId, type, name }
  });

  if (existing) {
    return existing;
  }

  return prisma.category.create({
    data: {
      userId,
      type,
      name,
      icon
    }
  });
}

export async function importMockTransactions(prisma, userId, bankAccountId) {
  const samples = buildSampleTransactions(bankAccountId);
  let importedCount = 0;

  for (const sample of samples) {
    const existing = await prisma.transaction.findUnique({
      where: { externalId: sample.externalId }
    });

    if (existing) {
      continue;
    }

    const category = await ensureCategory(
      prisma,
      userId,
      sample.type,
      sample.categoryName,
      sample.categoryIcon
    );

    await prisma.transaction.create({
      data: {
        amount: sample.amount,
        description: sample.description,
        type: sample.type,
        source: "bank",
        date: sample.date,
        externalId: sample.externalId,
        userId,
        categoryId: category.id,
        bankAccountId
      }
    });

    importedCount += 1;
  }

  return importedCount;
}
