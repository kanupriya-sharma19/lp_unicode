import { Application} from "../models/application.js";


async function displayapplication(req, res) {
    try {
        const applications = await Application.find().populate('user_id').populate('job_id');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  
  async function postapplication(req, res) {
    const { job_id, status ,applied_date} = req.body;
    try {
        const application = new Application({ user_id:req.person.person, job_id, status ,applied_date});
        const savedApplication = await application.save();
        res.status(201).json(savedApplication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
  async function updateapplication(req, res) {
    try {
        const appId = req.params.id;
        const updates = req.body;

        const updatedapp = await Application.findByIdAndUpdate(appId, updates, { new: true });

        if (!updatedapp) {
            return res.status(404).send({ message: "Job not found" });
        }

        res.status(200).send({ message: "Application updated successfully", application: updatedapp });
    } catch (error) {
        res.status(500).send({ message: "Error updating Application", details: error.message });
    }
  }
  
  
  async function deleteapplication(req, res) {
    try {
        const AppId = req.params.id;

        const deletedApp = await Application.findByIdAndDelete(AppId);

        if (!deletedApp) {
            return res.status(404).send({ message: "Application not found" });
        }

        res.status(200).send({ message: "Application deleted successfully", job: deletedApp });
    } catch (error) {
        res.status(500).send({ message: "Error deleting Application", details: error.message });
    }
  }
  
export{ displayapplication, postapplication, updateapplication, deleteapplication};