import { Follow } from "../models/follow.js";

async function displayfollow(req, res) {
  try {
    const allfollows = await Follow.find({}).populate("Follower_id");

    const promises = allfollows.map(async (follow) => {
      if (follow.FollowerType === "person") {
        return Follow.populate(follow, {
          path: "Following_id",
          model: "person",
        });
      } else if (follow.FollowerType === "Company") {
        return Follow.populate(follow, {
          path: "Following_id",
          model: "Company",
        });
      }
      return follow;
    });

    const populatedFollows = await Promise.all(promises);

    res.status(200).json(populatedFollows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get follows", details: error.message });
  }
}

async function postfollow(req, res) {
  try {
    const { Following_id, Follow_date, FollowerType } = req.body;
    const newfollow = new Follow({
      Follower_id: req.person.person,
      FollowerType,
      Following_id,
      Follow_date,
    });

    await newfollow.save();
    res
      .status(201)
      .send({ message: "follow created successfully", follow: newfollow });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating follow", details: error.message });
  }
}

async function deletefollow(req, res) {
  const followingId = req.params.id;
  try {
    console.log(followingId, req.person.person);
    await Follow.deleteOne({
      Following_id: followingId,
      Follower_id: req.person.person,
    });
    res.status(200).json({ message: "Successfully unfollowed" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to unfollow", details: error.message });
  }
}

async function getFollowers(req, res) {
  const userId = req.params.id;
  try {
    const followers = await Follow.find({ Following_id: userId }).populate({
      path: "Follower_id",
      model: "person",
    });
    const Name = followers.map((follower) => follower.Follower_id.Name);
    res.status(200).json({ Name });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve followers", details: error.message });
  }
}

async function getFollowing(req, res) {
  try {
    const following = await Follow.find({ Follower_id: req.person.person });
    const promises = following.map(async (follow) => {
      if (follow.FollowerType === "person") {
        return await Follow.populate(follow, {
          path: "Following_id",
          model: "person",
        });
      } else if (follow.FollowerType === "Company") {
        return await Follow.populate(follow, {
          path: "Following_id",
          model: "Company",
        });
      }
      return follow;
    });
    const populatedFollowing = await Promise.all(promises);

    const names = populatedFollowing.map((follow) => {
      const following = follow.Following_id;
      if (following) {
        return following.Name;
      }
      return null;
    });

    res.status(200).json({ names });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve followers", details: error.message });
  }
}

async function getCompanyFollowerCounts(req, res) {
  try {
    const followerCounts = await Follow.aggregate([
      { $match: { FollowerType: { $in: ["Company", "person"] } } },
      {
        $group: {
          _id: "$Following_id",
          followerCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(followerCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  displayfollow,
  postfollow,
  deletefollow,
  getFollowers,
  getFollowing,
  getCompanyFollowerCounts,
};
