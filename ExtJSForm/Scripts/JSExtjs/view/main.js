Ext.define('ExtJSForm.view.main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainmain',

    requires: ['Ext.layout.container.Border', 'Ext.button.Segmented'],

    controllers: ['ExtJSForm.controller.mainController'],

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    initComponent: function () {
        const me = this;

        me.storeFormExt = Ext.create('ExtJSForm.store.formExtStore');
        me.storeFormExt.load();

        me.MainContainerWrap = new Ext.create('Ext.grid.Panel', {
            title: 'Formulário Exemplo ExtJS',
            store: me.storeFormExt,
            border: false,
            flex: 1,
            itemId: 'gridFrm',
            description: 'Formulário Exemplo ExtJS',
            viewConfig: {
                loadMask: { msg: 'Aguarde, Carregando...' },
                emptyText: '<br/><center class="notFound">** Nenhum Registro Encontrado **</center>'
            },
            columns: [{ header: 'Nome', dataIndex: 'nome', flex: 1, filterable: true, align: 'center' },
            { header: 'Idade', dataIndex: 'idade', flex: 1, align: 'center' },
                {
                    header: 'Data', dataIndex: 'data', flex: 1, align: 'center', renderer: function (value, meta, r) {
                        return Ext.util.Format.date(value, 'd/m/Y H:i');
                    }
                }
            ],
            tbar: ['->',
                { text: 'Adicionar', iconCls: 'x-fa fa-plus-square-o', action: 'addFrm' },
                { text: 'Excluir', iconCls: 'x-fa fa-trash-o', action: 'deleteFrm' }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: me.storeFormExt,
                dock: 'bottom',
                displayInfo: true
            }]
        });

        me.treeStore = Ext.create('ExtJSForm.store.treeStore');
        me.treeStore.load();

        me.tree = Ext.create('Ext.tree.Panel', {
            title: 'Exemplo de Árvore com Store',
            itemId: 'treePanel',
            width: 400,
            height: 300,
            //renderTo: Ext.getBody(),
            store: me.treeStore,
            rootVisible: false,
            tbar: ['->',
                { text: 'Adicionar', iconCls: 'x-fa fa-plus-square-o', action: 'addWin' },
                { text: 'Excluir', iconCls: 'x-fa fa-trash-o', action: 'delTree' }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: me.treeStore,
                dock: 'bottom',
                displayInfo: true
            }],
            listeners: {
                select: function (rowModel, record, index, opts) {
                    const tree = me.down('#treePanel');

                    tree.parent_id = record.get('id_tree');                 
                },
                load: function (store, records, successful, operation, eOpts) {
                    const tree = me.down('#treePanel');

                    tree.parent_id = null;
                }
            }
        });

        this.items = [
            me.MainContainerWrap,
            me.tree
        ];

        this.callParent();
    }
});