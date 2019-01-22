"""Module for OPC UA device mirroring classes."""
from abc import ABC, abstractmethod
import logging
import threading

logger = logging.getLogger(__name__)


class SubHandler(object):
    """Handler class for OPC UA subscription notifications.

    On data change, updates the parent device model's attributes to mirror the
    underlying OPC UA object in real time and also sends a data_change
    message to the clients via socket.io.
    Implements the interface defined by python-opcua for subscription handling.

    Parameters
    ----------
    device_model : psct_gui.backend.device_models.DeviceModel
        Parent DeviceModel for nodes being subscribed to.

    """

    def __init__(self, device_model):
        """Instantiate a SubHandler instance."""
        self._device_model = device_model

    def datachange_notification(self, node, val, data):
        """Call a callback function on data change in a monitored node.

        Parameters
        ----------
        node : opcua.Node
            Node object which triggered data change notification
        val : various
            Value of the node which changed
        data : opcua.common.subscription.DataChangeNotif
            Object containing information about the monitored item and
            subscription params

        """
        # Determine whether node is an error node or data node
        if node in self._device_model._data_node_to_name:
            name = self._device_model._data_node_to_name[node]
            type = 'data'
            d = self._device_model.data
        elif node in self._device_model._error_node_to_name:
            name = self._device_model._error_node_to_name[node]
            type = 'error'
            d = self._device_model.errors
        else:
            raise ValueError("Node producing datachange notification cannot "
                             "be identified as a data or error node.")

        # Send changed value via socket.io
        value = data.monitored_item.Value.Value.Value
        d[name] = value

        logger.info("OPC UA: Data change - {} : {} : {} : {}".format(
            self._device_model.id, type, name, value))
        if self._socketio_server:
            self._socketio_server.emit('data_change', {
                'device_id': self._device_model.id,
                'type': type,
                'name': name,
                'value': value})

    def event_notification(self, event):
        """Call a callback function on an event in a monitored node."""
        logger.info("OPC UA: New event :::: {}".format(event))


