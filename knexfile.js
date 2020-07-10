const config = require('config');
const { host, user, database, password, port } = config.db.postgres;

module.exports = {
    client: 'pg',
    connection: { host, user, database, password, port }
};