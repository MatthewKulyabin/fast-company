const Profession = require('../models/Profession');
const Quality = require('../models/Quality');
const professionsMock = require('../mock/profession.json');
const qualitiesMock = require('../mock/quality.json');

module.exports = async () => {
  const profession = await Profession.find();
  const quality = await Quality.find();

  if (profession.length !== professionsMock.length) {
    await createInitialEntity(Profession, professionsMock);
  }
  if (quality.length !== qualitiesMock.length) {
    await createInitialEntity(Quality, qualitiesMock);
  }
};

const createInitialEntity = async (Model, data) => {
  await Model.collection.drop();
  return Promise.all(
    data.map(async (item) => {
      try {
        delete item._id;
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (error) {
        return error;
      }
    })
  );
};
