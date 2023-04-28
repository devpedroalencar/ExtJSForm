
Ext.define('ExtJSForm.model.treeModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id_tree', type: 'int' },
        { name: 'nome', type: 'string' },
        { name: 'leaf', type: 'boolean' },
        { name: 'expanded', type: 'boolean' },
        { name: 'children', type: 'auto' },
        { name: 'parent_id', type: 'int' }
    ]
});