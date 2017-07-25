
exports.up = knex =>
  knex.schema.createTable('steam_accounts', table => {
    table.bigIncrements('id')
      .notNullable()
      .primary();

    table.specificType('status', 'smallint')
      .notNullable()
      .index();

    table.string('account_name', 64) 
      .notNullable()
      .unique();

    table.string('account_password', 64) 
      .notNullable();

    table.string('identity_secret', 64) 
      .notNullable();

    table.string('shared_secret', 64) 
      .notNullable();

    table.string('message') 
      .notNullable();

    table.bigInteger('user_id')
      .notNullable()
      .index();

    table.foreign('user_id').references('users.id')

    table.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

exports.down = knex =>
  knex.schema.dropTable('steam_accounts');