Ext.override(Ext.form.field.Text, {
    setCaretPosition: function (pos) {
        var el = this.inputEl.dom;
        if (typeof (el.selectionStart) === "number") {
            el.focus();
            el.setSelectionRange(pos, pos);
        } else if (el.createTextRange) {
            var range = el.createTextRange();
            range.move("character", pos);
            range.select();
        } else {
            throw 'setCaretPosition() not supported';
        }
    },

    getCaretPosition: function () {
        var el = this.inputEl.dom;
        if (typeof (el.selectionStart) === "number") {
            return el.selectionStart;
        } else if (document.selection && el.createTextRange) {
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveStart("character", -el.value.length);
            return range.text.length;
        } else {
            throw 'getCaretPosition() not supported';
        }
    }
});




//(function () {

//    Ext.form.RadioGroup.prototype.blankText = 'Nenhum item foi selecionado';
   
//    if (Ext.isIE) {
//        Ext.SSL_SECURE_URL = 'javascript:""';
//    }

//    {
//        var defaultTimeout = 180000;
//        Ext.override(Ext.data.Connection, { timeout: defaultTimeout });
//        Ext.override(Ext.data.proxy.Ajax, { timeout: defaultTimeout });
//    }

//    //fix for controller bug in which buttons become menus in overflow and are not working
//    if (Ext.app.EventBus) {
//        Ext.override(Ext.app.EventBus,
//        {
//            dispatch: function (ev, target, args) {
//                var bus = this.bus,
//                   selectors = bus[ev],
//                   selector, controllers, id, events, event, i, ln;



//                if (selectors) {

//                    // Loop over all the selectors that are bound to this event
//                    for (selector in selectors) {
//                        // Check if the target matches the selector
//                        selectorNew = 'youshallnotpassthisselector';
//                        if (selector.indexOf("button") != -1) selectorNew = selector.replace('button', 'menuitem');
//                        if (selectors.hasOwnProperty(selector) && (target.is(selector) || target.is(selectorNew))) {
//                            // Loop over all the controllers that are bound to this selector
//                            controllers = selectors[selector];
//                            for (id in controllers) {

//                                if (controllers.hasOwnProperty(id)) {

//                                    // Loop over all the events that are bound to this selector on this controller
//                                    events = controllers[id];

//                                    for (i = 0, ln = events.length; i < ln; i++) {
//                                        event = events[i];
//                                        // Fire the event!
//                                        if (event.fire.apply(event, Array.prototype.slice.call(args, 1)) === false) {
//                                            return false;
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//                return true;
//            }
//        });
//    }

//    Ext.Date.parseFunctions['Y-m-d'] = function (date, strict) {
//        // custom function to parse date - needed to work around time zone issue
//        var parts = date.split('-');
//        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
//        parsedDate = new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
//        return parsedDate;
//    }

//    var create = Ext.Loader.syncRequire;
//    Ext.Loader.syncRequire = function () {
//        if (Ext.Loader.getPath[arguments[0]]) {
//            return create.apply(this, arguments);
//        }
//        var b = Ext.getBody();
//        if (b && !b.isMasked()) {
//            b.mask('Carregando informa&ccedil;&otilde;es');
//        }
//        var e;
//        try {
//            var r = create.apply(this, arguments);
//        }
//        catch (e) {
//            alert("Erro ao carregar " + arguments[0]);
//        }
//        if (b) {
//            b.unmask();
//        }
//        return r;
//    }


