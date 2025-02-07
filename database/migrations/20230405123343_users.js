exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username', 255).notNullable().unique()
    table.string('password', 255).notNullable().defaultTo('69e6318958c86cec07749a44db6963bf1ca42a83c4d826424bb140fd090a2808')
    table.boolean('active').notNullable().defaultTo(0)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
