define([
	"dojo/_base/declare",
	"dijit/PopupMenuItem",
	"wuhi/designer/_Widget"
], function (declare, PopupMenuItem, _Widget) {

	var PopupMenuItem = declare("wuhi.designer.dijit.PopupMenuItem", [PopupMenuItem, _Widget], {
		
		dojoClass: "dijit.PopupMenuItem",
		resizeable: false,
		moveable: false,
		needsRecreate: false,
		_getDefaultsAttr: function(){
			return [
				{"name": "label", "value": this.get("NextWidgetPrintname")}
			];
		},
		_getAcceptAttr:function(){
			return ["dijit.Menu"];
		},
		postInstance:function(){
			//this.startup();
		},
		placeChildWidget:function(widget){
			widget.set("moveable", false);
			widget.set("resizeable", false);
			
			this.inherited("placeChildWidget", arguments);
	
			//dojo.place(widget.domNode, this.containerNode);
	
		},
		_setPositionAttr:function(position){
			//needs no position
		},
		_onHover:function(){
			
		},
		_onUnhover:function(){
			
		},
		_onClick:function(){
			
		},
		_onFocus:function(){
			
		},
		_getDefaultChildrenAttr:function(){
			return [wuhi.designer.dijit.Menu];
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.PopupMenuItem);
	return PopupMenuItem;
});