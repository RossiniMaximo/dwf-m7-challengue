/* Aca va la lógica de los endpoints relacionados a las mascotas */
import { cloudinary } from "../lib/cloudinary";
import { Pet } from "../models/index";
import { indexPets } from "../lib/algolia";

export async function createPet(body) {
  let imgHolder;
  if (body.imgURL) {
    const resImg = await cloudinary.uploader.upload(body.imgURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    imgHolder = resImg.secure_url;
  }
  const pet = await Pet.create({
    petName: body.petName,
    latitude: body.latitude,
    length: body.length,
    imgURL: imgHolder,
    userId: body.userId,
  });

  const savePetInAlgolia = await indexPets.saveObject({
    objectID: pet.get("id"),
    petName: pet.get("petName"),
    imgURL: pet.get("imgURL"),
    _geoloc: {
      lat: pet.get("latitude"),
      lng: pet.get("length"),
    },
  });
  return pet;
}

export async function getPets() {
  const pets = await Pet.findAll();
  return pets;
}

export async function getPet(petId) {
  const pet = await Pet.findByPk(petId);
  if (pet) {
    return pet;
  } else {
    return "error : there is no pet with the token provided";
  }
}

function bodyFormated(body, id?) {
  const res: any = {};
  if (body.fullname) {
    res.fullname = body.fullname;
  }
  if (body.latitude && body.length) {
    res._geoloc = { lat: body.latitude, lng: body.length };
  }
  if (id) {
    res.objectID = id;
  }
  return res;
}

export async function updatePet(data, petId) {
  console.log("pet id en pet-controller", petId);

  try {
    const updatePet = await Pet.update(data, { where: { id: petId } });
    return updatePet;
  } catch (e) {
    console.log("error en el controller pets", e);
  }

  const indexItem = bodyFormated(data, petId);
  const updatedForAlgolia = await indexPets.partialUpdateObject(indexItem);
  console.log("updatedForAlgolia :", updatedForAlgolia);

  if (updatePet) {
    return updatePet;
  } else {
    return "error : there is no pet with the token provided";
  }
}

export async function deletePet(petId) {
  const petToDelete = await Pet.findByPk(petId);
  if (petToDelete) {
    petToDelete.destroy();
    return "pet deleted succesfully";
  }
}

// UNDONE
// LO QUE HAY QUE HACER ES USAR LA IP DEL CLIENTE PARA SACAR SU LATITUD Y LNG
//  PERO ESTO SIRVE PARA VER QUE LAS MASCOTAS SE ESTAN CREANDO

export async function getNearbyMissedPets() {
  const { hits } = await indexPets.search("", {
    aroundLatLngViaIP: true,
    aroundRadius: 15000,
    headers: {
      "X-Forwarded-For": "http://localhost:3001",
    },
  });
  if (hits) {
    return hits;
  }
}
