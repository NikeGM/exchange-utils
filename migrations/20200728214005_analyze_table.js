
exports.up = async knex => {
  await knex.schema.createTable('analyze_tables', table => {
    table.string('period');
    table.string('code');

    table.string('indicatorKey');
    table.json('indicatorParams');

    table.string('openCloseKey');
    table.json('openCloseParams');

    table.string('winLooseKey');
    table.json('winLooseParams');

    table.json('winSeries');
    table.integer('winCount');
    table.integer('looseCount');
    table.float('winRate');
    table.float('positionPerDay');
    table.integer('maxLoss');
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('analyze_table');
};
