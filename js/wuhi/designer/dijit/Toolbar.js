define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dijit/Toolbar",
	"wuhi/designer/_Widget"
], function (array, declare, Toolbar, _Widget) {

	var Toolbar = declare("wuhi.designer.dijit.Toolbar", [Toolbar, _Widget], {
	
		dojoClass: "dijit.Toolbar",
		resizeable: true,
		_toolboxImg: "Control_Toolbar.png",
		_resizeAxis: "x",
		needsRecreate: true,
		repositionChildren: false,
		_getDefaultsAttr: function () {
			return [
			//{"name": "style", "value": {"display": "none"}}
			];
		},
		_getAcceptAttr: function () {
			return ["dijit.form.Button", "dijit.form.DropDownButton"];
		},
		_getDefaultChildrenAttr: function () {
			return [wuhi.designer.dijit.form.Button, wuhi.designer.dijit.form.DropDownButton];
		},
		placeChildWidget:function(widget){
			
			this.inherited("placeChildWidget", arguments);
			this.trainChild(widget);
		},
		postAllChildInstances:function(){
			array.forEach(this.getChildren(), function(child){
				this.trainChild(child);
			}, this);
		},
		trainChild:function(widget){
			widget.set("moveable", false);
			widget.set("resizeable", false);
		},
		startup:function(){
			this.postAllChildInstances();
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.Toolbar); 
	return Toolbar;
});