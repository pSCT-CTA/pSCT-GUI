import socketio
from pyramid.config import Configurator

from psct_gui.models.core import MethodNamespace, ErrorNamespace

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.include('.security')
    config.scan()

    sio = socketio.Server()
    app = config.make_wsgi_app()

    sio.register_namespace(MethodNamespace('/methods'))
    sio.register_namespace(ErrorNamespace('/errors'))

    app = socketio.Middleware(sio, app)

    return app
