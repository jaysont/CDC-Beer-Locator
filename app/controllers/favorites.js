var args = arguments[0] || {};

var deleteFlag = 0;
Ti.App.Properties.setString('favoriteId', '-1');
function buildTable() {
	var favs = [];
	var db = Ti.Database.open('beerLocator');
	var rows = db.execute('SELECT * from favorites');
	var favs = [];
	while (rows.isValidRow()) {
		var fav = {
			id : rows.fieldByName('id'),
			brandId : rows.fieldByName('brandId'),
			packageId : rows.fieldByName('packageId'),
			brandName : rows.fieldByName('brandName'),
			packageName : rows.fieldByName('packageName')
		};
		favs.push(fav);
		rows.next();
	}
	rows.close();
	db.close();
	var tableData = [];
	for (var i = 0; i < favs.length; i++) {
		var fullName = favs[i].brandName + (favs[i].packageId > -1 ? ' - ' + favs[i].packageName : '');
		var row = Ti.UI.createTableViewRow({
			rowId : favs[i].id,
			fullName : fullName,
			height : Ti.Platform.displayCaps.platformWidth * .15
		});
		if (deleteFlag === 1) {
			var removeButton = Ti.UI.createButton({
				backgroundImage : "images/button-delete.png",
				left : 0,
				height : Alloy.CFG.deleteButton,
				width : Alloy.CFG.deleteButton,
				rowId : favs[i].id
			});
			row.add(removeButton);
		}
		if (favs[i].packageId > -1) {
			var beerView = Ti.UI.createView({
				width : '100%',
				height : '100%',
				layout : 'vertical'
			});
			var beerNameLabel = Ti.UI.createLabel({
				text : favs[i].brandName,
				textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
				color : "#554E4A",
				width : Ti.UI.FILL,
				top : 0,
				left : (deleteFlag === 1 ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5 ),
				minimumFontSize : 8,
				font : {
					fontSize : Alloy.CFG.fontSize.s4,
					fontWeight : "bold"
				}
			});
			beerView.add(beerNameLabel);
			var packageNameLabel = Ti.UI.createLabel({
				text : favs[i].packageName,
				textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
				color : "#554E4A",
				top : "4.69%",
				left : (deleteFlag === 1 ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5 ),
				width : Ti.UI.FILL,
				minimumFontSize : 8,
				font : {
					fontSize : Alloy.CFG.fontSize.s4,
					fontWeight : "bold"
				}
			});
			beerView.add(packageNameLabel);
			row.add(beerView);
		} else {
			var beerNameLabel = Ti.UI.createLabel({
				text : favs[i].brandName,
				textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
				color : "#554E4A",
				width : Ti.UI.FILL,
				minimumFontSize : 12,
				left : (deleteFlag === 1 ? Alloy.CFG.deleteButton : Alloy.CFG.deleteButton / 5 ),
				font : {
					fontSize : Alloy.CFG.fontSize.s4,
					fontWeight : "bold"
				}
			});
			row.add(beerNameLabel);
		}
		tableData.push(row);
	}
	$.favoritesTable.data = tableData;
}

$.favoritesTable.addEventListener('click', function(e) {
	var rowId = e.rowData.rowId;
	if (deleteFlag === 0) {
		Ti.App.Properties.setString('favoriteId', rowId);
		$.favoritesWindow.close();
	} else {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Ok', 'Cancel'],
			message : 'Would you like to remove ' + e.rowData.fullName + ' from Favorites?',
			title : 'Remove Brand'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index != e.source.cancel) {
				var sql = "DELETE FROM Favorites WHERE id = " + rowId;
				var db = Ti.Database.open('beerLocator');
				db.execute(sql);
				db.close();
				buildTable();
			}
		});
		dialog.show();
	}
});

$.returnView.addEventListener('click', function(e) {
	$.favoritesWindow.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
});
$.deleteButton.addEventListener('click', function(e) {
	if (deleteFlag === 0) {
		deleteFlag = 1;
	} else {
		deleteFlag = 0;
	}
	buildTable();
});
buildTable();
