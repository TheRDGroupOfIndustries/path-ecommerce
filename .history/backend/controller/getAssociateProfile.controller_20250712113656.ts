export const getAssociateDashboardDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        associate: {
          select: {
            level: true,
            percent: true,
            createdAt: true
          }
        },
        createdReferrals: {
          select: {
            id: true,
            referral: true,
            createdAt: true,
            usedBy: true,
          }
        },
        associateTransactions: {
          select: {
            id: true,
            productName: true,
            price: true,
            percent: true,
            commission: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user || !user.associate) {
      return res.status(404).json({ message: "Associate not found" });
    }

    const totalCommission = user.associateTransactions.reduce((sum, t) => sum + t.commission, 0);

    return res.status(200).json({ ...user, totalCommission });
  } catch (error) {
    console.error("Error fetching associate dashboard:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
