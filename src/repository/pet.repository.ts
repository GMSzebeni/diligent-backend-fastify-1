import { DbClient } from "../db";
import { Kind } from "../entity/kind.type";
import { Pet, PetToCreate, PetWithKind } from "../entity/pet.type";

export class PetRepository {
  private readonly client;

  constructor(dbClient: DbClient) {
    this.client = dbClient
  }

  private toEntity(record: any): Pet {
    const { id, name, age, weight_in_kg } = record;
    return {
      id,
      name,
      age,
      weightInKg: parseFloat(weight_in_kg)
    }
  }

  private toEntityWithKind(record: any): PetWithKind {
    const { id, name, age, weight_in_kg, kind } = record;
    return {
      id,
      name,
      age,
      weightInKg: parseFloat(weight_in_kg),
      kind
    }
  }

  private toKindEntity(record: any): Kind {
    const { id, name } = record;
    return {
      id,
      name
    }
  }

  async read({ limit, offset }: { limit?: number, offset?: number } = {}) {
    const sql = 'SELECT id, name, age, weight_in_kg FROM pet LIMIT $1 OFFSET $2;'
    const rows = await this.client.query(sql, [limit, offset]) as Array<unknown>;
    return rows.map(this.toEntity)
  }

  async create(pet: PetToCreate) {
    const {name, age, weightInKg} = pet;
    const sql = `
      INSERT INTO pet (name, age, weight_in_kg) VALUES 
        ($1, $2, $3) 
      RETURNING *
    `
    const rows  = await this.client.query(sql, [name, age, weightInKg]) as Array<unknown>
    return rows.map(this.toEntity)[0];
  }

  async readWithKinds({ limit, offset }: {limit?: number, offset?: number} = {}) {
    const sql = 'SELECT pet.id, pet.name, pet.age, pet.weight_in_kg, pet_kind.name kind FROM pet JOIN pet_kind ON pet.kind_id = pet_kind.id LIMIT $1 OFFSET $2';
    const rows = await this.client.query(sql, [limit, offset]) as Array<unknown>;
    return rows.map(this.toEntityWithKind);
  }

  async readKinds() {
    const sql = 'SELECT * FROM pet_kind';
    const rows = await this.client.query(sql) as Array<unknown>;
    return rows.map(this.toKindEntity);
  }
}