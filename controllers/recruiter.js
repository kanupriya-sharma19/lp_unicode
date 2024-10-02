import { Recruiters} from "../models/recruiter.js";


async function displayRec(req, res) {
  try {
    const allRec = await Recruiters.find({}).populate({ path: 'CompanyId', model: 'Company' });

    res.status(200).json(allRec);
  } catch (error) {
    res.status(500).json({ error: "Failed to get recruiters", details: error.message });
  }
}

  
  async function postRec(req, res) {
    try {
      const { Name,Email,CompanyId,Description } = req.body;
      const rec = new Recruiters({
        Name,Email,CompanyId,Description
      });
      await rec.save();
      res.status(200).send({ message: "Recruiterss created successfully",rec });
    } catch (error) {
      
      res.status(500).send({ message: "Error in making",error });
    }
  }
  
  async function updateRec(req, res) {
    try {
      const recId = req.params.id;
      const updatedRec = await Recruiters.findOneAndUpdate(
        { _id: recId },
        { Name:req.body.Name,Email:req.body.Email,CompanyId:req.body.CompanyId,Description:req.body.Description}, 
        { new: true } 
      );
  
      if (!updatedRec) {
        return res.status(404).send({ message: "Recruiterss not found" });
      }
  
      res.status(200).send({ message: "Recruiterss updated successfully" ,updatedRec});
    } catch (error) {
      res.status(500).send({ message: "Error updating Recruiterss", error });
    }
  }
  
  async function deleteRec(req, res) {
    try {
      const recId = req.params.id;
      const rec = await Recruiters.findOneAndDelete({_id: recId });
  
      if (rec) {
        res.status(200).json({
          message: "Recruiters deleted successfully",rec
        });
      } else {
        res.status(404).json({ error: "Recruiterss not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Error deleting Recruiterss", err });
    }
  }
  
export{ displayRec, postRec, updateRec, deleteRec};