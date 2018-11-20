<<<<<<< Updated upstream:psct_gui/backend/device_models.py
import time
from abc import ABC, abstractmethod


# Generic OPC UA subscription handler object, called on event and data change
# On data change, updates the parent device model's attributes to mirror the underlying
# OPC UA object in real time
# Implements the interface required by python-opcua for subscription handling
class SubHandler(object):

    def __init__(self, device_model):
        self.device_model = device_model

    def datachange_notification(self, node, val, data):
        print("OPC UA: New data change event::::", node, val)

        # Determine whether node is an error node or data node
        if node in self.device_model._data_node_to_name:
            name = self.device_model._data_node_to_name[node]
            type = 'data'
            d = self.device_model.data
        elif node in self.device_model._error_node_to_name:
            name = self.device_model._error_node_to_name[node]
            type = 'error'
            d = self.device_model.errors
        else:
            raise ValueError('Node producing datachange notification is not a data or error node.')

        # Write changed value and notify observers of data change
        d[name] = data.monitored_item.Value.Value.Value
        self.device_model.notify_observers(node.nodeid, type)

    def event_notification(self, event):
        print("OPC UA: New event", event)

# Generic wrapper class for OPC UA nodes. Subclassed to represent both
# folder and object nodes (not property and variable nodes).
# Handles general object/folder lookup, recursive traverse, etc.
class NodeModel(object):

    # 3 device status levels (corresponds to error levels)
    STATUS_KEYS = {
        1: "Normal",
        2: "Warning/Operable Error",
        3: "Critical/Fatal Error"
    }

    ALL_NODES = {}

    # Factory pattern
    # Class method to instantiate a new node model subclass from an OPC UA
    # object node (based on its object type)
    @classmethod
    def create(cls, obj_node, opcua_client, *args, **kwargs):
        model_class = NODE_ID_TO_MODEL[obj_node.get_type_definition().to_string()]
        model = model_class(obj_node, opcua_client, *args, **kwargs)
        NodeModel.ALL_NODES[model.id] = model

        if model_class in ALL_DEVICE_MODELS_TO_NAME:
            DeviceModel.ALL_DEVICES[model.id] = model
        elif model_class is FolderModel:
            FolderModel.ALL_FOLDERS[model.id] = model

        return model

    # Method to recurse through a fully initialized model tree
    # And call a callback function on every model.
    @staticmethod
    def traverse_models(root_model, callback_fn, **kwargs):

        seen = set()

        # Generic traversal function
        def __traverse(model, callback_fn, seen=seen, **kwargs):
            if model.id in seen:
                return
            else:
                seen.add(model.id)

            callback_fn(model, **kwargs)

            if model.children:
                for child in model.children:
                    __traverse(child, seen=seen, **kwargs)

        __traverse(root_model, callback_fn, seen=seen, **kwargs)

    def __init__(self, obj_node, opcua_client):

        # OPC UA client
        self._opcua_client = opcua_client

        # OPC UA object node, node name, node id, node object type
        self._obj_node = obj_node
        self._node_name = self._obj_node.get_display_name()
        self._node_id = self._obj_node.nodeid
        self._node_object_type = self._opcua_client.get_node(self._obj_node.get_type_definition()).get_display_name()

        self._children = []

    @property
    def name(self):
        return self._node_name

    @property
    def id(self):
        return self._node_id

    @property
    def object_type(self):
        return self._node_object_type

    @property
    def children(self):
        return self._children

    # Generic method to add a child to a NodeModel
    def add_child(self, child_model):
        self._children.append(child_model)

    # Calculates the status of this device from its internal properties/variables
    # Does not take into account the status of any children
    @property
    @abstractmethod
    def self_status(self):
        pass

    # Computes "overall" status of the device
    # based on its internal status and that of its children
    # (recursively)
    # The status is the "worst" of the parents + childrens' statuses
    @property
    def status(self):
        if self.children:
            status = max([child.status for child in self.children] + [self.self_status])
        else:
            status = self.self_status
        return status

# Folder model class. Wraps OPC UA foldertype nodes.
# implements only basic functionality.
class FolderModel(NodeModel):

    ALL_FOLDERS = {}

    def __init__(self, obj_node, opcua_client):
        super().__init__(obj_node, opcua_client)

    @property
    def self_status(self):
        return 1

