
exports.up = knex =>
  knex.schema.createTable('dummy_table', table => {
    table.string('id')
      .notNullable()
      .primary();

    table.decimal('col1')
      .notNullable();

    table.boolean('col2')
      .notNullable()
      .defaultTo(false);
  });

exports.down = knex =>
  knex.schema.dropTable('dummy_table');