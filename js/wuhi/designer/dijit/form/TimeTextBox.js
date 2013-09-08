define([
	"dojo/_base/declare",
	"dijit/form/TimeTextBox",
	"wuhi/designer/_Widget"
], function (declare, TimeTextBox, _Widget) {

	var TimeTextBox = declare("wuhi.designer.dijit.form.TimeTextBox", [TimeTextBox, _Widget], {
		
		dojoClass: "dijit.form.TimeTextBox",
		//_toolboxImg: "Control_DateTextBox.png",
		_resizeAxis: "x",
		
		_getAcceptAttr:function(){
			return [];
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "constraints", "value": {
		                timePattern: 'HH:mm:ss',
		                clickableIncrement: 'T00:30:00',
		                visibleIncrement: 'T00:30:00'
			        }
			    }
			];
		},
		_open:function(){
			//remove the calendar on click
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.TimeTextBox);
	
	return TimeTextBox;
});