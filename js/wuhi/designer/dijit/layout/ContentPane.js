define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"wuhi/designer/_Widget"
], function (declare, lang, domConstruct, topic, ContentPane, _Widget) {

	var ContentPane = declare("wuhi.designer.dijit.layout.ContentPane", [ContentPane, _Widget], {
		
		dojoClass: "dijit.layout.ContentPane",
		_toolboxImg: "Control_ContentPane.png",
		moveable: false,
		resizeable: false,
		needsRecreate: true,
		placeChildWidget:function(widget){
			domConstruct.place(widget.domNode, this.containerNode);
			this._scheduleLayout();
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "region", "value": null},
				{"name": "splitter", "value": null},
				{"name": "title", "value": null}
			];
		},
		postInstance:function(){
			
		},
		_getAcceptNotAttr:function(){
			return ["dijit.layout.ContentPane"];
		},
		_setPositionAttr:function(position){
			//a contentpane needs no position
		},
		postCreate:function(){
			this.inherited("postCreate", arguments);
			
			topic.subscribe("wuhi/designer/widget/resizeComplete", lang.hitch(this, function(message){
				if(message.needsRecreate == false){
					this._scheduleLayout();
				}
			}));
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.layout.ContentPane);
	return ContentPane;
});