define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/form/RadioButton",
	"dijit/layout/BorderContainer",
	"wuhi/designer/CallbackDialog",
	"wuhi/designer/_Widget"
], function (array, declare, lang, domConstruct, domGeometry, domStyle, RadioButton, BorderContainer, CallbackDialog, _Widget) {

	var BorderContainer = declare("wuhi.designer.dijit.layout.BorderContainer", [BorderContainer, _Widget], {
		
		dojoClass: "dijit.layout.BorderContainer",
		_toolboxImg: "Control_BorderContainer.png",
		moveable: true,
		resizeable: true,
		needsRecreate: true,
		_regions: ["left", "center", "top", "bottom"],
		_callbackDialog: null,
		useChildDefaults: false,
		placeChildWidget:function(widget){		
			var dialogContent = domConstruct.create("div");
			array.forEach(this._regions, function(region, index){
				var radio = new RadioButton({
				    checked: false,
				    value: region,
				    name: "region"
				}).placeAt(dialogContent);
				domConstruct.create("span", {"innerHTML": region}, dialogContent);			
				domConstruct.create("br", null, dialogContent);			
			}, this);
			
			if(this._callbackDialog != null){
				this._callbackDialog.destroyRecursive();
			}
	
			this._callbackDialog = new CallbackDialog({"title": "select a region", content: dialogContent, style: "width: 150px;", callback: lang.hitch(this, "_regionCallback", widget)});
			this._callbackDialog.show();
			
			//@TODO: get clientX/Y and show dialog on the right position
			domStyle.set(this._callbackDialog.dialog.domNode, {
				left: domGeometry.position(this.domNode).x+"px",
				top: domGeometry.position(this.domNode).y+"px"
			});
		},
		_regionCallback:function(widget, form){
			//@TODO: check if there exists already a contentpane with that region
			widget.set("region", form.region);
			
			//region-specific size
			var style = {/*"position": "relative", "top": 0, "left": 0*/};
			if(form.region == "left"){
				style["width"] = "120px";
			}
			domStyle.get(widget, style);
			
			this.addChild(widget);
			
			this.designer._updateSourceNode(widget.get("id"), {"region": form.region, "style":style}, /*instantrefresh*/true, /*clearattributes*/true);
			widget = this.designer._refreshDesignerFromSource(widget.get("id"));
			widget.showInPropertyGrid();
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "gutters", "value": "true"},
				{"name": "design", "value": "sidebar"},
				{"name": "style", "value": {"height": "200px", "width": "300px"}}
			];
		},
		_getAcceptAttr:function(){
			return ["dijit.layout.ContentPane", "dijit.layout.AccordionContainer", "dijit.layout.TabContainer", "dijit.layout.BorderContainer", "dijit.Menu", "dijit.Toolbar"];
		},
		layout:function(){
			this.inherited("layout", arguments);
			
			//all children of a bordercontainer are not allowed to be resizeable and moveable
			array.forEach(this.getChildren(), function(child){
				child.set("moveable", false);
				child.set("resizeable", false);
			});
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.layout.BorderContainer);
	return BorderContainer;
});