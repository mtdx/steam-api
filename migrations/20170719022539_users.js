
exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.bigIncrements('id')
      .notNullable()
      .primary();

    table.string('username', 20)
      .notNullable()
      .unique();

    table.string('password', 40)
      .notNullable();

    table.string('scope', 1)
      .notNullable();
    
    table.specificType('status', 'smallint')
      .notNullable();

    table.timestamp('created_at')
			.notNullable()
			.defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

exports.down = knex =>
  knex.schema.dropTable('users');