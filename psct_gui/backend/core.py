import sys
import logging
import time
import json
from abc import ABC, abstractmethod
#sys.path.insert(0, "..")

import socketio
import gevent

from opcua import Client, ua
from opcua.ua.object_ids import ObjectIds

from psct_gui.backend import device_models
from psct_gui.backend import element_models

logger = logging.getLogger()

class MethodNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        self.emit('server_connected',
            {'name': 'MethodNamespace'})

    def on_disconnect(self, sid):
        self.emit('server_disconnected',
            {'name': 'MethodNamespace'})

    def on_call_method(self, sid, data):
        id = data['node_id']
        method_name = data['method_name']
        args = data['args']

        device_model = device_models.DeviceModel.ALL_DEVICES[id]
        return_values = device_model.call_method(method_name, *args)

        self.emit('method_return_values',
            {'data': return_values})

class ErrorNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        self.emit('server_connected',
            {'name': 'ErrorNamespace'})

    def on_disconnect(self, sid):
        self.emit('server_disconnected',
            {'name': 'ErrorNamespace'})

    def on_my_event(self, sid, data):
        self.emit('my_response', data)

# Recursive class method to initialize all device models from the OPC UA objects node
def initialize_device_models(root_obj_nodes, opcua_client):
    device_trees = []
    devices_by_type = {}
    logger.info("Called initialization method.")

    # Function to recursively traverse node tree
    def __traverse_node(node, parent_model, opcua_client, devices_by_type):

        # If node already seen, get corresponding model
        if node.nodeid in device_models.NodeModel.ALL_NODES:
            logger.info("Found device model.")
            model = device_models.NodeModel.ALL_NODES[node.id]
            recurse = False
        else:
            logger.info("Creating device model.")
            model = device_models.NodeModel.create(node, opcua_client)
            recurse = True

        if parent_model:
            parent_model.add_child(model)
            logger.info("Added as child.")

        if issubclass(model, DeviceModel):
            device_type = ALL_DEVICE_MODELS_TO_NAME[model.__class__]
            # Add device model to devices_by_type dictionary
            if device_type not in devices_by_type:
                devices_by_type[device_type] = {}
            devices_by_type[device_type][model.name] = model

        # Recurse through children, including references
        # Only if not seen before
        if recurse and node.get_children(refs=31):
            for n in node.get_children(refs=31):
                __traverse_node(n, model, opcua_client, devices_by_type)

        return model

        for node in root_obj_nodes.get_children():
            device_trees.append(__traverse_node(node, None, opcua_client, devices_by_type))

    return device_trees, devices_by_type

def opcua_ws_server_main(opcua_server_addr, socketio_server):
    opcua_client = Client(opcua_server_addr)
    #try:
    opcua_client.connect()
    opcua_client.load_type_definitions()  # load custom object type definitions
    logger.info("Connected and loaded type definitions.")

    device_tree_folder = opcua_client.get_objects_node().get_child(["2:DeviceTree"])
    devices_by_type_folder = opcua_client.get_objects_node().get_child(["2:DevicesByType"])
    logger.info("Located device folders.")

    # Initialize all device models
    device_trees, devices_by_type = initialize_device_models(device_tree_folder, opcua_client)
    logger.info("Initialised all device models.")

    for type in devices_by_type:
        logger.info(type)
        logger.info(len(devices_by_type[type]))

    # Initialize all element models
    e_models = []
    e_models.append(element_models.DeviceTreeModel(socketio_server, device_trees, devices_by_type))
    e_models.append(element_models.InfoWindowModel(socketio_server, None))
    logger.info("Initialised all element models.")

    while True:
        gevent.sleep(0.1)

    #finally:
        #logger.info("Failed, disconecting...")
        #opcua_client.disconnect()

def opcua_ws_server_dummy(opcua_server_addr, socketio_server):

    # Initialize all dummy element models
    e_models = []
    e_models.append(element_models.DummyDeviceTreeModel(socketio_server))
    e_models.append(element_models.DummyInfoWindowModel(socketio_server))

    logger.info("Initialised all element models.")

    while true:
        time.sleep(1)
