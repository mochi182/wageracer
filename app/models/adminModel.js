'user strict';

const client = require('./db.js');

exports.create = async function (req) {
    try {
        const entity = req.query.entity;
        const formData = req.body;
        console.log(formData)
        const columns = Object.keys(formData).join(", ");
        const values = Object.values(formData).map(value => `'${value}'`).join(", ");
        const query = `INSERT INTO ${entity} (${columns}) VALUES (${values})`;
        console.log(query)
        const result = await client.promise().query(query);
        return result[0].insertId;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.readAll = async function (req) {
    try {
        const entity = req.query.entity;
        const query = `SELECT * FROM ${entity}`;
        const result = await client.promise().query(query);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getColumns = async function (req) {
    try {
        const entity = req.query.entity;
        const query = `
            SELECT 
            c.COLUMN_NAME, 
            c.DATA_TYPE, 
            c.COLUMN_DEFAULT, 
            c.IS_NULLABLE, 
            c.CHARACTER_MAXIMUM_LENGTH, 
            k.CONSTRAINT_NAME, 
            k.REFERENCED_TABLE_NAME, 
            k.REFERENCED_COLUMN_NAME
            FROM 
            INFORMATION_SCHEMA.COLUMNS c
            LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
                ON c.TABLE_NAME = k.TABLE_NAME
                AND c.COLUMN_NAME = k.COLUMN_NAME
            WHERE 
            c.TABLE_NAME = '${entity}' 
            AND c.TABLE_SCHEMA = 'wageracer';     
        `;
        const result = await client.promise().query(query);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.delete = async function (req) {
    try {
      const entity = req.query.entity;
      const id = req.params.id;
      const query = `DELETE FROM ${entity} WHERE id = ${id}`;
      const result = await client.promise().query(query);
      return result[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  