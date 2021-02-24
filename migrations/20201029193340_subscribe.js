
exports.up = async knex => {
  await knex.schema.createTable('subscribes_table', table => {
    table.increments('id');
    table.string('code');

    table.string('period');
    table.string('em');
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('subscribes_table');
};