Ext.define(null, {
    override: 'Ext.view.Table',

    getDefaultFocusPosition: function (fromComponent) {
        var me = this,
            store = me.dataSource,
            focusPosition = me.lastFocused,
            newPosition = new Ext.grid.CellContext(me).setPosition(0, 0),
            targetCell, scroller;
        if (fromComponent) {
            // Tabbing in from one of our column headers; the user will expect to land in that column.
            // Unless it is configured cellFocusable: false
            if (fromComponent.isColumn && fromComponent.cellFocusable !== false) {
                if (!focusPosition) {
                    focusPosition = newPosition;
                }
                focusPosition.setColumn(fromComponent);
                focusPosition.setView(fromComponent.getView());
            }
            // Tabbing in from the neighbouring TableView (eg, locking).
            // Go to column zero, same record
            else if (fromComponent.isTableView && fromComponent.lastFocused) {
                focusPosition = new Ext.grid.CellContext(me).setPosition(fromComponent.lastFocused.record, 0);
            }
        }
        // We found a position from the "fromComponent, or there was a previously focused context
        if (focusPosition) {
            scroller = me.getScrollable();
            // Record is not in the store, or not in the rendered block.
            // Fall back to using the same row index.
            if (!store.contains(focusPosition.record) || (scroller && !scroller.isInView(focusPosition.getRow()).y)) {
                focusPosition.setRow(store.getAt(Math.min(focusPosition.rowIdx, store.getCount() - 1)));
            }
        } else // All else failes, find the first focusable cell.
        {
            focusPosition = newPosition;
            // Find the first focusable cell.
            targetCell = me.el.down(me.getCellSelector() + '[tabIndex="-1"]');
            if (targetCell) {
                focusPosition.setPosition(me.getRecord(targetCell), me.getHeaderByCell(targetCell));
            } else // All visible columns are cellFocusable: false
            {
                focusPosition = null;
            }
        }
        return focusPosition;
    }
});

