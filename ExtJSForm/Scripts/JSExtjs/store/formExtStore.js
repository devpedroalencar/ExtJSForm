Ext.define('ExtJSForm.store.formExtStore', {
    extend: 'Ext.data.Store',
    require: 'ExtJSForm.model.formExtModel',
    model: 'ExtJSForm.model.formExtModel',
    autoLoad: false,
    autoSync: false, 
    remoteSort: true,
    proxy: {
        batchActions: false,
        type: 'ajax',
        api: {
            read: 'home/listaDadosExtWindow',
            create: 'home/salvaDadosExtWindow',
            //update: 'home/alterar',
            destroy: 'home/excluiDadosExtWindow'
        },
        actionMethods: {
            read: 'POST',
            create: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            idProperty: 'idInfoExtJS',
            type: 'json',
            rootProperty: 'records',
            totalProperty: 'total',
            successProperty: 'success'
        },
        writer: {
            idProperty: 'idInfoExtJS',
            writeAllFields: true,
            type: 'json'
        },

        listeners: {
            exception: function (proxy, response, operation) {
                //Joga Exception
            }
        }
    },
    listeners: {
        // depois do load() do ajax
        load: function (store, records, successful, operation, eOpts) {
            if (successful) {
                if (this.ajaxLoad) {
                    this.ajaxLoad(records);
                }
                if (this.afterRequest) {
                    this.getProxy().afterRequest = this.afterRequest; 
                }
            }
            else { this.removed = []; }
        }
    } 
}); 