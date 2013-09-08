define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dijit/form/Button",
	"wuhi/designer/_Widget"
], function (declare, domStyle, Button, _Widget) {

	var Button = declare("wuhi.designer.dijit.form.Button", [Button, _Widget], {
		
		dojoClass: "dijit.form.Button",
		resizeable: false,
		_toolboxImg: "Control_Button.png",
		_getDefaultsAttr: function(){
			return [{"name": "label", "value": this.get("NextWidgetPrintname")}];
		},
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
			//this.startup();
		},
		_resizeWidget:function(marginBox){		
			domStyle.set(this.get("id"), {"width": marginBox.w, "height": marginBox.h});
		},
		_onButtonClick:function(evt){
			this._onClick(evt);
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.Button);
	return Button;
});