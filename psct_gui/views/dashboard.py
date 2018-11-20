from pyramid.compat import escape
import re
from docutils.core import publish_parts

from pyramid.httpexceptions import (
	HTTPForbidden,
    HTTPFound,
    HTTPNotFound,
    )

from pyramid.view import view_config

from psct_gui.models import User, HistoryEntry
#from psct_gui.models import device_models

MAX_HISTORY_RECORDS = 100

@view_config(route_name='dashboard', renderer='../templates/dashboard.jinja2')
def dashboard(request):

    # Authentication
    # Check if logged in
    user = request.user
    if user is None:
        raise HTTPForbidden

    history_logs = request.dbsession.query(HistoryEntry).order_by(HistoryEntry.timestamp).limit(MAX_HISTORY_RECORDS).all() 
    logout_url = request.route_url('logout')

    return dict(history_logs=history_logs, logout_url=logout_url)

