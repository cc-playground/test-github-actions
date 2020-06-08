exports.OfferingsService = function() {

    const offerings = [
        {   
            "id": 1,
            "name": "Cloud Native Bootcamp",
            "description": "A flexible classroom coaching format, focused on assisted self-learning."
        }
    ]

    this.getAll = function () {
        return offerings
    }
    
    this.getByName = function (name) {
        return offerings.filter((offering) => offering.name == name)[0]
    }

    this.existsByName = function (name) {
        return offerings.filter((offering) => offering.name == name).length == 1
    }
}