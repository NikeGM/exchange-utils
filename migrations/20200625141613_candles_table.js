
exports.up = async knex => {
  await knex.schema.createTable('candles', table => {
    table.increments('id');
    table.string('name');
    table.string('code');
    table.bigInteger('time');
    table.timestamp('date');

    table.float('open');
    table.float('high');
    table.float('low');
    table.float('close');
    table.float('volume');

    table.float('median');
    table.float('typical');
    table.float('weighted_close');

    table.string('period');

    table.unique(['code', 'time', 'period']);

    table.index(['name', 'period'], 'name_period');

  });
};

exports.down = async knex => {
  await knex.schema.dropTable('candles');
};
