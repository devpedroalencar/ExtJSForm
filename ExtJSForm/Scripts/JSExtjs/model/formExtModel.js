
Ext.define('ExtJSForm.model.formExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'idInfoExtJS', type: 'int' },
        { name: 'nome', type: 'string' },
        { name: 'idade', type: 'int' },
        { name: 'data', type: 'date', dateFormat: 'MS' }        
    ]
});