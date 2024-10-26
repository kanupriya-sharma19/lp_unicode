import {Job} from "../models/job.js";


async function displayjob(req, res) {
  try {
    const allJobs = await Job.find({})
    .populate({ path: 'Recruiter_id', model: 'Recruiters' }) 
    .populate({ path: 'Company_id', model: 'Company' });

    res.status(200).json(allJobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get jobs", details: error.message });
  }
}

async function postjob(req, res) {
    try {
        const { Title, Description, Requirements, Salary_range, Location, Job_type } = req.body;

        // Log the person data for debugging
        console.log('Recruiter ID:', req.person.person);
        console.log('Company ID:', req.person.companyId);

        const newJob = new Job({
            Title,
            Description,
            Requirements,
            Salary_range,
            Location,
            Job_type,
            Recruiter_id: req.person.person,   // Recruiter ID
            Company_id: req.person.companyId     // Company ID
        });

        await newJob.save();
        res.status(201).send({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).send({ message: "Error creating job", details: error.message });
    }
}



  async function updatejob(req, res) {
    try {
        const jobId = req.params.id;
        const updates = req.body;

        const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true });

        if (!updatedJob) {
            return res.status(404).send({ message: "Job not found" });
        }

        res.status(200).send({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        res.status(500).send({ message: "Error updating job", details: error.message });
    }
  }
  
  
  async function deletejob(req, res) {
    try {
        const jobId = req.params.id;

        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).send({ message: "Job not found" });
        }

        res.status(200).send({ message: "Job deleted successfully", job: deletedJob });
    } catch (error) {
        res.status(500).send({ message: "Error deleting job", details: error.message });
    }
  }
  
export{ displayjob, postjob, updatejob, deletejob};