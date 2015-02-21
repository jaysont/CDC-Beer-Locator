function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

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
            activityIndicator.show();
            var url = "http://beerfinder.comerdistributing.com/mobile/brands.php";
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    brands = [];
                    for (var i = 0, j = json.brands.length; j > i; i++) brands.push(json.brands[i]);
                    activityIndicator.hide();
                    $.favoritesButton.color = "white";
                    $.favoritesButton.touchEnabled = true;
                    $.addFavorite.touchEnabled = true;
                    $.addFavorite.color = "white";
                    $.brandView.touchEnabled = true;
                    $.brandLabel.color = "#554E4A";
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    activityIndicator.hide();
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                },
                timeout: 15e3
            });
            client.open("GET", url);
            client.send();
        }
    }
    function loadPackages(brandId) {
        var online = 1;
        packages = [];
        $.packageLabel.text = "Select a package(optional)...";
        if (brandId > -1) {
            if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
                var alertDialog = Ti.UI.createAlertDialog({
                    title: "WARNING!",
                    message: "Your deveice is not online. Internet connection required.",
                    buttonNames: [ "OK" ]
                });
                alertDialog.show();
                online = 0;
                return online;
            }
            activityIndicator.show();
            var url = "http://beerfinder.comerdistributing.com/mobile/items.php?brand=" + brandId;
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    packages = [];
                    for (var i = 0, j = json.brands.length; j > i; i++) -1 === packages.indexOf(brands[i]) && packages.push(json.brands[i]);
                    activityIndicator.hide();
                    $.packageView.touchEnabled = true;
                    $.packageLabel.color = "#554E4A";
                    $.findView.touchEnabled = true;
                    $.findBeer.color = "#554E4A";
                    return online;
                },
                onerror: function(e) {
                    online = 0;
                    Ti.API.debug(e.error);
                    activityIndicator.hide();
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                    return online;
                },
                timeout: 15e3
            });
            client.open("GET", url);
            client.send();
        }
    }
    function brandShowDialog() {
        function setBrand(id, name) {
            selectedBrandId = id;
            $.brandLabel.text = name;
            id > 0 && loadPackages(id);
        }
        var online = 1;
        0 == brands.length && (online = loadBrands());
        if (1 === online) {
            var nameSelectController = Alloy.createController("nameSelect", {
                label: "Select a Beer Name",
                nameList: brands,
                setName: setBrand,
                useIndex: 1
            }).getView();
            activityIndicator.hide();
            nameSelectController.open({
                transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
            });
        }
    }
    function packageShowDialog() {
        function setPackage(id, name) {
            selectedPackageId = id;
            $.packageLabel.text = name;
        }
        var nameSelectController = Alloy.createController("nameSelect", {
            label: "Select a Package Name",
            nameList: packages,
            setName: setPackage,
            useIndex: 0
        }).getView();
        activityIndicator.hide();
        nameSelectController.open({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.window = Ti.UI.createWindow({
        backgroundColor: "white",
        apiName: "Ti.UI.Window",
        id: "window",
        classes: []
    });
    $.__views.window && $.addTopLevelView($.__views.window);
    $.__views.headerView = Ti.UI.createView({
        width: "100%",
        height: "10%",
        backgroundColor: "#554E4A",
        top: "20",
        apiName: "Ti.UI.View",
        id: "headerView",
        classes: []
    });
    $.__views.window.add($.__views.headerView);
    $.__views.header = Ti.UI.createLabel({
        text: "Locate Brews!",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontWeight: "bold",
            fontSize: Alloy.CFG.fontSize.s4
        },
        color: "white",
        apiName: "Ti.UI.Label",
        id: "header",
        classes: []
    });
    $.__views.headerView.add($.__views.header);
    $.__views.infoButton = Ti.UI.createButton({
        height: Alloy.CFG.infoButton,
        width: Alloy.CFG.infoButton,
        backgroundImage: "images/info.png",
        right: "5%",
        apiName: "Ti.UI.Button",
        id: "infoButton",
        classes: []
    });
    $.__views.headerView.add($.__views.infoButton);
    $.__views.brandView = Ti.UI.createView({
        top: "15%",
        width: "95%",
        height: "12%",
        borderColor: "#554E4A",
        borderWidth: 2,
        color: "white",
        apiName: "Ti.UI.View",
        id: "brandView",
        classes: []
    });
    $.__views.window.add($.__views.brandView);
    $.__views.brandSelectImage = Ti.UI.createImageView({
        image: "images/selector.png",
        left: "4%",
        width: "5%",
        height: "20%",
        apiName: "Ti.UI.ImageView",
        id: "brandSelectImage",
        classes: []
    });
    $.__views.brandView.add($.__views.brandSelectImage);
    $.__views.brandLabel = Ti.UI.createLabel({
        title: "Select a brand...",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        width: "80%",
        height: Ti.UI.FILL,
        left: "10%",
        color: "#554E4A",
        font: {
            fontSize: Alloy.CFG.fontSize.s4
        },
        apiName: "Ti.UI.Label",
        id: "brandLabel",
        classes: []
    });
    $.__views.brandView.add($.__views.brandLabel);
    $.__views.arrowBrand = Ti.UI.createImageView({
        image: "images/down-arrow.png",
        right: "2.5%",
        width: "5%",
        apiName: "Ti.UI.ImageView",
        id: "arrowBrand",
        classes: []
    });
    $.__views.brandView.add($.__views.arrowBrand);
    $.__views.packageView = Ti.UI.createView({
        top: "29%",
        width: "95%",
        height: "12%",
        borderColor: "#554E4A",
        borderWidth: 2,
        apiName: "Ti.UI.View",
        id: "packageView",
        classes: []
    });
    $.__views.window.add($.__views.packageView);
    $.__views.packageSelectImage = Ti.UI.createImageView({
        image: "images/selector.png",
        left: "4%",
        width: "5%",
        height: "20%",
        apiName: "Ti.UI.ImageView",
        id: "packageSelectImage",
        classes: []
    });
    $.__views.packageView.add($.__views.packageSelectImage);
    $.__views.packageLabel = Ti.UI.createLabel({
        title: "Select a package (optional)...",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        width: "80%",
        height: Ti.UI.FILL,
        left: "10%",
        color: "#554E4A",
        font: {
            fontSize: Alloy.CFG.fontSize.s4
        },
        apiName: "Ti.UI.Label",
        id: "packageLabel",
        classes: []
    });
    $.__views.packageView.add($.__views.packageLabel);
    $.__views.arrowPackage = Ti.UI.createImageView({
        image: "images/down-arrow.png",
        right: "2.5%",
        width: "5%",
        apiName: "Ti.UI.ImageView",
        id: "arrowPackage",
        classes: []
    });
    $.__views.packageView.add($.__views.arrowPackage);
    $.__views.buttonBar = Ti.UI.createView({
        width: "95%",
        height: "12%",
        top: "43%",
        borderColor: "#C2B49A",
        borderWidth: 2,
        apiName: "Ti.UI.View",
        id: "buttonBar",
        classes: []
    });
    $.__views.window.add($.__views.buttonBar);
    $.__views.allButton = Ti.UI.createButton({
        title: "All",
        width: "33%",
        height: "100%",
        left: "0%",
        apiName: "Ti.UI.Button",
        id: "allButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.allButton);
    $.__views.restaurantButton = Ti.UI.createButton({
        title: "Restaurants",
        width: "34%",
        height: "100%",
        left: "33%",
        borderColor: "#C2B49A",
        borderWidth: 2,
        apiName: "Ti.UI.Button",
        id: "restaurantButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.restaurantButton);
    $.__views.storeButton = Ti.UI.createButton({
        title: "Stores",
        width: "33.1%",
        height: "100%",
        left: "66.9%",
        apiName: "Ti.UI.Button",
        id: "storeButton",
        classes: []
    });
    $.__views.buttonBar.add($.__views.storeButton);
    $.__views.findView = Ti.UI.createView({
        top: "57%",
        height: "14%",
        width: "95%",
        borderColor: "#554E4A",
        borderWidth: 2,
        apiName: "Ti.UI.View",
        id: "findView",
        classes: []
    });
    $.__views.window.add($.__views.findView);
    $.__views.findBeer = Ti.UI.createLabel({
        text: "Find Beer!",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        height: "100%",
        width: "80%",
        font: {
            fontSize: Alloy.CFG.fontSize.s4,
            fontWeight: "bold"
        },
        color: "#554E4A",
        left: "13%",
        apiName: "Ti.UI.Label",
        id: "findBeer",
        classes: []
    });
    $.__views.findView.add($.__views.findBeer);
    $.__views.findBeerImage = Ti.UI.createImageView({
        backgroundImage: "images/world.png",
        left: "4%",
        width: Alloy.CFG.globeSize,
        height: Alloy.CFG.globeSize,
        apiName: "Ti.UI.ImageView",
        id: "findBeerImage",
        classes: []
    });
    $.__views.findView.add($.__views.findBeerImage);
    $.__views.findBeerArrow = Ti.UI.createImageView({
        image: "images/forward-arrow.png",
        right: "4%",
        width: "4%",
        apiName: "Ti.UI.ImageView",
        id: "findBeerArrow",
        classes: []
    });
    $.__views.findView.add($.__views.findBeerArrow);
    $.__views.footerView = Ti.UI.createView({
        width: "100%",
        height: "10%",
        bottom: "0",
        backgroundColor: "#554E4A",
        apiName: "Ti.UI.View",
        id: "footerView",
        classes: []
    });
    $.__views.window.add($.__views.footerView);
    $.__views.favoritesButton = Ti.UI.createButton({
        title: "Favorites",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontWeight: "bold",
            fontSize: Alloy.CFG.fontSize.s4
        },
        width: "50%",
        right: "24%",
        height: "100%",
        backgroundColor: "#554E4A",
        color: "white",
        apiName: "Ti.UI.Button",
        id: "favoritesButton",
        classes: []
    });
    $.__views.footerView.add($.__views.favoritesButton);
    $.__views.addFavorite = Ti.UI.createButton({
        title: " + ",
        font: {
            fontWeight: "bold",
            fontSize: Alloy.CFG.fontSize.s7
        },
        width: "20%",
        left: "80%",
        height: "100%",
        backgroundColor: "#554E4A",
        color: "white",
        apiName: "Ti.UI.Button",
        id: "addFavorite",
        classes: []
    });
    $.__views.footerView.add($.__views.addFavorite);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var selectedBrandId = -1, selectedPackageId = -1, selectedLocation = 2;
    $.brandLabel.text = "Select a brand...";
    $.packageLabel.text = "Select a package(optional)...";
    var brands = [];
    var packages = [];
    Ti.App.Properties.setString("favoriteId", "-1");
    if (!Ti.App.Properties.hasProperty("seeded")) {
        var db = Ti.Database.open("beerLocator");
        db.execute("CREATE TABLE IF NOT EXISTS favorites(id INTEGER PRIMARY KEY AUTOINCREMENT, brandId INTEGER, packageId INTEGER, brandName TEXT, packageName TEXT)");
        db.close();
        Ti.App.Properties.setString("seeded", "1");
        Ti.API.info("seeded");
    }
    var style;
    style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
    var activityIndicator = Ti.UI.createActivityIndicator({
        color: "black",
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: Alloy.CFG.fontSize.s5,
            fontWeight: "bold"
        },
        message: "Loading...",
        style: style,
        top: "75%",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        color: "#554E4A"
    });
    $.packageView.touchEnabled = false;
    $.packageLabel.color = "gray";
    $.findView.touchEnabled = false;
    $.findBeer.color = "gray";
    $.favoritesButton.color = "gray";
    $.favoritesButton.touchEnabled = false;
    $.addFavorite.color = "gray";
    $.addFavorite.touchEnabled = false;
    $.resetClass($.allButton, "selectionButtons buttonSelected");
    $.resetClass($.restaurantButton, "selectionButtons buttonNotSelected");
    $.resetClass($.storeButton, "selectionButtons buttonNotSelected");
    $.window.addEventListener("open", function() {
        loadBrands();
    });
    $.infoButton.addEventListener("click", function() {
        var infoWindow = Ti.UI.createWindow({
            backgroundImage: "images/infoBlank.jpg",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0
        });
        infoWindow.addEventListener("click", function(e) {
            "[object TiUIWindow]" == e.source && infoWindow.close({
                transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
            });
        });
        var instagramLabel = Ti.UI.createLabel({
            text: "@comerdist",
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s2
            },
            color: "white",
            top: "36%",
            left: "36%",
            minimumFontSize: "6"
        });
        var instagram = Ti.UI.createButton({
            height: Alloy.CFG.logoButton,
            width: Alloy.CFG.logoButton,
            top: "38%",
            left: "37%",
            backgroundImage: "images/instagramlogo.png"
        });
        instagram.addEventListener("click", function(e) {
            try {
                Ti.Platform.openURL(Ti.Platform.canOpenURL("instagram://user?username=comerdist") ? e.rowData.tweetUrl : "http://instagram.com/comerdist");
            } catch (err) {
                Ti.API.error(err);
            }
        });
        var twitterLabel = Ti.UI.createLabel({
            text: "@comerdist",
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s2
            },
            color: "white",
            top: "36%",
            left: "56%",
            minimumFontSize: "6"
        });
        var twitter = Ti.UI.createButton({
            height: Alloy.CFG.logoButton,
            width: Alloy.CFG.logoButton,
            top: "38%",
            left: "57%",
            backgroundImage: "images/twitterlogo.png"
        });
        twitter.addEventListener("click", function() {
            try {
                Ti.Platform.openURL(Ti.Platform.canOpenURL("twitter://user?screen_name=comerdist") ? "twitter://user?screen_name=comerdist" : "https://twitter.com/comerdist");
            } catch (err) {
                Ti.API.error(err);
            }
        });
        var facebookLabel = Ti.UI.createLabel({
            text: "/comerdistributing",
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s2
            },
            color: "white",
            top: "36%",
            left: "75%",
            minimumFontSize: "6"
        });
        var facebook = Ti.UI.createButton({
            height: Alloy.CFG.logoButton,
            width: Alloy.CFG.logoButton,
            top: "38%",
            left: "77%",
            backgroundImage: "images/facebooklogo.png"
        });
        facebook.addEventListener("click", function() {
            try {
                Ti.Platform.openURL(Ti.Platform.canOpenURL("fb://profile/comerdistributing") ? "fb://profile/comerdistributing" : "https://www.facebook.com/comerdistributing");
            } catch (err) {
                Ti.API.error(err);
            }
        });
        var comerLogo = Ti.UI.createImageView({
            image: "images/logo.png",
            height: 1.5 * Alloy.CFG.logoButton,
            top: "35%",
            left: "7%"
        });
        var comerLabel = Ti.UI.createLabel({
            text: "Comer Distributing Company, Inc.",
            width: "90%",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s7
            },
            color: "white",
            top: "50%",
            minimumFontSize: 10
        });
        var addressLabel = Ti.UI.createLabel({
            text: "110 Carmel Road, Rock Hill, SC 29730",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: "100%",
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s4
            },
            color: "white",
            top: "55%"
        });
        var phoneLabel = Ti.UI.createLabel({
            text: "(803) 324 - 1180",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: "100%",
            font: {
                fontFamily: "Palatino-Bold",
                fontSize: Alloy.CFG.fontSize.s4
            },
            color: "white",
            top: "59.5%"
        });
        phoneLabel.addEventListener("click", function() {
            Titanium.Platform.openURL("tel:8033241180");
        });
        var llcLabel = Ti.UI.createLabel({
            text: "created by JLM Creations, LLC",
            height: "25",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: "100%",
            font: {
                fontFamily: "Palatino-BoldItalic",
                fontSize: Alloy.CFG.fontSize.s3
            },
            color: "white",
            top: "64%"
        });
        infoWindow.add(comerLogo);
        infoWindow.add(llcLabel);
        infoWindow.add(phoneLabel);
        infoWindow.add(addressLabel);
        infoWindow.add(comerLabel);
        infoWindow.add(twitterLabel);
        infoWindow.add(facebookLabel);
        infoWindow.add(twitter);
        infoWindow.add(facebook);
        infoWindow.add(instagramLabel);
        infoWindow.add(instagram);
        infoWindow.open({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
        });
    });
    $.brandView.addEventListener("click", function() {
        brandShowDialog();
    });
    $.packageView.addEventListener("click", function() {
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
    $.findView.addEventListener("click", function() {
        var markers = [];
        if (-1 == selectedBrandId) alert("Please select a brand."); else if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
            var alertDialog = Ti.UI.createAlertDialog({
                title: "WARNING!",
                message: "Your deveice is not online. Internet connection required.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
        } else {
            activityIndicator.show();
            var url = "http://beerfinder.comerdistributing.com/mobile/locations.php?brand=" + selectedBrandId + "&premise=" + selectedLocation;
            selectedPackageId > -1 && (url = url + "&item=" + selectedPackageId);
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    var json = JSON.parse(this.responseText);
                    markers = json.markers;
                    var beerBrand = selectedBrandId > -1 ? $.brandLabel.text : "";
                    var beerPackage = selectedPackageId > -1 ? $.packageLabel.text : "";
                    var mapController = Alloy.createController("map", {
                        beerBrand: beerBrand,
                        beerPackage: beerPackage,
                        markers: markers
                    }).getView();
                    activityIndicator.hide();
                    mapController.open({
                        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
                    });
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    activityIndicator.hide();
                    alert("Error receiving beer list. Please check your internet connection or try again later.");
                },
                timeout: 15e3
            });
            client.open("GET", url);
            client.send();
        }
    });
    $.favoritesButton.addEventListener("click", function() {
        var favWin = Alloy.createController("favorites", {}).getView();
        favWin.addEventListener("close", function() {
            var id = Ti.App.Properties.getString("favoriteId");
            if (id > -1) {
                var db = Ti.Database.open("beerLocator");
                var rows = db.execute("SELECT * from favorites where id = " + id);
                while (rows.isValidRow()) {
                    selectedBrandId = rows.fieldByName("brandId");
                    selectedPackageId = rows.fieldByName("packageId");
                    $.brandLabel.text = rows.fieldByName("brandName");
                    $.packageLabel.text = rows.fieldByName("packageName");
                    rows.next();
                }
                rows.close();
                db.close();
                $.findBeer.enabled = true;
                $.findBeer.fireEvent("click");
            }
        });
        favWin.open({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
        });
    });
    $.addFavorite.addEventListener("click", function() {
        if (selectedBrandId > -1) {
            var message = $.brandLabel.text;
            selectedPackageId > -1 && (message = message + " - " + $.packageLabel.text);
            var dialog = Ti.UI.createAlertDialog({
                ok: 0,
                buttonNames: [ "Ok", "Cancel" ],
                message: message,
                title: "Add to Favorites"
            });
            dialog.addEventListener("click", function(e) {
                if (e.index === e.source.ok) {
                    var addSql = "INSERT INTO Favorites (brandId, packageId, brandName, packageName) SELECT " + selectedBrandId + ", " + selectedPackageId + ", '" + $.brandLabel.text.replace(/'/g, "\\'") + "', '" + $.packageLabel.text.replace(/'/g, "\\'") + "' WHERE NOT EXISTS(SELECT 1 FROM Favorites WHERE brandId = " + selectedBrandId + " and packageId = " + selectedPackageId + ")";
                    Ti.API.info(addSql);
                    var db = Ti.Database.open("beerLocator");
                    var rows = db.execute("SELECT * from Favorites where brandId = " + selectedBrandId + " and packageId = " + selectedPackageId);
                    rows.isValidRow() || db.execute("INSERT INTO Favorites (brandId, packageId, brandName, packageName) VALUES(?,?,?,?) ", selectedBrandId, selectedPackageId, $.brandLabel.text, $.packageLabel.text);
                    db.close();
                }
            });
            dialog.show();
        } else alert("No Brand selected to add to favorites list");
    });
    $.window.add(activityIndicator);
    $.window.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;