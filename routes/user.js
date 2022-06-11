const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const Comment = require("../models/Comment");
const MailList = require("../models/MailingListEmail");
const Post = require("../models/Post");

const DISCORD_CLIENT_ID = "830041863247495168";

router.post("/gauth", async (req, res) => {
    try {
        User.findOne({ google_id: req.body.googleId }).then(async (user) => {
            if (!user) {
                let username = req.body.email.split("@")[0];
                req.body.imageUrl = req.body.imageUrl.slice(0, -4);
                req.body.imageUrl = `${req.body.imageUrl}1000-c`;
                let newUser = User({
                    email: req.body.email,
                    name: req.body.name,
                    given_name: req.body.givenName,
                    family_name: req.body.familyName,
                    google_id: req.body.googleId,
                    pfp_url: req.body.imageUrl,
                    access_token: req.body.access_token,
                    username: username,
                    setUp: false,
                });
                await newUser.save();
                return res.json({ user: newUser });
            } else {
                if (req.body.access_token != user.access_token) {
                    user.access_token = req.body.access_token;
                    await user.save();
                    return res.json({ user });
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/discordauth", (req, res) => {
    res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}%2Fuser%2Fdiscordauth%2Fcallback&response_type=code&scope=identify&state=${req.query.access_token}`
    );
});

router.get("/discordauth/callback", async (req, res) => {
    try {
        const code = req.query.code;
        const access_token = req.query.state;
        let response = await axios
            .post(
                "https://discord.com/api/oauth2/token",
                `client_id=${DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${process.env.BASE_URL}/user/discordauth/callback&scopes=identify`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
            .catch((err) => {
                console.log(err);
            });
        User.findOne({ access_token: access_token }).then(async (user) => {
            if (user) {
                user.discord_auth = response.data;
                let discord_user = await axios.get(
                    "https://discord.com/api/users/@me",
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${response.data.access_token}`,
                        },
                    }
                );
                if (!user.socials) {
                    user.socials = {};
                }
                user.socials.discord = discord_user.data;
                user.save();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/pfp", async (req, res) => {
    let user = await User.findOne({ access_token: req.query.access_token });
    if (user) {
        res.redirect(user.pfp_url);
    } else {
        res.sendStatus(404);
    }
});

router.get("/id/:id", async (req, res) => {
    console.log(req.params.id);
    let user = await User.findById(req.params.id).select({
        username: 1,
        pfp_url: 1,
        name: 1,
        title: 1,
        links: 1,
        email: 1,
        about: 1,
        org: 1,
        country: 1,
        city: 1,
        skills: 1,
        _id: 1,
    });
    res.json({ user });
});

router.get("/info", async (req, res) => {
    const user = await User.findOne({
        access_token: req.query.access_token,
    }).select({
        _id: 1,
        username: 1,
        pfp_url: 1,
        name: 1,
        title: 1,
        links: 1,
        email: 1,
        about: 1,
        org: 1,
        country: 1,
        city: 1,
        skills: 1,
        setUp: 1,
    });
    res.json({ user });
});

router.post("/update", async (req, res) => {
    await User.updateOne(
        { access_token: req.query.access_token },
        {
            $set: req.body,
        }
    );
    res.json({ done: true });
});

router.delete("/delete", async (req, res) => {
    try {
        const user = await User.findOne({
            access_token: req.query.access_token,
        });

        if (req.query.email === user.email) {
            // await Comment.deleteMany({ author: user._id });
            // await Post.deleteMany({ author: user._id });
            // await MailList.deleteMany({ email: user.email });
            // await User.deleteOne({ access_token: req.query.access_token });

            res.json({ success: true });
        } else {
            res.json({ err: "email incorrect" });
        }
    } catch (err) {
        res.json({ err: err });
    }
});

router.get("/all", async (req, res) => {
    let users = await User.find()
        .select({
            pfp_url: 1,
            name: 1,
            title: 1,
            links: 1,
            _id: 1,
        })
        .sort({ name: 1 });
    res.json({ users: users });
});

module.exports = router;
