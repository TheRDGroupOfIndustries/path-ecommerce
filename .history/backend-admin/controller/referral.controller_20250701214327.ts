



// import { Request, Response } from "express";
// import db from "../client/connect.js";
// import { getReferralByUser, createReferral, updateReferralUsedBy } from "../model/referral.model.js";

// export const createOrUpdateReferral = async (req: Request, res: Response) => {
//   const { associateId, percent } = req.body;

//   try {
//     const user = await db.user.findUnique({ where: { id: associateId } });

//     if (!user || user.role !== "ASSOCIATE") {
//       return res.status(404).json({ error: "User not found or not an associate" });
//     }

//     const referralCode = `${user.name.toLowerCase().replace(/\s+/g, "-")}-${percent}`;

//     let referral = await getReferralByUser(associateId);

//     if (!referral) {
//       referral = await createReferral(referralCode, associateId, [associateId]);
//     } else {
//       const updatedUsedBy = referral.usedBy?.includes(associateId)
//         ? referral.usedBy
//         : [...referral.usedBy, associateId];

//       referral = await updateReferralUsedBy(referral.id, updatedUsedBy);
//     }

//     res.status(200).json({ message: "Referral processed successfully", referral });
//   } catch (err) {
//     console.error("Error processing referral:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