# Generic device model class
# A wrapper around an OPC UA object node + subscriptions
# Mirrors, in real time, the OPC UA object using subscriptions
class DeviceModel(ABC):
    """Model class for OPC UA device models.

    Mirrors OPC UA objects (panels, MPES, etc.) as Python objects.

    Parameters
    ----------
    obj_node : opcua.Node
        OPC UA node of the device to be mirrored.
    opcua_client : opcua.Client
        OPC UA Client instance connected to the alignment server.
    socketio_server : socketio.Server
        Socket.io Server instance used to connect to client browsers.
    sub_periods : (dict of str : int)
        Dictionary of node browse name : subscription period (ms) used to
        specify specific subscription periods for different data nodes.
        If not provided, the default subscription publish intervals will be
        used.

    Attributes
    ----------
    DEVICE_TYPE_NAME : str
        Name of this device type (for printing and dictionary lookup).
    TYPE_NODE_ID : str
        OPC UA node id for the type node corresponding to this device type.
    FOLDER_TYPE_NODE_ID : str
        Node ID of OPC UA folder type node.
    ERROR_NODE_BROWSE_NAME : str
        Browse name of the folder node under each device which contains the
        error nodes.
    DEFAULT_DATA_SUBSCRIPTION_PUBLISH_INTERVAL : int
        Default subscription publish interval for data nodes (in ms).
    DEFAULT_ERROR_SUBSCRIPTION_PUBLISH_INTERVAL : int
        Default subscription publish interval for error nodes (in ms).

    """

    DEVICE_TYPE_NAME = "BaseDeviceModel"

    FOLDER_TYPE_NODE_ID = "i=61"
    ERROR_NODE_BROWSE_NAME = "0:Errors"

    DEFAULT_DATA_SUBSCRIPTION_PUBLISH_INTERVAL = 1000
    DEFAULT_ERROR_SUBSCRIPTION_PUBLISH_INTERVAL = 1000

    @abstractmethod
    def __init__(self,
                 obj_node,
                 opcua_client,
                 socketio_server=None,
                 sub_periods={}):
        """Instantiate a DeviceModel instance."""
        self._opcua_client = opcua_client
        self._sub_periods = sub_periods

        self._exit = threading.Event()

        if socketio_server:
            self._socketio_server = socketio_server
            self._sub_handler = SubHandler(self)
            self._subscriptions = {}

        # OPC UA object node, node name, node id, node object type
        self._obj_node = obj_node
        self._type_node = self._opcua_client.get_node(
            self._obj_node.get_type_definition())

        self._id = self._obj_node.node_id
        self._name = self._obj_node.get_display_name()
        self._device_type_name = self.DEVICE_TYPE_NAME
        self._node_type_name = self._type_node.get_display_name()

        self.children = {}
        self.parents = []

        # Flag indicating whether a method is being executed
        # (only 1 allowed concurrently)
        self._busy = False

        # All monitored data nodes (properties and variables)
        _data_nodes = (
            self._obj_node.get_properties() + self._obj_node.get_variables())

        # NOTE: Requires that node display names for all properties
        # and variables are unique within each device
        self._data_nodes = {node.get_display_name().to_string(): node
                            for node in _data_nodes}

        # TEMPORARY: Try-catch to allow instantiation even if errors not
        # implemented
        try:
            _error_nodes = self._obj_node.get_child(
                [DeviceModel.ERROR_NODE_BROWSE_NAME]).get_variables()
            self._error_nodes = {node.get_display_name().to_string(): node
                                 for node in _error_nodes}
        except Exception:
            self._error_nodes = {}

        self._method_names_to_ids = {
            node.get_display_name().to_string(): node.node_id
            for node in self._obj_node.get_methods()}

        # Dictionaries mapping node objects to node names
        # Used by the subscription handler to retrieve the name of the changed
        # node in a data change notification
        self._data_node_to_name = {self._data_nodes[node_name]: node_name
                                   for node_name in self._data_nodes}
        self._error_node_to_name = {self._error_nodes[node_name]: node_name
                                    for node_name in self._error_nodes}

        # Initialize data dictionary and error dictionary.
        # Maps data property/error names to values
        self._data = {node_name: self._data_nodes[node_name].get_value()
                      for node_name in self._data_nodes}
        self._errors = {node_name: self._error_nodes[node_name].get_value()
                        for node_name in self._error_nodes}

    @classmethod
    def create(cls, obj_node, opcua_client, *args, **kwargs):
        """Model class for OPC UA device models.

        Mirrors OPC UA objects (panels, MPES, etc.) as Python objects.

        Parameters
        ----------
        obj_node : opcua.Node
            OPC UA node of the device to be mirrored.
        opcua_client : opcua.Client
            OPC UA Client instance connected to the alignment server.
        socketio_server : socketio.Server
            Socket.io Server instance used to connect to client browsers.
        sub_periods : (dict of str : int)
            Dictionary of node browse name : subscription period (ms) used to
            specify specific subscription periods for different data nodes.
            If not provided, the default subscription publish intervals will be
            used.

        """
        subclasses = {subcls.TYPE_NODE_ID: subcls
                      for subcls in DeviceModel.__subclasses__()}

        type_node_id = obj_node.get_type_definition().to_string()
        if type_node_id in subclasses:
            model_class = subclasses[type_node_id]
        else:
            raise ValueError("Could not find DeviceModel type "
                             "matching type_node_id: {}".format(type_node_id))
        model = model_class(obj_node, opcua_client, *args, **kwargs)
        return model

    @property
    def data(self):
        """dict: Dictionary of data node display names (str) and values."""
        return self._data

    @property
    def errors(self):
        """dict: Dictionary of error node display names (str) and values."""
        return self._errors

    @property
    def methods(self):
        """dict: Dictionary of method node display names (str) and node ids."""
        return self._method_names_to_ids

    @property
    def name(self):
        """str: Name of device (display name of its OPC UA object node)."""
        return self._name

    @property
    def id(self):
        """str: Unique node id of this device's OPC UA object node."""
        return self._id

    @property
    def type(self):
        """str: Name of this device's type."""
        return self._device_type_name

    @property
    def all_children(self):
        """list of DeviceModel: Flat list of all children devices."""
        return [c for l in self.children.values() for c in l]

    def send_initial_data(self, sid):
        """Send data describing this device to a client browser via socketio.

        Parameters
        ----------
        sid : str
            Session ID of the client to send data to.

        """
        initial_data = {
            'device_id': self.id,
            'name': self.name,
            'type': self.type,
            'data': self.data,
            'errors': self.errors,
            'methods': self._method_names_to_ids,
            'children': {type: [model.id for model in self.children[type]]
                         for type in self.children},
            'parents': [model.id for model in self.parents]
        }
        logger.info("Device {}: Initial Data: {}".format(
            self.name, initial_data))
        if self._socketio_server:
            self._socketio_server.emit('initial_data', room=sid,
                                       data=initial_data)

    def start_subscriptions(self):
        """Add a DeviceModel as a child of this device.

        Parameters
        ----------
        child : psct_gui.backend.device_models.DeviceModel
            DeviceModel to add as a child.

        """
        for n, node_dict in [('data', self._data_nodes),
                             ('errors', self._error_nodes)]:
            if n == 'data':
                DEFAULT_SUBSCRIPTION_PERIOD = (
                    DeviceModel.DEFAULT_DATA_SUBSCRIPTION_PUBLISH_INTERVAL)
            elif n == 'errors':
                DEFAULT_SUBSCRIPTION_PERIOD = (
                    DeviceModel.DEFAULT_ERROR_SUBSCRIPTION_PUBLISH_INTERVAL)

            for node_name in node_dict:
                # If node is provided in sub_periods, use provided custom
                # subscription period. Else use default
                sub_period = (self._sub_periods[node_name]
                              if node_name in self._sub_periods
                              else DEFAULT_SUBSCRIPTION_PERIOD)
                if sub_period in self._subscriptions:
                    sub = self._subscriptions[sub_period]
                else:
                    sub = self._opcua_client.create_subscription(
                        sub_period, self._sub_handler)
                    self._subscriptions[sub_period] = sub
                sub.subscribe_data_change(node_dict[node_name])

    def add_child(self, child):
        """Add a DeviceModel as a child of this device.

        Parameters
        ----------
        child : psct_gui.backend.device_models.DeviceModel
            DeviceModel to add as a child.

        """
        if child.type not in self.children:
            self.children[child.type] = []
        self.children[child.type].append(child)
        child.parents.append(self)

    # Calls an object method and returns its return value
    def call_method(self, method_name, args):
        """Call a method from the OPC UA device.

        Calls the method in a separate thread to allow a concurrent call to
        the stop method before the method finishes execution.

        Parameters
        ----------
        method_name : str
            Name (display name) of the method to be called.
        args : list
            List of arguments to pass to the method.

        Returns
        -------
        list
            List of return values from the method.

        """
        if not self._busy:
            if method_name in self.methods:
                self._busy = True
                return_values = self._obj_node.call_method(
                    self.methods[method_name], args)
                if self._socketio_server:
                    self._socketio_server.emit('method_return', {
                        'device_id': self.id,
                        'method_name': method_name,
                        'args': args,
                        'return_values': return_values})
                self._busy = False

                return return_values
            else:
                logger.error("Method name {} not found in device {}.".format(
                    method_name, self.name))

        else:
            logger.warning("Device {} busy. Method call {} blocked.".format(
                self.name, method_name))
            if self._socketio_server:
                self._socketio_server.emit('device_busy', {
                    'device_id': self.id,
                    'method_name': method_name})

        return False

    def call_method_background(self, method_name, args):
        if not self._busy:
            if method_name in self.methods:
                self._busy = True
                thread = threading.Thread(
                    target=self._call_method,
                    args=(self.methods[method_name], args))
                thread.start()
            else:
                logger.error("Method name {} not found in device {}.".format(
                    method_name, self.name))

        else:
            logger.warning("Device {} busy. Method call {} blocked.".format(
                self.name, method_name))
            if self._socketio_server:
                self._socketio_server.emit('device_busy', {
                    'device_id': self.id,
                    'method_name': method_name})

        return False

    def _call_method(self, method_name, args):
        return_values = self._obj_node.call_method(
            self.methods[method_name], args)
        logger.info("Device {} - Method {} returned. Return vals: {}".format(
            self.name, method_name, return_values))
        if self._busy:
            if self._socketio_server:
                self._socketio_server.emit('method_return', {
                    'device_id': self.id,
                    'method_name': method_name,
                    'args': args,
                    'return_values': return_values})
            self._busy = False

    def call_stop(self):
        if self._busy:
            self._obj_node.call_method(self.methods['stop'], [])
            logger.info("Device {} - Stop called.".format(self.name))
            if self._socketio_server:
                self._socketio_server.emit('method_stopped', {
                    'device_id': self.id})
            self._busy = False


