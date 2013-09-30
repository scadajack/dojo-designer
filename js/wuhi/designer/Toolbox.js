define([
	"dojo/_base/declare"
	,"dojo/_base/lang"
	,"dojo/aspect"
	,"dojo/dnd/Source"
	,"dojo/dom-class"
	,"dojo/dom-construct"
	,"dojo/on"
	,"dijit/_WidgetBase"
	,"dijit/_TemplatedMixin"
	,"dijit/_WidgetsInTemplateMixin"
	,"dijit/layout/AccordionContainer"
	,"dijit/layout/ContentPane"
	,"dojo/text!wuhi/designer/resources/Toolbox.html"
	,"wuhi/designer/_WidgetDescriptor"

], function(
	declare
	,lang
	,aspect
	,Source
	,domClass
	,domConstruct
	,on
	,_WidgetBase
	,_TemplatedMixin
	,_WidgetsInTemplateMixin
	,AccordionContainer
	,ContentPane
	,template
	,_WidgetDescriptor
){

	var Toolbox = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{

		templateString : template,

		title : "Widget Toolbox",
		_setTitleAttr : { node: "titleNode", type: "innerHTML"},


		startup : function(){
			this.inherited(arguments);
			var self = this;
			aspect.before(this.containerNode,'selectChild',function(pane){
				console.log(arguments);
				self.containerNode.domNode.parentNode.parentNode.scrollTop=0;
				self._tmpScrollProps = self.containerNode.domNode.parentNode.parentNode.style['overflow'];
				self.containerNode.domNode.parentNode.parentNode.style['overflow'] = 'hidden';
				var child = pane._wrapperWidget;
				if (child){
					domConstruct.place(child.domNode,this.containerNode,'last');
				}
			});

			aspect.after(this.containerNode,'selectChild',function(openPromise){
				console.log(arguments);
				var thisObj = this;
				var animation = this._animation;
				var w = aspect.after(this._animation,"onEnd",function(){
					self.containerNode.domNode.parentNode.parentNode.style['overflow'] = self._tmpScrollProps;
					self.containerNode.domNode.parentNode.parentNode.style['height'] = '100%';

					self.containerNode.domNode.parentNode.parentNode.scrollTop=0;
					w.remove();
				})
			});
		},

		addWidgetClass : function(widgetClass){
			// summary:
			//    Adds a widget class to the toolbox. The actual object supplied is a reference to the 
			//    constructor object that the class pushes into the Designer registry when the class is 
			//    declared.
			var dojoClass = widgetClass.content.prototype.dojoClass;
			var category = _WidgetDescriptor.prototype.getAttribute(dojoClass,'category') || 'Misc';
			var p = _WidgetDescriptor.prototype.getInheritanceList(dojoClass);

			var refName;

				if (category == 'Standard'){
					refName = "toolboxDndSource";
				}  else {
					refName = category.replace(' ','_').toLowerCase();
				}
					if (!this[refName]){
						// build content pane containing a dndSource div to hold widgets
						this[refName] = domConstruct.create("div", {copyonly:"true", selfaccept:"false", selfcopy:"false"});
						var cp = new ContentPane({title: category});
						this[refName] = domConstruct.place(this[refName],cp.domNode);
						cp.placeAt(this.containerNode,'last');

						this[refName + "DndSource"] = new Source(this[refName]);
						on(this[refName + "DndSource"], "DndStart", lang.hitch(this, function(){
							//remove the selection if dnd is in progress. this is needed because the selection-avatar has a higher zIndex than the dnd-target of the widget
							this.designer.selectionController.removeSelection();
						}));
					}
					
				//}
				var ref = this[refName];
				var proto = widgetClass.content.prototype;

				var entry = domConstruct.create("div", {"dndType": proto.dojoClass, "dojoClass": proto.dojoClass});
				var cellLeft = domConstruct.create("div", {"style": {"float": "left", "width": "20px"}}, entry);
				var img = domConstruct.create("img", {"src": "img/" + proto._toolboxImg}, cellLeft);
				var cellRight = domConstruct.create("div", {"innerHTML": proto.dojoClass}, entry);
				
				domClass.add(entry, "dojoDndItem");
				domConstruct.place(entry,  ref);
					// now we need to let the dnd container be aware of the new dnd item.
				this[refName + "DndSource"].sync();

		}

	})

	return Toolbox;

})