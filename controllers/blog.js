import { Blog } from "../models/blog.js";

async function displayblog(req, res) {
  try {
    const allblog = await Blog.find({});
    const promises = allblog.map(async (blog) => {
      if (blog.AuthorType === "person") {
        return Blog.populate(blog, { path: "Author_id", model: "person" });
      } else if (blog.AuthorType === "Company") {
        return Blog.populate(blog, { path: "Author_id", model: "Company" });
      }
      return blog;
    });

    const populatedBlogs = await Promise.all(promises);

    res.status(200).json(populatedBlogs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get blogs", details: error.message });
  }
}

async function postblog(req, res) {
  try {
    const { Author_id, AuthorType, Title, Content, Tags, Created_at } =
      req.body;
    const blog = new Blog({
      Author_id,
      AuthorType,
      Title,
      Content,
      Tags,
      Created_at: Created_at,
    });
    await blog.save();
    res.status(200).send({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).send({ message: "Error in making", error });
  }
}

async function updateblog(req, res) {
  try {
    const blogId = req.params.id;
    const updates = req.body;
    const updatedblog = await Blog.findByIdAndUpdate(
      blogId,
      updates,
      { new: true },
      { runValidators: true }
    );
    if (!updatedblog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.status(200).send({ message: "Blog updated successfully", updatedComp });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating Blog", details: error.message });
  }
}
async function deleteblog(req, res) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOneAndDelete({ _id: blogId });

    if (blog) {
      res.status(200).json({
        message: "Blog deleted successfully",
        blog,
      });
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting blog", details: err });
  }
}

async function displaybytags(req, res) {
  try {
    const taags = req.params.tags.split(",");
    const blogs = await Blog.find({ Tags: { $in: taags } });
    console.log("Blogs found:", blogs);

    if (blogs.length > 0) {
      res.status(200).json({
        message: "Tags found",
        blogs,
      });
    } else {
      res.status(404).json({ error: "No blogs found for the provided tags" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error getting tags", err: err.message || err });
  }
}

export { displayblog, postblog, updateblog, deleteblog, displaybytags };
