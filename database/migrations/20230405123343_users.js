exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('username', 255).notNullable().unique()
    table.string('password', 255).notNullable().defaultTo('ed3b05eecfa0765b8e74e06f2824f23e487982590435b698c70a6957ccf22dcb')
    table.boolean('active').notNullable().defaultTo(0)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