class TelescopeModel(DeviceModel):
    """Model class for a telescope device."""

    DEVICE_TYPE_NAME = "Telescope"
    TYPE_NODE_ID = "placeholder_telescope"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a TelescopeModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class MirrorModel(DeviceModel):
    """Model class for a telescope mirror device.

    Attributes
    ----------
    MIRROR_TYPE_NODE_NAME: str
        Browse name for the node containing the mirror type.

    """

    DEVICE_TYPE_NAME = "Mirror"
    TYPE_NODE_ID = "ns=2;i=100"
    MIRROR_TYPE_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a MirrorModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)

        try:
            self.mirror_type = self._obj_node.get_child(
                [MirrorModel.MIRROR_TYPE_NODE_NAME]).get_value()
        except Exception:
            self.mirror_type = None


class PanelModel(DeviceModel):
    """Model class for a mirror panel edge sensor device.

    Attributes
    ----------
    PANEL_NUMBER_NODE_NAME: str
        Browse name for the node containing the panel position number.

    """

    DEVICE_TYPE_NAME = "Panel"
    TYPE_NODE_ID = "ns=2;i=2000"
    PANEL_NUMBER_NODE_NAME = ''

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a PanelModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)

        try:
            self.panel_number = self._obj_node.get_child(
                [self.PANEL_NUMBER_NODE_NAME]).get_value()
        except Exception:
            self.panel_number = int(self.name[-4:])

        if (self.panel_number // 1000) % 10 == 1:
            self.mirror_identifier = 'P'
        elif (self.panel_number // 1000) % 10 == 2:
            self.mirror_indentifier = 'S'
        self.ring_number = (self.panel_number // 10) % 10
        self.panel_type = self.mirror_indentifier + str(self.ring_number)

        self.add_adjacent_panels()

        # More panel info describing geometry (?)

    def add_adjacent_panels(self):
        """Add all adjacent panels to self.adjacent_panels.

        Gets all edges, iterates over their panels and adds any which are
        distinct from this panel.

        """
        self.adjacent_panels = []
        for edge_model in self.edges:
            for panel in edge_model.panels:
                if panel != self:
                    self.adjacent_panels.append(panel)


class EdgeModel(DeviceModel):
    """Model class for a panel edge device."""

    DEVICE_TYPE_NAME = "Edge"
    TYPE_NODE_ID = "ns=2;i=1000"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a EdgeModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class ActuatorModel(DeviceModel):
    """Model class for a stewart platform actuator device."""

    DEVICE_TYPE_NAME = "Actuator"
    TYPE_NODE_ID = "ns=2;i=2100"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a ActuatorModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class MPESModel(DeviceModel):
    """Model class for a mirror panel edge sensor device."""

    DEVICE_TYPE_NAME = "MPES"
    TYPE_NODE_ID = "ns=2;i=1100"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a MPESModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class GASSystemModel(DeviceModel):
    """Model class for a global alignment system device."""

    DEVICE_TYPE_NAME = "GAS_system"
    TYPE_NODE_ID = "placeholder_gas"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a PositionerModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class PointingSystemModel(DeviceModel):
    """Model class for a telescope pointing system device."""

    DEVICE_TYPE_NAME = "Pointing_system"
    TYPE_NODE_ID = "placeholder_pointing"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a PointingSystemModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


class PositionerModel(DeviceModel):
    """Model class for a telescope positioner device."""

    DEVICE_TYPE_NAME = "Positioner"
    TYPE_NODE_ID = "placeholder_positioner"

    def __init__(self, obj_node, opcua_client, socketio_server=None,
                 sub_periods={}):
        """Instantiate a PositionerModel instance."""
        super().__init__(obj_node, opcua_client,
                         socketio_server=socketio_server,
                         sub_periods=sub_periods)


# Set of node ids for type nodes corresponding to all implemented DeviceModel
# subclasses plus folder type nodes.
VALID_NODE_TYPE_IDS = {subcls.TYPE_NODE_ID
                       for subcls in DeviceModel.__subclasses__()}.union(
                           {DeviceModel.FOLDER_TYPE_NODE_ID})
