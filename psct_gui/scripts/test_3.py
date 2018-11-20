from opcua import Client, ua
import sys
import random
import time

class SubHandler(object):

    def datachange_notification(self, node, val, data):
        print("OPC UA: New data change event", node, val)

    def event_notification(self, event):
        print("OPC UA: New event", event)

# Function to recursively traverse node tree
def __traverse_node(node, opcua_client, seen):
    if node in seen:
        return
    else:
        seen.add(node)

    subhandler = SubHandler()

    nodes_to_monitor = node.get_variables() + node.get_properties()
    random.shuffle(nodes_to_monitor)

    for n in nodes_to_monitor:
        try:
            sub = opcua_client.create_subscription(5000, subhandler)
            sub.subscribe_data_change(n)
            print("Subscription created.", n)

        except:
            print("Failed to create subscription for node: ", n)
            return

    # Recurse through object children
    children = node.get_children(nodeclassmask=1)
    if children:
        for n in children:
            #print("Child found:", n)
                __traverse_node(n, opcua_client, seen)


if __name__ == '__main__':

    opcua_client = Client("opc.tcp://10.0.1.6:4840")
    opcua_client.connect()

    device_tree_root = opcua_client.get_objects_node().get_child(["2:ACT"])

    seen = set()

    __traverse_node(device_tree_root, opcua_client, seen)
