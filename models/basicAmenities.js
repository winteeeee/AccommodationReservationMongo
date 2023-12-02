const {Schema, model} = require("mongoose");

const BasicAmenitiesSchema = new Schema({
    toiletPaper: {type: Boolean},
    soapForHandsAndBody: {type: Boolean},
    oneTowelPerGuest: {type: Boolean},
    linensForEachBed: {type: Boolean},
    onePillowPerGuest: {type: Boolean},
    cleaningSupplies: {type: Boolean}
})

const BasicAmenities = model("BasicAmenities", BasicAmenitiesSchema)
module.exports = {BasicAmenities, BasicAmenitiesSchema}