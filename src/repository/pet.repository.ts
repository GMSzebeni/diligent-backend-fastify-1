import { DbClient } from "../db";
import { Kind } from "../entity/kind.type";
import { Pet, PetToCreate, PetToUpdate, PetWithKind } from "../entity/pet.type";

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
      INSERT INTO pet (name, age, weight_in_kg)
      VALUES ($1, $2, $3)
    `
    const rows  = await this.client.query(sql, [name, age, weightInKg]) as Array<unknown>
    return rows.map(this.toEntity)[0];
  }

  async createWithKind(pet: PetToCreate) {
    const {name, age, weightInKg, kindId} = pet;
    const sql = `
      INSERT INTO pet (name, age, weight_in_kg, kind_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, age, weight_in_kg, 
      (SELECT name kind FROM pet_kind WHERE id = kind_id)
    `
    const rows  = await this.client.query(sql, [name, age, weightInKg, kindId]) as Array<unknown>
    return rows.map(this.toEntityWithKind)[0];
  }

  async readWithKinds({ limit, offset }: {limit?: number, offset?: number} = {}) {
    const sql = 
      `SELECT pet.id, pet.name, pet.age, pet.weight_in_kg, pet_kind.name kind 
      FROM pet JOIN pet_kind ON pet.kind_id = pet_kind.id 
      LIMIT $1 OFFSET $2`;
    const rows = await this.client.query(sql, [limit, offset]) as Array<unknown>;
    return rows.map(this.toEntityWithKind);
  }

  async updateWithKind(id: number, pet: PetToUpdate) {
    const { name, age, weightInKg, kindId } = pet;

    const sql = 
      `UPDATE pet 
      SET 
        name = COALESCE($2, name), 
        age = COALESCE($3, age), 
        weight_in_kg = COALESCE($4, weight_in_kg), 
        kind_id = COALESCE($5, kind_id)
      WHERE id = $1
      RETURNING id, name, age, weight_in_kg, (SELECT name kind FROM pet_kind WHERE id = kind_id)`
    const rows = await this.client.query(sql, [
      id, 
      name ?? null, 
      age ?? null, 
      weightInKg ?? null, 
      kindId ?? null
    ]) as Array<unknown>;
    return rows.map(this.toEntityWithKind)[0];
  }

  async readKinds() {
    const sql = 'SELECT * FROM pet_kind';
    const rows = await this.client.query(sql) as Array<unknown>;
    return rows.map(this.toKindEntity);
  }
}