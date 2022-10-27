##################################################################################
#                                                                                #
#    TECNIHAND INFORMATICA SISTEMES TECNOLOGIA DIGITAL, S.L.                     #
#    Copyright (C) 2014-2022                                                     #
#                                                                                #
#    You should have received a copy of the GNU Affero General Public License    #
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.       #
#                                                                                #
##################################################################################
import logging
import json

from odoo.http import request
from odoo import http
from odoo.osv import expression
from odoo.addons.portal.controllers.portal import CustomerPortal

_logger = logging.getLogger(__name__)

class CustomerPortalMod(CustomerPortal):

    @http.route(['/demo'], type='http', auth="user", website=True)
    def list_event(self, **post):

        countrys = request.env['res.country'].sudo().search([], limit=10)

        values = {
            'country_ids': countrys,
        }

        if post and request.httprequest.method == 'POST':
            country_ids = json.loads(post.get('country_ids'))
            _logger.info(' ************* Recibiendo informacion formulario %s', post)
            _logger.info('Paises: => %s | %s', type(country_ids), country_ids)

        return request.render("th_o2m.page_demo", values)


    @http.route(['/demo/config'], type='json', auth="public", methods=['POST'], website=True)
    def get_config_information_tosearch(self, **kw):
        fields = ['id', 'name']
        countrys = request.env['res.country'].sudo().search_read([], fields=fields)
        values = {
            'countrys_data': countrys,
        }

        return values