# Generic device model class
# A wrapper around an OPC UA object node + subscriptions
# Mirrors, in real time, the OPC UA object using subscriptions
class DeviceModel(NodeModel):

    ERROR_NODE_NAME = "0:Errors"

    DEFAULT_DATA_SUBSCRIPTION_PERIOD = 1000
    DEFAULT_ERROR_SUBSCRIPTION_PERIOD = 1000

    # Dictionary of all devices by node id
    ALL_DEVICES = {}

    DEVICES_BY_TYPE = {}
    DEVICE_TREES = []

    def __init__(self, obj_node, opcua_client, sub_periods={}):

        super().__init__(obj_node, opcua_client)

        # Subscription handler
        self._sub_handler = SubHandler(self)
        self._subscriptions = {}

        # Observing element models
        self.observers = []

        # All monitored internal nodes
        self._data_nodes = {node.get_display_name().to_string(): node
            for node in self._obj_node.get_properties() + self._obj_node.get_variables()}
        self._method_nodes = {node.get_display_name().to_string(): node
            for node in self._obj_node.get_methods()}
        try:
            self._error_nodes = {node.get_display_name().to_string(): node
                for node in self._obj_node.get_child([DeviceModel.ERROR_NODE_NAME]).get_variables()}
        except:
            self._error_nodes = {}

        # Dictionaries mapping node objects to node names
        # Used by the subscription handler to retrieve the name of the changed node
        # in a data change notification
        self._data_node_to_name = {self._data_nodes[node_name]: node_name for node_name in self._data_nodes}
        self._error_node_to_name = {self._error_nodes[node_name]: node_name for node_name in self._error_nodes}

        # Initialize data dictionary and error dictionary.
        # Maps data property/error names to values
        self._data = {node_name: self._data_nodes[node_name].get_value() for node_name in self._data_nodes}
        self._errors = {node_name: self._error_nodes[node_name].get_value() for node_name in self._error_nodes}

        # Subscribe to data changes in all properties/variables + errors
        for n, node_dict in [('data', self._data_nodes), ('errors', self._error_nodes)]:
            if n == 'data':
                DEFAULT_SUBSCRIPTION_PERIOD = DeviceModel.DEFAULT_DATA_SUBSCRIPTION_PERIOD
            elif n == 'errors':
                DEFAULT_SUBSCRIPTION_PERIOD = DeviceModel.DEFAULT_ERROR_SUBSCRIPTION_PERIOD

            for node_name in node_dict:
                # If node is provided in sub_periods, use provided custom subscription period.
                # Else use default
                sub_period = sub_periods[node_name] if node_name in sub_periods else DEFAULT_SUBSCRIPTION_PERIOD
                if sub_period in self._subscriptions:
                    sub = self._subscriptions[sub_period]
                else:
                    sub = self._opcua_client.create_subscription(sub_period, self._sub_handler)
                    self._subscriptions[sub_period] = sub
                sub.subscribe_data_change(node_dict[node_name])

    # Dictionary of data property names and values
    @property
    def data(self):
        return self._data

    # List of method names
    @property
    def methods(self):
        return self._method_nodes.keys()

    # Dictionary of error flags
    @property
    def errors(self):
        return self._errors

    # Returns a list of tuples of (property, value) describing this device
    # Used for producing info boxes and tooltips
    @property
    @abstractmethod
    def description(self):
       pass

    # Returns a list of all device models which descend from this model
    @property
    def descendents(self):
        descendents = []
        def get_descendents_callback(model, descendents=descendents):
            if model.__class__ in ALL_DEVICE_MODELS_TO_NAME:
                descendents.append(model)

        NodeModels.traverse_models(self, get_descendents_callback, descendents=descendents)
        return descendents

    # Calls an object method and returns its return value
    def call_method(self, method_name, *args):
        return_values = self._obj_node.call_method(self._methods[method_name], *args)
        return return_values

    # Add an observer model which will be notified whenever there is a data change in this device
    # Recursively observes all descendents as well
    # The observer model should implement a self.notify() method
    def add_observer(self, observer):
        self.observers.append(observer)
        for device_model in self.descendents:
            device_model.observers.append(observer)

    # Notifies all attached observers that one of the device nodes has experienced
    # a data change
    def notify_observers(self, data_node_id, data_node_type):
        for observer in self.observers:
            observer.notify(data_node_id, data_node_type)

class TelescopeModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def mirrors(self):
        return [child for child in self.children if isinstance(child, MirrorModel)]

    @property
    def gas_system(self):
        return [child for child in self.children if isinstance(child, GASSystemModel)]

    @property
    def positioner(self):
        return [child for child in self.children if isinstance(child, PositionerModel)]

    @property
    def pointing_system(self):
        return [child for child in self.children if isinstance(child, PointingSystemModel)]

