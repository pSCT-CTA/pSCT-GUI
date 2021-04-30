export class BaseSocketioDeviceClient {
  constructor (address, component) {
    this.socket = io(address)
    this.component = component

    // General-purpose event handlers
    this.socket.on('connect', function () {
      console.log(`[socket.io] - Connected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('disconnect', function () {
      console.log(`[socket.io] - Disconnected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('connect_error', function () {
      console.log(`[socket.io] - Connect error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('connect_timeout', function () {
      console.log(`[socket.io] - Connect timeout - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('error', function () {
      console.log(`[socket.io] - Error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect', function () {
      console.log(`[socket.io] - Reconnected - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_attempt', function () {
      console.log(`[socket.io] - Reconnect attempt - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnecting', function () {
      console.log(`[socket.io] - Reconnect attempt - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_error', function () {
      console.log(`[socket.io] - Reconnect error - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))
    this.socket.on('reconnect_failed', function () {
      console.log(`[socket.io] - Reconnect failed - ${this.component.name}, id=${this.socket.id}.`)
    }.bind(this))

    // Device-specific handlers
    this.socket.on('requested_data', this.component._onRequestedData.bind(this.component))
    this.socket.on('data_change', this.component._onDataChange)
    this.socket.on('method_return', this.component._onMethodReturn)
    this.socket.on('method_stopped', this.component._onMethodStopped)
    this.socket.on('device_busy', this.component._onDeviceBusy)
  }

  requestData (request) {
    this.socket.emit('request_data', request)
  }

  connect () {
    this.socket.connect()
  }
  disconnect () {
    this.socket.disconnect()
  }
}
