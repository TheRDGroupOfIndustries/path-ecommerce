// import db from "../client/connect.js";

// export const getReferralByUser = async (userId: string) => {
//   return await db.referral.findFirst({ where: { createdForId: userId } });
// };

// export const createReferral = async (referral: string, createdForId: string, usedBy: string[]) => {
//   return await db.referral.create({
//     data: {
//       referral,
//       createdFor: { connect: { id: createdForId } },
//       usedBy,
//     },
//   });
// };

// export const updateReferralUsedBy = async (referralId: string, usedBy: string[]) => {
//   return await db.referral.update({
//     where: { id: referralId },
//     data: { usedBy },
//   });
// };