Ext.define(null, {
    override: 'Ext.grid.CellContext',

    setView: function (view) {
        this.view = view;
        this.refresh();
    }
});

    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        emaillist: function (value) {
            var emails = value.split(';');
            var ret = true;
            for (var i = 0; i < emails.length; i++) {
                ret = ret & Ext.form.field.VTypes.email(emails[i]);
            }
            return ret;
        },

        emailMask: /[\w.\-@'"!#$%&'*+/=?^_`{|}~]/i,
        emailText: 'email inv&aacute;lido',

        daterange: function (val, field) {
            var date = field.getValue();

            if (!date) {
                return;
            }

            if (field.startDateField) {
                var dif = field.minDiff || 0;
                var start = field.startDateField;
                if (Ext.isString(field.startDateField)) {
                    field.startDateField = start = Ext.getCmp(field.startDateField);
                }
                field.setMinValue(SomaDias(dif, start.getValue()));
            }

            if (field.endDateField) {
                var dif = field.maxDiff || 0;
                var end = field.endDateField;
                if (Ext.isString(field.endDateField)) {
                    field.endDateField = end = Ext.getCmp(field.endDateField);
                }
                field.setMaxValue(SomaDias(dif, end.getValue()));
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },

        daterangeText: 'Data inv&aacute;lida'
    });
//    Ext.toolbar.Toolbar.prototype.enableOverflow = true;

//    Ext.button.Button.prototype.click = function () {
//        this.btnInnerEl.dom.click();
//    }
//    Ext.button.Button.prototype.allowDepress = false; //override do valor default, assim os toggles sempre mantem um pressionado

//    var originalFnBeforeRender = Ext.Component.prototype.initComponent;
//    Ext.override(Ext.Component, {
//        initComponent: function () {
//            originalFnBeforeRender.apply(this, arguments);
//            var me = this;
//            if (me.permissao && !VerificaPermissao(me.permissao)) {
//                me.hide();
//                me.disable();
//            }
//            if (me.permissaoReadOnly && !VerificaPermissao(me.permissaoReadOnly) && me.setReadOnly) {
//                me.setReadOnly(true);
//            }
//        }
//    });


Ext.form.RadioGroup.prototype.blankText = 'Nenhum item foi selecionado';

if (Ext.isIE) {
    Ext.SSL_SECURE_URL = 'javascript:""';
}

{
    var defaultTimeout = 180000;
    Ext.override(Ext.data.Connection, { timeout: defaultTimeout });
    Ext.override(Ext.data.proxy.Ajax, { timeout: defaultTimeout });
}

//Ext.override(Ext.grid, {
//    initComponent: function () {
//        var me = this;

//        me.minHeight = Server.THei - 110;
//        me.border = false;

//        me.callParent.apply(me, arguments);
//    }
//});

Ext.override(Ext.window.Window, {
    initComponent: function ()
    {
        var me = this;
        me.center();

        me.autoShow =  me.xtype == "messagebox" ? false : true,
        me.modal = true;
        me.closable = true;
        me.autoScroll = true;
        me.border = false;
        me.draggable = true;
        me.resizable = false;
        if (me.expandir) {
            me.width = Server.TWid;
            me.height = Server.THei;
        }
        else if (me.expandir_centro) {
            me.width = Server.TWid - (Server.TWid / 5);
            me.height = Server.THei - (Server.THei / 10);
        }
        else {
            me.width = me.width || 500;
            me.height = me.height;
        }

        me.callParent.apply(me, arguments);
    },
    getDockedItems: function (selector, beforeBody) {
        var layout = this.getComponentLayout();
        if (layout.getDockedItems) {
            var dockedItems = layout.getDockedItems('render', beforeBody);
            if (selector && dockedItems.length) {
                dockedItems = Ext.ComponentQuery.query(selector, dockedItems);
            }
            return dockedItems;
        }
        else {
            return [];
        }
    }
});

Ext.override(Ext.data.NodeStore, {
    /**
     * @inheritdoc Ext.data.Store#filter
     */
    filter: function (filters, value) {
        if (Ext.isString(filters)) {
            filters = {
                property: filters,
                value: value
            };
        }

        var me = this,
            decoded = me.decodeFilters(filters),
            i,
            length = decoded.length,
            nodes, node,
            filteredNodes;

        // Merge new filters into current filter set.
        for (i = 0; i < length; i++) {
            me.filters.replace(decoded[i]);
        }

        filters = me.filters.items;

        if (filters.length) {
            me.filterFn = Ext.util.Filter.createFilterFn(filters);

            nodes = me.data.getRange();
            filteredNodes = [];

            // Filter the existing visible nodes.
            for (i = 0, length = nodes.length; i < length; i++) {
                node = nodes[i];
                if (me.filterFn(node)) {
                    filteredNodes.push(node);
                }
                // Node did not pass the filter.
                // If it's a non-leaf, we still need it.
                else if (!node.isLeaf()) {
                    filteredNodes.push(node);
                }
            }

            // Filter the unfiltered dataset using the filter set
            me.data.clear();
            me.data.addAll(filteredNodes);

            me.fireEvent('datachanged', me);
            me.fireEvent('refresh', me);
        }
        me.fireEvent('filterchange', me, filters);
    },

    /**
     * @inheritdoc Ext.data.Store#clearFilter
     */
    clearFilter: function () {
        var me = this,
            node = me.node;

        me.filters.clear();
        me.filterFn = null;
        Ext.suspendLayouts();
        me.onNodeCollapse(node, me.data.getRange(), true);
        me.onNodeExpand(node, node.childNodes, true);
        Ext.resumeLayouts(true);
    },


    // Collects child nodes to remove into the passed toRemove array.
    // When available, all descendant nodes are pushed into that array using recursion.
    handleNodeExpand: function (parent, records, toAdd) {
        var me = this,
            ln = records ? records.length : 0,
            i, record;

        // recursive is hardcoded to true in TreeView.
        if (!me.recursive && parent !== me.node) {
            return;
        }

        if (parent !== this.node && !me.isVisible(parent)) {
            return;
        }

        if (ln) {
            // The view items corresponding to these are rendered.
            // Loop through and expand any of the non-leaf nodes which are expanded
            for (i = 0; i < ln; i++) {
                record = records[i];

                //
                if (me.filterFn) {
                    if (!record.isLeaf() || me.filterFn(record)) {
                        toAdd.push(record);
                    }
                } else {

                    // Add to array being collected by recursion when child nodes are loaded.
                    // Must be done here in loop so that child nodes are inserted into the stream in place
                    // in recursive calls.
                    toAdd.push(record);
                }

                if (record.isExpanded()) {
                    if (record.isLoaded()) {
                        // Take a shortcut - appends to toAdd array
                        me.handleNodeExpand(record, record.childNodes, toAdd);
                    } else {
                        // Might be asynchronous if child nodes are not immediately available
                        record.set('expanded', false);
                        record.expand();
                    }
                }
            }
        }
    },

    // Triggered by a NodeInterface's bubbled "collapse" event.
    onNodeCollapse: function (parent, records, suppressEvent, callback, scope) {
        var me = this,
            collapseIndex = me.indexOf(parent) + 1,
            node, lastNodeIndexPlus, sibling, found;

        if (!me.recursive && parent !== me.node) {
            return;
        }

        if (me.filterFn) {
            records = Ext.Array.filter(records, me.filterFn);
        }

        // Used by the TreeView to bracket recursive expand & collapse ops.
        // The TreeViewsets up the animWrap object if we are animating.
        // It also caches the collapse callback to call when it receives the
        // end collapse event. See below.
        if (!suppressEvent) {
            me.fireEvent('beforecollapse', parent, records, collapseIndex, callback, scope);
        }

        // Only attempt to remove the records if they are there.
        // Collapsing an ancestor node *immediately removes from the view, ALL its descendant nodes at all levels*.
        // But if the collapse was recursive, all descendant root nodes will still fire their
        // events. But we must ignore those events here - we have nothing to do.
        if (records.length && me.data.contains(records[0])) {

            // Calculate the index *one beyond* the last node we are going to remove
            // Need to loop up the tree to find the nearest view sibling, since it could
            // exist at some level above the current node.
            node = parent;
            while (node.parentNode) {
                sibling = node.nextSibling;
                if (sibling) {
                    found = true;
                    lastNodeIndexPlus = me.indexOf(sibling);
                    break;
                } else {
                    node = node.parentNode;
                }
            }
            if (!found) {
                lastNodeIndexPlus = me.getCount();
            }

            // Remove the whole collapsed node set.
            me.removeAt(collapseIndex, lastNodeIndexPlus - collapseIndex);
        }

        // Triggers the TreeView's onCollapse method which calls refreshSize,
        // and fires its afteritecollapse event
        if (!suppressEvent) {
            me.fireEvent('collapse', parent, records, collapseIndex);
        }
    }
});

    Ext.override(Ext.form.field.Base, {
        beforeRender: function () {
            var me = this;
            me.callParent.apply(me, arguments);
            if (me.allowBlank == false && me.readOnly != true) {
                me.addCls('x-field-required'); // adiciona classe de required
            }
        }
    });

    Ext.override(Ext.selection.TreeModel, {
        onSelectChange: function (record, isSelected, suppressEvent, commitFn) {
            var me = this;
            if (isSelected) {
                me.selectedRecord = record;
            }
            me.callParent.apply(me, [arguments]);
        }
    });   

    var originalLoadRecord = Ext.form.Basic.prototype.loadRecord;
    Ext.override(Ext.form.Basic, {
        loadRecord: function (record) {
            var me = this;
            var args = arguments;
            me.fireEvent('recordload', record.data, me, record);
            me.owner.fireEvent('recordload', record.data, me, record);

            originalLoadRecord.apply(me, args);

            var forms = Ext.ComponentQuery.query('form', me.owner);
            for (var i = 0; i < forms.length; i++) {
                forms[i].form.loadRecord(record);
            }

            me.fireEvent('afterrecordload', record.data, me, record);
            me.owner.fireEvent('afterrecordload', record.data, me, record);
        }
    });

//    Ext.form.action.Submit.prototype.onSuccess = function (response) {
//        var form = this.form,
//        success = true,
//        result = this.processResponse(response);
//        if (result && result !== true && !result.success) {
//            if (result.errors) {
//                form.markInvalid(result.errors);
//            }
//            this.failureType = Ext.form.action.Action.SERVER_INVALID;
//            success = false;
//        }
//        form.afterAction(this, success);
//    };

//    Ext.form.Panel.prototype.visualizar = Ext.form.Basic.prototype.visualizar = function (record, hideToolbar, hideButtons, hideEmpty, hideOnlyWinToolbar) {
//        var me = this;
//        var frm = me.getForm ? me.getForm() : me;

//        if (record) { frm.loadRecord(record); }

//        var fields = frm.getFields();
//        //limpa os campos null ou vazios
//        var hideFunc = function (cmp) {
//            cmp.setVisible ? cmp.setVisible(false) : cmp.hide();
//            if (cmp.ownerCt.ariaRole != 'form') {
//                var i = cmp.ownerCt.items.length - 1;
//                for (; i >= 0; i--) {
//                    if (!cmp.ownerCt.items.getAt(i).hidden) {
//                        return;
//                    }
//                }
//                hideFunc(cmp.ownerCt);
//            }
//        };

//        Ext.iterate(fields.items, function (cmp) {
//            cmp.setReadOnly(true);
//            if (cmp.xtype != 'checkbox' && cmp.xtype != 'textarea' && hideEmpty != false && cmp.hideEmpty != false) {
//                var v = cmp.getGroupValue ? cmp.getGroupValue() : cmp.getValue();
//                if (v == null || v == '') {
//                    hideFunc(cmp);
//                }
//            }
//        });

//        //retira o buttombar
//        var ct = frm.owner.ownerCt;
//        if (ct.down('toolbar') && hideToolbar != false) { ct.down('toolbar').hide(); }

//        if (hideButtons != false) {
//            Ext.iterate(ct.query('button'), function (btn) { btn.hide(); });
//        }

//        if (hideOnlyWinToolbar == true) {
//            Ext.iterate(ct.query('toolbar'), function (tb) { if (ct == tb.ownerCt) { tb.hide(); } });
//        }

//        //adiciona o close
//        var addClose = true;
//        Ext.iterate(ct.tools, function (tool) {
//            if (tool.type == 'close') {
//                addClose = false;
//            }
//        });

//        if (addClose) { ct.addTool({ type: 'close', handler: function () { ct.close(); } }); }


//        ct.update(); //update layout

//    }

//    Ext.form.field.HtmlEditor.prototype.allowBlank = false;
//    Ext.form.field.HtmlEditor.prototype.blankText = Ext.form.TextField.prototype.blankText;
//    Ext.form.field.HtmlEditor.prototype.requiredCls = Ext.baseCSSPrefix + 'htmleditor-required-field' + ' ' + Ext.baseCSSPrefix + 'field-required';
//    Ext.form.field.HtmlEditor.prototype.readOnlyCls = Ext.baseCSSPrefix + 'htmleditor-readonly-field' + ' ' + Ext.baseCSSPrefix + 'field-readonly';

//    Ext.override(Ext.form.field.HtmlEditor, {
//        initComponent: function () {
//            if (!this.allowBlank) {
//                this.addCls(this.requiredCls);
//            }
//            if (!this.readOnly) {
//                this.addCls(this.readOnlyCls);
//            }
//            return this.callParent(arguments);
//        },
//        setReadOnly: function (readOnly) {
//            if (readOnly) {
//                this.addCls(this.readOnlyCls);
//            }
//            else {
//                this.removeCls(this.readOnlyCls);
//            }
//            return this.callParent(arguments);
//        },
//        validate: function () {
//            var me = this;
//            return me.callParent(arguments) && !(me.getValue().length < 1 && !me.allowBlank);
//        },

//        getErrors: function (value) {
//            var me = this;
//            var errors = me.callParent(arguments);
//            var value = value || me.getValue();

//            if (value.length < 1 && !me.allowBlank) {
//                errors.push(me.blankText);
//            }
//            return errors;
//        }
//    });

    Ext.form.field.Base.prototype.setRequired = function (req) {
        this.allowBlank = !req;
        if (req != false) {
            this.setReadOnly(false);
            this.addCls(Ext.baseCSSPrefix + 'field-required');
        }
        else {
            this.removeCls(Ext.baseCSSPrefix + 'field-required');
        }
        this.validate();
    };

//    Ext.override(Ext.form.field.Number, {
//        getErrors: function (value) {
//            var me = this, ret = me.callParent(arguments);
//            if (ret.length == 0 && !me.allowBlank && me.allowZero != true && me.getValue() == 0) {
//                ret.push(this.blankText);
//            }
//            return ret;
//        }
//    });

//    Ext.override(Ext.form.field.ComboBox, {
//        setValue: function (value) {
//            var ret = this.callParent(arguments);
//            this.fireEvent('setvalue', arguments);
//            return ret;
//        }
//    });

//    Ext.override(Ext.form.field.TextArea, {
//        initComponent: function () {
//            if (this.upperCase) {
//                this.addCls('x-field-uppercase'); // adiciona classe de uppercase
//            }
//            else if (this.lowerCase) {
//                this.addCls('x-field-lowercase'); // adiciona classe de lower
//            }
//            this.callParent.apply(this, arguments);
//        },

//        getValue: function () {
//            var val = this.callParent.apply(this, arguments);
//            if (this.upperCase) {
//                val = val.toUpperCase();
//            }
//            else if (this.lowerCase) {
//                val = val.toLowerCase();
//            }
//            return val;
//        }
//    });


//    Ext.override(Ext.form.field.Text, { 
//        initComponent: function () {
//            if (this.upperCase) {
//                this.addCls('x-field-uppercase'); // adiciona classe de uppercase
//            }
//            else if (this.lowerCase) {
//                this.addCls('x-field-lowercase'); // adiciona classe de lower
//            }
//            this.callParent.apply(this, arguments);
//        },

//        getValue: function () {
//            var val = this.callParent.apply(this, arguments);
//            if (this.upperCase) {
//                val = val.toUpperCase();
//            }
//            else if (this.lowerCase) {
//                val = val.toLowerCase();
//            }
//            return val;
//        }
//    });

//    //Ext.override(Ext.data.Store, {
//    //    /**
//    //     * Groups data inside the store.
//    //     * @param {String/Object[]} groupers Either a string name of one of the fields in this Store's
//    //     * configured {@link Ext.data.Model Model}, or an Array of grouper configurations.
//    //     * @param {String} [direction="ASC"] The overall direction to group the data by.
//    //     */
//    //    group: function (groupers, direction) {
//    //        var me = this,
//    //            hasNew = false,
//    //            grouper,
//    //            newGroupers;

//    //        if (Ext.isArray(groupers)) {
//    //            newGroupers = groupers;
//    //        } else if (Ext.isObject(groupers)) {
//    //            newGroupers = [groupers];
//    //        } else if (Ext.isString(groupers)) {
//    //            grouper = me.groupers.get(groupers);

//    //            if (!grouper) {
//    //                grouper = {
//    //                    property: groupers,
//    //                    direction: direction
//    //                };
//    //                newGroupers = [grouper];
//    //            } else if (direction === undefined) {
//    //                grouper.toggle();
//    //            } else {
//    //                grouper.setDirection(direction);
//    //            }
//    //        }

//    //        if (newGroupers && newGroupers.length) {
//    //            hasNew = true;
//    //            newGroupers = me.decodeGroupers(newGroupers);
//    //            me.groupers.clear();
//    //            me.groupers.addAll(newGroupers);
//    //        }

//    //        if (me.remoteGroup) {
//    //            if (me.buffered) {
//    //                me.pageMap.clear();
//    //            }
//    //            me.load({
//    //                scope: me,
//    //                callback: me.fireGroupChange
//    //            });
//    //        } else {
//    //            // need to explicitly force a sort if we have groupers
//    //            me.sort(null, null, null, hasNew);
//    //            me.fireGroupChange();
//    //        }
//    //    }
//    //});

//    Ext.override(Ext.form.Basic, {
//        reset: function (resetRecord) {
//            Ext.suspendLayouts();

//            var me = this,
//                fields = me.getFields().items,
//                f,
//                fLen = fields.length;

//            for (f = 0; f < fLen; f++) {
//                fields[f].reset();
//            }

//            Ext.resumeLayouts(true);

//            if (resetRecord === true) {
//                delete me._record;
//            }
//            return me;
//        }
//    });


    Ext.override(Ext.form.FieldSet, {
        initComponent: function () {
            var me = this;
            me.callParent();
            me.setReadOnly(me.readOnly);
        },
        setReadOnly: function (value) {
            if (this.checkboxCmp) {
                this.checkboxCmp.setReadOnly(value);
            }
        }
    });

//    Ext.data.JsonP.handleResponse = function (result, request) {

//        var success = true;
//        if (!request) {
//            request = this.requests[result.id];
//        }

//        if (request.timeout) {
//            clearTimeout(request.timeout);
//        }
//        delete this[request.callbackName];
//        delete this.requests[request.id];
//        this.cleanupErrorHandling(request);
//        Ext.fly(request.script).remove();

//        if (request.errorType) {
//            success = false;
//            Ext.callback(request.failure, request.scope, [request.errorType]);
//        } else {
//            Ext.callback(request.success, request.scope, [result]);
//        }
//        Ext.callback(request.callback, request.scope, [success, result, request.errorType]);
//        Ext.EventManager.idleEvent.fire();
//    }

//    Ext.override(Ext.AbstractComponent, {
//        onEnable: function () {
//            if (this.hideOnDisable) {
//                this.setVisible(true);
//            }
//            return this.callParent();
//        },
//        onDisable: function () {
//            if (this.hideOnDisable) {
//                this.setVisible(false);
//            }
//            return this.callParent();
//        }
//    });

//    Ext.override(Ext.layout.container.Editor, {
//        calculate: function (ownerContext) {
//            if (!ownerContext || !ownerContext.childItems || !ownerContext.childItems[0])
//            {
//                return;
//            }

//            return this.callParent(arguments);
//        }
//    });

//    Ext.form.field.Text.prototype.setVtype =  function (vtype)
//    {
//        var me = this;
//        if (me.vtype) {
//            me.vtype = null;
//            me.maskRe = null;
//        }

//        me.vtype = vtype;
//        if (me.maskRe || (me.vtype && me.disableKeyFilter !== true && (me.maskRe = Ext.form.field.VTypes[me.vtype + 'Mask']))) {
//            me.mon(me.el, 'keypress', me.filterKeys, me);
//        }
//    }


//})();


//function LoadJs(script, sync, isPath, crossDomain, cbFunction) {
//    if (!isPath) {
//        sync = sync != false;
//        var url = !!isPath ? script : Ext.Loader.getPath(script);
//        Ext.Loader.loadScript(url);       
//    }
//    else {
//        var opt = {
//            url: script,
//            disableCaching: crossDomain || Server.disableCaching,
//            async: false,
//            success: function (response) {
//                if (!crossDomain) {
//                    var se = document.createElement('script');
//                    se.type = "text/javascript";
//                    se.text = response.responseText;
//                    document.getElementsByTagName('head')[0].appendChild(se);
//                }
//                if (cbFunction) {
//                    cbFunction.apply(this, arguments);
//                }
//            }
//        };
//        if (crossDomain) {
//            Ext.data.JsonP.request(opt);
//        }
//        else {
//            Ext.Ajax.request(opt);
//        }
//    }
//}

//function FindField(component, id, fields) {
//    if (!fields) {
//        fields = Ext.create('Ext.util.MixedCollection');
//        fields.addAll(component.query('[isFormField]'))
//    }

//    return fields.findBy(function (f) {
//        return f.id === id || f.getName() === id || f.itemId === id;
//    });
//}

//function SetFields(component, objValue) {

//    var fields = Ext.create('Ext.util.MixedCollection');
//    fields.addAll(component.query('[isFormField]'));

//    function setVal(fieldId, val) {
//        var field = FindField(component, fieldId, fields);
//        if (field) {
//            field.setValue(val);
//        }
//    };

//    if (Ext.isArray(objValue)) {
//        // array of objects
//        Ext.each(objValue, function (val) {
//            setVal(val.id, val.value);
//        });
//    } else {
//        // object hash
//        Ext.iterate(objValue, setVal);
//    }
//}


//function adicionaMenuCores(component, opts) {
//    var hadTb = !!component.tbar;
//    var btnListeners = {
//        mouseover: function () {
//            if (!this.hasVisibleMenu()) {
//                this.showMenu();
//            }
//        },
//        mouseout: function () {
//            if (this.hasVisibleMenu()) {
//                this.hideMenu();
//            }
//        }
//    }; // abre automaticamente
//    var cores = component.colors || component.cores;
//    var xtype = Ext.Object.getSize(cores) > 0 ? 'button' : 'tbtext';
//    var icon = (component.icone || component.icon);
//    var text = (component.descricao || component.description);


//    Ext.iterate(cores, function (key, value, myself) {
//        menuItem.menu.push({ text: value, cls: key });
//    });

//    menuItem = Ext.widget(xtype, menuItem);
//    if (hadTb || !component.items || (component.items && !component.down('toolbar'))) { //somente configuracao
//        var toolbar = component.tbar ? component.tbar : Ext.isArray(opts) ? opts : [];
//        component.tbar = toolbar;
//        return toolbar.unshift(menuItem);
//    }
//    else {
//        var tbar = component.down('toolbar[dock=top]');
//        if (!tbar) {
//            tbar = Ext.widget('toolbar', {dock: 'top'});
//            component.dockedItems.insert(0, tbar);
//        }

//        tbar.insert(0, menuItem);
//    }
//}

function setaStoreSync(sync) {
    Ext.apply(Ext.data.Connection.prototype, {
        async: !sync
    });
}

//function fieldsHaveValue(component, arrayIds) {
//    var setado = false;
//    for (i = 0; i < arrayIds.length; i++) {
//        var cmp = component.down(arrayIds[i]);
//        if (cmp && cmp.getValue) {
//            if (setado = setado || !!cmp.getValue()) {
//                return true;
//            }
//        }
//    }
//    return !!setado;
//}

function setRequiredFunction(component, arrayIds) {
    return function (setado) {
        var i;
        setado = (setado == true) || fieldsHaveValue(component, arrayIds);
        for (i = 0; i < arrayIds.length; i++) {
            var cmp = component.down(arrayIds[i]);
            if (cmp && cmp.setRequired) {
                cmp.setRequired(setado);
            }
        }
    }
}






