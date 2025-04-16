import * as bicycleModel from "../models/BicycleModel.js";

/**
 * Get all filters for bicycles
 * @param {Object} req object containing the request data
 * @param {Object} res object containing the response data
 * @returns {void}
 */
export const getAllFilters = async (req, res) => {
  const pricing = await bicycleModel.getBicyclePricing();
  const brands = await bicycleModel.getAllBrands();
  const models = await bicycleModel.getAllModels();
  const types = await bicycleModel.getAllTypes();
  const statuses = await bicycleModel.getAllStatuses();
  const payload = {
    pricing,
    brands: brands.map((brand) => brand.brand),
    models: models.map((model) => model.model),
    types: types.map((type) => type.bicycle_type),
    statuses: statuses.map((status) => status.status),
  };
  res.json(payload);
};
