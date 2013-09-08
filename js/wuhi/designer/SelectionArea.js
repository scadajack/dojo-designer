define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/on",
	"dojo/topic",
	"dijit/_Templated",
	"dijit/_Widget"
], function (declare, lang, windowModule, domConstruct, domStyle, on, topic, _Templated, _Widget) {

	//@TODO: this is the selectionarea of an very old test-version of the designer. port it to fit with the current version
	var SelectionArea = declare("wuhi.designer.SelectionArea", [_Widget, _Templated], {
		templateString: '<div dojoAttachPoint="selectionArea" style="display: none;"><div dojoAttachPoint="selectionAreaInner"></div></div>',
	
		target: null,
		selectedNodes: new Array(),
		getSelectedNodes: function () {
	/*
			var selectionLeft = parseInt(this.selectionArea.style.left);
			var selectionRight = selectionLeft + parseInt(this.selectionArea.style.width);
			var selectionBottom = parseInt(this.selectionArea.style.top) + parseInt(this.selectionArea.style.height);
			var selectionTop = parseInt(this.selectionArea.style.top);
			
			var selectedNodes = new Array();
			//parse all dijits in source
			dojo.query("div", more.designer.sourceCodeContainer).forEach(
					  function(node, index, arr){
						  
						  var nodeLeft = parseInt(node.style.left);
						  var nodeTop = parseInt(node.style.top);
						  
						  if(nodeLeft >= selectionLeft && nodeLeft <= selectionRight && nodeTop <= selectionBottom && nodeTop >= selectionTop)
						  {
							  var offsetTop = nodeTop - selectionTop;
							  var offsetLeft = nodeLeft - selectionLeft;
							  selectedNodes.push({nodeId: node.id, offsetTop: offsetTop, offsetLeft: offsetLeft});
						  }
					  });
			
			return selectedNodes;
			*/
			return [];
		},
		postCreate: function () {
			this.inherited(arguments);
	
			this.addSelectionHandler();
			domConstruct.place(this.domNode, this.target.domNode)
	
			domStyle.set(this.selectionArea, {
				'position': 'absolute',
				'border': '1px solid #3399ff'
			});
	
			domStyle.set(this.selectionAreaInner, {
				'background': '#3399ff',
				'opacity': "0.40",
				'width': '100%',
				'height': '100%'
			});
	
			var sender = this;
	/*
			dojo.connect(this.domNode, "onmousedown",
					function()
					{
						sender.selectedNodes = sender.getSelectedNodes();
						dojo.forEach(sender.selectedNodes,
									function(nodeObject, index, arr)
									{
										//create clones of innerObjects to simulate real-time-moving 
										var cloneNode = dojo.clone(dojo.byId(nodeObject.nodeId));
										dojo.style(cloneNode, {'top': nodeObject.offsetTop+'px', 'left': nodeObject.offsetLeft+'px'});
										sender.selectionAreaInner.appendChild(cloneNode);
									});
						
						sender.moveHandler.onMoveStop = function(mover)
						{
							//console.log(mover);
							if(mover.mouseButton != 0)
							{
								return;
							}
							dojo.forEach(sender.selectedNodes,
								  function(nodeObject, index, arr)
								  {
										var currentDijit = dijit.byId(nodeObject.nodeId);
										dijitTop = parseInt(currentDijit.domNode.style.top);
										dijitLeft = parseInt(currentDijit.domNode.style.left);
	
										//set the position in designer mask
										more.designer.setPositionOnRaster(	currentDijit.domNode, 
																	parseInt(mover.node.style.top) + nodeObject.offsetTop,
																	parseInt(mover.node.style.left) + nodeObject.offsetLeft
																	);
										
										//set the position in sourcecode
										dojo.query("div", more.designer.sourceCodeContainer).forEach(
												  function(node, index, arr){
													  if(node.id == nodeObject.nodeId)
													  {
														more.designer.setPositionOnRaster(	node, 
													  								parseInt(mover.node.style.top) + nodeObject.offsetTop, 
													  								parseInt(mover.node.style.left) + nodeObject.offsetLeft);
													  	more.designer.refreshSourceCode();
													  }
												  });
										
										//the the position of the selection
										more.designer.setPositionOnRaster(	mover.node, 
												parseInt(mover.node.style.top),
												parseInt(mover.node.style.left)
												);
										
										//remove all clone-nodes
										sender.selectionAreaInner.innerHTML = "";
								  });
						};
					}
			);
			*/
	
		},
		addSelectionHandler: function () {
	
			on(this.target.domNode, "mousedown", lang.hitch(this, function (event) {
				//console.log(event);			
				domStyle.set(this.selectionArea, {
					'top': parseInt(event.layerY) + 'px',
					'left': parseInt(event.layerX) + 'px',
					'height': "0px",
					'width': "0px",
					'display': 'block'
				});
				this.selectionCreated = true;
				event.preventDefault(), event.stopPropagation();
			}));
	
			on(windowModule.doc, "mousemove", lang.hitch(this, function (event) {
				//console.log(event);
				if (this.selectionCreated == true) {
					var OldLeftX = parseInt(this.selectionArea.style.left);
					var OldTopY = parseInt(this.selectionArea.style.top);
	
					var oldWidth = OldLeftX;
					var oldHeight = OldTopY;
					var width = (parseInt(event.layerX) - oldWidth);
					var height = (parseInt(event.layerY) - oldHeight);
	
					if (width > 0) {
						domStyle.set(this.selectionArea, {
							'width': width + 'px',
							'height': height + 'px'
						});
					}	
					event.preventDefault(), event.stopPropagation();			
				}
				
			}));
	
			on(this.target.domNode, "mouseup", lang.hitch(this, function (event) {
				//console.log(event);
				if (this.selectionCreated == true) {
					this.selectionCreated = false;
					domStyle.set(this.selectionArea, 'display', 'none');
					event.preventDefault(), event.stopPropagation();
				}
			}));
	
			on(this.target.domNode, "contextmenu", lang.hitch(this, function (event) {
				domStyle.set(this.selectionArea, 'display', 'none');
				event.preventDefault(), event.stopPropagation();
			}));
		}
	
	});
	return SelectionArea;
});