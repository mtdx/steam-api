
exports.up = knex =>
  knex.schema.createTable('steam_groups', table => {
    table.bigIncrements('id')
      .notNullable()
      .primary();

    table.string('group_link', 32) // min 2 max 32 
      .notNullable()
      .unique();

    table.bigInteger('user_id')
      .notNullable()
      .index();

     table.foreign('user_id').references('users.id')  

     table.timestamp('created_at')
			.notNullable()
			.defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

exports.down = knex =>
  knex.schema.dropTable('steam_groups');