define([
	"dojo/_base/declare",
	"dijit/MenuItem",
	"wuhi/designer/_Widget"
], function (declare, MenuItem, _Widget) {

	var MenuItem = declare("wuhi.designer.dijit.MenuItem", [MenuItem, _Widget], {
		
		dojoClass: "dijit.MenuItem",
		resizeable: false,
		moveable: false,
		needsRecreate: false,
		_getDefaultsAttr: function(){
			return [
				{"name": "label", "value": this.get("NextWidgetPrintname")}
			];
		},
		_getAcceptAttr:function(){
			return [];
		},
		postInstance:function(){
			//this.startup();
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
			
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.MenuItem);
	return MenuItem;
});