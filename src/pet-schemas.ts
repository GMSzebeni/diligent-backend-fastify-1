export const getPetsSchema = {
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
          },
          weightInKg: {
            type: 'number'
          }
        }
      }
    }
  }
} as const

export const postPetSchema = {
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
      },
      weightInKg: {
        type: 'number',
        minimum: 0
      }
    },
    required: ['name', 'age', 'weightInKg'],
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
        },
        weightInKg: {
          type: 'number'
        }
      }
    }
  }
} as const

export const getPetsWithKindsSchema = {
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
          },
          weightInKg: {
            type: 'number'
          },
          kind: {
            type: 'string'
          }
        }
      }
    }
  }
} as const