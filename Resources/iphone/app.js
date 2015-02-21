var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Alloy.CFG.globeSize = .13 * Ti.Platform.displayCaps.platformWidth;

Alloy.CFG.infoButton = .08 * Ti.Platform.displayCaps.platformWidth;

Alloy.CFG.logoButton = .14 * Ti.Platform.displayCaps.platformWidth;

Alloy.CFG.deleteButton = .07 * Ti.Platform.displayCaps.platformWidth;

Alloy.CFG.fontSize = {
    s1: .01875 * Ti.Platform.displayCaps.platformWidth,
    s2: .028125 * Ti.Platform.displayCaps.platformWidth,
    s3: .03125 * Ti.Platform.displayCaps.platformWidth,
    s4: .05 * Ti.Platform.displayCaps.platformWidth,
    s5: .0375 * Ti.Platform.displayCaps.platformWidth,
    s6: .021875 * Ti.Platform.displayCaps.platformWidth,
    s7: .065 * Ti.Platform.displayCaps.platformWidth
};

Alloy.createController("index");