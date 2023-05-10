'user strict';

let client = require('./db.js');

exports.readAll = async function (req) {
    try {
        let query = `
        SELECT 
            app.id,
            app.name AS job_position,
            cm.name AS company_name, 
            d.name AS domain_name,
            app.description,
            app.is_remote,
            c.name AS country_name,
            s.name AS status_name,
            avs.date,
            avs.next_date,
            app.link 
        FROM 
            application app
            INNER JOIN company cm ON app.company_id = cm.id
            INNER JOIN domain d ON app.domain_id = d.id
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