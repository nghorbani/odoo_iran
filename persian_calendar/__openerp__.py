# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (c) 2010-2013, Nima Ghorbani , All Rights Reserved
#        Nima ghorbani <nimaqzzz@gmail.com> <http://ir.linkedin.com/in/nimaghi>
#        Developed Exclusively For SuperPipe International Company <http://www.superpipe.com>
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

{
    'name': 'Persian Calendar',
    'version': '1.5',
    'category': 'Generic Modules/Tools',
    'description': """
Persian Calendar Support for Odoo (OpenERP)
====================================
    
After installtion the user can choose wether to use the Persian numbering and Jalali Calendar
by selecting the option in his/her own preferences.
Whenever the user chooses to do so, if the direction of the language was RTL he will be shown Persian Numbers
along with persian date-times.
    """,
    'summary': 'Persian Calendar Support for OpenERP',
    'author': 'Nima Ghorbani',
    'website': 'http://ir.linkedin.com/in/nimaghi',
    'depends': ['base','web'],
    'init_xml': [],
    'data': [
                'view/res_users.xml',
                'view/templates.xml'
                ],
    'js': [],
    'demo_xml': [],
    'installable': True,
    'certificate': '',
}