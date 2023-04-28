
Ext.define('ExtJSForm.view.winFormAddTree', {
    extend: 'Ext.window.Window',
    alias: 'widget.winformaddtree',
    width: 600,
    maxHeight: 480,
    title: 'Window Tree',

    initComponent: function () {
        var me = this;

        me.items = [{
            border: false,
            itemId: 'frmTree',
            xtype: 'form',
            bodyStyle: 'padding:10px',
            items: [
                { hidden: true, name: 'parent_id', itemId: 'parent_id', xtype: 'numberfield' },
                { fieldLabel: 'Nome', anchor: '100%', labelAlign: 'top', xtype: 'textfield', itemId: 'nome', name: 'nome', flex: 1, allowBlank: false }               
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
            win.down('#parent_id').setValue(win.parent_id ? win.parent_id : null);
        }
    }
}); 
