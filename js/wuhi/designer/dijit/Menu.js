define([
	"dojo/_base/declare",
	"dijit/Menu",
	"wuhi/designer/_Widget"
], function (declare, Menu, _Widget) {

	//dojo.require("wuhi.designer.dijit.MenuItem"); //@TODO: add a sort to the widgets. atm the menueitem will appear BEFORE Menu if the require is done here
	var Menu = declare("wuhi.designer.dijit.Menu", [Menu, _Widget], {
		
		dojoClass: "dijit.Menu",
		_toolboxImg: "Control_Menu.png",
		resizeable: false,
		needsRecreate: true,
		_getDefaultsAttr: function(){
			return [
				//{"name": "style", "value": {"display": "none"}}
			];
		},
		_getAcceptAttr:function(){
			return ["dijit.MenuItem", "dijit.PopupMenuItem"];
		},
		postInstance:function(){
			//this.startup();
		},
		_setPositionAttr:function(position){
			//needs no position
		},
		_getDefaultChildrenAttr:function(){
			return [wuhi.designer.dijit.MenuItem, wuhi.designer.dijit.MenuItem];
		},
		placeChildWidget:function(widget){		
			this.addChild(widget);
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.Menu);
	return Menu;
});