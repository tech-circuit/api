const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const Comment = require("../models/Comment");
const createNotification = require("../helpers/createNotification");

router.get("/projects/:field", (req, res) => {
    Project.find({ fields: req.params.field })
        .sort({ upload_date: -1 })
        .then((projects) => {
            if (projects.length == 0) {
                res.sendStatus(404);
            } else {
                res.json({ success: true, projects: projects });
            }
        });
});

router.get("/comments/:id", async (req, res) => {
    const pageNumber = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const totalComments = await Comment.countDocuments({
        details: { type: "project", id: req.params.id },
    });
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    console.log(startIndex, endIndex);
    let skipIndex = (req.query.page - 1) * 20;
    let response = {
        success: true,
        comments: [],
        totalComments,
        previous:
            startIndex > 0
                ? {
                      pageNumber: pageNumber - 1,
                      limit: limit,
                  }
                : null,
        next:
            endIndex < totalComments
                ? {
                      pageNumber: pageNumber + 1,
                      limit: limit,
                  }
                : null,
        rowsPerPage: limit,
    };
    let user = await User.findOne({ access_token: req.query.access_token });
    // let project = await Project.findOne({ _id: req.params.id });
    let comments = await Comment.find({
        details: { type: "project", id: req.params.id },
    })
        .sort({ date: -1 })
        .skip(startIndex)
        .limit(limit);
    let responseComments = [];
    for (let i = 0; i < comments.length; i++) {
        let commentAuthor = await User.findOne({ _id: comments[i].author });
        let commentIsMine = false;
        if (user) {
            commentIsMine =
                comments[i].author.toString().trim() ===
                user._id.toString().trim()
                    ? true
                    : false;
        }
        responseComments.push({
            comment: comments[i].comment,
            author_username: commentAuthor.username,
            author_pfp_url: commentAuthor.pfp_url,
            date: comments[i].date,
            id: comments[i]._id,
            is_mine: commentIsMine,
        });
    }
    response.comments = responseComments;
    res.json(response);
});

router.post("/comment/new", async (req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token });
    if (user) {
        let comment = new Comment({
            author: user._id,
            date: Date.now(),
            comment: req.body.comment,
            details: {
                type: "project",
                id: req.body.project_id,
            },
        });
        await comment.save();
        let { status, receivers } = await createNotification(
            user._id,
            "comment",
            { type: "project", typeID: req.body.project_id }
        );
        const resComment = {
            comment: comment.comment,
            author_username: user.username,
            author_pfp_url: user.pfp_url,
            date: comment.date,
            id: comment._id,
            is_mine: true,
        };
        if (status) {
            res.json({ success: true, comment: resComment, receivers });
        } else {
            res.json({
                success: false,
                error: "Could not create notification.",
            });
        }
    } else {
        res.json({ success: false, error: "User not found." });
    }
});

module.exports = router;
