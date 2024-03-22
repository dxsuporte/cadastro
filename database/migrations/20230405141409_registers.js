exports.up = function (knex) {
  return knex.schema.createTable('registers', (table) => {
    table.increments('id')
    table.string('name', 255).notNullable()
    table.string('surname', 255).notNullable()
    table.string('description', 255).notNullable()
    table.string('note', 255).notNullable()
    table.string('phone', 255).notNullable()
    table.string('obs', 255)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('registers')
}
