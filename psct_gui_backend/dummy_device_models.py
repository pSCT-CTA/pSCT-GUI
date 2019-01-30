"""Module for OPC UA device mirroring classes."""
from abc import abstractmethod
import logging
import threading
import pprint
import opcua
import random
import time

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
                      for subcls in DummyDeviceModel.__subclasses__()}

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

    def generate_dummy_data(self, type, name, mean=10.0, stddev=1.0,
                            min_time=1.0, max_time=2.0):
        while True:
            if type == "data":
                type_dict = self._data
            elif type == "error":
                type_dict = self._errors
            else:
                raise ValueError("Invalid type {}".format(type))

            if name in dict:
                type_dict[name] = random.gauss(mean, stddev)

            self._socketio_server.emit('data_change', {
                'device_id': self._device_model.id,
                'type': type,
                'name': name,
                'value': type_dict[name]})

            time.sleep(random.uniform(min_time, max_time))


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

    def __init__(self, panel_number, initial_data=None, socketio_server=None):
        super().__init__(socketio_server=socketio_server)

        logger.info("Creating dummy panel with ID {}".format(panel_number))

        self.panel_number = panel_number

        if self.panel_number[0] == '1':
            self.mirror = 'primary'
            mirror_identifier = 'P'
        elif self.panel_number[0] == '2':
            self.mirror = 'secondary'
            mirror_identifier = 'S'
        self.ring_number = self.panel_number[1]
        if self.ring_number == '1':
            self.ring = 'inner'
        elif self.ring_number == '2':
            self.ring = 'outer'

        self.panel_type = mirror_identifier + self.ring_number

        self._position_info = {
            'panel_number': self.panel_number,
            'mirror': self.mirror,
            'ring': self.ring,
            'panel_type': self.panel_type
        }

        self._id = panel_number
        self._name = "Panel " + panel_number
        self._position_info = {}

        if initial_data:
            self._data = initial_data
        else:
            self._data = {
                'State': 0,
                'curCoords_x': -3.5,
                'curCoords_y': 3.1,
                'curCoords_z': 608.9,
                'curCoords_xRot': -4.4,
                'curCoords_yRot': -0.5,
                'curCoords_zRot': 2.1,
                'inCoords_x': -3.5,
                'inCoords_y': 3.1,
                'inCoords_z': 608.9,
                'inCoords_xRot': -4.4,
                'inCoords_yRot': -0.5,
                'inCoords_zRot': 2.1,
                'InternalTemperature': 20.84,
                'ExternalTemperature': 34.81
                }
        logger.info("Set initial data.")

        thread1 = threading.Thread(target=self.generate_dummy_data, args=("data", "InternalTempearture"), kwargs={'mean': 20.0})
        thread1.daemon = True
        thread1.start()
        thread2 = threading.Thread(target=self.generate_dummy_data, args=("data", "ExternalTemperature"), kwargs={'mean': 34.0})
        thread2.daemon = True
        thread2.start()
        logger.info("Started dummy data generation threads.")


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
