define([
	"dojo",
	"dojo/query",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom",
	"dojo/_base/lang",
	"dojo/dom-geometry",
	"dojo/_base/window",
	"dojo/on",
	"dojo/topic",
	"dijit/_Widget"
], function (dojo, query, array, declare, domAttr, domStyle, domClass, domConstruct, dom, lang, domGeometry, windowModule, on, topic, _Widget) {

	var ResizeHandle = declare("wuhi.designer.ResizeHandle", _Widget, {
	    targetNode: null,
	    _handleNodes: [],
	    
	    postCreate: function() {
	        if (lang.isString(this.targetNode)) {
	            this.targetNode = dom.byId(this.targetNode);
	        }
			
			this._pconnects = []; 
	        this._pconnects.push(on(windowModule.doc, "mouseup", lang.hitch(this, "_onMouseUp")));
	        this._pconnects.push(on(windowModule.doc, "mousemove", lang.hitch(this, "_onMouseMove")));
	
	        this.createResizeHandles();
	    },
	    resizeAxis: "xy",
	    basezIndex: 0,
		minWidth: 0,
		minHeight: 0,
	    _mouseDown: false,
	    _lastDirection: "",
	    _lastMarginBox: {
	        l: 0,
	        t: 0,
	        w: 0,
	        h: 0
	    },
	    _lastPosition: {
	        x: 0,
	        y: 0,
	        w: 0,
	        h: 0
	    },
	    _lastGrab: {
	        x: 0,
	        y: 0
	    },
	    onResizeComplete: function(marginBox) {
	        //connect here
	    },
	    onResize: function(node, marginBox){
	    	//connect here
	    },
	    _onMouseDown: function(e) {
	        this._lastMarginBox = dojo.marginBox(this.targetNode);
	        this._lastPosition = domGeometry.position(this.targetNode);
	        this._lastGrab = {
	            x: e.clientX,
	            y: e.clientY
	        };
	
	        this._mouseDown = true;
	        var handle = e.target;
	        var direction = domAttr.get(handle, "className");
	        //N,S,W,E,NW,NE,SW,SE
	        this._lastDirection = direction.substr(direction.length - 2, 3).replace("_", "");
	
	        e.preventDefault(), e.stopPropagation();
	    },
	    _onMouseUp: function(e) {
	
	        if (this._mouseDown == true) {
	            this.onResizeComplete(dojo.marginBox(this.targetNode));
	        }
	        this._mouseDown = false;
	        e.preventDefault(), e.stopPropagation();
	    },
	    _onMouseMove: function(e) {
	        if (this._mouseDown === true) {
	
	            var newBox = {};
	
	            if (this._lastDirection.indexOf("E") != -1) {
	                newBox.w = Math.max(this.minWidth, this._lastMarginBox.w + e.clientX - this._lastGrab.x);
	            }
	
	            if (this._lastDirection.indexOf("S") != -1) {
	                newBox.h = Math.max(this.minHeight, this._lastMarginBox.h + e.clientY - this._lastGrab.y);
	            }
	
	            if (this._lastDirection.indexOf("W") != -1) {
	                newBox.l = Math.min(this._lastMarginBox.l + e.clientX - this._lastGrab.x, this._lastMarginBox.l + this._lastMarginBox.w - this.minWidth);
	                newBox.w = Math.max(this.minWidth, this._lastMarginBox.w - e.clientX + this._lastGrab.x);
	            }
	            if (this._lastDirection.indexOf("N") != -1) {
	                newBox.t = Math.min(this._lastMarginBox.t + e.clientY - this._lastGrab.y, this._lastMarginBox.t + this._lastMarginBox.h - this.minHeight);
	                newBox.h = Math.max(this.minHeight, this._lastMarginBox.h - e.clientY + this._lastGrab.y);
	            }
	
	            //apply the new size
	            dojo.marginBox(this.targetNode, newBox);
				this.onResize(this.targetNode, newBox);
				
	            this.createResizeHandles();
	
	            e.preventDefault(), e.stopPropagation();
	        }
	    },
	    createResizeHandles: function() {
	
	        var squareBorderSize = 1;
	        var squareSize = 6; //px
	        var squareSizeHalf = 4; //@TODO: fix this in opera. opera needs a fixed value. calc with (squareSize / 2) + squareBorderSize; does not work
	        var squareSizePx = squareSize + "px";
	        var squareSizeHalfPx = squareSizeHalf + "px";
	        var squareSizeHalfNegPx = "-" + squareSizeHalf + "px";
	
	        var positions = [{
	            "direction": "NW",
	            "axis": "xy",
	            "style": {
	                "top": squareSizeHalfNegPx,
	                "left": squareSizeHalfNegPx
	            }},
	        {
	            "direction": "NE",
	            "axis": "xy",
	            "style": {
	                "top": squareSizeHalfNegPx,
	                "right": squareSizeHalfNegPx
	            }},
	        {
	            "direction": "SE",
	            "axis": "xy",
	            "style": {
	                "bottom": squareSizeHalfNegPx,
	                "right": squareSizeHalfNegPx
	            }},
	        {
	            "direction": "SW",
	            "axis": "xy",
	            "style": {
	                "bottom": squareSizeHalfNegPx,
	                "left": squareSizeHalfNegPx
	            }},
	        {
	            "direction": "N",
	            "axis": "y",
	            "style": {
	                "top": squareSizeHalfNegPx,
	                "left": ((dojo.marginBox(this.targetNode).w / 2) - squareSizeHalf) + "px"
	            }},
	        {
	            "direction": "S",
	            "axis": "y",
	            "style": {
	                "bottom": squareSizeHalfNegPx,
	                "left": ((dojo.marginBox(this.targetNode).w / 2) - squareSizeHalf) + "px"
	            }},
	        {
	            "direction": "W",
	            "axis": "x",
	            "style": {
	                "left": squareSizeHalfNegPx,
	                "top": ((dojo.marginBox(this.targetNode).h / 2) - squareSizeHalf) + "px"
	            }},
	        {
	            "direction": "E",
	            "axis": "x",
	            "style": {
	                "right": squareSizeHalfNegPx,
	                "top": ((dojo.marginBox(this.targetNode).h / 2) - squareSizeHalf) + "px"
	            }}];
	
	        array.forEach(positions, function(item) {
	        	if(this.resizeAxis.indexOf(item.axis) == -1) { return; }
	        	
	            var node;
	
	            if (node = query("." + "wuhiDesignerResizeSquare_" + item.direction, this.targetNode)[0]) {
	                //console.log("use existing");
	            } else {
	                node = domConstruct.create("div", {
	                    "style": {
	                        "position": "absolute",
	                        "height": squareSizePx,
	                        "width": squareSizePx,
	                        "backgroundColor": "white",
	                        "border": squareBorderSize + "px solid black",
	                        "zIndex": this.basezIndex + 1
	                    }
	                });
	
	                domClass.add(node, "wuhiDesignerResizeSquare_" + item.direction);
	                domStyle.set(node, "cursor", item.direction + "-resize");
	                domConstruct.place(node, this.targetNode);
	                this.connect(node, "onmousedown", lang.hitch(this, "_onMouseDown"));
	                this._handleNodes.push(node);
	            }
	            //apply the new position to the square
	            domStyle.set(node, item.style);
	            //console.log(dojo.style(node));
	        }, this);
	    },
	    moveTo:function(marginBox){
	    	dojo.marginBox(this.targetNode, marginBox);	
	    	dojo.marginBox(this._outlineBorder, marginBox);
	    },
	    destroy: function() {
	        this.inherited("destroy", arguments);
			//disconnect listeners
			array.forEach(this._pconnects, dojo.disconnect);
			//destroy handleNodes
	        array.forEach(this._handleNodes, function(node) {
	            domConstruct.destroy(node);
	        }, this);
	    }
	});
	return ResizeHandle;
});