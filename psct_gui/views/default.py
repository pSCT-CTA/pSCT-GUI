from pyramid.compat import escape
import re
from docutils.core import publish_parts

from pyramid.httpexceptions import (
	HTTPForbidden,
    HTTPFound,
    HTTPNotFound,
    )

from pyramid.view import view_config

@view_config(route_name='home')
def home(request):
    redirect_url = request.route_url('login')
    return HTTPFound(location=redirect_url)
