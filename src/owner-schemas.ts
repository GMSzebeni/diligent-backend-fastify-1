export const getOwnersSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          name: {
            type: 'string'
          },
          age: {
            type: 'number'
          }
        }
      }
    }
  }
};

export const postOwnerSchema = {
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50
      },
      age: {
        type: 'number',
        minimum: 0
      }
    },
    required: ['name', 'age'],
    additionalProperties: false
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: {
          type: 'number'
        },
        name: {
          type: 'string'
        },
        age: {
          type: 'number'
        }
      }
    }
  }
} as const