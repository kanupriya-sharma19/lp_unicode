import { Application } from "../models/application.js";

async function displayAllApplication(req, res) {
  try {
    const acceptedApplications = await Application.find({ status: "accepted" })
      .populate("user_id")
      .populate("job_id");
    const rejectedApplications = await Application.find({ status: "rejected" })
      .populate("user_id")
      .populate("job_id");
    const pendingApplications = await Application.find({ status: "pending" })
      .populate("user_id")
      .populate("job_id");
    res.json({
      accepted: acceptedApplications,
      rejected: rejectedApplications,
      pending: pendingApplications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function displayapplication(req, res) {
  try {
    const applications = await Application.find({ user_id: req.person.person })
      .populate("user_id")
      .populate("job_id");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function postapplication(req, res) {
  const { job_id, status, applied_date } = req.body;
  try {
    const application = new Application({
      user_id: req.person.person,
      job_id,
      status,
      applied_date
    });
    await application.save();
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function deleteapplication(req, res) {
  try {
    const Id=req.parms.id;

    const deletedApp = await Application.findByIdAndDelete(
      Id);

    if (!deletedApp) {
      return res.status(404).send({ message: "Application not found" });
    }

    res
      .status(200)
      .send({ message: "Application deleted successfully", job: deletedApp });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting Application", details: error.message });
  }
}

export {
  displayapplication,
  postapplication,
  deleteapplication,
  displayAllApplication,
};
