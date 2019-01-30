"""Module for backend OPC UA-socket.io server thread."""
import logging
import argparse

import socketio
import eventlet

from psct_gui_backend.dummy_device_models import DummyPanelModel

logger = logging.getLogger(__name__)


class DummyBackendServer:
    def __init__(self,
                 socketio_server):
        """Instantiate a BackendServer instance."""
        self.sio = socketio_server
        self.sio_clients = []

        self.device_models = {}

        @self.sio.on('connect')
        def on_connect(sid, environ):
            logger.info("Client connected: {}".format(sid))
            self.sio_clients.append(sid)

        @self.sio.on('request_initial_data')
        def on_request_initial_data(self, sid, data):
            component_name = data['component_name']
            for nodeid in self.device_models:
                device_model = self.device_models[nodeid]
                device_model.send_initial_data(sid, component_name)
            logger.info('Initialization data sent for component {}.'.format(
                component_name))

        @self.sio.on('disconnect')
        def on_disconnect(sid):
            logger.info("Client disconnected: {}".format(sid))

        @self.sio.on('call_method')
        def on_call_method(self, sid, data):
            device_id = data['device_id']
            method_name = data['method_name']
            args = data['args']

            logger.info("Call request for method: {} on device ID: {}.".format(
                method_name, device_id))

            if method_name == "stop":
                self.device_models[device_id].call_stop()
            else:
                self.device_models[device_id].call_method(method_name, args)

    def __del__(self):
        """Destroy a BackendServer instance."""
        self.stop()

    def stop(self):
        """Stop and disconnect """
        logger.info("Disconnecting socketio clients...")
        while self.sio_clients:
            sid = self.sio_clients.pop()
            self.sio.disconnect(sid)
            logger.info("Client {} disconnected.".format(sid))

    def initialize_device_models(self):
        logger.info("Creating device models...")
        panel_numbers = ['2112', '2111', '2412', '2411',
                         '2312', '2311', '2212', '2211',
                         '2424', '2423', '2422', '2421',
                         '2324', '2323', '2322', '2321',
                         '2224', '2223', '2222', '2221',
                         '2124', '2123', '2122', '2121']

        for panel_number in panel_numbers:
            self.device_models[panel_number] = DummyPanelModel(panel_number,
                                                               socketio_server=self.sio)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run a dummy socketio server.")
    parser.add_argument('--debug',
                        help="",
                        action="store_true")

    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    sio = socketio.Server()

    serv = DummyBackendServer(sio)
    serv.initialize_device_models()

    app = socketio.Middleware(sio)
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
