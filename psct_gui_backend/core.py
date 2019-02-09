"""Module for backend OPC UA-socket.io server thread."""
import logging
import argparse
import sys

import socketio
import eventlet
eventlet.monkey_patch()
import opcua

from psct_gui_backend.OPCUA_device_models import (OPCUADeviceModel,
                                                  VALID_NODE_TYPE_IDS)

logger = logging.getLogger('psct_gui_backend')
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class BackendServer(object):
    """A backend OPC UA to socket.io server object class.

    Parameters
    ----------
    opcua_client : opcua.Client
        A python-opcua Client instance, connected to OPC UA alignment server.
    socketio_server : socketio.Server
        A socket.io Server instance, will connect to client browsers.
    opcua_device_tree_node_name : str, optional
        Browse name for root node of OPC UA device tree. Should be a child of
        device node.
    stop_method_id : str, optional
        OPC UA node id for stop method.

    """

    def __init__(self,
                 opcua_client,
                 socketio_server):
        """Instantiate a BackendServer instance."""
        self.opcua_client = opcua_client
        self.sio = socketio_server
        self.sio_clients = []

        self.device_models = {}
        self.device_models_by_type = {}

        @self.sio.on('connect')
        def on_connect(sid, environ):
            logger.info("Client connected: {}".format(sid))
            self.sio_clients.append(sid)

        @self.sio.on('disconnect')
        def on_disconnect(sid):
            logger.info("Client disconnected: {}".format(sid))

        @self.sio.on('request_all_data')
        def on_request_all_data(sid, request_data):
            return self._on_request_all_data(sid, request_data)

        @self.sio.on('call_method')
        def on_call_method(sid, data):
            self._on_call_method(sid, data)

        @self.sio.on('set_value')
        def on_set_value(sid, data):
            self._on_set_value(sid, data)

        logger.info("Connecting to OPC UA server and loading type defs... ")
        self.opcua_client.connect()
        self.opcua_client.load_type_definitions()

    def __del__(self):
        """Destroy a BackendServer instance."""
        self.stop()

    def stop(self):
        """Stop and disconnect OPC UA client."""
        logger.info("Disconnecting socketio clients...")
        while self.sio_clients:
            sid = self.sio_clients.pop()
            self.sio.disconnect(sid)
            logger.info("Client {} disconnected.".format(sid))
        logger.info("Disconnecting OPC UA client...")
        self.opcua_client.disconnect()

    def _on_request_all_data(self, sid, request_data):
        logger.info("Received all data request: {}".format(request_data))
        all_data = {}
        component_name = request_data['component_name']
        devices_by = request_data['devices_by']
        if devices_by == "types":
            for type in request_data['types']:
                if type not in all_data:
                    all_data[type] = {}
                for id in self.device_models_by_type[type]:
                    self.device_models_by_type[type][id].read()
                    all_data[type][id] = self.device_models_by_type[type][id].all_data
        elif devices_by == "ids":
            for id in request_data['ids']:
                all_data[id] = self.device_models[id].all_data
        elif devices_by == "all":
            for id in self.device_models:
                all_data[id] = self.device_models[id].all_data

        sio.emit('all_data', all_data, room=sid)

        logger.info('All data sent for component {}.'.format(
            component_name))



        return all_data

    def _on_call_method(self, sid, data):
        device_id = data['device_id']
        method_name = data['method_name']
        args = data['args']

        logger.info("Call request for method: {} on device ID: {}.".format(
            method_name, device_id))

        if method_name == "stop":
            self.device_models[device_id].call_stop()
        else:
            self.device_models[device_id].call_method(method_name, args)

    def _on_set_value(self, sid, data):
        device_id = data['device_id']
        type = data['type']
        name = data['name']
        value = data['value']

        logger.info(
            ("Set value request for device: {}, type: {}, ".format(
                device_id, type))
            (" name: {}, value: {}".format(name, value)))

        if type == 'data':
            self.device_models[device_id].set_data(name, value)
        elif type == 'error':
            self.device_models[device_id].set_error(name, value)

    def initialize_device_models(self, opcua_device_tree_node_name):
        logger.info("Creating device models...")
        device_tree_root_node = (
            self.opcua_client.get_objects_node().get_child(
                opcua_device_tree_node_name))
        for node in device_tree_root_node.get_children():
            self.__traverse_node(node, None)

        #for device_model in self.device_models.values():
        #    device_model.start_subscriptions()

    # Function to recursively traverse node tree
    def __traverse_node(self, node, parent_model):

        node_type = self.opcua_client.get_node(
            node.get_type_definition())

        if node_type.nodeid.to_string() == OPCUADeviceModel.FOLDER_TYPE_NODE_ID:
            recurse = True
            new_parent = parent_model
        else:
            # If node already seen, get corresponding model
            if node.nodeid.to_string() in self.device_models:
                model = self.device_models[node.nodeid.to_string()]
                recurse = False
            else:
                logger.info("Creating device model with id: {}".format(
                    node.nodeid.to_string()))
                model = OPCUADeviceModel.create(
                    node, self.opcua_client, socketio_server=self.sio)
                self.device_models[node.nodeid.to_string()] = model
                if model.DEVICE_TYPE_NAME not in self.device_models_by_type:
                    self.device_models_by_type[model.DEVICE_TYPE_NAME] = {}
                self.device_models_by_type[model.DEVICE_TYPE_NAME][node.nodeid.to_string()] = model
                recurse = True

            if parent_model:
                parent_model.add_child(model)
            new_parent = model

        # Recurse through children, including references
        # Only if not seen before
        children = node.get_children(nodeclassmask=1)
        if recurse and children:
            for child in children:
                type_node_id = (child.get_type_definition()).to_string()
                if type_node_id in VALID_NODE_TYPE_IDS:
                    self.__traverse_node(child, new_parent)


class OldBackendServer(BackendServer):
    def initialize_device_models(self, device_node_paths):
        logger.info("Creating device models...")
        for path in device_node_paths:
            node = self.opcua_client.get_objects_node().get_child(path)
            node_type = self.opcua_client.get_node(node.get_type_definition())
            model = OPCUADeviceModel.create(
                node, self.opcua_client)
            self.device_models[node.nodeid.to_string()] = model

            logger.info(
                "Created device model with type {}, node id {}.".format(
                    node_type, node.nodeid))

        logger.info("{} device models created.".format(len(self.device_models)))

        for device_model in self.device_models.values():
            device_model.start_subscriptions()
        logger.info("Subscriptions started.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the background thread "
                                     "connecting to the OPC UA aggregating "
                                     "server.")
    parser.add_argument('opcua_server_address',
                        help="IP address/port for the OPC UA aggregating "
                        "server")
    parser.add_argument('--debug',
                        help="",
                        action="store_true")

    args = parser.parse_args()

    if args.debug:
        logger.setLevel(logging.DEBUG)

    logger.info("Starting OPC UA client for address {}".format(args.opcua_server_address))
    opcua_client = opcua.Client(args.opcua_server_address, timeout=60)
    sio = socketio.Server()

    serv = BackendServer(opcua_client, sio)
    serv.initialize_device_models("2:DeviceTree")

    #serv = OldBackendServer(opcua_client, sio)
    #serv.initialize_device_models(["2:Panel_2111"])

    app = socketio.Middleware(sio)
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
