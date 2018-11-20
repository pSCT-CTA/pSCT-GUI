import logging
import socketio
from opcua import Client, ua
import sys
sys.path.append("..")

from psct_gui.backend import device_models
from psct_gui.backend import element_models

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

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
            model = device_models.NodeModel.ALL_NODES[node.nodeid]
            recurse = False
        else:
            logger.info("Creating device model.")
            model = device_models.NodeModel.create(node, opcua_client)
            recurse = True

        if parent_model:
            parent_model.add_child(model)
            logger.info("Added as child.")

        if issubclass(model.__class__, device_models.DeviceModel):
            device_type = device_models.ALL_DEVICE_MODELS_TO_NAME[model.__class__]
            # Add device model to devices_by_type dictionary
            if device_type not in devices_by_type:
                devices_by_type[device_type] = {}
            devices_by_type[device_type][model.name.to_string()] = model

        # Recurse through children, including references
        # Only if not seen before
        children = node.get_children(nodeclassmask=1)
        if recurse and children:
            for n in children:
                if n.get_type_definition().to_string() in device_models.NODE_ID_TO_MODEL:
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

    logger.info("Device Models by Type:")
    for type in devices_by_type:
        logger.info("{}: {}".format(type, len(devices_by_type[type])))

    # Initialize all element models
    e_models = []
    e_models.append(element_models.DeviceTreeModel(socketio_server, device_trees, devices_by_type))
    e_models.append(element_models.InfoWindowModel(socketio_server, None))
    logger.info("Initialised all element models.")

    while True:
        gevent.sleep(0.1)

    #except:
        #logger.info("Failed, disconecting...")
        #opcua_client.disconnect()

if __name__ == '__main__':
    # Create server
    sio = socketio.Server()

    opcua_ws_server_main("opc.tcp://10.0.1.13:48010",sio)
