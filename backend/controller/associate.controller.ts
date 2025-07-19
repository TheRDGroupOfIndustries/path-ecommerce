import { deleteAssociate, updateAssociate } from "../model/associate.model.js";



export const updateAssociateController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {level, percent} = req.body;
        if (!id || !level || !percent) {
            return res.status(400).json({ message: "ID, level, and percent are required" });
        }
        const updated = await updateAssociate(id, level, percent);
        return res.status(200).json(updated);
    } catch (error) {
        console.error("Error updating associate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteAssociateController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }
        await deleteAssociate(id);

        return res.status(200).json({ message: "Associate deleted successfully" });
    } catch (error) {
        console.error("Error deleting associate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
