import express from "express";

import {
  displayblog,
  postblog,
  updateblog,
  deleteblog,
  displaybytags,
} from "../controllers/blog.js";
const blog = express.Router();

blog.get("/view_blog", displayblog);
blog.post("/post_blog", postblog);
blog.patch("/update_blog/:id", updateblog);
blog.delete("/delete_blog/:id", deleteblog);
blog.get("/blog_by_tags/:tags", displaybytags);
export { blog };
