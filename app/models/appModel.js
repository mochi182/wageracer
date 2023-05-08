'user strict';

let client = require('./db.js');

exports.readAll = async function (req) {
    try {
        let query = `
        SELECT 
            app.id AS application_id,
            jp.name AS job_position_name,
            d.name AS domain_name,
            w.name AS website_name,
            c.name AS country_name,
            app.is_remote,
            avs.status_id,
            s.name AS status_name,
            avs.date,
            avs.next_date
        FROM 
            application app
            INNER JOIN job_position jp ON app.job_position_id = jp.id
            INNER JOIN domain d ON app.domain_id = d.id
            INNER JOIN website w ON app.found_in = w.id
            INNER JOIN country c ON app.country_id = c.id
            INNER JOIN (
                SELECT application_id, MAX(date) AS max_date
                FROM application_vs_status
                GROUP BY application_id
            ) latest_avs ON app.id = latest_avs.application_id
            INNER JOIN application_vs_status avs ON latest_avs.application_id = avs.application_id AND latest_avs.max_date = avs.date
            INNER JOIN status s ON avs.status_id = s.id;
        `
        const results = await client.promise().query(query)
        return results[0]
    } catch (err) {
        console.log(err)
        throw err;
    }
}