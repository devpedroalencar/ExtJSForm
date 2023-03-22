
Ext.define('ExtJSForm.view.winFormMain', {
    extend: 'Ext.window.Window',
    alias: 'widget.winformmain', // nome definido para acessar o form    
    width: 600,
    maxHeight: 480,
    title: 'Window Main',

    initComponent: function () {
        var me = this;

        me.items = [{
            border: false,
            itemId: 'frmMain',
            xtype: 'form',
            bodyStyle: 'padding:10px',
            items: [{
                fieldLabel: 'Nome', anchor: '100%', labelAlign: 'top', xtype: 'textfield', itemId: 'nome', name: 'nome', flex: 1, allowBlank: false
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: { anchor: '100%', labelAlign: 'top', flex: 1 },
                items: [
                    {
                        fieldLabel: 'Idade', xtype: 'numberfield', itemId: 'idade', name: 'idade', allowBlank: false , margin: '0 10 0 0'
                    },
                    { fieldLabel: 'Data', name: 'data', itemId: 'data', xtype: 'datefield', inputValue: true, allowBlank: false }
                ]
            }
            ]
        }];
        me.buttons = [
            '->',
            { text: 'Salvar', itemId: 'btnSalvar', iconCls: 'fa fa-floppy-o fa-inverse', action: 'salvar' }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (win) {
            //win.down('#valor_abertura').setRequired(true);
            //win.down('#id_usuario').setValue(win.id_usuario);
            //win.tools.close.setVisible(false);
        }
    }
}); // fim ExtJSForm.view.teste.orcamento_has_item_disponibilizado
