"""Module for backend OPC UA-socket.io server thread."""
import logging
import argparse

import socketio
import eventlet
import opcua

from psct_gui.backend import device_models

logger = logging.getLogger(__name__)


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
                 socketio_server,
                 opcua_device_tree_node_name="2:DeviceTree",
                 stop_method_id="2:Stop"):
        """Instantiate a BackendServer instance."""
        self.opcua_client = opcua_client
        self.sio = socketio_server
        self.sio_clients = []

        self.device_models = {}

        self.opcua_device_tree_node_name = opcua_device_tree_node_name

        # Setup server connect and disconnect responses
        @self.sio.on('connect')
        def on_connect(sid, environ):
            logger.info("Client connected: {}".format(sid))
            self.sio_clients.append(sid)
            for nodeid, device_model in self.device_models:
                device_model.send_initial_data(sid)

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


        """Connect to OPC UA server, create device models, and wait."""
        logger.info("Connecting to OPC UA server and loading type defs... ")
        self.opcua_client.connect()
        self.opcua_client.load_type_definitions()

        self.device_tree_root_node = (
            self.opcua_client.get_objects_node().get_child(
                self.opcua_device_tree_node_name))

        # First, recurse through node tree to identify all devices
        # and their relationships
        self._initialize_device_models()
        for nodeid, device_model in self.device_models:
            device_model.start_subscriptions()

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

    def _initialize_device_models(self):
        logger.info("Creating device models...")
        for node in self.device_tree_root_node.get_children():
            self.__traverse_node(node, None)

    # Function to recursively traverse node tree
    def __traverse_node(self, node, parent_model):

        node_type = self._opcua_client.get_node(
            self._obj_node.get_type_definition())

        if node_type.nodeid == device_models.DeviceModel.FOLDER_TYPE_NODE_ID:
            recurse = True
            new_parent = parent_model
        else:
            # If node already seen, get corresponding model
            if node.nodeid in self.device_models:
                model = self.device_models[node.nodeid]
                recurse = False
            else:
                logger.info("Creating device model with id: {}".format(
                    node.nodeid))
                model = device_models.DeviceModel.create(
                    node, self.opcua_client)
                self.device_models[node.nodeid] = model
                recurse = True

            if parent_model:
                parent_model.add_child(model)
            new_parent = model

        # Recurse through children, including references
        # Only if not seen before
        children = node.get_children(nodeclassmask=1)
        if recurse and children:
            for child in children:
                type_node_id = child.get_type_definition().to_string()
                if type_node_id in device_models.VALID_NODE_TYPES:
                    self.__traverse_node(child, new_parent)

        return model


class TestBackendServer(BackendServer):
    def __init__(self,
                 opcua_client,
                 socketio_server,
                 panel_node_name="2:Panel_2111",
                 stop_method_id="2:Stop"):
        """Instantiate a BackendServer instance."""
        self.opcua_client = opcua_client
        self.sio = socketio_server
        self.sio_clients = []

        self.device_models = {}

        self.panel_node_name = panel_node_name

        @self.sio.on('connect')
        def on_connect(sid, environ):
            logger.info("Client connected: {}".format(sid))
            self.sio_clients.append(sid)

        @self.sio.on('initialize')
        def on_initialize(self, sid, data):
            component_name = data['component_name']
            for nodeid in data['device_ids']:
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

        """Connect to OPC UA server, create device models, and wait."""
        logger.info("Connecting to OPC UA server on and loading type defs... ")
        self.opcua_client.connect()
        self.opcua_client.load_type_definitions()

        self.panel_node = (
            self.opcua_client.get_objects_node().get_child(
                self.panel_node_name))
        logger.info("Located panel node.")

        # First, recurse through node tree to identify all devices
        # and their relationships
        self._initialize_device_models()
        logger.info("Device models initialized.")
        for nodeid, device_model in self.device_models:
            device_model.start_subscriptions()
            logger.info("Subscriptions started.")

    def stop(self):
        """Stop and disconnect OPC UA client."""
        logger.info("Disconnecting all socketio clients...")
        while self.sio_clients:
            sid = self.sio_clients.pop()
            self.sio.disconnect(sid)
            logger.info("Client {} disconnected.".format(sid))
        logger.info("Disconnecting OPC UA client...")
        self.opcua_client.disconnect()

    def _initialize_device_models(self):
        logger.info("Creating device model...")
        node_type = self._opcua_client.get_node(
            self.panel_node.get_type_definition())
        model = device_models.DeviceModel.create(
            self.panel_node, self.opcua_client, parents=[])
        self.device_models[self.panel_node.nodeid] = model

        logger.info("Created device model with type {}, node id {}.".format(
            node_type, self.panel_node.nodeid
        ))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the background thread "
                                     "connecting to the OPC UA aggregating "
                                     "server.")
    parser.add_argument('opcua_server_address',
                        help="IP address/port for the OPC UA aggregating "
                        "server")
    parser.add_argument('--debug',
                        help="IP address/port for the OPC UA aggregating",
                        action="store_true")

    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    opcua_client = opcua.Client(args.opcua_server_address, timeout=60)
    sio = socketio.Server()

    # serv = BackendServer(opcua_client, sio)
    serv = TestBackendServer(opcua_client, sio)

    # app = socketio.Middleware(sio)
    # eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
