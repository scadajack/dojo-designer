define([
	"dojo/_base/declare",
	"dijit/form/RadioButton",
	"wuhi/designer/_Widget"
], function (declare, RadioButton, _Widget) {

	var RadioButton = declare("wuhi.designer.dijit.form.RadioButton", [RadioButton, _Widget], {
		
		dojoClass: "dijit.form.RadioButton",
		//_toolboxImg: "Control_CheckBox.png",
		resizeable: false,
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
	
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.RadioButton);
	return RadioButton;
});