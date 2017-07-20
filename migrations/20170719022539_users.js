
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
  });

exports.down = knex =>
  knex.schema.dropTable('users');