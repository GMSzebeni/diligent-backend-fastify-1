import { OwnerToCreate } from "../entity/owner.type";
import { OwnerRepository } from "../repository/owner.repository";

export class OwnerService {
  private readonly ownerRepository;

  constructor(ownerRespository: OwnerRepository) {
    this.ownerRepository = ownerRespository;
  }

  async getAllOwners() {
    return await this.ownerRepository.read();
  }

  async createOwner(ownerToCreate: OwnerToCreate) {
    return await this.ownerRepository.create(ownerToCreate);
  }
}