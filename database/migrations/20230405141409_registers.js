exports.up = function (knex) {
  return knex.schema.createTable('registers', (table) => {
    table.increments('id')
    table.string('name', 255).notNullable()
    table.string('surname', 255).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('registers')
}
