import fastify from 'fastify';
import { PetService } from '../service/pet.service';
import { PetRepository } from '../repository/pet.repository';
import { DbClient } from '../db';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { getPetsWithKindsSchema, patchPetWithKindSchema, postPetWithKindSchema } from '../pet-schemas';
import { OwnerService } from '../service/owner.service';
import { OwnerRepository } from '../repository/owner.repository';
import { getOwnersSchema, postOwnerSchema } from '../owner-schemas';
import { getKindsSchema } from '../kind-schemas';

type Dependencies = {
  dbClient: DbClient;
}

export default function createApp(options = {}, dependencies: Dependencies) {
  const { dbClient } = dependencies;

  const petRepository = new PetRepository(dbClient);
  const petService = new PetService(petRepository);
  const ownerRepository = new OwnerRepository(dbClient);
  const ownerService = new OwnerService(ownerRepository);
  
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();

  app.get(
    '/api/pets', 
    { schema: getPetsWithKindsSchema },
    async (request, reply) => {
    const pets = await petService.getAllWithKinds();
    return reply.status(200).send(pets);
  })

  app.get(
    '/api/owners', 
    { schema: getOwnersSchema },
    async (request, reply) => {
    const owners = await ownerService.getAllOwners();
    return reply.status(200).send(owners);
  })

  app.get(
    '/api/pets/kinds',
    { schema: getKindsSchema },
    async (request, reply) => {
      const kinds = await petService.getAllKinds();
      return reply.status(200).send(kinds);
    }
  )

  app.post(
    '/api/pets', 
    { schema: postPetWithKindSchema }, 
    async (request, reply) => {
      const { body: petToCreate } = request;

      const created = await petService.createWithKind(petToCreate);
      return reply.status(201).send(created);
  })

  app.patch(
    '/api/pets/:id',
    { schema: patchPetWithKindSchema },
    async (request, reply) => {
      const { body: petToUpdate } = request;
      const { id } = request.params;

      const updated = await petService.updateWithKind(id, petToUpdate);
      return reply.status(200).send(updated);
    }
  )

  app.post(
    '/api/owners',
    { schema: postOwnerSchema },
    async (request, reply) => {
      const { body: ownerToCreate } = request;

      const createdOwner = await ownerService.createOwner(ownerToCreate);
      return reply.status(201).send(createdOwner);
    }
  )

  return app;
}