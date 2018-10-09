import sys
sys.path.insert(0, "..")
import logging
import time

from opcua import Client, ua


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARN)

    client = Client("opc.tcp://localhost:4840")
    try:
        client.connect()
        client.load_type_definitions()  # load custom object type definitions

        root = client.get_root_node()
        objects = client.get_objects_node()

        for child in objects.get_children():
            print("*********")
            print(child.nodeid)
            print(child.get_browse_name())
            print(child.get_node_class())
            print(client.get_node(child.get_type_definition()).get_browse_name())
            print(child.get_children())
            print("*********")

    finally:
        client.disconnect()
