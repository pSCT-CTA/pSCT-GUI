import socketio
from pyramid.config import Configurator

from psct_gui.backend.core import opcua_ws_server_main

# Create server
sio = socketio.Server()

# Global variable for background thread
thread = None

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    # Get OPC UA server address (read from config file)
    opcua_server_addr = settings.get('opcua_server_addr', 'false')

    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.include('.security')
    config.scan()

    app = config.make_wsgi_app()

	# Start opc ua client/ws_server as a separate background thread
    #global thread
    #if thread is None:
        #thread = sio.start_background_task(opcua_ws_server_main, opcua_server_addr, sio)

    # Startup wsgi app w/ socketio support
    app = socketio.Middleware(sio, app)

    return app
