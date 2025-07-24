import { deleteAssociate, updateAssociate,deleteReferralsByAssociateId } from "../model/associate.model.js";
import db from "../client/connect.js";

export const updateAssociateController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { level, percent } = req.body;

    if (!id || !level || !percent) {
      return res.status(400).json({ message: "ID, level, and percent are required" });
    }

    const updated = await updateAssociate(id, level, percent);

    //  Also update the referral code for this associate
    const user = await db.user.findUnique({ where: { id } });
    if (user) {
      const firstName = user.name.split(" ")[0].toLowerCase();
      const newReferralCode = `${firstName}-${percent}`;

      await db.referral.updateMany({
        where: { createdForId: id },
        data: { referral: newReferralCode },
      });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating associate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// export const deleteAssociateController = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return res.status(400).json({ message: "ID is required" });
//         }
//         await deleteAssociate(id);

//         return res.status(200).json({ message: "Associate deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting associate:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }


export const deleteAssociateController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        // 🔁 First delete all referral codes linked to this associate
        await deleteReferralsByAssociateId(id);

        // 🗑 Then delete the associate
        await deleteAssociate(id);

        return res.status(200).json({ message: "Associate and related referrals deleted successfully" });
    } catch (error) {
        console.error("Error deleting associate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}