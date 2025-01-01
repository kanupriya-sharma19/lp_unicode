import { Company } from "../models/company.js";
import { Recruiters } from "../models/recruiter.js";

async function displayComp(req, res) {
  try {
    const allComp = await Company.find({}).populate({
      path: "Recruiters",
      model: "Recruiters",
    });
    // , karke u can write which info  u want {Rec,name}
    res.status(200).json(allComp);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get Companies", details: error.message });
  }
}

async function postComp(req, res) {
  try {
    const { Name, Website, Industry, Recruiters, Description } = req.body;
    const company = new Company({
      Name,
      Website,
      Industry,
      Recruiters,
      Description,
    });
    await company.save();
    res.status(200).send({ message: "Company created successfully", company });
  } catch (error) {
    res.status(500).send({ message: "Error in making", error });
  }
}
async function updateComp(req, res) {
  try {
    const companyId = req.params.id;
    const updates = req.body;
    const updatedComp = await Company.findByIdAndUpdate(
      companyId,
      updates,
      { new: true },
      { runValidators: true }
    );
    if (!updatedComp) {
      return res.status(404).send({ message: "Company not found" });
    }

    res
      .status(200)
      .send({ message: "Company updated successfully", updatedComp });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating Company", details: error.message });
  }
}

async function deleteComp(req, res) {
  try {
    const companyId = req.params.id;
    const deletedCompany = await Company.findOneAndDelete({ _id: companyId });

    if (deletedCompany) {
      res.status(200).json({
        message: "Company deleted successfully",
        deletedCompany,
      });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting company", message: err.message });
  }
}

const viewRecruiters = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId).populate(
      "Recruiters",
      "Name Email Qualification"
    );
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company doesn't have any recruiters" });
    }
    return res.status(200).json(company.Recruiters);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeRecruiter = async (req, res) => {
  try {
    const { CompanyId ,recruiterId} = req.body;
  
    const recruiter = await Recruiters.findById(recruiterId);
    const company = await Company.findById(CompanyId);
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    company.Recruiters.pull(recruiterId);
    recruiter.CompanyId= null;
    
    await recruiter.save();
    await company.save();
    return res
      .status(200)
      .json({ message: "Successfully removed the recruiter" });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const addRecruiter = async (req, res) => {
  try {
    const { CompanyId ,recruiterId} = req.body;
    const recruiter = await Recruiters.findById(recruiterId);
    const company = await Company.findById(CompanyId);
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    company.Recruiters.push(recruiterId);
   
    Recruiters.CompanyId = CompanyId;
    await recruiter.save();
    await company.save();
    return res
      .status(200)
      .json({ message: "Successfully added the recruiter" });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export { displayComp, postComp, updateComp, deleteComp ,addRecruiter,removeRecruiter,viewRecruiters};
