define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/topic"
],
function(
	declare,
	lang,
	on,
	topic
){

	return declare(null,{
		// summary:
		//    This mixin modifies the dojo.dnd.Moveable so that it will prevent the 
		//    creation of multiple Movers. The native implementation will, if interrupted 
		//    during a normal move operation, not know that there is a Mover existing 
		//    if it thinks it needs to create another. This implementation will keep track 
		//    of the movers and destroy existing ones before creating another.
		//
		//    Also updates so Moveable doesn't capture all mouse clicks, but only 
		//    left clicks.
		//
		//    This module is intended to fix issues where, due to unusual circumstances 
		//    the Mover doesn't get a Mouseup event and the user is stuck with the Mover 
		//    controlling the element. With this mixin, the user just clicks again and 
		//    the current mover is destroyed and a new mover is created (which will 
		//    presumably cancel properly.)

		constructor : function(){
			console.log("building emm")
			var escapeListener = topic.subscribe("document/ESC",function(){
				this._currentMover && this.escaper();
			});
		},

		onMouseDown: function(e){
			// summary:
			//		event processor for onmousedown, creates a Mover for the node
			// e: Event
			//		mouse event
			if (!e.button == 0){ return }
			this.inherited(arguments);
		},

		onDragDetected: function(/* Event */ e){
			if (this._currentMover){
				console.log("found current mover. Destroying and replacing");
				this._currentMover.destroy();
			} else {
				this._currentMover = new this.mover(this.node, e, this);
			}
		},

		onMoveStop : function(/* dojo.dnd.Mover */ mover){
			
			if (!this.moveStopping){
				try {
					console.log("move stop")
					this.moveStopping = true;
					this.destroyCurrentMover();
					this.inherited(arguments);	
				} finally {
					this.moveStopping = false;
				}
			}
			
		},

		destroyCurrentMover : function(){
			if (this._currentMover){
				var m = this._currentMover;
				delete this._currentMover;
				m.destroy();
				
			}
		},

		escaper : function(){
				console.log("Escaper Triggered")
				this.destroyCurrentMover();
				
		}


	});
})
