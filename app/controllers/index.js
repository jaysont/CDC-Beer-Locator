var selectedBrandId = -1,
    selectedPackageId = -1,
    selectedLocation = 2;
var brandDialog;
$.brandLabel.text = "Select a brand...";
$.packageLabel.text = "Select a package(optional)...";

var brands = [];
var packages = [];
Ti.App.Properties.setString('favoriteId', '-1');
//create database
if (!Ti.App.Properties.hasProperty('seeded')) {
	var db = Ti.Database.open('beerLocator');
	db.execute('CREATE TABLE IF NOT EXISTS favorites(id INTEGER PRIMARY KEY AUTOINCREMENT, brandId INTEGER, packageId INTEGER, brandName TEXT, packageName TEXT)');
	db.close();
	Ti.App.Properties.setString('seeded', '1');
	Ti.API.info('seeded');
}

var style;
if (Ti.Platform.name === 'iPhone OS') {
	style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
} else {
	style = Ti.UI.ActivityIndicatorStyle.DARK;
}
var activityIndicator = Ti.UI.createActivityIndicator({
	color : 'black',
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : Alloy.CFG.fontSize.s5,
		fontWeight : 'bold'
	},
	message : 'Loading...',
	style : style,
	top : "75%",
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE,
	color : "#554E4A"
});

$.packageView.touchEnabled = false;
$.packageLabel.color = "gray";
$.findView.touchEnabled = false;
$.findBeer.color = "gray";
$.favoritesButton.color = "gray";
$.favoritesButton.touchEnabled = false;
$.addFavorite.color = "gray";
$.addFavorite.touchEnabled = false;

$.resetClass($.allButton, 'selectionButtons buttonSelected');
$.resetClass($.restaurantButton, 'selectionButtons buttonNotSelected');
$.resetClass($.storeButton, 'selectionButtons buttonNotSelected');

