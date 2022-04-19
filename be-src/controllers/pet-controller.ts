/* Aca va la lógica de los endpoints relacionados a las mascotas */
import { cloudinary } from "../lib/cloudinary";
import { Pet } from "../models/index";
import { indexPets } from "../lib/algolia";
import publicIp from "public-ip";

export async function createPet(body) {
  console.log("body en create pet", body);
  try {
    let imgHolder;
    if (body.pet.img) {
      const resImg = await cloudinary.uploader.upload(body.pet.img, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });
      /* console.log("resimg", resImg); */
      imgHolder = resImg.secure_url;
      /* console.log("imgHolder", imgHolder); */
    }
    const pet = await Pet.create({
      petName: body.pet.petName,
      latitude: body.pet.lat,
      length: body.pet.length,
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
    console.log("save pet in algolia", savePetInAlgolia);

    if (pet) {
      return pet;
    } else {
      return false;
    }
  } catch (error) {
    console.error("error en createPet,error :", error);
  }
}

export async function getPets() {
  const pets = await Pet.findAll();
  return pets;
}

export async function getUserPets(userId) {
  const userPets = await Pet.findAll({ where: { userId } });
  return userPets;
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
  console.log("data en pet-controller", data);

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
    indexPets.deleteObject(petId);
    return "pet deleted succesfully";
  }
}

export async function getNearbyMissedPets(request) {
  const ip = await publicIp.v4();
  const { hits } = await indexPets.search("", {
    aroundLatLngViaIP: true,
    aroundRadius: 15000,
    "X-Forwarded-For": ip,
  });
  console.log("hits", hits);
  if (hits) {
    return hits;
  }
}
