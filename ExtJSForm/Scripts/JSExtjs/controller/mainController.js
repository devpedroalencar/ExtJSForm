
Ext.define('ExtJSForm.controller.mainController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.MainController',
    refs: [
        { ref: 'main', selector: 'mainmain' },
        { ref: 'winFormMain', selector: 'winformmain' },
    ], // refs

    init: function () {
        this.control({
            'mainmain button[action=addFrm]': { click: this.abreWindowMain },
            'mainmain button[action=deleteFrm]': { click: this.deletaRegistro },
            'winformmain button[action=salvar]': { click: this.salvaWinFormMain },
        });
    },

    abreWindowMain: function () {
        Ext.create('ExtJSForm.view.winFormMain');
    },

    salvaWinFormMain: function (sender) {
        var win = sender.up('window');
        var form = win.down('#frmMain').getForm();

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

        var grid = sender.up('grid');
        var store = grid.getStore();

        var selected = grid.getSelectionModel().getSelection();

        if (selected.length == 0) {
            Ext.Msg.alert("Selecione um registro.");
            return;
        } else {
            store.remove(selected[0]);
            store.sync();
        }
    }

    

});