//LISTENERS
$.window.addEventListener('open', function(e) {
	loadBrands();
});
$.infoButton.addEventListener('click', function(e) {
	var infoWindow = Ti.UI.createWindow({
		backgroundImage : "images/infoBlank.jpg",
		height : "100%",
		width : "100%",
		top : 0,
		left : 0
	});
	infoWindow.addEventListener('click', function(e) {
		if (e.source == '[object TiUIWindow]') {
			infoWindow.close({
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		}
	});
	var instagramLabel = Ti.UI.createLabel({
		text : "@comerdist",
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s2
		},
		color : "white",
		top : "36%",
		left : "36%",
		minimumFontSize : "6"
	});
	var instagram = Ti.UI.createButton({
		height : Alloy.CFG.logoButton,
		width : Alloy.CFG.logoButton,
		top : "38%",
		left : "37%",
		backgroundImage : "images/instagramlogo.png"
	});
	instagram.addEventListener('click', function(e) {
		// Enclose in Try / Catch in case of Android
		try {// canOpenURL only works in iOS
			if (Ti.Platform.canOpenURL("instagram://user?username=comerdist")) {// Open the native twitter client url: twitter://status?id=statusidnumber
				Ti.Platform.openURL(e.rowData.tweetUrl);
			} else {// If it can't open the twitter client open the twitter site: http://twitter.com/user/statuses/statusidnumber
				Ti.Platform.openURL("http://instagram.com/comerdist");
			}
		} catch (err) {// Android will catch an error because it can't call canOpenURL
			Ti.API.error(err);
		}
	});
	var twitterLabel = Ti.UI.createLabel({
		text : "@comerdist",
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s2
		},
		color : "white",
		top : "36%",
		left : "56%",
		minimumFontSize : "6"
	});
	var twitter = Ti.UI.createButton({
		height : Alloy.CFG.logoButton,
		width : Alloy.CFG.logoButton,
		top : "38%",
		left : "57%",
		backgroundImage : "images/twitterlogo.png"
	});
	twitter.addEventListener('click', function(e) {
		// Enclose in Try / Catch in case of Android
		try {// canOpenURL only works in iOS
			if (Ti.Platform.canOpenURL("twitter://user?screen_name=comerdist")) {// Open the native twitter client url: twitter://status?id=statusidnumber
				Ti.Platform.openURL("twitter://user?screen_name=comerdist");
			} else {// If it can't open the twitter client open the twitter site: http://twitter.com/user/statuses/statusidnumber
				Ti.Platform.openURL("https://twitter.com/comerdist");
			}
		} catch (err) {// Android will catch an error because it can't call canOpenURL
			Ti.API.error(err);
		}
	});
	var facebookLabel = Ti.UI.createLabel({
		text : "/comerdistributing",
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s2
		},
		color : "white",
		top : "36%",
		left : "75%",
		minimumFontSize : "6"
	});
	var facebook = Ti.UI.createButton({
		height : Alloy.CFG.logoButton,
		width : Alloy.CFG.logoButton,
		top : "38%",
		left : "77%",
		backgroundImage : "images/facebooklogo.png"
	});
	facebook.addEventListener('click', function(e) {
		// Enclose in Try / Catch in case of Android
		try {// canOpenURL only works in iOS
			if (Ti.Platform.canOpenURL("fb://profile/comerdistributing")) {// Open the native twitter client url: twitter://status?id=statusidnumber
				Ti.Platform.openURL("fb://profile/comerdistributing");
			} else {// If it can't open the twitter client open the twitter site: http://twitter.com/user/statuses/statusidnumber
				Ti.Platform.openURL("https://www.facebook.com/comerdistributing");
			}
		} catch (err) {// Android will catch an error because it can't call canOpenURL
			Ti.API.error(err);
		}
	});
	var comerLogo = Ti.UI.createImageView({
		image : "images/logo.png",
		height : Alloy.CFG.logoButton * 1.5,
		top : "35%",
		left : "7%"
	});
	var comerLabel = Ti.UI.createLabel({
		text : "Comer Distributing Company, Inc.",
		width : "90%",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s7
		},
		color : "white",
		top : "50%",
		minimumFontSize : 10
	});
	var addressLabel = Ti.UI.createLabel({
		text : "110 Carmel Road, Rock Hill, SC 29730",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s4
		},
		color : "white",
		top : "55%"
	});
	var phoneLabel = Ti.UI.createLabel({
		text : "(803) 324 - 1180",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		font : {
			fontFamily : "Palatino-Bold",
			fontSize : Alloy.CFG.fontSize.s4
		},
		color : "white",
		top : "59.5%"
	});
	phoneLabel.addEventListener('click', function(e) {
		Titanium.Platform.openURL('tel:8033241180');
	});
	var llcLabel = Ti.UI.createLabel({
		text : "created by JLM Creations, LLC",
		height : "25",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		font : {
			fontFamily : "Palatino-BoldItalic",
			fontSize : Alloy.CFG.fontSize.s3
		},
		color : "white",
		top : "64%"
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
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});
});
$.brandView.addEventListener('click', function(e) {
	brandShowDialog();
});
$.packageView.addEventListener('click', function(e) {
	packageShowDialog();
});
$.allButton.addEventListener('click', function(e) {
	selectedLocation = 2;
	$.resetClass($.allButton, 'selectionButtons buttonSelected');
	$.resetClass($.restaurantButton, 'selectionButtons buttonNotSelected');
	$.resetClass($.storeButton, 'selectionButtons buttonNotSelected');
});

$.restaurantButton.addEventListener('click', function(e) {
	selectedLocation = 0;
	$.resetClass($.allButton, 'selectionButtons buttonNotSelected');
	$.resetClass($.restaurantButton, 'selectionButtons buttonSelected');
	$.resetClass($.storeButton, 'selectionButtons buttonNotSelected');
});

$.storeButton.addEventListener('click', function(e) {
	selectedLocation = 1;
	$.resetClass($.allButton, 'selectionButtons buttonNotSelected');
	$.resetClass($.restaurantButton, 'selectionButtons buttonNotSelected');
	$.resetClass($.storeButton, 'selectionButtons buttonSelected');
});

