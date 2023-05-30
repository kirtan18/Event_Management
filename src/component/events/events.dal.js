const updateQuery = require('../../helper/updateQuery.helper');

module.exports = {
  getEventsDal: async (dbClient, sortBy, orderBy, limit, offSet) => {
    const sqlQuery = `
                    SELECT 
                      "eventId", 
                      title, 
                      description, 
                      location, 
                      "startDate", 
                      "endDate" "createdBy", 
                      "updatedBy", 
                      "createdAt", 
                      "updatedAt" 
                    FROM 
                       events 
                    ORDER BY 
                      "${sortBy}" ${orderBy} 
                    LIMIT 
                      ${limit} OFFSET ${offSet}`;

    const result = await dbClient.query(sqlQuery);
    return result.rows;
  },

  getEventByIdDal: async (dbClient, values) => {
    const sqlQuery = `
                    SELECT 
                      "eventId", 
                      title, 
                      description, 
                      location, 
                      "startDate", 
                      "endDate" "createdBy", 
                      "updatedBy", 
                      "createdAt", 
                      "updatedAt" 
                    FROM 
                      events 
                    WHERE 
                      "eventId" = $1`;
    const result = await dbClient.query(sqlQuery, values);
    return result.rows;
  },

  getEventsByLocationOrDateDal: async (dbClient, args, values) => {
    let sqlQuery = `
                    SELECT 
                      "eventId", 
                      title, 
                      description, 
                      location, 
                      "startDate", 
                      "endDate" "createdBy", 
                      "updatedBy", 
                      "createdAt", 
                      "updatedAt" 
                    FROM 
                      events 
                    WHERE 1=1`;

    if (args.date && args.location) {
      sqlQuery += `
                    AND (
                        "startDate" <= $1 
                        AND "endDate" >= $1
                      ) 
                      AND (location ILIKE $2)`;
    } else if (args.date) {
      sqlQuery += ` 
                    AND (
                         "startDate" <= $1 
                         AND "endDate" >= $1
                        )`;
    } else if (args.location) {
      sqlQuery += ' AND location ILIKE $1';
    }
    const result = await dbClient.query(sqlQuery, values);
    return result.rows;
  },

  createEventDal: async (dbClient, values) => {
    const sqlQuery = `
                    INSERT INTO events(
                      title, 
                      description, 
                      location, 
                      "startDate",   
                      "endDate", 
                      "createdBy", 
                      "createdAt"
                    ) 
                    VALUES 
                      ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const result = await dbClient.query(sqlQuery, values);
    return result.rows;
  },

  updateEventDal: async (dbClient, columns, values) => {
    const sqlQuery = `
                    UPDATE 
                      events 
                    SET 
                      ${updateQuery.updateQueryData(columns)} 
                    WHERE 
                      "eventId" = $${columns.length + 1} RETURNING *`;
    const result = await dbClient.query(sqlQuery, values);
    return result.rows;
  },

  deleteEventDal: async (dbClient, values) => {
    const sqlQuery = `
                    DELETE FROM 
                      events 
                    WHERE 
                      "eventId" = $1 RETURNING "eventId", title`;
    const result = await dbClient.query(sqlQuery, values);
    return result.rows;
  }
};
