odoo.define('th_o2m.list_country', function (require) {
    "use strict";

    var core = require('web.core');
    var publicWidget = require('web.public.widget');
    var Dialog = require('web.Dialog');

    var _t = core._t;

    var PageCountrysDialog = Dialog.extend({
        template: 'th_o2m.country.modal',
        xmlDependencies: Dialog.prototype.xmlDependencies.concat(
            ['th_o2m/static/src/xml/country_modal.xml']
        ),

        init: function (parent, options) {
            var buttons = [
                {text: _t("Save"), classes: 'btn-primary', close: true, click: this.save},
                {text: _t("Discard"), classes: 'mr-auto', close: true},
            ];

            this._super(parent, _.extend({}, {
                title: _t("Seleccione un pais ..."),
                size: 'medium',
                buttons: buttons,
            }, options || {}));
        },

        willStart: function () {
            var defs = [this._super.apply(this, arguments)];
            //this.title = 'Seleccione un pais';
            console.log('Modal => ', this);
            // Cargar informacion de Paises
            defs.push(this._fetchCountry());
            return Promise.all(defs);
        },

        _fetchCountry: function (){
            var self = this;
            let rpcPromise = this._rpc({
                route: '/demo/config',
            }).then(function (readData) {
                self.countrys_data = readData.countrys_data;
                return Promise.resolve();
            });
            return rpcPromise;
        },

        save: function (data) {
            var self = this;
            var country_id = self.$('#country_id').val();
            var country_name = self.$('#country_id option:selected').prop('label');

            // Actualizar en el parent
            self.trigger_up('on_select_country', {
                country_id: country_id,
                country_name: country_name,
            });

            // this.close();
        },


    });

    publicWidget.registry.ListCountry = publicWidget.Widget.extend({
        selector: '#list_country_div',

        events: {
            "click button[name='bt_eliminar']": "eliminarCountry",
            "click button[name='bt_agregar']": "agregarCountry",
        },
        custom_events: _.extend({}, publicWidget.Widget.prototype.custom_events, {
            on_select_country: '_onSelectCountry',
        }),

         init(parent, options) {
             this._super(parent);
             console.log('init => ', parent);
             console.log('init => ', options)
             console.log('[init] list_country');

             // Iniciarlizar arreglo que tendra los ids
             this.country_ids = [];
         },

        start: function () {
            var self = this;
            self._super.apply(self, arguments);
            console.log('[start] list_country =>', self);

            self._initCountryIds();
        },

        willStart() {
            return Promise.all([
                this._super(),
                // Aqui codigo personalizado
                console.log('[init] willStart promise ...'),
            ]);
        },

        _render: function () {
            this._super.apply(this, arguments);
            console.log('[_render] list_country');
        },

        eliminarCountry(ev){
            ev.stopPropagation();
            ev.preventDefault();

            //this._disableButton(true);

            console.log('Eliminar country ...', this);
            console.log('Eliminar country ...', ev);
           //this.$el.closest("tr").remove();

            //Elemento a eliminar
            let id = $(ev.currentTarget).closest("tr").data('id');
            console.log('id a eliminar: ', id);
            this._removeCountryIds(id);

           $(ev.currentTarget).closest("tr").remove();



        },

        agregarCountry(ev){
            console.log('Agregar Pais')
            var dialog = new PageCountrysDialog(this, {}).open();
            return dialog.opened();
        },

        _onSelectCountry: function (event){
            console.log('Se ha seleccionado :', event.data);
            let id = event.data.country_id;

            // Agregar si no existe
            if ( typeof Number(id) && !this.country_ids.includes(Number(id)) ) {
                let name = event.data.country_name;
                let button = '<button class="btn" type="button" name="bt_eliminar">Eliminar <i class="fa fa-chevron-down"></i></button>';
                let html_tr = `<tr data-id="${id}"> <td>${id}</td> <td>${name}</td> <td>${button}</td> </tr>`;
                $('#country_table > tbody:last-child').append(html_tr);

                this._addCountryIds(id);
            }



            //const mediaId = $(ev.currentTarget).data('mediaId');
        },


        _initCountryIds: function () {
            var self = this;
            $("#country_table > tbody tr").each(function() {
                self.country_ids.push($(this).data('id'));
            });
            console.log('Listado de ids PAIS => ', self.country_ids);
            self._updateInputCountrys();

        },

        _addCountryIds: function (id) {
            var self = this;
            self.country_ids.push(Number(id));

            console.log('Paises seleccionados :', self.country_ids);
            self._updateInputCountrys();
        },

        _removeCountryIds: function (id) {
            var self = this;
            self.country_ids = self.country_ids.filter(item => item !== id);
            console.log('Id eliminado: ', id);
            self._updateInputCountrys();
        },

        _updateInputCountrys: function () {
            // Actualizar informacion de campo oculto que se enviara al controller
            $("#country_ids").val(JSON.stringify(this.country_ids));
        }

    });

return publicWidget.registry.ListCountry;

});
