// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.Map = require('ti.map');

Alloy.CFG.globeSize = Ti.Platform.displayCaps.platformWidth * .13;
Alloy.CFG.infoButton = Ti.Platform.displayCaps.platformWidth * .08;
Alloy.CFG.logoButton = Ti.Platform.displayCaps.platformWidth * .14;
Alloy.CFG.deleteButton = Ti.Platform.displayCaps.platformWidth * .07;

Alloy.CFG.fontSize = {
	s1: Ti.Platform.displayCaps.platformWidth * .01875,
	s2: Ti.Platform.displayCaps.platformWidth * .028125,
	s3: Ti.Platform.displayCaps.platformWidth * .03125,
	s4: Ti.Platform.displayCaps.platformWidth * .05,
	s5: Ti.Platform.displayCaps.platformWidth * .0375,
	s6: Ti.Platform.displayCaps.platformWidth * .021875,
	s7: Ti.Platform.displayCaps.platformWidth * .065,
};
