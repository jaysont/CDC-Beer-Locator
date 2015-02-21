function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buildTable() {
        var favs = [];
        var db = Ti.Database.open("beerLocator");
        var rows = db.execute("SELECT * from favorites");
        var favs = [];
        while (rows.isValidRow()) {
            var fav = {
                id: rows.fieldByName("id"),
                brandId: rows.fieldByName("brandId"),
                packageId: rows.fieldByName("packageId"),
                brandName: rows.fieldByName("brandName"),
                packageName: rows.fieldByName("packageName")
            };
            favs.push(fav);
            rows.next();
        }
        rows.close();
        db.close();
        var tableData = [];
        for (var i = 0; i < favs.length; i++) {
            var fullName = favs[i].brandName + (favs[i].packageId > -1 ? " - " + favs[i].packageName : "");
            var row = Ti.UI.createTableViewRow({
                rowId: favs[i].id,
                fullName: fullName,
                height: .15 * Ti.Platform.displayCaps.platformWidth
            });
            if (1 === deleteFlag) {
                var removeButton = Ti.UI.createButton({
                    backgroundImage: "images/button-delete.png",
                    left: 0,
                    height: Alloy.CFG.deleteButton,
                    width: Alloy.CFG.deleteButton,
                    rowId: favs[i].id
                });
                row.add(removeButton);
            }
            if (favs[i].packageId > -1) {
                var beerView = Ti.UI.createView({
                    width: "100%",
                    height: "100%",
                    layout: "vertical"
                });
                var beerNameLabel = Ti.UI.createLabel({
                    text: favs[i].brandName,
                    textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
                    color: "#554E4A",
                    width: Ti.UI.FILL,
                    top: 0,
                    left: 1 === deleteFlag ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5,
                    minimumFontSize: 8,
                    font: {
                        fontSize: Alloy.CFG.fontSize.s4,
                        fontWeight: "bold"
                    }
                });
                beerView.add(beerNameLabel);
                var packageNameLabel = Ti.UI.createLabel({
                    text: favs[i].packageName,
                    textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
                    color: "#554E4A",
                    top: "4.69%",
                    left: 1 === deleteFlag ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5,
                    width: Ti.UI.FILL,
                    minimumFontSize: 8,
                    font: {
                        fontSize: Alloy.CFG.fontSize.s4,
                        fontWeight: "bold"
                    }
                });
                beerView.add(packageNameLabel);
                row.add(beerView);
            } else {
                var beerNameLabel = Ti.UI.createLabel({
                    text: favs[i].brandName,
                    textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
                    color: "#554E4A",
                    width: Ti.UI.FILL,
                    minimumFontSize: 12,
                    left: 1 === deleteFlag ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5,
                    font: {
                        fontSize: Alloy.CFG.fontSize.s4,
                        fontWeight: "bold"
                    }
                });
                row.add(beerNameLabel);
            }
            tableData.push(row);
        }
        $.favoritesTable.data = tableData;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "favorites";
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
    $.__views.favoritesWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        apiName: "Ti.UI.Window",
        id: "favoritesWindow",
        classes: []
    });
    $.__views.favoritesWindow && $.addTopLevelView($.__views.favoritesWindow);
    $.__views.headerView = Ti.UI.createView({
        width: "100%",
        height: "10%",
        backgroundColor: "#554E4A",
        top: "20",
        apiName: "Ti.UI.View",
        id: "headerView",
        classes: []
    });
    $.__views.favoritesWindow.add($.__views.headerView);
    $.__views.headerLabel = Ti.UI.createLabel({
        text: "Favorites",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        color: "white",
        left: "10%",
        width: "80%",
        height: Ti.UI.FILL,
        font: {
            fontSize: Alloy.CFG.fontSize.s4,
            fontWeight: "bold"
        },
        apiName: "Ti.UI.Label",
        id: "headerLabel",
        classes: []
    });
    $.__views.headerView.add($.__views.headerLabel);
    $.__views.returnView = Ti.UI.createView({
        left: 0,
        width: "20%",
        zIndex: 100,
        apiName: "Ti.UI.View",
        id: "returnView",
        classes: []
    });
    $.__views.headerView.add($.__views.returnView);
    $.__views.returnButton = Ti.UI.createImageView({
        color: "white",
        image: "images/back-arrow.png",
        width: "20%",
        left: "20%",
        apiName: "Ti.UI.ImageView",
        id: "returnButton",
        classes: []
    });
    $.__views.returnView.add($.__views.returnButton);
    $.__views.deleteButton = Ti.UI.createButton({
        backgroundImage: "images/button-delete.png",
        right: "5%",
        height: Alloy.CFG.deleteButton,
        width: Alloy.CFG.deleteButton,
        apiName: "Ti.UI.Button",
        id: "deleteButton",
        classes: []
    });
    $.__views.headerView.add($.__views.deleteButton);
    $.__views.favoritesTable = Ti.UI.createTableView({
        top: "18%",
        height: Ti.UI.SIZE,
        width: "90%",
        separatorColor: "#554E4A",
        apiName: "Ti.UI.TableView",
        id: "favoritesTable",
        classes: []
    });
    $.__views.favoritesWindow.add($.__views.favoritesTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var deleteFlag = 0;
    Ti.App.Properties.setString("favoriteId", "-1");
    $.favoritesTable.addEventListener("click", function(e) {
        var rowId = e.rowData.rowId;
        if (0 === deleteFlag) {
            Ti.App.Properties.setString("favoriteId", rowId);
            $.favoritesWindow.close();
        } else {
            var dialog = Ti.UI.createAlertDialog({
                cancel: 1,
                buttonNames: [ "Ok", "Cancel" ],
                message: "Would you like to remove " + e.rowData.fullName + " from Favorites?",
                title: "Remove Brand"
            });
            dialog.addEventListener("click", function(e) {
                if (e.index != e.source.cancel) {
                    var sql = "DELETE FROM Favorites WHERE id = " + rowId;
                    var db = Ti.Database.open("beerLocator");
                    db.execute(sql);
                    db.close();
                    buildTable();
                }
            });
            dialog.show();
        }
    });
    $.returnView.addEventListener("click", function() {
        $.favoritesWindow.close({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    });
    $.deleteButton.addEventListener("click", function() {
        deleteFlag = 0 === deleteFlag ? 1 : 0;
        buildTable();
    });
    buildTable();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;