$.findView.addEventListener('click', function(e) {
	var markers = [];
	if (selectedBrandId == -1) {
		alert("Please select a brand.");
	} else {
		//make webservice call with selectedBrandId and selectedPackageId and selectedLocation
		if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
			var alertDialog = Ti.UI.createAlertDialog({
				title : 'WARNING!',
				message : 'Your deveice is not online. Internet connection required.',
				buttonNames : ['OK']
			});
			alertDialog.show();
		} else {
			activityIndicator.show();
			//make web service call and load brands[]
			var url = "http://beerfinder.comerdistributing.com/mobile/locations.php?brand=" + selectedBrandId + "&premise=" + selectedLocation;
			if (selectedPackageId > -1) {
				url = url + "&item=" + selectedPackageId;
			}
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {

					var json = JSON.parse(this.responseText);
					markers = json.markers;
					var beerBrand = ((selectedBrandId > -1) ? $.brandLabel.text : "");
					var beerPackage = ((selectedPackageId > -1) ? $.packageLabel.text : "");
					var mapController = Alloy.createController('map', {
						beerBrand : beerBrand,
						beerPackage : beerPackage,
						markers : markers
					}).getView();
					activityIndicator.hide();
					mapController.open({
						transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
					});
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.debug(e.error);
					activityIndicator.hide();
					alert('Error receiving beer list. Please check your internet connection or try again later.');
				},
				timeout : 15000 // in milliseconds
			});
			// Prepare the connection.
			client.open("GET", url);
			// Send the request.
			client.send();
		}

	}
});

$.favoritesButton.addEventListener('click', function(e) {
	var favWin = Alloy.createController('favorites', {}).getView();
	favWin.addEventListener('close', function() {
		var id = Ti.App.Properties.getString('favoriteId');
		if (id > -1) {
			var db = Ti.Database.open('beerLocator');
			var rows = db.execute('SELECT * from favorites where id = ' + id);
			while (rows.isValidRow()) {
				selectedBrandId = rows.fieldByName('brandId');
				selectedPackageId = rows.fieldByName('packageId');
				$.brandLabel.text = rows.fieldByName('brandName');
				$.packageLabel.text = rows.fieldByName('packageName');
				rows.next();
			}
			rows.close();
			db.close();
			//$.packabeView.enabled = true;
			$.findBeer.enabled = true;
			$.findBeer.fireEvent('click');
		}
	});
	favWin.open({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});

});

$.addFavorite.addEventListener('click', function(e) {
	if (selectedBrandId > -1) {
		var message = $.brandLabel.text;
		if (selectedPackageId > -1) {
			message = message + ' - ' + $.packageLabel.text;
		}
		var dialog = Ti.UI.createAlertDialog({
			ok : 0,
			buttonNames : ['Ok', 'Cancel'],
			message : message,
			title : 'Add to Favorites'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.ok) {
				var addSql = "INSERT INTO Favorites (brandId, packageId, brandName, packageName) " + "SELECT " + selectedBrandId + ", " + selectedPackageId + ", '" + $.brandLabel.text.replace(/'/g, "\\'") + "', '" + $.packageLabel.text.replace(/'/g, "\\'") + "' " + 'WHERE NOT EXISTS(SELECT 1 FROM Favorites WHERE brandId = ' + selectedBrandId + ' and packageId = ' + selectedPackageId + ')';
				Ti.API.info(addSql);
				var db = Ti.Database.open('beerLocator');
				var rows = db.execute('SELECT * from Favorites where brandId = ' + selectedBrandId + ' and packageId = ' + selectedPackageId);
				if(!rows.isValidRow()){
					db.execute('INSERT INTO Favorites (brandId, packageId, brandName, packageName) VALUES(?,?,?,?) ', selectedBrandId, selectedPackageId, $.brandLabel.text, $.packageLabel.text);
				}
				db.close();
			}
		});
		dialog.show();

	} else {
		alert('No Brand selected to add to favorites list');
	}

});

