
exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.string('id')
      .notNullable()
      .primary();

    table.string('username')
      .notNullable()
      .unique();

    table.string('password')
      .notNullable();
  });

exports.down = knex =>
  knex.schema.dropTable('users');