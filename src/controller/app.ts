import fastify from 'fastify';
import { PetService } from '../service/pet.service';
import { PetRepository } from '../repository/pet.repository';
import { DbClient } from '../db';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { getPetsSchema, postPetSchema } from '../schemas';

type Dependencies = {
  dbClient: DbClient;
}

export default function createApp(options = {}, dependencies: Dependencies) {
  const { dbClient } = dependencies;

  const petRepository = new PetRepository(dbClient);
  const petService = new PetService(petRepository);
  
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();

  app.get(
    '/api/pets', 
    { schema: getPetsSchema },
    async (request, reply) => {
    const pets = await petService.getAll();
    return reply.status(200).send(pets);
  })

  app.post(
    '/api/pets', 
    { schema: postPetSchema }, 
    async (request, reply) => {
      const { body: petToCreate } = request;

      const created = await petService.create(petToCreate);
      return reply.status(201).send(created);
  })

  return app;
}