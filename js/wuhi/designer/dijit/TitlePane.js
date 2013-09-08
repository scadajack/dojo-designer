define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/TitlePane",
	"wuhi/designer/_Widget"
], function (declare, domConstruct, TitlePane, _Widget) {

	var TitlePane = declare("wuhi.designer.dijit.TitlePane", [TitlePane, _Widget], {
		
		dojoClass: "dijit.TitlePane",
		resizeable: false,
		needsRecreate: true,
		_getDefaultsAttr: function(){
			return [
				{"name": "title", "value": this.get("NextWidgetPrintname")}
			];
		},
		postInstance:function(){
			//this.startup();
		},
		placeChildWidget:function(widget){
			domConstruct.place(widget.domNode, this.containerNode);
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.TitlePane);
	return TitlePane;
});