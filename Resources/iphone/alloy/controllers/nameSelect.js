function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "nameSelect";
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
    $.__views.nameSelectWindow = Ti.UI.createWindow({
        id: "nameSelectWindow"
    });
    $.__views.nameSelectWindow && $.addTopLevelView($.__views.nameSelectWindow);
    $.__views.pageView = Ti.UI.createView({
        layout: "vertical",
        top: 20,
        id: "pageView"
    });
    $.__views.nameSelectWindow.add($.__views.pageView);
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
        text: "Please select a beer",
        font: {
            fontSize: Alloy.CFG.fontSize.s4,
            fontStyle: "italic"
        },
        id: "headerLabel1"
    });
    $.__views.headerView.add($.__views.headerLabel1);
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
    $.__views.tableView = Ti.UI.createTableView({
        separatorStyle: Titanium.UI.iPhone.TableViewStyle.GROUPED,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "tableView"
    });
    $.__views.pageView.add($.__views.tableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var nameList = args.nameList;
    var tvrow;
    var curheader = "1";
    var index = [];
    var data = [];
    var isAndroid = false;
    $.headerLabel1.text = args.label;
    for (var i = 0; i < nameList.length; i++) {
        if (nameList[i].name[0] != curheader && 1 === args.useIndex) {
            curheader = nameList[i].name[0];
            tvrow = Titanium.UI.createTableViewRow({
                height: "7%",
                header: curheader,
                rowId: nameList[i].id,
                name: nameList[i].name
            });
            index.push({
                title: curheader,
                index: i
            });
        } else tvrow = Titanium.UI.createTableViewRow({
            height: "7%",
            rowId: nameList[i].id,
            name: nameList[i].name
        });
        var title = Titanium.UI.createLabel({
            left: "6%",
            color: "#000",
            font: {
                fontSize: Alloy.CFG.fontSize.s4,
                fontWeight: "normal",
                fontFamily: isAndroid ? "sans-serif" : "Helvetica Neue"
            },
            color: "#554E4A",
            text: nameList[i].name
        });
        tvrow.add(title);
        data.push(tvrow);
    }
    $.tableView.data = data;
    1 === args.useIndex && ($.tableView.index = index);
    $.tableView.addEventListener("click", function(e) {
        args.setName(e.rowData.rowId, e.rowData.name);
        $.nameSelectWindow.close({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    });
    $.returnView.addEventListener("click", function() {
        $.nameSelectWindow.close({
            transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;