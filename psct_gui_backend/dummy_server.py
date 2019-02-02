"""Module for backend OPC UA-socket.io server thread."""
import logging
import argparse
import sys

import socketio
import aiohttp
import eventlet
import gevent
import geventwebsocket

from psct_gui_backend.dummy_device_models import DummyPanelModel

logger = logging.getLogger('psct_gui_backend')
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


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

        @self.sio.on('request_all_data')
        def on_request_all_data(self, sid, data):
            all_data = {}
            component_name = data['component_name']
            devices_by = data['devices_by']
            if devices_by == "types":
                for type in data['types']:
                    for id, device_model in types:
                        all_data[type][id] = device_model.all_data
            elif devices_by == "ids":
                for id in data['ids']:
                    device_model = self.device_models[id]
                    all_data[id] = device_model.all_data

            logger.info('All data sent for component {}.'.format(
                component_name))

            return all_data

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
        logger.setLevel(logging.INFO)

    sio = socketio.Server()

    serv = DummyBackendServer(sio)
    serv.initialize_device_models()

    app = socketio.Middleware(sio)
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
