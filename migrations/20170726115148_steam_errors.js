
exports.up = knex =>
  knex.schema.createTable('steam_errors', table => {
    table.bigIncrements('id')
      .notNullable()
      .primary();

    table.specificType('code', 'smallint');

    table.string('error')
      .notNullable();

    table.string('message');

    table.string('steam_account_name', 64)
      .notNullable()
      .index();

    table.foreign('steam_account_name').references('steam_accounts.account_name')

    table.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

exports.down = knex =>
  knex.schema.dropTable('steam_errors');