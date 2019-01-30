"""Module for OPC UA device mirroring classes."""
from abc import abstractmethod
import logging
import threading
import pprint
import opcua

from psct_gui_backend.device_models import BaseDeviceModel

logger = logging.getLogger(__name__)


class DummyDeviceModel(BaseDeviceModel):
    DEVICE_TYPE_NAME = "DummyDeviceModel"

    @abstractmethod
    def __init__(self,
                 socketio_server=None):
        """Instantiate a DummyDeviceModel instance."""
        super().__init__(socketio_server=socketio_server)

        self._id = ""
        self._name = ""
        self._type = self.DEVICE_TYPE_NAME
        self._position_info = {}

        self._data = {}
        self._errors = {}
        self._methods = []

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
        """dict: Dictionary of data property names (str) and values."""
        return self._data

    @property
    def errors(self):
        """dict: Dictionary of error property names (str) and values."""
        return self._errors

    @property
    def methods(self):
        """list: List of method names."""
        return self._methods

    @property
    def name(self):
        """str: Name of device."""
        return self._name

    @property
    def id(self):
        """str: Unique device id."""
        return self._id

    @property
    def type(self):
        """str: Name of this device's type."""
        return self._type

    @property
    def position_info(self):
        """str: Name of this device's type."""
        return self._position_info

    def set_data(self, name, value):
        self._data[name] = value

    def set_error(self, name, value):
        self._errors[name] = value

    # Calls an object method and returns its return value
    def call_method(self, method_name, *args):
        method_to_call = self._methods[method_name]
        return method_to_call(*args)

    def call_stop(self):
        self._stop()

    def _stop(self):
        pass


class DummyTelescopeModel(DummyDeviceModel):
    """Dummy model class for a telescope device."""

    DEVICE_TYPE_NAME = "Telescope"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyMirrorModel(DummyDeviceModel):
    """Dummy model class for a mirror device."""

    DEVICE_TYPE_NAME = "Mirror"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyPanelModel(DummyDeviceModel):
    """Dummy model class for a panel device."""

    DEVICE_TYPE_NAME = "Panel"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyEdgeModel(DummyDeviceModel):
    """Dummy model class for an edge device."""

    DEVICE_TYPE_NAME = "Edge"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyActuatorModel(DummyDeviceModel):
    """Dummy model class for an ACT device."""

    DEVICE_TYPE_NAME = "Actuator"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyMPESModel(DummyDeviceModel):
    """Dummy model class for an MPES device."""

    DEVICE_TYPE_NAME = "MPES"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyGASSystemModel(DummyDeviceModel):
    """Dummy model class for the GAS system."""

    DEVICE_TYPE_NAME = "GAS System"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyPointingSystemModel(DummyDeviceModel):
    """Dummy model class for the telescope pointing system."""

    DEVICE_TYPE_NAME = "Pointing System"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


class DummyPositionerModel(DummyDeviceModel):
    """Dummy model class for the telescope positioner."""

    DEVICE_TYPE_NAME = "Positioner"

    def __init__(self, socketio_server=None):
        super().__init__(socketio_server=socketio_server)


# Set of node ids for type nodes corresponding to all implemented DeviceModel
# subclasses plus folder type nodes.
DUMMY_DEVICE_MODEL_CLASSES = {subcls.__name__: subcls
                              for subcls in DummyDeviceModel.__subclasses__()}
