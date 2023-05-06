
Ext.define('ExtJSForm.controller.mainController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.MainController',
    refs: [
        { ref: 'main', selector: 'mainmain' },
        { ref: 'winFormMain', selector: 'winformmain' },
        { ref: 'viewwinFormAddTree', selector: 'winformaddtree' },
    ], // refs

    init: function () {
        this.control({
            'mainmain button[action=addFrm]': { click: this.abreWindowMain },
            'mainmain button[action=deleteFrm]': { click: this.deletaRegistro },
            'winformmain button[action=salvar]': { click: this.salvaWinFormMain },

            'mainmain button[action=addWin]': { click: this.abreWindowTree },
            'mainmain button[action=delTree]': { click: this.deletaRegistroTreeJS },
            'winformaddtree button[action=salvar]': { click: this.salvaWinFormAddTree },
        });
    },

    abreWindowMain: function () {
        Ext.create('ExtJSForm.view.winFormMain');
    },

    salvaWinFormMain: function (sender) {
        const win = sender.up('window');
        const form = win.down('#frmMain').getForm();

        if (form.isValid()) {
            form.submit({
                url: "/home/salvaDadosExtWindow",
                waitMsg: 'Salvando, aguarde...',
                success: function (form, action) {
                    win.close();
                },
                failure: Ext.Msg.alert("Erro.")
            });
        } else { Ext.Msg.alert("Preencha os campos corretamente."); }


    },

    deletaRegistro: function (sender) {

        const grid = sender.up('grid');
        const store = grid.getStore();

        const selected = grid.getSelectionModel().getSelection();

        if (selected.length == 0) {
            Ext.Msg.alert("Selecione um registro.");
            return;
        } else {
            store.remove(selected[0]);
            store.sync();
        }
    },

    abreWindowTree: function (sender) {
        const tree = sender.up('#treePanel');

        Ext.create('ExtJSForm.view.winFormAddTree', { parent_id: tree.parent_id, treeStore: tree.getStore() });
    },

    salvaWinFormAddTree: function (sender) {
        const win = sender.up('window');
        const form = win.down('#frmTree').getForm();

        if (form.isValid()) {
            form.submit({
                url: "/home/salvaDadosTree",
                waitMsg: 'Salvando, aguarde...',
                success: function (form, action) {
                    win.treeStore.proxy.extraParams.id_tree = win.down('#parent_id').getValue();
                    win.treeStore.load();
                    win.close();
                },
                failure: Ext.Msg.alert("Erro.")
            });
        } else { Ext.Msg.alert("Preencha os campos corretamente."); }
    },

    deletaRegistroTreeJS: function (sender) {

        const grid = sender.up('#treePanel');
        const store = grid.getStore();

        const selected = grid.getSelectionModel().getSelection();

        if (selected.length == 0) {
            Ext.Msg.alert("Selecione um registro.");
            return;
        } else {
            store.remove(selected[0]);
            store.sync();
        }
    },


});