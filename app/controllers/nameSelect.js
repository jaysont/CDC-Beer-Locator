var args = arguments[0] || {};

var nameList = args.nameList;

var tvrow;
var curheader   = '1'; //the first letter of the list.
var index   = [];
var data = [];
var isAndroid   = (Titanium.Platform.name == 'android');

$.headerLabel1.text = args.label;

for (var i = 0; i < nameList.length; i++) {
	if (nameList[i].name[0] != curheader && args.useIndex === 1) {
		curheader = nameList[i].name[0];
		tvrow = Titanium.UI.createTableViewRow({
			height : '7%',
			header : curheader,
			rowId : nameList[i].id,
			name: nameList[i].name
		});
		index.push({
			title : curheader,
			index : i
		});
	} else {
		tvrow = Titanium.UI.createTableViewRow({
			height : '7%',
			rowId : nameList[i].id,
			name: nameList[i].name
		});
	}
	var title = Titanium.UI.createLabel({
		left : '6%',
		color : '#000',
		font : {
			fontSize : Alloy.CFG.fontSize.s4,
			fontWeight : 'normal',
			fontFamily : ( isAndroid ? 'sans-serif' : 'Helvetica Neue')
		},
		color: "#554E4A",
		text : nameList[i].name
	});
	tvrow.add(title);
	data.push(tvrow);
}
$.tableView.data = data;
if(args.useIndex === 1){
	$.tableView.index = index;
}

$.tableView.addEventListener('click', function(e){
	args.setName(e.rowData.rowId, e.rowData.name);
	$.nameSelectWindow.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
});
$.returnView.addEventListener('click', function(e) {
	$.nameSelectWindow.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
});