class MirrorModel(DeviceModel):

    MIRROR_TYPE_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

        try:
            self.mirror_type = self._obj_node.get_child([MirrorModel.MIRROR_TYPE_NODE_NAME]).get_value()
        except:
            self.mirror_type = None

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def panels(self):
        return [child for child in self.children if isinstance(child, PanelModel)]

    @property
    def edges(self):
        return [child for child in self.children if isinstance(child, EdgeModel)]

    @property
    def P1_panels(self):
        if self.mirror_type == 'primary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'P1')]
        else:
            raise ValueError("Mirror type '{}' does not have P1 panels".format(self.mirror_type))

    @property
    def P2_panels(self):
        if self.mirror_type == 'primary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'P2')]
        else:
            raise ValueError("Mirror type '{}' does not have P2 panels".format(self.mirror_type))

    @property
    def S1_panels(self):
        if self.mirror_type == 'secondary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'S1')]
        else:
            raise ValueError("Mirror type '{}' does not have S1 panels".format(self.mirror_type))

    @property
    def S2_panels(self):
        if self.mirror_type == 'secondary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'S2')]
        else:
            raise ValueError("Mirror type '{}' does not have S2 panels".format(self.mirror_type))

# TODO
class PanelModel(DeviceModel):

    PANEL_NUMBER_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

        try:
            self.panel_number = self._obj_node.get_child([PANEL_NUMBER_NODE_NAME]).get_value()
            if (self.panel_number // 1000)%10 == 1:
                self.mirror_identifier = 'P'
            elif (self.panel_number // 1000)%10 == 2:
                self.mirror_indentifier = 'S'
            self.ring_number = (self.panel_number // 10)%10
            self.panel_type = self.mirror_indentifier + str(self.ring_number)
        except:
            self.panel_number = None

        self.add_adjacent_panels()

        # More panel info describing geometry (?)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def MPES(self):
        return [child for child in self.children if isinstance(child, MPESModel)]

    @property
    def actuators(self):
        return [child for child in self.children if isinstance(child, ActuatorModel)]

    @property
    def edges(self):
        return [child for child in self.children if isinstance(child, EdgeModel)]

    def add_adjacent_panels(self):
        self.adjacent_panels = []
        for edge_model in self.edges:
            for panel in edge_model.panels:
                if panel != self:
                    self.adjacent_panels.append(panel)

class EdgeModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def MPES(self):
        return [child for child in self.children if isinstance(child, MPESModel)]

    @property
    def panels(self):
        return [child for child in self.children if isinstance(child, PanelModel)]

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class ActuatorModel(DeviceModel):

    def __init__(self, obj_node, opcua_client,  sub_periods={}):
        super().__init__(obj_node, opcua_client,  sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class MPESModel(DeviceModel):
    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class GASSystemModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, sub_periods={}):
        super().__init__(obj_node, opcua_client, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class PointingSystemModel(DeviceModel):

    def __init__(self, obj_node, opcua_client,  sub_periods={}):
        super().__init__(obj_node, opcua_client,  sub_periods=sub_periods)

    @property
    def description(self):
        properties = [('status', self.self_status)]
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class PositionerModel(DeviceModel):

    def __init__(self, obj_node, opcua_client,  sub_periods={}):
        super().__init__(obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

# NOTE: Only child model types whose name (from ALL_DEVICE_MODELS_TO_NAME, in lowercase)
# exists as an instance attribute of the parent are allowed as children.
ALL_DEVICE_MODELS_TO_NAME = {
        TelescopeModel: 'Telescopes',
        MirrorModel: 'Mirrors',
        PanelModel: 'Panels',
        EdgeModel: 'Edges',
        ActuatorModel: 'Actuators',
        MPESModel: 'MPES',
        GASSystemModel: 'GAS_system',
        PointingSystemModel: 'Pointing_system',
        PositionerModel: 'Positioner'
        }

NODE_ID_TO_MODEL = {
        '': TelescopeModel,
        'ns=2;i=100': MirrorModel,
        'ns=2;i=2000': PanelModel,
        'ns=2;i=1000': EdgeModel,
        'ns=2;i=2100': ActuatorModel,
        'ns=2;i=1100': MPESModel,
        '': GASSystemModel,
        '': PointingSystemModel,
        'ns=2;i=0': PositionerModel,
        'i=61': FolderModel
}
=======
from abc import ABC, abstractmethod

# Generic OPC UA subscription handler object, called on event and data change
# On data change, updates the parent device model's attributes to mirror the underlying
# OPC UA object in real time
# Implements the interface required by python-opcua for subscription handling
class SubHandler(object):

    def __init__(self, device_model):
        self.device_model = device_model

    def datachange_notification(self, node, val, data):
        print("OPC UA: New data change event", node, val)

        # Determine whether node is an error node or data node
        if node in self.device_model.__data_node_to_name:
            name = self.device_model.__data_node_to_name[node]
            type = 'data'
            d = self.device_model.data
        elif node in self.device_model.__error_node_to_name:
            name = self.device_model.__error_node_to_name[node]
            type = 'error'
            d = self.device_model.errors
        else:
            raise ValueError('Node producing datachange notification is not a data or error node.')

        # Write changed value and notify observers of data change
        d[name] = data.monitored_item.Value.Value.Value
        self.notify_observers(name, type)

    def event_notification(self, event):
        print("OPC UA: New event", event)

# Generic wrapper class for OPC UA nodes. Only subclassed to handle
# Handles general object/folder lookup, recursive traverse, etc.
class NodeModel(object):

    # 3 device status levels (corresponds to error levels)
    STATUS_KEYS = {
        1: "Normal",
        2: "Warning/Operable Error",
        3: "Critical/Fatal Error"
    }

    ALL_NODES = {}

    # Factory pattern
    # Class method to instantiate a new node model subclass from an OPC UA
    # object node (based on its object type)
    @classmethod
    def create(obj_node, opcua_client, *args, **kwargs):
        model_class = NODE_ID_TO_MODEL[obj_node.get_type_definition()]
        model = model_class(obj_node, opcua_client, *args, **kwargs)
        NodeModel.ALL_NODES[model.id] = model

        if model_class in ALL_DEVICE_MODELS_TO_NAME:
            DeviceModel.ALL_DEVICES[model.id] = model
        elif model_class is FolderModel:
            FolderModel.ALL_FOLDERS[model.id] = model

        return model

    # Recursive class method to initialize all device models from the OPC UA objects node
    @classmethod
    def initialize_all(root_obj_nodes, opcua_client):
        model_trees = []
        devices_by_type = {}

        # Function to recursively traverse node tree
        def __traverse_node(node, parent_model, opcua_client, devices_by_type):

            # If node already seen, get corresponding model
            if node.id in NodeModel.ALL_NODES:
                model = NodeModel.ALL_NODES[node.id]
                recurse = False
            else:
                model = NodeModel.create(node, opcua_client)
                recurse = True
            parent_model.add_child(model)

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

        for node in root_obj_nodes:
            model_trees.append(__traverse_node(node, None, opcua_client, devices_by_type))

        return model_trees, devices_by_type

    # Method to recurse through a fully initialized model tree
    # And call a callback function on every model.
    @staticmethod
    def traverse_models(root_model, callback_fn, **kwargs):

        seen = {}

        # Generic traversal function
        def __traverse(model, callback_fn, seen=seen, **kwargs):
            if model.id in seen:
                model = seen[node.id]
                recurse = False
            else:
                seen[model.id] = model
                recurse = True

            new_args = callback_fn(model, **kwargs)

            if recurse and model.children:
                for child in model.children:
                    __traverse(child, seen=seen, **new_args)

        __traverse(root_model, callback_fn, seen=seen, **kwargs)

    def __init__(self, obj_node, opcua_client):

        # OPC UA object node, node name, node id, node object type
        self._obj_node = obj_node
        self._node_name = self._obj_node.get_display_name()
        self._node_id = self._obj_node.nodeid
        self._node_object_type = self._opcua_client.get_node(self._obj_node.get_type_definition()).get_display_name()

        # OPC UA client
        self._opcua_client = opcua_client

        self._children = []

    @property
    def name(self):
        return self._node_name

    @property
    def id(self):
        return self._node_id

    @property
    def object_type(self):
        return self._node_object_type

    @property
    def children(self):
        return self._children

    # Generic method to add a child to a NodeModel
    def add_child(self, child_model):
        self._children.append(child_model)

    # Calculates the status of this device from its internal properties/variables
    # Does not take into account the status of any children
    @property
    @abstractmethod
    def self_status(self):
        pass

    # Computes "overall" status of the device
    # based on its internal status and that of its children
    # (recursively)
    # The status is the "worst" of the parents + childrens' statuses
    @property
    def status(self):
        if self.children:
            status = max([child.status for child in self.children] + [self.self_status])
        else:
            status = self.self_status
        return status

# Folder model class. Wraps OPC UA foldertype nodes.
# implements only basic functionality.

class FolderModel(NodeModel):

    def __init__(self, obj_node, opcua_client):
        super().__init__(self, obj_node, opcua_client)

    @property
    def self_status(self):
        return 1

# Generic device model class
# A wrapper around an OPC UA object node + subscriptions
# Mirrors, in real time, the OPC UA object using subscriptions
class DeviceModel(NodeModel):

    ERROR_NODE_NAME = "0:Errors"

    DEFAULT_DATA_SUBSCRIPTION_PERIOD = 1000
    DEFAULT_ERROR_SUBSCRIPTION_PERIOD = 100

    # Subscription instances are shared across all device models
    __subscriptions = []

    # Dictionary of all devices by node id
    ALL_DEVICES = {}

    def __init__(self, obj_node, opcua_client, sub_periods={}):

        super().__init__(self, obj_node, opcua_client)

        # Subscription handler
        self._sub_handler = SubHandler(self)

        # All monitored internal nodes
        self._data_nodes = {node.get_display_name(): node
            for node in self._obj_node.get_properties() + self._obj_node.get_variables()}
        self._method_nodes = {node.get_display_name(): node
            for node in self._obj_node.get_methods()}
        self._error_nodes = {node.get_display_name(): node
            for node in self._obj_node.get_child([ERROR_NODE_NAME]).get_variables()}

        # Dictionaries mapping node objects to node names
        # Used by the subscription handler to retrieve the name of the changed node
        # in a data change notification
        self.__data_node_to_name = {node: node.get_display_name() for node in data_nodes}
        self.__error_node_to_name = {node: node.get_display_name() for node in error_nodes}

        # Initialize data dictionary and error dictionary.
        # Maps data property/error names to values
        self._data = {node.get_display_name(): node.get_value() for node in data_nodes}
        self._errors = {node.get_display_name(): node.get_value() for node in error_nodes}

        # Subscribe to data changes in all properties/variables + errors
        for n, node_dict in [('data', self._data_nodes), ('errors', self._error_nodes)]:
            if n == 'data':
                DEFAULT_SUBSCRIPTION_PERIOD = DEFAULT_DATA_SUBSCRIPTION_PERIOD
            elif n == 'errors':
                DEFAULT_SUBSCRIPTION_PERIOD = DEFAULT_ERROR_SUBSCRIPTION_PERIOD

            for name, node in node_dict:
                # If node is provided in sub_periods, use provided custom subscription period.
                # Else use default
                sub_period = sub_periods[name] if name in sub_periods else DEFAULT_SUBSCRIPTION_PERIOD
                # If subscription with a given period does not exist, create, else re-use existing subscription
                if sub_period not in self.__subscriptions:
                    sub = self._opcua_client.create_subscription(sub_period, self._sub_handler)
                    self.__subscriptions[sub_period] = sub
                else:
                    sub = self.__subscriptions[sub_period]
                sub.subscribe_data_change(node)

    # Dictionary of data property names and values
    @property
    def data(self):
        return self._data

    # List of method names
    @property
    def methods(self):
        return self._method_nodes.keys()

    # Dictionary of error flags
    @property
    def errors(self):
        return self._errors

    # Returns a list of tuples of (property, value) describing this device
    # Used for producing info boxes and tooltips
    @property
    @abstractmethod
    def description(self):
       pass

    # Calls an object method and returns its return value
    def call_method(self, method_name, *args):
        return_values = self._obj_node.call_method(self._methods[method_name], *args)
        return return_values

    # Add an observer model which will be notified whenever there is a data change in this device
    # The observer model should implement a self.notify() method
    def add_observer(self, observer):
        self.observers.append(observer)

    # Notifies all attached observers that the device has experienced a data change
    def notify_observers(self, data_node_name, data_node_type):
        for observer in self.observers:
            observer.notify(data_node_name, data_node_type)

class TelescopeModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def mirrors(self):
        return [child for child in self.children if isinstance(child, MirrorModel)]

    @property
    def gas_system(self):
        return [child for child in self.children if isinstance(child, GASSystemModel)]

    @property
    def positioner(self):
        return [child for child in self.children if isinstance(child, PositionerModel)]

    @property
    def pointing_system(self):
        return [child for child in self.children if isinstance(child, PointingSystemModel)]

class MirrorModel(DeviceModel):

    MIRROR_TYPE_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

        self.mirror_type = self._obj_node.get_child([MIRROR_TYPE_NODE_NAME]).get_value()

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def panels(self):
        return [child for child in self.children if isinstance(child, PanelModel)]

    @property
    def P1_panels(self):
        if self.mirror_type == 'primary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'P1')]
        else:
            raise ValueError("Mirror type '{}' does not have P1 panels".format(self.mirror_type))

    @property
    def P2_panels(self):
        if self.mirror_type == 'primary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'P2')]
        else:
            raise ValueError("Mirror type '{}' does not have P2 panels".format(self.mirror_type))

    @property
    def S1_panels(self):
        if self.mirror_type == 'secondary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'S1')]
        else:
            raise ValueError("Mirror type '{}' does not have S1 panels".format(self.mirror_type))

    @property
    def S2_panels(self):
        if self.mirror_type == 'secondary':
            return [child for child in self.children if (isinstance(child, PanelModel) and child.panel_type == 'S2')]
        else:
            raise ValueError("Mirror type '{}' does not have S2 panels".format(self.mirror_type))

# TODO
class PanelModel(DeviceModel):

    PANEL_NUMBER_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

        self.panel_number = self._obj_node.get_child([PANEL_NUMBER_NODE_NAME]).get_value()
        if (self.panel_number // 1000)%10 == 1:
            self.mirror_identifier = 'P'
        elif (self.panel_number // 1000)%10 == 2:
            self.mirror_indentifier = 'S'
        self.ring_number = (self.panel_number // 10)%10
        self.panel_type = self.mirror_indentifier + str(self.ring_number)

        self.add_adjacent_panels()

        # More panel info describing geometry (?)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

    @property
    def MPES(self):
        return [child for child in self.children if isinstance(child, MPESModel)]

    @property
    def actuators(self):
        return [child for child in self.children if isinstance(child, ActuatorModel)]

    @property
    def edges(self):
        return [child for child in self.children if isinstance(child, EdgeModel)]

    def add_adjacent_panels(self):
        self.adjacent_panels = []
        for edge_model in self.edges:
            for panel in edge_model.panels:
                if panel != self:
                    self.adjacent_panels.append(panel)

class EdgeModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def MPES(self):
        return [child for child in self.children if isinstance(child, MPESModel)]

    @property
    def panels(self):
        return [child for child in self.children if isinstance(child, PanelModel)]

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class ActuatorModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class MPESModel(DeviceModel):
    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class GASSystemModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class PointingSystemModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = [('status', self.self_status)]
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status


class PositionerModel(DeviceModel):

    def __init__(self, obj_node, opcua_client, socketio_server, sub_periods={}):
        super().__init__(self, obj_node, opcua_client, socketio_server, sub_periods=sub_periods)

    @property
    def description(self):
        properties = {
            'name': self.name,
            'object_type': ALL_DEVICE_MODELS_TO_NAME[self.__class__],
            'properties':[('status', self.self_status)]
        }
        return properties

    @property
    def self_status(self):
        status = 3 if self.errors.values().any() else 1
        return status

# NOTE: Only child model types whose name (from ALL_DEVICE_MODELS_TO_NAME, in lowercase)
# exists as an instance attribute of the parent are allowed as children.
ALL_DEVICE_MODELS_TO_NAME = {
        TelescopeModel: 'Telescopes',
        MirrorModel: 'Mirrors',
        PanelModel: 'Panels',
        EdgeModel: 'Edges',
        ActuatorModel: 'Actuators',
        MPESModel: 'MPES',
        GASSystemModel: 'GAS_system',
        PointingSystemModel: 'Pointing_system',
        PositionerModel: 'Positioner'
        }

NODE_ID_TO_MODEL = {
        '': TelescopeModel,
        'ns=2;i=100': MirrorModel,
        'ns=2;i=2000': PanelModel,
        'ns=2;i=1000': EdgeModel,
        'ns=2;i=2100': ActuatorModel,
        'ns=2;i=1100': MPESModel,
        '': GASSystemModel,
        '': PointingSystemModel,
        '': PositionerModel,
        'i=61': FolderModel
}
>>>>>>> Stashed changes:psct_gui/models/device_models.py
