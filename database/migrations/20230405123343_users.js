exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username', 255).notNullable()
    table.string('password', 255).notNullable().defaultTo('123456')
    table.boolean('active').notNullable().defaultTo(0)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
