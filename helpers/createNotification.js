const Notification = require("../models/Notification");
const User = require("../models/User");
const Org = require("../models/Org");
const Project = require("../models/Project");
const Post = require('../models/Post')
const Event = require("../models/Event");

function truncateText(text) {
    if (text.length > 19) {
        return text.substring(0, 19) + "..."
    } else {
        return text
    }
}

function createNotification(sender, type, typeDetails) {
    // createNotification function details:
    // if type == request, typeDetails is {type: "orgJoin", typeID: orgID}, or {type: "eventOrgHost", typeID: orgID, eventID: eventID}
    // if type == comment, typeDetails is either {type: "project", typeID: projectID}, or {type: "post", typeID: postID}
    let promise = new Promise(async(resolve, reject) => {
        let notifs = []
        let receivers = []
        let notif = {}
        notif.type = type
        notif.typeDetails = typeDetails
        notif.sender = sender
        notif.createdAt = new Date()
        notif.meta = {}
        let user = await User.findOne({ _id: sender })
        if (type === "request") {
            let org = await Org.findOne({ _id: typeDetails.typeID });
            if (typeDetails.type === "orgJoin") {
                notif.meta.description = `${user.given_name} has requested to join '${truncateText(org.name)}' club`
            } else if (typeDetails.type === "eventOrgHost") {
                let event = await Event.findOne({ _id: typeDetails.eventID })
                notif.meta.description = `${user.given_name} is requesting '${truncateText(org.name)}' to host '${truncateText(event.name)}' event`
            }
            notif.meta.img = user.pfp_url
            receivers = org.admins
        } else if (type === "comment") {
            if (typeDetails.type === "project") {
                let project = await Project.findOne({ _id: typeDetails.typeID })
                notif.meta.description = `${user.given_name} has commented on your project '${truncateText(project.title)}'`
                notif.meta.img = project.cover_image
                receivers = [project.uploader]
            } else if (typeDetails.type === "post") {
                let post = await Post.findOne({ _id: typeDetails.typeID })
                notif.meta.description = `${user.given_name} has commented on your post '${truncateText(post.title)}'`
                notif.meta.img = user.pfp_url
                receivers = [post.author]
            }
        }
        for (let i = 0; i < receivers.length; i++) {
            notif.receiver = receivers[i]
            notifs.push(notif)
        }
        let bool = await Notification.insertMany(notifs)
        resolve(bool) // set bool to status of adding to db (true or false)
    })
    return promise
}

module.exports = createNotification