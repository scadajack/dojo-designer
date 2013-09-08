define([
	"dojo",
	"dojo/_base/array",
	"dojo/parser",
	"dojo/_base/declare",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileWriteStore",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dnd/Source",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/json",
	"dojo/on",
	"dojo/query",
	"dojo/text!wuhi/designer/resources/Designer.html",
	"dijit/MenuItem",
	"dijit/Menu",
	"dijit/_Widget",
	"dijit/form/ComboButton",
	"dijit/Toolbar",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/Tree",
	"dijit/form/SimpleTextarea",
	"dijit/form/ToggleButton",
	"dijit/layout/AccordionContainer",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/tree/TreeStoreModel",
	"dijit/tree/dndSource",
	"dojox/widget/Toaster",
	"dojox/grid/DataGrid",
	"dojox/html/entities",
	"dojox/html/format",
	"dojox/widget/Dialog",
	"wuhi/designer/DesignPane",
	"wuhi/designer/PropertyGrid",
	"wuhi/designer/SelectionController",
	"wuhi/designer/_Widget",
	"wuhi/designer/_WidgetDescriptor"
], function (dojo, array, parser, declare, topic, domClass, domAttr, ItemFileWriteStore, ItemFileReadStore, 
			lang, windowModule, Source, domConstruct, domStyle, JSON, on, query, template, MenuItem, Menu, 
			_Widget, ComboButton, Toolbar, _TemplatedMixin, _WidgetsInTemplateMixin, Tree, SimpleTextarea, ToggleButton, AccordionContainer, 
			BorderContainer, ContentPane, TabContainer, TreeStoreModel, dndSource, Toaster, DataGrid, 
			entities, format, Dialog, DesignPane, PropertyGrid, SelectionController, 
			designer_Widget, _WidgetDescriptor) {

			
	var Designer = declare("wuhi.designer.Designer", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin],{
	
		templateString: template,
//		widgetsInTemplate: true,
		_objectTree: null,
		_objectTreeStore: null,
		alignToGrid: true,
		useHtml5Markup: false,
		_history: [""], //the first history-entry is an empty string
		_historyIndex: 1,
		selectionController: null,
		
		postCreate:function(){
			//set designer for the deisgnerpane (first widget) it will inherit the designer to all created child widgets
			this.designerPane.designer = this;
			this.propertyGrid.designer = this;
			this.selectionController = new SelectionController(this);
			
			this.inherited("postCreate", arguments);

			//add all avaliable designer-widgets to the toolbox
			array.forEach(wuhi.designer.registry.classes, function(entry){
					if(entry.type == "designerWidgetClass" ){
						var proto = entry.content.prototype;
	
						var entry = domConstruct.create("div", {"dndType": proto.dojoClass, "dojoClass": proto.dojoClass});
						var cellLeft = domConstruct.create("div", {"style": {"float": "left", "width": "20px"}}, entry);
						var img = domConstruct.create("img", {"src": "img/" + proto._toolboxImg}, cellLeft);
						var cellRight = domConstruct.create("div", {"innerHTML": proto.dojoClass}, entry);
						
						domClass.add(entry, "dojoDndItem");
						domConstruct.place(entry,  this.toolboxDndSource);
					}
				}, this
			);
				
			//enable dnd
			this._toolboxDndSource = new Source(this.toolboxDndSource);
			on(this._toolboxDndSource, "DndStart", lang.hitch(this, function(){
				//remove the selection if dnd is in progress. this is needed because the selection-avatar has a higher zIndex than the dnd-target of the widget
				this.selectionController.removeSelection();
			}));
				
			//this.mainToaster.setContent('did you know?<p>...you can resize the widgets with a doubleclick...</p>', 'message');
			//this.mainToaster.show();
				
			//init object explorer	
			this._loadObjectExplorer();
				
			//start editarea
			this._activateCodeEditors();

				// NOTE: This is not a comprehensive listener. There are some text areas in the 
				//  document that tend to grab the window focus and cause events to not be captured by 
				//  this node tree (instead, the IFrame captures them.) Need to manage the IFrames' focus 
				//  better for this to work!
			this.ownerDocument.addEventListener('keydown',this.escListener,true);

		},

		escListener : function(event){
			switch (event.keyCode){
				case 27: console.log("ESC Pressed");
						 topic.publish("document/ESC",event);
						 break;
				default: console.log("keydown event:",event);
			}
		},

		createHistoryStep:function(){
			var content = domAttr.get(lang.clone(this.codePaneInternal), "innerHTML");
	
			//if the historyIndex is not at the end of the array, cut the array from historyIndex to the end
			if(this._historyIndex < this._history.length - 1){
				var newHistory = [];
				for(var i = 0; i <= this._historyIndex; i++){
					newHistory.push(this._history[i]);
				}
				this._history = newHistory;
			}
			
			if(content != this._history[this._history.length - 1]){
				this._history.push(content);
				this._historyIndex = this._history.length - 1;
			}
		},
		_onUndoClick:function(evt){
			
			if(this._historyIndex > 0){
				this._historyIndex--;
				
				this.set("sourceInternal", domConstruct.create("div", {"innerHTML": this._history[this._historyIndex]}), false);
				this._refreshDesignerFromSource();
				
				this._refreshCodePane(true);
			}
		},
		_onRedoClick:function(evt){
			
			if(this._historyIndex < (this._history.length - 1)){
				this._historyIndex++;
				
				this.set("sourceInternal", domConstruct.create("div", {"innerHTML": this._history[this._historyIndex]}), false);
				this._refreshDesignerFromSource();
				
				this._refreshCodePane(true);
			}
		},
		_onAlignToGridChanged:function(value){
			this.alignToGrid = value;
		},
		_onHtml5ButtonChanged:function(value){
			this.useHtml5Markup = value;	
		},
		_onClickTundra:function(evt){
			domClass.remove(windowModule.body(), "claro");
			domClass.add(windowModule.body(), "tundra");
			this._refreshDesignerFromSource();
		},
		_onClickClaro:function(evt){
			domClass.remove(windowModule.body(), "tundra");
			domClass.add(windowModule.body(), "claro");
			this._refreshDesignerFromSource();
		},
		_loadObjectExplorer: function () {
			
			if (this._objectTree != null) {
				this._objectTree.destroyRecursive();
				this._objectTree = null;
			}
			this._objectTreeStore = new ItemFileWriteStore({
				data: {
					identifier: "id",
					label: "name",
					items: [this.getObjectExplorerData()]
				}
			});
			
			on(this._objectTreeStore, "New", function(item, parent){
				//@TODO: create dropped widgets
				//console.log(item, parent);
			});
					
			var model = new TreeStoreModel({
				"store": this._objectTreeStore,
				"childrenAttrs": ["children"]
			});
	
			//@TODO: fix this with dojo.hitch
			var designer = this;
		
			this._objectTree = new Tree({
				"model": model,
				"dndController": dndSource,
				"showRoot": true,
				"onClick": lang.hitch(this, "_onObjectTreeClick"),
				"autoExpand": true,
				"checkItemAcceptance":function(node,source){
					var accepted = false;
					//console.log(node, source);
					source.forInSelectedItems(function(item){
						var storeItem = dijit.getEnclosingWidget(node).item;
						var sourceDojoType;
						
						if(item.type == "treeNode"){//dnd tree to tree
							sourceDojoType = designer._objectTreeStore.getValue(item.data.item, "name");
						}else{//dnd from toolbox to tree
							sourceDojoType = item.type;
							
							accepted = false;
							return;
						}
	
						var targetDojoType = storeItem.name[0];
						var targetDesignerDojoType = designer.designerClassFromDojoClass(targetDojoType);				
						var targetWidget = designer_Widget.prototype.__stringToFunction(targetDesignerDojoType);
						
						if(storeItem.id[0] == "root"){
							targetWidget = {prototype: DesignPane.prototype};
						}
	
						//check if the source is accepted by the target
						if(targetWidget){
							array.forEach(targetWidget.prototype.get("accept"), function(entry){
								if(entry == sourceDojoType){
									accepted = true;
								}
							});
						}
					});
					
					return accepted;
				},
				"onDndDrop":function(source, nodes, copy){
					this.inherited("onDndDrop", arguments)
					
					if(source.declaredClass == "dijit.tree.dndSource"){ //dnd tree to tree
						
						var newInternalSourceContainer = designer.__getSourceNodesByTreeStoreItemsHelper(designer._objectTreeStore._arrayOfAllItems[0]);
						designer.set("sourceInternal", newInternalSourceContainer, true);
					}else if(source.declaredClass == "dojo.dnd.Source"){
						
					}
				},
				"onClick":lang.hitch(this, function(item){
					var widget = dijit.byId(this._objectTreeStore.getValue(item, "id"));
					if(widget){
						topic.publish("wuhi/designer/widget/click", {widget: widget, event: null});
					}
				})
			}).placeAt(this.objectExplorer.domNode);
			
			this._objectTree.startup();
		},
		__getSourceNodesByTreeStoreItemsHelper:function(item){
			//
			//	helperfunction
			//
			var entry = lang.clone(this._getInternalNodeById(item.id[0]));
			if(item.id[0] == "root"){
				entry = domConstruct.create("div");
			}
				
			//remove all children because there whre added one by one
			var widget = dijit.byId(domAttr.get(entry, "id"));
			if(widget){
				if(widget.isDojoWidget == true){
					domAttr.set(entry, "innerHTML", "");
				}
			}
			
			//console.log(item.id[0], entry);
			
			array.forEach(item.children, function(child) {
				var newChild = this.__getSourceNodesByTreeStoreItemsHelper(child);
				if(domAttr.get(newChild, "id")){
					entry.appendChild(newChild);
				}
			}, this);
				
			return entry;
		},
		_getInternalNodeById:function(id){
			var node = query("[id$="+id+"]", this.codePaneInternal)[0] || null;
			return node;
		},
	
		_onObjectTreeClick:function(item){
	
			var widget = dijit.byId(this._objectTreeStore.getValue(item, "id"));
			
			var items = [];
			var props = _WidgetDescriptor.prototype.getProperties(widget.dojoClass);
			array.forEach(props, function(item, index){
				if(item.isStyle == true){
					items.push({"id": index, "name": item.name, "value": domStyle.get(this.domNode, item.name), "isStyle": item.isStyle});
				}else{
					items.push({"id": index, "name": item.name, "value": this.get(item.name), "isStyle": item.isStyle});
				}
			}, widget);
			
			var props = {'identifier': 'id',
				'label': 'name',
				'numRows': 1,
				'items':items
			};
			
			this.propertyGrid.set("data", props);
			this.propertyGrid.set("widget", widget);
		},
		getObjectExplorerData:function(){
			return this.__getTreeEntriesHelper(this.codePaneInternal);
		},
		__getTreeEntriesHelper:function(node){
			//
			//	helperfunction
			//
			var entry = {"id": domAttr.get(node, "id") || "root", "name": domAttr.get(node, (this.useHtml5Markup)?"data-dojo-type":"dojoType") || node.tagName};
	
			var children = [];
			array.forEach(query("> *", node), function(subNode) {
			   children.push(this.__getTreeEntriesHelper(subNode));
			}, this);
			
			if(children.length > 0){
				entry["children"] = children;
			}
			
			return entry;
		},
		_activateCodeEditors:function(){
			
			editAreaLoader.init({
					id: this.codePaneExternal.textbox.id
					,start_highlight: true
					,allow_resize: "no"
					,allow_toggle: false
					,word_wrap: false
					,language: "en"
					,syntax: "html"
					,is_editable: false
			});
			
			//@TODO create the javascript & css editors
		},
		_setSourceAttr:function(value){
			
			if(editAreaLoader.getValue(this.codePaneExternal.textbox.id) == value){ return; }
			
			editAreaLoader.setValue(this.codePaneExternal.textbox.id, "");
			editAreaLoader.setValue(this.codePaneExternal.textbox.id, value);
			
			//this.codePaneExternal.attr("value", value);
		},
		_getSourceAttr:function(){
			//return this.codePaneExternal.attr("value");
			return editAreaLoader.getValue(this.codePaneExternal.textbox.id);
		},
		_getDesignerSourceAttr:function(){
			//var source = editAreaLoader.getValue(this.codePaneExternal.textbox.id);
			var source = domAttr.get(this.codePaneInternal, "innerHTML");
			var container = domConstruct.create("div", {"innerHTML": source});
			
			query("*", container).forEach(function(node){
				if(domAttr.get(node, (this.useHtml5Markup)?"data-dojo-type":"dojoType")){
					//console.log(node);
					domAttr.set(node, (this.useHtml5Markup)?"data-dojo-type":"dojoType", this.designerClassFromDojoClass(domAttr.get(node, (this.useHtml5Markup)?"data-dojo-type":"dojoType")));
				}
			}, this);
			
			return domAttr.get(container, "innerHTML");
		},
		_pasteSource:function(sourceNode, parentId, instantRefresh){
			if(sourceNode == null){ return; }
	
			var foundParent = 0;
			query("*", this.codePaneInternal).forEach(function(node){
				//console.log("checking node ", node);
				if(node.id == parentId){
					domConstruct.place(sourceNode, node);
					foundParent++;
				}
			});
			//if no parent was found (e.g. for the first widget) drop it in the root ...
			if(foundParent == 0){ domConstruct.place(sourceNode, this.codePaneInternal); }
	
			if(instantRefresh === true){
				//display the new source
				this._refreshCodePane();
			}
			
			//refresh the object-explorer
			//this._loadObjectExplorer();
			//@TODO: fix this ugly time-hack (its only with dndcontroller of the object-tree
			setTimeout(lang.hitch(this, "_loadObjectExplorer"), 100);
		},
		_refreshCodePane:function(noHistory){
			var internalSource = lang.clone(this.codePaneInternal);
			//remove the internal id's
			//dojo.query("[dojoType]", internalSource).forEach(function(node){
			query("*", internalSource).forEach(function(node){
				var widget = dijit.byId(domAttr.get(node, "id"));
				if(widget){
					if(widget.isDojoWidget != true){ //remove the dojotype of non-dojo-widgets. (dojotype of a non-dojo-widget is a wrapper)
						node.removeAttribute(((this.useHtml5Markup)?"data-dojo-type":"dojoType"));
					}
				}
				node.removeAttribute("id");
			});
					
			//textarea content
			this.set("source", format.prettyPrint(entities.decode(domAttr.get(internalSource, "innerHTML"))));
			//editAreaLoader.setValue("wuhiDesignerCodeEditor", "");
	                //editAreaLoader.setValue("wuhiDesignerCodeEditor", dojox.html.format.prettyPrint(dojo.attr(internalSource, "innerHTML")));
			
			if(!noHistory){
				//add history step
				this.createHistoryStep();
			}
		},
		_updateSourceNode:function(sourceNodeId, properties, instantRefresh, clearAttributes){
			query("*", this.codePaneInternal).forEach(lang.hitch(this, function(node){
				//console.log("checking node ", sourceNodeId, properties);
				if(domAttr.get(node, "id") == sourceNodeId){
					
					for(var prop in properties){
						/*
						//node.setAttribute(prop, properties[prop]);
						if(clearAttributes == true){
							dojo.removeAttr(node, prop);
						}
						if(prop == "style" && typeof(properties[prop]) == "object"){
							for(var styleProp in properties[prop]){
								dojo.style(node, styleProp, properties[prop][styleProp]);
							}
						}else{
							dojo.attr(node, prop, properties[prop]);
						}
						*/
						this._updateNodeAttribute(node, prop, properties[prop], clearAttributes, this.useHtml5Markup);
					}	
				}
			}));
	
			if(instantRefresh === true){
				//display the new source
				this._refreshCodePane();
			}
		},
		_updateSourceNodePosition:function(widget, instantRefresh){
	
			var styleProps = null;
			//this._updateSourceNode(widget.id, {"style": widget.attr("style")}, false);
			//@TODO: fix the position-problem ... relative nodes are not alloed to have top/left. keep in mind that the position can be changed with the popertygrid
			if(widget.moveable == true) {
				styleProps = {"style": {"top": domStyle.get(widget.domNode, "top")+"px", "left": domStyle.get(widget.domNode, "left")+"px", "position": domStyle.get(widget.domNode, "position")}};
			}
	
			this._updateSourceNode(widget.id, styleProps, instantRefresh, false);
		},
		_updateNodeAttribute:function(node, name, value, clearValue, html5){
			//console.log(node, name, value, clearValue, html5);
			var itemValue = value;
			if(typeof(html5) == "undefined"){
				html5 = this.useHtml5Markup;	
			}
	
			var dataDojoProps;
			if(html5 && domAttr.get(node, "data-dojo-props") != null && clearValue == false){
				dataDojoProps = JSON.parse("{"+domAttr.get(node, "data-dojo-props")+"}");
				//console.log(dojo.clone(dataDojoProps));
			}
			if(!dataDojoProps){
				dataDojoProps = {};
			}
			
			if(itemValue != null){
							
				if(html5){
					if(typeof(itemValue) == "object"){
	
						if(typeof(dataDojoProps[name]) != "undefined"){
							for(var prop in itemValue){
								dataDojoProps[name][prop] = itemValue[prop];
							}
						}else{
							dataDojoProps[name] = itemValue;
						}
					}else{
						dataDojoProps[name] = itemValue;
					}
					var jsonContent = JSON.stringify(dataDojoProps).replace(/"/g, "'");
					//console.log(jsonContent);
					jsonContent = jsonContent.substr(1, jsonContent.length - 2);
					domAttr.set(node, "data-dojo-props", jsonContent);
				}else{
					if(name == "value"){
						node.setAttribute(name, itemValue);
					}else if(name == "style" && typeof(itemValue) == "object"){
	
						if(clearValue == true){
							domAttr.set(node, "style", "");	
						}
						domStyle.set(node, itemValue);
	
					}else if(typeof(itemValue) == "object"){
						//@TODO: fix the replace thing. the properties are getting escaped to much. so its a string ether than an object
						//try the style ... if a width is set, and a move is perfeormed, the move will override the width
						if(html5){
							itemValue = JSON.stringify(itemValue);
						}else{
							itemValue = JSON.stringify(itemValue).replace(/"/g, "'");
						}
						
						domAttr.set(node, name, itemValue);
					}else {
						domAttr.set(node, name, itemValue);	
					}
				}	
			}	
		},
		registerWidget:function(widget)	{
			if(!lang.isArray(wuhi.designer.registry.widgets[widget.dojoClass])){
				wuhi.designer.registry.widgets[widget.dojoClass] = new Array();
			}
			
			wuhi.designer.registry.widgets[widget.dojoClass].push(widget);
		},
		unregisterWidget:function(widget){
			//console.log(widget, typeof(wuhi.designer.registry.widgets[widget.dojoClass]));
			//wuhi.designer.registry.widgets[widget.dojoClass].remove(widget);
			//@TODO
		},
		registerClass:function(classPntr){
			if(typeof(wuhi.designer.registry) == "undefined"){	
				wuhi.designer.registry = {};
				wuhi.designer.registry.widgets = []; //holds the created widgets
				wuhi.designer.registry.classes = []; //holds the pointers to the avaliable designer-widgets
			}
	
			wuhi.designer.registry.classes.push({"type": "designerWidgetClass", "content": classPntr});		
		},
		unregisterClass:function(classPntr){
			//@TODO
		},
		designerClassFromDojoClass:function(dojoClass){
			var designerClass = "";
			array.forEach(wuhi.designer.registry.classes, function(entry){
				if(entry.content.prototype.dojoClass == dojoClass){
					designerClass = entry.content.prototype.declaredClass;
				}
			});
			return designerClass;
		},
		_onPreviewClick:function(evt){
			var dlg = new Dialog({
			    content: this.get("source"),
			    //executeScripts: true,
			    sizeToViewport: true,
			    title: "Run",
			    autofocus: false
			});
			dlg.startup();
			dlg.show();
		},
		_refreshDesignerFromSource:function(recreatedInstanceOfWidgetId, sourceCode){
			//@TODO: all operations from see _Widget._onDndDrop should be called here ...
			//this.designerPane.destroyChildren();
			this.destroyWidgets();
			//console.log(this.designerPane);
			//console.log("after destroy");
			var source = sourceCode || this.get("designerSource");
			domAttr.set(this.designerPane.domNode, "innerHTML", source);
			parser.parse(this.designerPane.domNode);
			
			if(recreatedInstanceOfWidgetId){
				return dijit.byId(recreatedInstanceOfWidgetId);
			}		
			
			topic.publish("wuhi/designer/refresh", {});
			//refresh the object-explorer
			//this._loadObjectExplorer();
			//@TODO: fix this ugly time-hack (its only with dndcontroller of the object-tree
			setTimeout(lang.hitch(this, "_loadObjectExplorer"), 100);
		},
		_setSourceInternalAttr:function(container, instantRefresh){
			domAttr.set(this.codePaneInternal, "innerHTML", domAttr.get(container, "innerHTML"));
			if(instantRefresh == true){
				this._refreshDesignerFromSource();
				this._refreshCodePane();
			}
		},
		destroyWidgets:function(){
			query("[id]", this.codePaneInternal).forEach(function(node){
				var childWidget = dijit.byId(domAttr.get(node, "id"));
				if (typeof(childWidget) != "undefined") {
					this.unregisterWidget(childWidget);
					childWidget.destroyRecursive();
				}
			}, this);
		}
	
	});
	return Designer;
});