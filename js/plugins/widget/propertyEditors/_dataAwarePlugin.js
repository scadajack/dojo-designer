define([
	'dojo/_base/declare'
	,'dijit/_WidgetBase'
	,'plugins/widget/PluginDataManager'
	,'plugins/widget/PluginFactory'
	,'wuhi/designer/_WidgetDescriptor'
],function(
	declare
	,_WidgetBase
	,PluginDataManager
	,PluginFactory
	,_WidgetDescriptor
){

var READ_WRITE_MODE = 'readWrite',
	READ_MODE = 'read';

var dap = declare([_WidgetBase],{
	// This class provides a facade for editing a _dataAwarePlugin instance 
	// in the PropertyGrid. This class will only delegate methods that are 
	// listed in the widgetDescriptor properties for that method.
	constructor : function(params){
		params && this.set('Widget',params.widget);

	},

	_setWidgetAttr : function(widget){
		if (widget){
			this.widget = widget;
			var classN = widget.get('pluginClass');
			this.mappedAccessors = _WidgetDescriptor.prototype.getProperties(classN).map(function(des){
				return des.name;
			});

		}
	},

	set : function(name,value){
		// summary:
		//    Override set to allow any mapped properties (i.e. properties to be edited)
		//    to access the embedded widget.
		if (this.mappedAccessors && this.widget && (name in this.mappedAccessors)){
			return this.widget.set(name,value);
		}
		this.inherited(arguments);
	},

	get : function(name){
		if (this.mappedAccessors && this.widget && (this.mappedAccessors.indexOf(name) > -1)){
			return this.widget.get(name);
		}
		this.inherited(arguments);
	},

	getDataSources: function(){
		return PluginDataManager.getDataSources();
	},

	getDataItemIds: function(){
		var ds = this.get('dataSource');
		if (ds)
			return PluginDataManager.getDataItemIds(ds.name);
	},

	getDataFields: function(){
		var ds = this.get('dataSource')
			did = ds && this.get('dataItem');
		if (did)
			return PluginDataManager.getDataFields(ds,did);
	},

	getTargetFields : function(){
		var plugin = this.widget,
			target = plugin && plugin.host,
			hostProps = target && _WidgetDescriptor.prototype.getProperties(target.dojoClass).map(function(des){
				return des.name;
			});

			return hostProps;
	},

	getModeValues : function(){
		return [READ_MODE,READ_WRITE_MODE]
	}



})

return dap;
})