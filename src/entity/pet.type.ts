export type Pet = {
  id: number,
  name: string,
  age: number,
  weightInKg: number,
  kindId?: number
};

export type PetToCreate = Omit<Pet, 'id'>;

export type PetWithKind =  Omit<Pet, 'kindId'> & { kind: string };