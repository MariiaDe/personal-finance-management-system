import prisma from "../config/prisma.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrency: true,
        recommendationsEnabled: true,
        recommendationPeriod: true,
        recommendationFrom: true,
        recommendationTo: true,
        createdAt: true
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name,
      preferredCurrency,
      recommendationsEnabled,
      recommendationPeriod,
      recommendationFrom,
      recommendationTo
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        preferredCurrency,
        recommendationsEnabled,
        recommendationPeriod,
        recommendationFrom: recommendationFrom ? new Date(recommendationFrom) : null,
        recommendationTo: recommendationTo ? new Date(recommendationTo) : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrency: true,
        recommendationsEnabled: true,
        recommendationPeriod: true,
        recommendationFrom: true,
        recommendationTo: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      message: "Профіль оновлено",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка сервера",
      error: error.message
    });
  }
};
