define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dijit/form/DropDownButton",
	"wuhi/designer/_Widget"
], function (declare, domStyle, DropDownButton, _Widget) {

	var DropDownButton = declare("wuhi.designer.dijit.form.DropDownButton", [DropDownButton, _Widget], {
		
		dojoClass: "dijit.form.DropDownButton",
		resizeable: false,
		_toolboxImg: "Control_Button.png",
		_getDefaultsAttr: function(){
			return [
				{"name": "label", "value": this.get("NextWidgetPrintname")}
			];
		},
		_getAcceptAttr:function(){
			return ["dijit.Menu"];
		},
		postAllChildInstances:function(){
			//this.startup();
		},
		_resizeWidget:function(marginBox){		
			domStyle.set(this.get("id"), {"width": marginBox.w, "height": marginBox.h});
		},
		_getDefaultChildrenAttr:function(){
			return [/*wuhi.designer.html.Text, */wuhi.designer.dijit.Menu];
		},
		placeChildWidget:function(widget){
			//children are not allowed to be moveable or resizeable
			widget.set("moveable", false);
			widget.set("resizeable", false);
			widget.set("style",  {"display": "none"});
			
			this.inherited("placeChildWidget", arguments);
		},
		loadDropDown:function(){
			//remove poup
		},
		toggleDropDown:function(){}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.DropDownButton);
	return DropDownButton;
});