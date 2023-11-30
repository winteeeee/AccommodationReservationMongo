const {Schema, model} = require("mongoose");

const TopAmenitiesGuestsSearchForSchema = new Schema({
    pool: {type: Boolean},
    wifi: {type: Boolean},
    kitchen: {type: Boolean},
    freeParking: {type: Boolean},
    jacuzzi: {type: Boolean},
    washerOfDryer: {type: Boolean},
    airConditioningOrHeating: {type: Boolean},
    selfCheckIn: {type: Boolean},
    laptopFriendlyWorkspace: {type: Boolean},
    petsAllowed: {type: Boolean}
})

const TopAmenitiesGuestsSearchFor = model("TopAmenitiesGuestsSearchFor", TopAmenitiesGuestsSearchForSchema)
module.exports = {TopAmenitiesGuestsSearchFor}