//PRIVATE FUNCTIONS
function loadBrands() {
	brands = [];
	if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
		var alertDialog = Ti.UI.createAlertDialog({
			title : 'WARNING!',
			message : 'Your deveice is not online. Internet connection required.',
			buttonNames : ['OK']
		});
		alertDialog.show();
	} else {
		activityIndicator.show();
		//make web service call and load brands[]
		var url = "http://beerfinder.comerdistributing.com/mobile/brands.php";
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				var json = JSON.parse(this.responseText);
				brands = [];
				for (var i = 0,
				    j = json.brands.length; i < j; i++) {
					brands.push(json.brands[i]);
				}
				activityIndicator.hide();
				//$.brandButton.enabled = true;
				//$.brandButton.color = "black";
				$.favoritesButton.color = "white";
				$.favoritesButton.touchEnabled = true;
				$.addFavorite.touchEnabled = true;
				$.addFavorite.color = "white";
				$.brandView.touchEnabled = true;
				$.brandLabel.color = "#554E4A";
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				activityIndicator.hide();
				alert('Error receiving beer list. Please check your internet connection or try again later.');
			},
			timeout : 15000 // in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();
	}

}

function loadPackages(brandId) {
	var online = 1;
	packages = [];
	$.packageLabel.text = "Select a package(optional)...";
	//make web service call and load packages[]
	if (brandId > -1) {

		if (Ti.Network.networkType === Ti.Network.NETWORK_NONE) {
			var alertDialog = Ti.UI.createAlertDialog({
				title : 'WARNING!',
				message : 'Your deveice is not online. Internet connection required.',
				buttonNames : ['OK']
			});
			alertDialog.show();
			online = 0;
			return online;
		} else {
			activityIndicator.show();
			//make web service call and load brands[]
			var url = "http://beerfinder.comerdistributing.com/mobile/items.php?brand=" + brandId;
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					var json = JSON.parse(this.responseText);
					packages = [];
					for (var i = 0,
					    j = json.brands.length; i < j; i++) {
					    if(packages.indexOf(brands[i]) === -1){
					    	packages.push(json.brands[i]);	
					    }
					}
					activityIndicator.hide();
					//$.packageButton.enabled = true;
					//$.packageButton.color = "black";
					//$.findBeer.color = "black";
					$.packageView.touchEnabled = true;
					$.packageLabel.color = "#554E4A";
					$.findView.touchEnabled = true;
					$.findBeer.color = "#554E4A";
					return online;
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					online = 0;
					Ti.API.debug(e.error);
					activityIndicator.hide();
					alert('Error receiving beer list. Please check your internet connection or try again later.');
					return online;
				},
				timeout : 15000 // in milliseconds
			});
			// Prepare the connection.
			client.open("GET", url);
			// Send the request.
			client.send();
		}
	}
}

function brandShowDialog() {
	var online = 1;
	if (brands.length == 0) {
		online = loadBrands();
	}
	if (online === 1) {
		function setBrand(id, name) {
			selectedBrandId = id;
			$.brandLabel.text = name;
			if (id > 0) {
				loadPackages(id);
			}
		}

		var nameSelectController = Alloy.createController('nameSelect', {
			label : "Select a Beer Name",
			nameList : brands,
			setName : setBrand,
			useIndex : 1
		}).getView();
		activityIndicator.hide();
		nameSelectController.open({
			transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
		});
	}
}

function packageShowDialog() {
	function setPackage(id, name) {
		selectedPackageId = id;
		$.packageLabel.text = name;
	}

	var nameSelectController = Alloy.createController('nameSelect', {
		label : "Select a Package Name",
		nameList : packages,
		setName : setPackage,
		useIndex : 0
	}).getView();
	activityIndicator.hide();
	nameSelectController.open({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});
}


$.window.add(activityIndicator);
$.window.open();

