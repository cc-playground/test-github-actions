const assert = require("assert")
const { OfferingsService } = require("../js/offerings-service");

describe("OfferingsService", function () {

    it("should contain CNB",function() {
        const offeringsService = new OfferingsService();
        assert.equal(offeringsService.existsByName("Cloud Native Bootcamp") , true);
        assert.equal(offeringsService.getByName("Cloud Native Bootcamp").name,"Cloud Native Bootcamp");
    });

    it("can list all",function() {
        const offeringsService = new OfferingsService();
        assert.notEqual(offeringsService.getAll().length,0);
    });

});