import { PetToCreate } from "../entity/pet.type";
import { PetRepository } from "../repository/pet.repository"

export class PetService {
  private readonly repository;

  constructor(repository: PetRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.read();
  }

  async create(pet: PetToCreate) {
    return await this.repository.create(pet);
  }

  async getAllWithKinds() {
    return await this.repository.readWithKinds();
  }

  async getAllKinds() {
    return await this.repository.readKinds();
  }
}