define([
	"dojo/_base/declare",
	"dijit/form/CheckBox",
	"wuhi/designer/_Widget"
], function (declare, CheckBox, _Widget) {

	var CheckBox = declare("wuhi.designer.dijit.form.CheckBox", [CheckBox, _Widget], {
		
		dojoClass: "dijit.form.CheckBox",
		_toolboxImg: "Control_CheckBox.png",
		resizeable: false,
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
	
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.CheckBox);
	return CheckBox;
});