Ext.application({
    name: 'ExtJSForm',  

    mainView: 'ExtJSForm.view.main',

    launch: function () {
        window.centropanel = Ext.ComponentQuery.query('tabpanel[itemId=contentPanel]')[0];      
    
        Mvc = this;

        Mvc.getController('ExtJSForm.controller.mainController');

      
    },
    LoadController: function (controllerName) {
        var controller = Mvc.getController(controllerName);
        if (!controller.initialized) {
            controller.initialized = true;
        }
        return controller;
    }
});
