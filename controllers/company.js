import { Company} from "../models/company.js";


async function displayComp(req, res) {
  try {
    const allComp = await Company.find({}).populate({ path: 'Recruiters', model: 'Recruiters' });
    res.status(200).json(allComp);
  } catch (error) {
    res.status(500).json({ error: "Failed to get Companies", details: error.message });
  }
}

  
  async function postComp(req, res) {
    try {
      const { Name,Website,Industry,Recruiters,Description } = req.body;
      const company = new Company({
        Name,Website,Industry,Recruiters,Description
      });
      await company.save().populate({ path: 'Recruiters', model: 'Recruiters' });
      res.status(200).send({ message: "Company created successfully",company });
    } catch (error) {
      
      res.status(500).send({ message: "Error in making",error });
    }
  }
  async function updateComp(req, res) {
    try {
      const companyId = req.params.id;
      const recruiterId = req.body.Recruiters;
      if (!recruiterId) {
        return res.status(400).send({ message: "Recruiter ID is required" });
      }
const updatedComp = await Company.findByIdAndUpdate(
        companyId,
        { $addToSet: { Recruiters: recruiterId } }, 
        { new: true } 
      );
      if (!updatedComp) {
        return res.status(404).send({ message: "Company not found" });
      }

      res.status(200).send({ message: "Company updated successfully", updatedComp });
    } catch (error) {
      res.status(500).send({ message: "Error updating Company", details: error.message });
    }
  }
  
  
  async function deleteComp(req, res) {
    try {
      const companyId = req.params.id;
      const Company = await Company.findOneAndDelete({_id: companyId });
  
      if (Company) {
        res.status(200).json({
          message: "Company deleted successfully",Company
        });
      } else {
        res.status(404).json({ error: "Company not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Error deleting Company", err });
    }
  }
  
export{ displayComp, postComp, updateComp, deleteComp};