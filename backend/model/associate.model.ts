import db from "../client/connect.js";

export const getAssociateByUserId = async (userId: string) => {
  return await db.associate.findUnique({
    where: { userId }
  });
};

export const createAssociate = async (userId: string, level: number, percent: number) => {
  return await db.associate.create({
    data: { userId, level, percent }
  });
};

export const updateAssociate = async (userId: string, level: number, percent: number) => {
  return await db.associate.update({
    where: { userId },
    data: { level: Number(level), percent: Number(percent) }
  });
};

export const deleteAssociate = async (userId: string) => {
  const associate = await db.associate.findUnique({
    where: { userId },
  });

  if (!associate) {
    throw new Error("Associate not found");
  }

  await db.associate.delete({
    where: { userId },
  });

  await db.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });
};

export const deleteReferralsByAssociateId = async (userId: string) => {
  await db.referral.deleteMany({
    where: {
      createdForId: userId,
    },
  });
};


