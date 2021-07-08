const monk = require('monk');
const db = monk(process.env.MONGO_URL);

class Calls {
    static async insertGuild(obj) {
        const collection = db.get('guilds')
        return (await collection.insert(obj))
    }

    static async removeGuild(guild_id) {
        const collection = db.get('guilds')
        return (await collection.findOneAndDelete({ guild_id }))
    }

    static async updateGuild(id, props, value) {
        const collection = db.get('guilds')
        return (await collection.findOneAndUpdate({ guild_id }, { $set: { [props]: value } }))
    }

    static async getGuild(guild_id) {
        const collection = db.get('guilds')
        return (await collection.findOne({ guild_id }))
    }

    static async getUser(id) {
        const collection = db.get('users')
        let user = await collection.findOne({ id })
        if (user === null) {
            return (await Calls.insertUser(id))
        } else {
            return user;
        }
    }

    static async getAllUsers() {
        const collection = db.get('users')
        return (await collection.find())
    }

    static async updateUser(id, props, value) {
        const collection = db.get('users')
        return (await collection.findOneAndUpdate({ id }, { $set: { [props]: value } }))
    }

    static async updateUserBatch(id, batch) {
        const collection = db.get('users')
        return (await collection.findOneAndUpdate({ id }, { $set: { comments: batch } }))
    }

    static async insertUser(id) {
        const collection = db.get('users')
        return (await collection.insert({
            id: id,
            views: {
                total: 0,
                users: []
            },
            hearts: {
                users: []
            },
            comments: {
                status: true,
                comments: []
            },
            customization: {
                profile_picture: '',
                profile_quote: '',
                profile_color: '',
                profile_nickname: '',
                profile_nationality: '',
                profile_gender: '',
                profile_age: '',
                profile_social: '',
            },
            premium: {
                status: false
            },
            settings: {
                blocked: false,
                admin: false,
                staff: false
            }
        }))
    }

    static async updateUserPushOrPull(id, props, value, pop) {
        const collection = db.get('users')
        if (pop) {
            return (await collection.update({ id: id }, { $push: { [props]: value } }));
        } else {
            return (await collection.update({ id: id }, { $pull: { [props]: value } }));
        }
    }

}

module.exports = Calls;
