import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAdvancedAdminStats = async () => {
  const [revenue, userStats, ticketTrends] = await Promise.all([
    // Sum total revenue
    prisma.payment.aggregate({ _sum: { amount: true } }),
    // Count users by role
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    // Fetch last 6 months of sales for charts
    prisma.$queryRaw`
      SELECT date_trunc('month', "purchaseDate") AS month, SUM("pricePaid") AS total
      FROM "Ticket"
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `,
  ]);

  return {
    totalRevenue: revenue._sum.amount || 0,
    userDistribution: userStats,
    monthlyTrends: ticketTrends,
  };
};

export const getOrganizerPerformance = async (organizerId) => {
  return await prisma.event.findMany({
    where: { organizerId },
    select: {
      title: true,
      totalTickets: true,
      availableTickets: true,
      _count: { select: { tickets: true } },
    },
  });
};
