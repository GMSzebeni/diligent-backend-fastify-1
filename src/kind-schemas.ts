export const getKindsSchema = {
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
        }
      }
    }
  }
} as const;