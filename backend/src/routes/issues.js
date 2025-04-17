const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const Issue = require("../models/Issue");

// Get all issues (filtered based on user role)
router.get("/", auth, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Filter sensitive issues for non-admin users
    if (req.user.role !== "admin") {
      query.isSensitive = false;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Apply category filter
    if (category && category !== "all") {
      query.category = category;
    }

    const issues = await Issue.find(query)
      .sort({ upvotes: -1, downvotes: 1 })
      .populate("reporterId", "name email");

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new issue
router.post("/", auth, async (req, res) => {
  try {
    const issue = new Issue({
      ...req.body,
      reporterId: req.user._id,
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update issue status (admin only)
router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment to issue
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.comments.push({
      userId: req.user._id,
      userName: req.user.name,
      content,
    });

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vote on issue
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Remove existing votes
    issue.upvotedBy = issue.upvotedBy.filter((id) => !id.equals(req.user._id));
    issue.downvotedBy = issue.downvotedBy.filter(
      (id) => !id.equals(req.user._id)
    );

    if (voteType === "up") {
      issue.upvotedBy.push(req.user._id);
    } else if (voteType === "down") {
      issue.downvotedBy.push(req.user._id);
    }

    issue.upvotes = issue.upvotedBy.length;
    issue.downvotes = issue.downvotedBy.length;

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
