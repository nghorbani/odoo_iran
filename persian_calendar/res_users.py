# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (c) 2010-2013, Nima Ghorbani , All Rights Reserved
#        Nima ghorbani <nimaqzzz@gmail.com> <http://ir.linkedin.com/in/nimaghi>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################


from openerp.osv import osv,fields
from openerp.addons.web import http
import os, platform
from datetime import datetime
openerpweb = http
import werkzeug.local
import itertools


_request_stack = werkzeug.local.LocalStack()

request = _request_stack()

import openerp

class res_users(osv.osv):
    _inherit="res.users"
    _columns={                
              'context_jcalendar': fields.boolean('Jalali Calendar?', help="Using persian numbers and jalali calendar throughout views.")
             }
    _defaults = {
        'context_jcalendar': True,
        }


class WebClient(openerpweb.Controller):
        
    @http.route('/web/webclient/translations', type='json', auth="none")
    def translations(self, mods=None, lang=None):
        request.disable_db = False
        uid = openerp.SUPERUSER_ID
        if mods is None:
            m = request.registry.get('ir.module.module')
            mods = [x['name'] for x in m.search_read(request.cr, uid,
                [('state','=','installed')], ['name'])]
        if lang is None:
            lang = request.context["lang"]
        res_lang = request.registry.get('res.lang')
        ids = res_lang.search(request.cr, uid, [("code", "=", lang)])
        lang_params = None
        if ids:
            lang_params = res_lang.read(request.cr, uid, ids[0], ["direction", "date_format", "time_format",
                                                "grouping", "decimal_point", "thousands_sep"])
            user_context = request.session.get_context() if request.session._uid else {}
            jcalendar = user_context.get('jcalendar',False)
                
            lang_params.update({'jcalendar': jcalendar,})
            if jcalendar == True:
                lang_params.update({"grouping" : '[3,0]',
                                    "decimal_point":u'.',
                                    "thousands_sep":u'‚',
                                    "direction":u'rtl'})
            
        # Regional languages (ll_CC) must inherit/override their parent lang (ll), but this is
        # done server-side when the language is loaded, so we only need to load the user's lang.
        ir_translation = request.registry.get('ir.translation')
        translations_per_module = {}
        messages = ir_translation.search_read(request.cr, uid, [('module','in',mods),('lang','=',lang),
                                               ('comments','like','openerp-web'),('value','!=',False),
                                               ('value','!=','')],
                                              ['module','src','value','lang'], order='module')
        for mod, msg_group in itertools.groupby(messages, key=operator.itemgetter('module')):
            translations_per_module.setdefault(mod,{'messages':[]})
            translations_per_module[mod]['messages'].extend({'id': m['src'],
                                                             'string': m['value']} \
                                                                for m in msg_group)
        return {"modules": translations_per_module,
                "lang_parameters": lang_params}
        
        