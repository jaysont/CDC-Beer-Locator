function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function setMarkersWithCenter(latiarray, longiarray) {
        if (latiarray.length != longiarray.length) return;
        var total_locations = latiarray.length;
        var minLongi = null, minLati = null, maxLongi = null, maxLati = null;
        for (var i = 0; total_locations > i; i++) {
            (null == minLati || minLati > latiarray[i]) && (minLati = latiarray[i]);
            (null == minLongi || minLongi > longiarray[i]) && (minLongi = longiarray[i]);
            (null == maxLati || maxLati < latiarray[i]) && (maxLati = latiarray[i]);
            (null == maxLongi || maxLongi < longiarray[i]) && (maxLongi = longiarray[i]);
        }
        var ltDiff = maxLati - minLati;
        var lgDiff = maxLongi - minLongi;
        var delta = ltDiff > lgDiff ? ltDiff : lgDiff;
        delta += .3;
        if (total_locations > 0 && delta > 0) {
            var boundaryLat = (Number(maxLati) + Number(minLati)) / 2;
            var boundaryLong = (Number(maxLongi) + Number(minLongi)) / 2;
            $.map.setLocation({
                animate: true,
                latitude: boundaryLat,
                longitude: boundaryLong,
                latitudeDelta: delta,
                longitudeDelta: delta
            });
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "map";
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
    $.__views.mapWindow = Ti.UI.createWindow({
        id: "mapWindow"
    });
    $.__views.mapWindow && $.addTopLevelView($.__views.mapWindow);
    $.__views.pageView = Ti.UI.createView({
        layout: "vertical",
        top: 20,
        id: "pageView"
    });
    $.__views.mapWindow.add($.__views.pageView);
    $.__views.headerView = Ti.UI.createView({
        width: "100%",
        height: "10%",
        backgroundColor: "#554E4A",
        id: "headerView"
    });
    $.__views.pageView.add($.__views.headerView);
    $.__views.headerLabel1 = Ti.UI.createLabel({
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        color: "white",
        top: "15%",
        left: "20%",
        width: "80%",
        height: "30%",
        text: "Please contact the establishment to make",
        font: {
            fontSize: Alloy.CFG.fontSize.s3,
            fontStyle: "italic"
        },
        id: "headerLabel1"
    });
    $.__views.headerView.add($.__views.headerLabel1);
    $.__views.headerLabel2 = Ti.UI.createLabel({
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        color: "white",
        top: "45%",
        left: "20%",
        width: "80%",
        height: "30%",
        text: "sure your beer is still in stock!",
        font: {
            fontSize: Alloy.CFG.fontSize.s3,
            fontStyle: "italic"
        },
        id: "headerLabel2"
    });
    $.__views.headerView.add($.__views.headerLabel2);
    $.__views.returnView = Ti.UI.createView({
        left: 0,
        width: "20%",
        zIndex: 100,
        id: "returnView"
    });
    $.__views.headerView.add($.__views.returnView);
    $.__views.returnButton = Ti.UI.createImageView({
        color: "white",
        image: "images/back-arrow.png",
        width: "20%",
        left: "20%",
        id: "returnButton"
    });
    $.__views.returnView.add($.__views.returnButton);
    $.__views.map = Alloy.Globals.Map.createView({
        barColor: "#6d0a0c",
        userLocation: false,
        animate: true,
        regionFit: true,
        height: "79%",
        width: "100%",
        id: "map"
    });
    $.__views.pageView.add($.__views.map);
    $.__views.footerView = Ti.UI.createView({
        width: "100%",
        height: Ti.UI.FILL,
        backgroundColor: "#554E4A",
        id: "footerView"
    });
    $.__views.pageView.add($.__views.footerView);
    $.__views.footerLabel = Ti.UI.createLabel({
        height: "100%",
        width: "95%",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        color: "white",
        minimumFontSize: 5,
        font: {
            fontSize: Alloy.CFG.fontSize.s4
        },
        id: "footerLabel"
    });
    $.__views.footerView.add($.__views.footerLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var markers = args.markers;
    $.footerLabel.text = args.beerBrand + (args.beerPackage.length > 0 ? " - " + args.beerPackage : "");
    var annos = [];
    var annoViews = [];
    var latitudePositions = [], longitudePositions = [], delta = .3;
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        latitudePositions.push(marker.latitude);
        longitudePositions.push(marker.longitude);
        var annoView = Ti.UI.createView({
            width: .525 * Ti.Platform.displayCaps.platformWidth,
            height: .375 * Ti.Platform.displayCaps.platformWidth,
            zIndex: 1,
            id: "annoView_" + i,
            backgroundColor: "white",
            borderRadius: .018 * Ti.Platform.displayCaps.platformWidth
        });
        var containerView = Ti.UI.createView({
            width: "90%",
            height: Ti.UI.FILL,
            layout: "vertical"
        });
        var titleLabel = Ti.UI.createLabel({
            text: marker.name,
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2,
                fontWeight: "bold"
            },
            color: "black",
            top: "3.125%",
            left: 0,
            minimumFontSize: .67 * Alloy.CFG.fontSize.s2 * 1.5,
            textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
        });
        var addressLabel = Ti.UI.createLabel({
            text: marker.street,
            color: "black",
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2
            },
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            top: "6%",
            left: 0,
            minimumFontSize: .67 * Alloy.CFG.fontSize.s1 * 1.5,
            textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
        });
        var cityStateLabel = Ti.UI.createLabel({
            text: marker.city + ", " + marker.state + " " + marker.zip,
            color: "black",
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2
            },
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            left: 0,
            top: "1%",
            minimumFontSize: .67 * Alloy.CFG.fontSize.s1 * 1.5,
            textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
        });
        var phoneView = Ti.UI.createView({
            left: 0,
            top: "1%",
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            layout: "horizontal"
        });
        var phoneLabel = Ti.UI.createLabel({
            text: "Phone:",
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2,
                fontWeight: "bold"
            },
            color: "black",
            left: 0,
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
        });
        var phoneNumberButton = Ti.UI.createLabel({
            text: marker.phone,
            color: "blue",
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2
            },
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            left: "5%"
        });
        phoneNumberButton.addEventListener("click", function(e) {
            var phoneNumber = e.source.text.replace(/\./g, "");
            Ti.API.info(phoneNumber);
            Titanium.Platform.openURL("tel:" + phoneNumber);
        });
        phoneView.add(phoneLabel);
        phoneView.add(phoneNumberButton);
        var directionsButton = Ti.UI.createButton({
            title: "Get Directions",
            font: {
                fontSize: 1.5 * Alloy.CFG.fontSize.s2
            },
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            top: "3%",
            textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT,
            i: i
        });
        directionsButton.addEventListener("click", function(e) {
            var i = e.source.i;
            Ti.API.info(i);
            var address = "http://maps.apple.com/?q=" + markers[i].street + " " + markers[i].city + ", " + markers[i].state + " " + markers[i].zip;
            Ti.API.info(address);
            Ti.Platform.openURL(address);
        });
        containerView.add(titleLabel);
        containerView.add(addressLabel);
        containerView.add(cityStateLabel);
        containerView.add(phoneView);
        containerView.add(directionsButton);
        annoView.add(containerView);
        annoViews.push(annoView);
        var anno = Alloy.Globals.Map.createAnnotation({
            id: "marker_" + i,
            latitude: marker.latitude,
            longitude: marker.longitude,
            title: " "
        });
        annos.push(anno);
    }
    $.map.addAnnotations(annos);
    delta = setMarkersWithCenter(latitudePositions, longitudePositions);
    $.returnView.addEventListener("click", function() {
        $.mapWindow.close({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    });
    $.map.addEventListener("click", function(e) {
        if ("pin" === e.clicksource) {
            this.removeAllChildren();
            this.setLocation({
                latitude: e.annotation.latitude,
                longitude: e.annotation.longitude,
                latitudeDelta: delta,
                longitudeDelta: delta
            });
            var index = e.annotation.id.replace("marker_", "");
            var view = annoViews[index];
            var image = $.mapWindow.toImage();
            view.top = Ti.Platform.displayCaps.platformHeight < 1e3 ? image.height / 2 - .7 * Ti.Platform.displayCaps.platformWidth : image.height / 2 - .62 * Ti.Platform.displayCaps.platformWidth;
            this.add(view);
        } else this.removeAllChildren();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;