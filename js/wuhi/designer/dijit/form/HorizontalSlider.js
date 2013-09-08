define([
	"dojo/_base/declare",
	"dijit/form/HorizontalSlider",
	"wuhi/designer/_Widget"
], function (declare, HorizontalSlider, _Widget) {

	var HorizontalSlider = declare("wuhi.designer.dijit.form.HorizontalSlider", [HorizontalSlider, _Widget], {
		
		dojoClass: "dijit.form.HorizontalSlider",
		//_toolboxImg: "Control_TextBox.png",
		_resizeAxis: "x",
		
		_getAcceptAttr:function(){
			return [];
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "value", "value": "5"},
				{"name": "minimum", "value": "-10"},
				{"name": "maximum", "value": "10"},
				{"name": "intermediateChanges", "value": "true"},
				{"name": "style", "value": {"width": "200px"}}
			];
		},
		_onBarClick:function(){},
		_onHandleClick:function(){},
		_onClkDecBumper:function(){},
		_onClkIncBumper:function(){}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.HorizontalSlider);
	return HorizontalSlider;
});