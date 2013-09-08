define([
	"dojo/_base/declare",
	"dojo/dnd/Moveable",
	"wuhi/designer/dnd/_EscapableMoveableMixin"
],

function(
	declare,
	Moveable,
	_EscapableMoveableMixin
	){
	
	return declare([dojo.dnd.Moveable,_EscapableMoveableMixin],{});

});
		
