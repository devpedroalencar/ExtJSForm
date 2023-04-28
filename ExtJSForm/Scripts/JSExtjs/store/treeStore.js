Ext.define('ExtJSForm.store.treeStore', {
    extend: 'Ext.data.TreeStore',
    require: 'ExtJSForm.model.treeModel',
    model: 'ExtJSForm.model.treeModel',
    autoLoad: false,
    autoSync: false,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        //url: 'Home/LoadNodes',

        api: {
            read: 'Home/LoadNodes',
            create: 'home/salvaDadosTree',
            //update: 'home/alterar',
            destroy: 'Home/deletaRegistroTree'
        },
        reader: {
            idProperty: 'id_tree',
            type: 'json',
            //rootProperty: 'children'
        },
        writer: {
            idProperty: 'id_tree',
            writeAllFields: true,
            type: 'json'
        }
    },

    root: {
        expanded: true,
        children: [], // Array vazio para carregar os nós pai inicialmente
        //property: 'childrens'
    },
    listeners: {
        // Evento que é acionado quando um nó é expandido
        nodebeforeexpand: function (node, eOpts) {
            if (node.isLoaded()) { // Verifica se os filhos já foram carregados
                return;
            }

            // Carrega os filhos do nó
            this.proxy.extraParams.id_tree = node.get('id_tree');
            this.load({
                node: node,
                callback: function () {
                    node.set('loaded', true);
                }
            });
        },
        load: function (store, records, successful, operation, eOpts) {            
            this.proxy.extraParams.id_tree = null;
        }
    }
}); 