from pyramid.httpexceptions import HTTPFound
from pyramid.security import (
    remember,
    forget,
    )
from pyramid.view import (
    forbidden_view_config,
    view_config,
)

from ..models import User

@view_config(route_name='login', renderer='../templates/login.jinja2')
def login(request):

    message = ''
    username = ''
    
    if 'login_attempt' in request.params:
        attempt = request.params['login_attempt']
    else:
        attempt = ''

    # Redirect to dashboard normally
    next_url = request.route_url('dashboard')

    # If already logged in, bypass
    if request.user:
        return HTTPFound(location=next_url)

    if 'form.submitted' in request.params:
        username = request.params['username']
        password = request.params['password']
        user = request.dbsession.query(User).filter_by(username=username).first()
        if user is not None and user.check_password(password):
            # Store/remember current user and role
            headers = remember(request, user.username)
            return HTTPFound(location=next_url, headers=headers)
        else:
            next_url = request.route_url('login', _query={'login_attempt': 'fail'})
            return HTTPFound(location=next_url, headers=headers)

    return dict(
        login_attempt=attempt,
        url=request.route_url('login'),
        next_url=next_url,
        username=username,
        )

@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    next_url = request.route_url('login', _query={'login_attempt': 'logout'})
    return HTTPFound(location=next_url, headers=headers)

@forbidden_view_config()
def forbidden_view(request):
    # Set next url (to redirect to) to requested page
    # so user will go there automatically after successful login
    next_url = request.route_url('login', _query={'next': request.url, 'login_attempt': 'redirect'})
    return HTTPFound(location=next_url)