define([
	'dojo/_base/declare'
	,'dojo/_base/lang'
	,'./_pluginBase'
	,'./PluginDataManager'
	,'./PluginFactory'
],function(
	declare
	,lang
	,_pluginBase
	,PluginDataManager
	,PluginFactory
){


var dataManager = PluginDataManager.getInstance();
var PLUGIN_CLASS = 'plugins.widget._dataAwarePlugin',
	READ_WRITE_MODE = 'readWrite',
	READ_MODE = 'read',
	DEFAULT_FIELD = 'value',
	DEFAULT_NAME = 'Data Connector',
	DEFAULT_TARGET = 'value';

var dap = declare([_pluginBase],{

	//  dataSource : (string)
	//      summary: Object or identifier of object that holds values.
	//  dataItem : (string)
	//      Object or identifier of the data item.
	//  dataField : (string)
	//      Field to be updated in dataItem
	//  target : (string)
	//      Property name that will receive the value on the host object.
	//  dataValue : ?
	//      Current or last data value
	//  mode : ('read' | 'readWrite')       

	pluginClass : PLUGIN_CLASS,

	constructor : function(params){
		var io = {
			name : DEFAULT_NAME,
			dataField : DEFAULT_FIELD,
			mode : READ_MODE,
			target : DEFAULT_TARGET
		}
		var p = lang.mixin(io,params || {});

		Object.keys(p).forEach(function(key){
			!this[key] && (this[key] = p[key]);
		},this);
	},

	_setModeAttr : function(mode){
		switch (mode){
			case READ_WRITE_MODE : this.mode = mode; break;
			default : this.mode = READ_MODE;
		}
		this._setTargetListener();
	},


	_setDataSourceAttr : function(dataSource){
		if (this.dataSource != dataSource){
			this.dataSource = dataSource;
			this.updateDataConfiguration();
		}
	},

	_setDataItemAttr : function(dataItem){
		if (this.dataItem != dataItem){
			this.dataItem = dataItem;
			this.updateDataConfiguration();
		}
	},

	_setDataFieldAttr : function(dataField){
		if (this.dataField != dataField){
			this.dataField = dataField;
			this.updateDataConfiguration();
		}
	},

	_setTargetAttr : function(target){
		
		this.target = target;
			// Check that we have a dataListener (i.e. we're connected to a dataSource) 
			// before attempting to initialize value from that source.
		if (this.dataListener && (host.get(target) != this.dataValue)){
			host.set(target,this.dataValue);
		}
		this._setTargetListener(target);
		
	},

	_setTargetListener : function(){
		this._targetListenerHandle && this._targetListenerHandle.remove();
		if (this.mode == READ_WRITE_MODE && this.target)
			this._targetListenerHandle = host.on(target,this.hostListener);
	},

	updateDataConfiguration : function(){
		this.dataListener && this.dataListener.remove();
		if (this.dataSource && this.dataSource.length > 0 && this.dataItem && this.dataItem.length > 0 
				&& this.dataField && this.dataField.length > 0){
			this.dataListener = dataManager.monitorValue(this.dataSource,this.dataItem,this.dataField,this.dataSourceListener); 
				// fetch initial data from dataManager and update widget if possible.
			var value = dataManager.getValue(this.dataSource,this.dataItem,this.dataField);
			this.dataSourceListener('','update',this.dataField,value);
		}
	},

	hostListener : function(eventValue){
		if (eventValue != this.dataValue){
			this.dataValue = eventValue;
			dataManager.updateValue(this.dataSource,this.dataItem,this.dataField,this.dataValue);
		}
	},

	dataSourceListener : function(topicName,op,key,value,oldValue){
		if (op == 'update'){
			if (this.dataValue != value){
				this.dataValue = value;
				this.updateHostValue();
			}
		}
	},

	updateHostValue : function(){
		if (!this.target || !this.host) return;
		var oldHostValue = host.get(target);
		if (oldHostValue != this.dataValue)
			host.set(target,this.dataValue);
	},

	getDefinition : function(){
		var d = this.inherited(arguments);
		d.dataSource = this.dataSource;
		d.dataItem = this.dataItem;
		d.dataField = this.dataField;
		d.target = this.target;
		d.dataValue = this.dataValue;
		d.mode = this.mode;
		return d;
	}
})

PluginFactory.getInstance().registerPluginClass("plugins.widget._dataAwarePlugin",dap);

return dap;

})