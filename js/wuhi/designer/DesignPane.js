define([
	"dojo",
	"dojo/_base/window",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/parser",
	"dojo/query",
	"dojo/topic",
	"wuhi/designer/SelectionArea",
	"wuhi/designer/_Widget"
], function (dojo, windowModule, declare, array, domAttr, domClass, domConstruct, domStyle, parser, query, topic, SelectionArea, _Widget) {

	var DesignPane = declare("wuhi.designer.DesignPane", _Widget, {
	
		dojoClass: "wuhi.designer.DesignPane",
		moveable: false,
		resizeable: false,
		_mouseFollower: null,
		selectionArea: null,
		_getAcceptNotAttr: function () {
			return ["dijit.layout.ContentPane"];
		},
		_setContentAttr: function (content) {
			//clear content
			domAttr.set(this.domNode, "innerHTML", "");
			//assign new node to this
			//dojo.place(content, this.domNode);
			domAttr.set(this.domNode, "innerHTML", content);
			//parse for widgets
			parser.parse(this.domNode);
		},
		destroyChildren: function () {
			var childNodes = query("*", this.domNode);
			array.forEach(childNodes, function (node, index) {
				var childWidget = dijit.byNode(node);
				if (typeof(childWidget) != "undefined") {
					this.designer.unregisterWidget(childWidget);
					childWidget.destroyRecursive();
				}
			}, this);
		},
		postCreate: function () {
			this.inherited("postCreate", arguments);
	
			domClass.add(this.domNode, "wuhiDesignerDesignPane");
	
			//@TODO: selectionarea
			//this.selectionArea = new wuhi.designer.SelectionArea({"target": this});
			//this.selectionArea.startup();
			
			//dojo.connect(dojo.doc, "onmousemove", this, "_onMouseMove");
			//dojo.connect(dojo.doc, "onmouseover", this, "_onMouseOver");
			//dojo.connect(dojo.doc, "onmouseout", this, "_onMouseOut");
		},
		_onMouseOver: function (evt) {
			this._mouseFollower = domConstruct.create("div", {
				"innerHTML": "todo"
			}, windowModule.body());
			evt.preventDefault(), evt.stopPropagation();
		},
		_onMouseOut: function (evt) {
			domConstruct.destroy(this._mouseFollower);
			this._mouseFollower = null;
			evt.preventDefault(), evt.stopPropagation();
		},
		_onMouseMove: function (evt) {
			domStyle.set(this._mouseFollower, {
				"position": "absolute",
				"left": (evt.pageX + 20) + "px",
				"top": evt.pageY + "px"
			});
			evt.preventDefault(), evt.stopPropagation();
		}
	});
	return DesignPane;
});