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
                });
                newUser.save();
            } else {
                if (req.body.access_token != user.access_token) {
                    user.access_token = req.body.access_token;
                    await user.save();
                }
            }
        });
        res.sendStatus(200);
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

router.get("/auth-pfp", async (req, res) => {
    if (req.query.access_token !== "") {
        let user = await User.findOne({ access_token: req.query.access_token });
        if (user) {
            res.json({ pfp: user.pfp_url });
        } else {
            res.json({ pfp: false });
        }
    } else {
        res.json({ pfp: false });
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

router.get("/:id", async (req, res) => {
    let user = await User.findOne({ _id: req.params.id });
    res.json({user});
})

router.get("/info", async (req, res) => {
    const user = await User.findOne({ access_token: req.query.access_token });
    res.json({ user });
});

router.post("/update", async (req, res) => {
    await User.updateOne(
        { access_token: req.query.access_token },
        {
            $set: req.body,
        }
    );
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

router.get("/get", async (req, res) => {
    try {
        const users = await User.find().sort({ username: 1 });
        res.json({ users: users });
    } catch (err) {
        res.json({ err: err });
    }
});

router.put("/user-details", async (req, res) => {
    try {
        const { username, about, org, title, country, city, skills, links } =
            req.body;
        const user = await User.findOne({
            access_token: req.query.access_token,
        });

        if (user) {
            await User.updateOne(
                { access_token: req.query.access_token },
                {
                    $set: {
                        username: username ? username : "",
                        about: about ? about : "",
                        org: org ? org : "",
                        title: title ? title : "",
                        country: country ? country : "",
                        city: city ? city : "",
                        skills: skills ? skills : "",
                        links: links ? links : "",
                    },
                }
            );

            res.json({ done: true });
        } else {
            res.json({ err: "User not found" });
        }
    } catch (err) {
        res.json({ err: err });
    }
});

module.exports = router;
