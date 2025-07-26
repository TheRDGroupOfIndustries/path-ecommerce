import { Router } from "express";
import { createReferral , checkReferralCode , applyReferralCode, getReferralDetails,validateReferralCode } from "../controller/referral.controller.js";
import db from "../client/connect.js";
import {deleteReferral } from "../controller/referral.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = Router();

router.post("/create-or-update", async (req, res) => {
  await createReferral(req, res);
});

router.post("/check", isAuthenticated, async (req, res) => {
   await checkReferralCode(req, res);
});


// router.get("/all", async (req, res) => {
//   try {
//     const referrals = await db.referral.findMany({
//       include: {
//         transactions: {
//           select: {
//             percent: true,
//             commission: true,
//             userId: true, 
//           }
//         }
//       }
//     });

//     const filteredReferrals = referrals.map(ref => {
//       const seenUsers = new Set();
//       const uniqueTransactions = ref.transactions.filter(tx => {
//         if (!tx.userId || seenUsers.has(tx.userId)) return false;
//         seenUsers.add(tx.userId);
//         return true;
//       });

//       const totalRevenue = uniqueTransactions.reduce((sum, tx) => sum + tx.commission, 0);

//       return {
//         ...ref,
//         transactions: uniqueTransactions,
//         totalRevenue, 
//       };
//     });

//     res.status(200).json(filteredReferrals);
//   } catch (err) {
//     console.error("Error fetching referrals:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/all", async (req, res) => {
  try {
    const referrals = await db.referral.findMany({
      include: {
        createdFor: {
          select: { id: true, name: true, email: true }
        },
        usedByUsers: {
          select: { id: true, name: true, email: true, createdAt: true }
        },
        transactions: {
          select: {
            percent: true,
            commission: true,
            userId: true,
            user: {
              select: { id: true, name: true, email: true }
            },
          },
        },
      },
    });

    // Fetch all Enquiries with referralCode
    const enquiries = await db.enquire.findMany({
      where: {
        referralCode: { not: null }
      },
      select: {
        referralCode: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true,
      }
    });

    const formatted = referrals.map((ref) => {
      // Unique users for purchase tracking
      const seenUsers = new Set();
      const uniqueTransactions = ref.transactions.filter(tx => {
        if (!tx.userId || seenUsers.has(tx.userId)) return false;
        seenUsers.add(tx.userId);
        return true;
      });

      const totalRevenue = uniqueTransactions.reduce((sum, tx) => sum + tx.commission, 0);

      // Get enquiries matching this referral code
      const matchingEnquiries = enquiries.filter(eq => eq.referralCode === ref.referral);

      return {
        id: ref.id,
        referralCode: ref.referral,
        createdFor: ref.createdFor,

        // Users referral in signup
        usedAtSignupUsers: ref.usedByUsers,

        // Users who used referral in purchase
        usedAtPurchaseUsers: uniqueTransactions.map(tx => tx.user),

        // Enquiry submissions using this referral
        usedInEnquiries: matchingEnquiries,

       
        totalRevenue,
        totalUsedBy: {
          signup: ref.usedByUsers.length,
          purchase: seenUsers.size,
          enquiry: matchingEnquiries.length
        }
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching referrals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/apply",isAuthenticated, async (req,res) => {
  await applyReferralCode(req,res);
});



router.delete("/:id", async (req, res) => {
  await deleteReferral(req, res);
});

// Get Full Referral Details (Per Associate)
router.get("/detail/:id", async (req, res) => {
   await getReferralDetails(req, res);
  });


router.get("/validate/:code", validateReferralCode);


export default router;
