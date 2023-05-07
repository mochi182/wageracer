'user strict';

//let client = require('./db.js');

exports.select_all = async function (req) {
    try {
        //let id = req.body.id;
        //let query = `SELECT * FROM table WHERE id = ${id}`
        //const results = await client.promise().query(query)
        //return results[0]
        return {sample: "Hello world"}
    } catch (err) {
        console.log(err)
        throw err;
    }
}