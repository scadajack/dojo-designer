define([
	"dojo/_base/declare",
	"dijit/form/TextBox",
	"wuhi/designer/_Widget",
	"wuhi/designer/Designer"
], function (declare, TextBox, _Widget, Designer) {

	var mTextBox = declare("wuhi.designer.dijit.form.TextBox", [TextBox, _Widget], {
		
		dojoClass: "dijit.form.TextBox",
		_toolboxImg: "Control_TextBox.png",
		_resizeAxis: "x",
		
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
	
		}
	});
	
	//Designer.prototype.registerClass(wuhi.designer.dijit.form.TextBox);
	Designer.prototype.registerClass(mTextBox);
	return mTextBox;
});