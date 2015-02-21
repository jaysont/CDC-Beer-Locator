function Controller() {
    function loadBrands() {
        brands = [];
        brands.push({
            name: "Abita Flagship",
            id: 191
        });
        brands.push({
            name: "Amstel Light",
            id: 93
        });
        brands.push({
            name: "Banks Beer",
            id: 308
        });
        brands.push({
            name: "Blue Moon",
            id: 5
        });
    }
    function loadPackages(brandId) {
        packages = [];
        if (191 === brandId) {
            packages.push({
                name: "Abita Amber 1/4 Keg",
                id: 2174
            });
            packages.push({
                name: "Abita Amber 4/6/12 B",
                id: 1282
            });
            packages.push({
                name: "Abita Amber Jockamo Ipa 4/6/12 B",
                id: 1480
            });
            packages.push({
                name: "Abita Purple Haze 1/2 Keg",
                id: 1505
            });
            packages.push({
                name: "Abita Purple Haze 1/4 Keg",
                id: 3501
            });
        }
    }
    function brandShowDialog() {
        var options = [];
        options.push("Select a brand...");
        for (var i = 0; brands.length - 1 > i; i++) options.push(brands[i].name);
        var brandOption = {
            options: options
        };
        var dialog = Ti.UI.createOptionDialog(brandOption);
        dialog.addEventListener("click", function(c) {
            $.brandButton.title = options[c.index];
            selectedBrandId = brands[c.index - 1].id;
            loadPackages(selectedBrandId);
        });
        dialog.show();
    }
    function packageShowDialog() {
        var options = [];
        options.push("Select a package(optional)...");
        for (var i = 0; packages.length - 1 > i; i++) options.push(packages[i].name);
        var brandOption = {
            options: options
        };
        var dialog = Ti.UI.createOptionDialog(brandOption);
        dialog.addEventListener("click", function(c) {
            $.packageButton.title = options[c.index];
            selectedPackageId = packages[c.index - 1].id;
        });
        dialog.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.window = Ti.UI.createWindow({
        backgroundColor: "#EFEFEF",
        apiName: "Ti.UI.Window",
        id: "window",
        classes: []
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.header = Ti.UI.createLabel({
        text: "Locate Brews!",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontWeight: "bold"
        },
        width: "100%",
        height: "40",
        backgroundColor: "black",
        color: "white",
        top: "20",
        apiName: "Ti.UI.Label",
        id: "header",
        classes: []
    });
    $.__views.window.add($.__views.header);
    $.__views.brandView = Ti.UI.createView({
        top: "70",
        width: "95%",
        height: "60",
        apiName: "Ti.UI.View",
        id: "brandView",
        classes: []
    });
    $.__views.window.add($.__views.brandView);
    $.__views.brandButton = Ti.UI.createButton({
        backgroundImage: "images/buttonBackground.png",
        backgroundFocusedImage: "images/buttonBackgroundFocused.png",
        color: "black",
        title: "Select a brand...",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        apiName: "Ti.UI.Button",
        id: "brandButton",
        classes: [ "selectButtons" ]
    });
    $.__views.brandView.add($.__views.brandButton);
    $.__views.arrowBrand = Ti.UI.createImageView({
        image: "images/arrow.png",
        left: "90%",
        apiName: "Ti.UI.ImageView",
        id: "arrowBrand",
        classes: []
    });
    $.__views.brandView.add($.__views.arrowBrand);
    $.__views.packageView = Ti.UI.createView({
        top: "140",
        width: "95%",
        height: "60",
        apiName: "Ti.UI.View",
        id: "packageView",
        classes: []
    });
    $.__views.window.add($.__views.packageView);
    $.__views.packageButton = Ti.UI.createButton({
        backgroundImage: "images/buttonBackground.png",
        backgroundFocusedImage: "images/buttonBackgroundFocused.png",
        color: "black",
        title: "Select a package (optional)...",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        apiName: "Ti.UI.Button",
        id: "packageButton",
        classes: [ "selectButtons" ]
    });
    $.__views.packageView.add($.__views.packageButton);
    $.__views.arrowPackage = Ti.UI.createImageView({
        image: "images/arrow.png",
        left: "90%",
        apiName: "Ti.UI.ImageView",
        id: "arrowPackage",
        classes: []
    });
    $.__views.packageView.add($.__views.arrowPackage);
    $.__views.buttonBar = Ti.UI.createView({
        width: "95%",
        height: "60",
        top: "210",
        apiName: "Ti.UI.View",
        id: "buttonBar",
        classes: []
    });
    $.__views.window.add($.__views.buttonBar);
    $.__views.allButton = Ti.UI.createButton({
        title: "All",
        width: "33%",
        left: "0%",
        apiName: "Ti.UI.Button",
        id: "allButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.allButton);
    $.__views.restaurantButton = Ti.UI.createButton({
        title: "Restaurants",
        width: "33%",
        left: "33%",
        apiName: "Ti.UI.Button",
        id: "restaurantButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.restaurantButton);
    $.__views.storeButton = Ti.UI.createButton({
        title: "Stores",
        width: "33%",
        left: "66%",
        apiName: "Ti.UI.Button",
        id: "storeButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.storeButton);
    $.__views.findBeer = Ti.UI.createButton({
        title: "Find Beer!",
        top: "280",
        height: "60",
        width: "95%",
        color: "black",
        font: {
            fontSize: "20",
            fontWeight: "bold"
        },
        backgroundImage: "images/buttonBackground.png",
        backgroundFocusedImage: "images/buttonBackgroundFocused.png",
        apiName: "Ti.UI.Button",
        id: "findBeer",
        classes: []
    });
    $.__views.window.add($.__views.findBeer);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var selectedBrandId = -1, selectedPackageId = -1, selectedLocation = 0;
    var brands = [];
    var packages = [];
    $.resetClass($.allButton, "selectionButtons buttonSelected");
    $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
    $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    $.window.addEventListener("open", function() {
        loadBrands();
    });
    $.brandButton.addEventListener("click", function() {
        brandShowDialog();
    });
    $.arrowBrand.addEventListener("click", function() {
        brandShowDialog();
    });
    $.packageButton.addEventListener("click", function() {
        packageShowDialog();
    });
    $.arrowPackage.addEventListener("click", function() {
        packageShowDialog();
    });
    $.allButton.addEventListener("click", function() {
        selectedLocation = 0;
        $.resetClass($.allButton, "selectionButtons buttonSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
        $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    });
    $.restaurantButton.addEventListener("click", function() {
        selectedLocation = 1;
        $.resetClass($.allButton, "selectionButtons buttonNotSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonSelected");
        $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    });
    $.storeButton.addEventListener("click", function() {
        selectedLocation = 2;
        $.resetClass($.allButton, "selectionButtons buttonNotSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
        $.resetClass($.storeButton, "selectionButtons buttonSelected");
    });
    $.findBeer.addEventListener("click", function() {
        var markers = [];
        markers.push({
            name: "Bi-lo #05720",
            street: "1329 W Hwy 160",
            cityState: "Fort Mill, SC  29715",
            phone: "803.547.7147",
            latitude: "35.021332204341903",
            longitude: "-80.959557518362999"
        });
        markers.push({
            name: "Publix #1485",
            street: "2186 Cherry Rd Ste 101",
            cityState: "Rock Hill, SC 29730",
            phone: "803.366.7500",
            latitude: "35.0053956",
            longitude: "-80.8545282"
        });
        var mapController = Alloy.createController("map", markers);
        $.window.open(mapController.getView());
    });
    $.window.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;