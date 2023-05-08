'user strict';

let client = require('./db.js');

exports.readAll = async function (req) {
    try {
        let query = `
        SELECT * FROM company
        `
        const results = await client.promise().query(query)
        return results[0]
    } catch (err) {
        console.log(err)
        throw err;
    }
}