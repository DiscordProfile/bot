const monk = require('monk');
const db = monk(process.env.MONGO_URL);

class Calls {
    static async insertGuild(obj) {
        const collection = db.get('guilds')
        return (await collection.insert(obj))
    }

    static async removeGuild(id) {
        const collection = db.get('guilds')
        return (await collection.findOneAndDelete({ guild_id: id }))
    }

    static async updateGuild(id, props, value) {
        const collection = db.get('guilds')
        return (await collection.findOneAndUpdate({ id }, { $set: { [props]: value } }))
    }

    static async getGuild(id) {
        const collection = db.get('guilds')
        return (await collection.findOne({ id }))
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
            premium: {
                status: false
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
