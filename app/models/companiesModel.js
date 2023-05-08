'user strict';

let client = require('./db.js');

exports.readAll = async function (req) {
    try {
      // Select all companies along with their website name
      const companiesQuery = `
        SELECT c.*, w.name AS website_name 
        FROM company AS c 
        LEFT JOIN website AS w ON c.website_id = w.id
      `;
      const companiesResult = await client.promise().query(companiesQuery);
      const companies = companiesResult[0];
  
      // For each company, select its reviews and contacts
      for (let i = 0; i < companies.length; i++) {
        const companyId = companies[i].id;
  
        // Select all company reviews for this company
        const reviewsQuery = `
          SELECT * FROM company_review 
          WHERE company_id = ${companyId}
        `;
        const reviewsResult = await client.promise().query(reviewsQuery);
        const reviews = reviewsResult[0];
  
        // Select all contacts for this company
        const contactsQuery = `
          SELECT * FROM contact 
          WHERE company_id = ${companyId}
        `;
        const contactsResult = await client.promise().query(contactsQuery);
        const contacts = contactsResult[0];
  
        // Append reviews and contacts to the company object
        companies[i].reviews = reviews;
        companies[i].contacts = contacts;
      }
  
      return companies;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  