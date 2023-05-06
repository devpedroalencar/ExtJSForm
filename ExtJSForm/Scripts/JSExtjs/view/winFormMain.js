
Ext.define('ExtJSForm.view.winFormMain', {
    extend: 'Ext.window.Window',
    alias: 'widget.winformmain',
    width: 600,
    maxHeight: 480,
    title: 'Window Main',

    initComponent: function () {
        const me = this;

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
    }

}); 
