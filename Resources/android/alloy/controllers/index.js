function Controller() {
    function loadBrands() {
        brands = [];
        if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: "WARNING!",
                message: "Your deveice is not online. Internet connection required.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
        } else {
            var url = "http://beerfinder.comerdistributing.com/mobile/brands.php";
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    for (var i = 0, j = json.brands.length; j > i; i++) brands.push(json.brands[i]);
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                },
                timeout: 1e4
            });
            client.open("GET", url);
            client.send();
        }
    }
    function loadPackages(brandId) {
        packages = [];
        if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: "WARNING!",
                message: "Your deveice is not online. Internet connection required.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
        } else {
            var url = "http://beerfinder.comerdistributing.com/mobile/items.php?brand=" + brandId;
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    for (var i = 0, j = json.brands.length; j > i; i++) packages.push(json.brands[i]);
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                },
                timeout: 1e4
            });
            client.open("GET", url);
            client.send();
        }
    }
    function brandShowDialog() {
        var options = [];
        options.push("Select a brand...");
        for (var i = 0; brands.length > i; i++) options.push(brands[i].name);
        var brandOption = {
            options: options
        };
        var dialog = Ti.UI.createOptionDialog(brandOption);
        dialog.addEventListener("click", function(c) {
            $.brandButton.title = options[c.index];
            c.index > 0 ? selectedBrandId = brands[c.index - 1].id : (selectedBrandId = -1, 
            selectedPackageId = -1);
            loadPackages(selectedBrandId);
        });
        dialog.show();
    }
    function packageShowDialog() {
        var options = [];
        options.push("Select a package(optional)...");
        for (var i = 0; packages.length > i; i++) options.push(packages[i].name);
        var brandOption = {
            options: options
        };
        var dialog = Ti.UI.createOptionDialog(brandOption);
        dialog.addEventListener("click", function(c) {
            $.packageButton.title = options[c.index];
            selectedPackageId = c.index > 0 ? packages[c.index - 1].id : -1;
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
    var selectedBrandId = -1, selectedPackageId = -1, selectedLocation = 2;
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
        selectedLocation = 2;
        $.resetClass($.allButton, "selectionButtons buttonSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
        $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    });
    $.restaurantButton.addEventListener("click", function() {
        selectedLocation = 0;
        $.resetClass($.allButton, "selectionButtons buttonNotSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonSelected");
        $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    });
    $.storeButton.addEventListener("click", function() {
        selectedLocation = 1;
        $.resetClass($.allButton, "selectionButtons buttonNotSelected");
        $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
        $.resetClass($.storeButton, "selectionButtons buttonSelected");
    });
    $.findBeer.addEventListener("click", function() {
        var markers = [];
        if (-1 == selectedBrandId) alert("Please select a brand."); else if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: "WARNING!",
                message: "Your deveice is not online. Internet connection required.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
        } else {
            var url = "http://beerfinder.comerdistributing.com/mobile/locations.php?brand=" + selectedBrandId + "&premise=" + selectedLocation;
            selectedPackageId > -1 && (url = url + "&item=" + selectedPackageId);
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    markers = json.markers;
                    var beerBrand = selectedBrandId > -1 ? $.brandButton.title : "";
                    var beerPackage = selectedPackageId > -1 ? $.packageButton.title : "";
                    var mapController = Alloy.createController("map", {
                        beerBrand: beerBrand,
                        beerPackage: beerPackage,
                        markers: markers
                    });
                    $.window.open(mapController.getView());
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                },
                timeout: 1e4
            });
            client.open("GET", url);
            client.send();
        }
    });
    $.window.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;