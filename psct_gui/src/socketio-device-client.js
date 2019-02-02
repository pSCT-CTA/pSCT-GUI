export class BaseSocketioDeviceClient {
  constructor(address, component) {
    this.socket = io(address)
    this.component = component

    // General-purpose event handlers
    this.socket.on('connect', function(){
      console.log(`[socket.io] - Connected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('disconnect', function(){
      console.log(`[socket.io] - Disconnected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('connect_error', function(){
      console.log(`[socket.io] - Connect error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('connect_timeout', function(){
      console.log(`[socket.io] - Connect timeout - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('error', function(){
      console.log(`[socket.io] - Error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect', function(){
      console.log(`[socket.io] - Reconnected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_attempt', function(){
      console.log(`[socket.io] - Reconnect attempt - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnecting', function(){
      console.log(`[socket.io] - Reconnect attempt - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_error', function(){
      console.log(`[socket.io] - Reconnect error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_failed', function(){
      console.log(`[socket.io] - Reconnect failed - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))

    // Device client-specific handlers
    this.socket.on('data_change', this.on_data_change.bind(this))
    this.socket.on('method_return', this.on_method_return.bind(this))
    this.socket.on('method_stopped', this.on_method_stopped.bind(this))
    this.socket.on('device_busy', this.on_device_busy.bind(this))
  }

  on_data_change(data) {
  }
  on_method_return(data) {
  }
  on_method_stopped(data) {
  }
  on_device_busy(data) {
  }

  request_all_data(devices_by, selection=null) {
    var requestData = {
      component_name: this.component.name,
      devices_by: devices_by}
    if (devices_by === "types") {
      requestData.types = selection
    }
    else if (devices_by === "ids") {
      requestData.ids = selection
    }
    else if (devices_by === "all") {
    }
    else {
      throw new Error("Invalid devices_by mode.")
    }
    this.socket.emit('request_all_data', requestData, this.component.setAllData.bind(this.component))
  }

  connect() {
    this.socket.connect()
  }
  disconnect() {
    this.socket.disconnect()
  }
}
