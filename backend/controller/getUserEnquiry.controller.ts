import db from "../client/connect.js";

export const getUserEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const enquiries = await db.enquire.findMany({
      where: {
        OR: [
          { email: user.email },
          { phone: user.phone },
          { name: user.name },
        ],
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
           imageUrl: true,
          },
        },
        marketplace: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = enquiries.map((enquiry) => {
      let linkedTo = null;
      let image = null;
      let itemName = null;

      if (enquiry.property) {
        linkedTo = "property";
        image = image = enquiry.property.imageUrl?.[0] || null;
        itemName = enquiry.property.name;
      } else if (enquiry.marketplace) {
        linkedTo = "marketplace";
        image = enquiry.marketplace.imageUrl?.[0] || null;
        itemName = enquiry.marketplace.name;
      }

      return {
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        subject: enquiry.subject,
        message: enquiry.message,
        createdAt: enquiry.createdAt,
        linkedTo,
        itemId: enquiry.property?.id || enquiry.marketplace?.id || null,
        image,
        itemName,
      };
    });

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Error fetching user enquiries:", error);
    res.status(500).json({
      error: "Failed to fetch enquiries",
      details: error?.message || error,
    });
  }
};
