define([
	"dojo/_base/declare",
	"dijit/form/DateTextBox",
	"wuhi/designer/_Widget"
], function (declare, DateTextBox, _Widget) {

	var DateTextBox = declare("wuhi.designer.dijit.form.DateTextBox", [DateTextBox, _Widget], {
		
		dojoClass: "dijit.form.DateTextBox",
		_toolboxImg: "Control_DateTextBox.png",
		_resizeAxis: "x",
		
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
		
		},
		_open:function(){
			//remove the calendar on click
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.DateTextBox);
	return DateTextBox;
});