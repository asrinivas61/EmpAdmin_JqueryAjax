/**
 * Json schema faker import
 */

var fakeSchema = require('json-schema-faker');

/**
 * Customized schema
 */

var schema = {
  
      type: 'object',
      properties: {
        id: {
          $ref: '#/definitions/positiveInt'
        },
        first_name: {
          type: 'string',
          faker: 'name.firstName'
        },
        last_name: {
          type: 'string',
          faker: 'name.firstName'
        },
        email: {
          type: 'string',
          format: 'email',
          faker: 'internet.email'
        },
        phone: {
          $ref: '#/definitions/phone_number'
        }
      },
      required: ['id', 'first_name', 'last_name', 'email', 'phone'],

    definitions: {
      positiveInt: {
        type: 'integer',
        minimum: 3000000,
        maximum: 4000000,
        exclusiveMinimum: true
      },
      phone_number: {
        type: 'integer',
        minimum: 7000000000,
        maximum: 9999999999,
        exclusiveMinimum: true
      }
    }
  };

/**
 * Generating array of Objects
 */
  
var employee = [];
function employee1() {
  for (var i=0; i<50000; i++){
    employee.push(fakeSchema(schema));
  }
  return { employee: employee }
}

/**
 * Exporting created fake JSON Data
 */

module.exports = employee1;