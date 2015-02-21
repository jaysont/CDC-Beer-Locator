var args = arguments[0] || {};
var markers = args.markers;
$.footerLabel.text = args.beerBrand + ((args.beerPackage.length > 0) ? " - " + args.beerPackage : "");
var annos = [];
var annoViews = [];
var latitudePositions = [], longitudePositions = [], delta = .3;

for (var i = 0; i < markers.length; i++) {
	var marker = markers[i];
	latitudePositions.push(marker.latitude);
	longitudePositions.push(marker.longitude);
	var annoView = Ti.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth * .525,
		height : Ti.Platform.displayCaps.platformWidth * .375,
		zIndex : 1,
		id : "annoView_" + i,
		backgroundColor : "white",
		borderRadius : Ti.Platform.displayCaps.platformWidth * .018
	});
	var containerView = Ti.UI.createView({
		width: '90%',
		height: Ti.UI.FILL,
		layout: 'vertical'
	});
	var titleLabel = Ti.UI.createLabel({
		text : marker.name,
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5,
			fontWeight : "bold"
		},
		color : "black",
		top : "3.125%",
		left : 0,
		minimumFontSize : Alloy.CFG.fontSize.s2 * .67 * 1.5, 
		textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	var addressLabel = Ti.UI.createLabel({
		text : marker.street,
		color : "black",
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5,
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		top : "6%",
		left : 0,
		minimumFontSize : Alloy.CFG.fontSize.s1 * .67 * 1.5,
		textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	var cityStateLabel = Ti.UI.createLabel({
		text : marker.city + ', ' + marker.state + ' ' + marker.zip,
		color : "black",
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5,
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		left : 0,
		top: "1%",
		minimumFontSize : Alloy.CFG.fontSize.s1 * .67 * 1.5,
		textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	var phoneView = Ti.UI.createView({
		left : 0,
		top: "1%",
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		layout: 'horizontal'
	});
	var phoneLabel = Ti.UI.createLabel({
		text : "Phone:",
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5,
			fontWeight : "bold"
		},
		color : "black",
		left: 0,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	var phoneNumberButton = Ti.UI.createLabel({
		text : marker.phone,
		color: 'blue',
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5 ,
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		left : '5%'
	});
	phoneNumberButton.addEventListener('click', function(e) {
		var phoneNumber = e.source.text.replace(/\./g, '');
		Ti.API.info(phoneNumber);
		Titanium.Platform.openURL('tel:' + phoneNumber);
	});
	phoneView.add(phoneLabel);
	phoneView.add(phoneNumberButton);
	var directionsButton = Ti.UI.createButton({
		title : "Get Directions",
		font : {
			fontSize : Alloy.CFG.fontSize.s2 * 1.5
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		top: '3%',
		textAlighn: Ti.UI.TEXT_ALIGNMENT_LEFT,
		i: i
	});

	directionsButton.addEventListener('click', function(e) {
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
		id : "marker_" + i,
		latitude : marker.latitude,
		longitude : marker.longitude,
		title : " "
	});

	annos.push(anno);
}
$.map.addAnnotations(annos);
delta = setMarkersWithCenter(latitudePositions, longitudePositions);
$.returnView.addEventListener('click', function(e) {
	$.mapWindow.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
});

$.map.addEventListener('click', function(e) {
	if (e.clicksource === 'pin') {
		this.removeAllChildren();
		this.setLocation({
			latitude : e.annotation.latitude,
			longitude : e.annotation.longitude,
			latitudeDelta : delta,
			longitudeDelta : delta
		});
		var index = e.annotation.id.replace('marker_', '');
		var view = annoViews[index];
		var image = $.mapWindow.toImage();
		if (Ti.Platform.displayCaps.platformHeight < 1000){
			view.top = image.height/2 - Ti.Platform.displayCaps.platformWidth * .70;	
		}else{
			view.top = image.height/2 - Ti.Platform.displayCaps.platformWidth * .62;
		}
		
		//view.left = (width / 2) - 80;
		this.add(view);
	} else {
		this.removeAllChildren();
	}
});

function setMarkersWithCenter(latiarray, longiarray) {
	if (latiarray.length != longiarray.length)
		return;
	var total_locations = latiarray.length;
	var minLongi = null, minLati = null, maxLongi = null, maxLati = null;
	var totalLongi = 0.0, totalLati = 0.0;

	for (var i = 0; i < total_locations; i++) {
		if (minLati == null || minLati > latiarray[i]) {
			minLati = latiarray[i];
		}
		if (minLongi == null || minLongi > longiarray[i]) {
			minLongi = longiarray[i];
		}
		if (maxLati == null || maxLati < latiarray[i]) {
			maxLati = latiarray[i];
		}
		if (maxLongi == null || maxLongi < longiarray[i]) {
			maxLongi = longiarray[i];
		}
	}

	var ltDiff = maxLati - minLati;
	var lgDiff = maxLongi - minLongi;
	var delta = ltDiff > lgDiff ? ltDiff : lgDiff;
	delta = delta + .3;
	if (total_locations > 0 && delta > 0) {

		var boundaryLat = (Number(maxLati) + Number(minLati)) / 2;
		var boundaryLong = (Number(maxLongi) + Number(minLongi)) / 2;

		$.map.setLocation({
			animate : true,
			latitude : boundaryLat,
			longitude : boundaryLong,
			latitudeDelta : delta,
			longitudeDelta : delta,
		});
	}

}
