function Controller() {
    function setMarkersWithCenter(latiarray, longiarray) {
        if (latiarray.length != longiarray.length) return;
        var total_locations = latiarray.length;
        var minLongi = null, minLati = null, maxLongi = null, maxLati = null;
        for (var i = 0; total_locations > i; i++) {
            (null == minLati || minLati > latiarray[i]) && (minLati = latiarray[i]);
            (null == minLongi || minLongi > longiarray[i]) && (minLongi = longiarray[i]);
            (null == maxLati || latiarray[i] > maxLati) && (maxLati = latiarray[i]);
            (null == maxLongi || longiarray[i] > maxLongi) && (maxLongi = longiarray[i]);
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
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.mapWindow = Ti.UI.createWindow({
        id: "mapWindow"
    });
    $.__views.mapWindow && $.addTopLevelView($.__views.mapWindow);
    $.__views.headerView = Ti.UI.createView({
        width: "100%",
        height: "40",
        backgroundColor: "black",
        top: "20",
        id: "headerView"
    });
    $.__views.mapWindow.add($.__views.headerView);
    $.__views.headerLabel = Ti.UI.createLabel({
        text: "Beer Name - results",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        color: "white",
        left: 20,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "headerLabel"
    });
    $.__views.headerView.add($.__views.headerLabel);
    $.__views.returnButton = Ti.UI.createButton({
        title: "<",
        color: "white",
        backgroundColor: "transparent",
        font: {
            fontSize: "20",
            fontWeight: "bold"
        },
        left: "0",
        id: "returnButton"
    });
    $.__views.headerView.add($.__views.returnButton);
    $.__views.map = Alloy.Globals.Map.createView({
        barColor: "#6d0a0c",
        userLocation: false,
        animate: true,
        regionFit: true,
        height: Ti.UI.FILL,
        top: 60,
        id: "map",
        ns: "Alloy.Globals.Map"
    });
    $.__views.mapWindow.add($.__views.map);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var markers = arguments[0] || {};
    var annos = [];
    var annoViews = [];
    var latitudePositions = [], longitudePositions = [], delta = .3;
    for (var i = 0; markers.length > i; i++) {
        var marker = markers[i];
        latitudePositions.push(marker.latitude);
        longitudePositions.push(marker.longitude);
        var annoView = Ti.UI.createView({
            width: 160,
            height: 120,
            zIndex: 1,
            id: "annoView_" + i,
            backgroundColor: "white",
            borderRadius: 10
        });
        var titleLabel = Ti.UI.createLabel({
            text: marker.name,
            font: {
                fontSize: 16,
                fontWeight: "bold"
            },
            color: "black",
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            top: 0
        });
        var phoneLabel = Ti.UI.createLabel({
            text: marker.phone,
            color: "black",
            height: Ti.UI.SIZE,
            width: Ti.UI.FILL,
            top: 40
        });
        annoView.add(titleLabel);
        annoView.add(phoneLabel);
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
    $.returnButton.addEventListener("click", function() {
        $.mapWindow.close();
    });
    $.map.addEventListener("click", function(e) {
        if ("pin" === e.clicksource) {
            this.setLocation({
                latitude: e.annotation.latitude,
                longitude: e.annotation.longitude,
                latitudeDelta: delta,
                longitudeDelta: delta
            });
            var index = e.annotation.id.replace("marker_", "");
            var view = annoViews[index];
            var image = $.mapWindow.toImage();
            var height = image.height;
            var width = image.width;
            view.top = height / 2 - 195;
            view.left = width / 2 - 80;
            this.add(view);
        } else this.removeAllChildren();
    });
    $.mapWindow.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;