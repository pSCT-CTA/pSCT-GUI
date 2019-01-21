import io from 'socket.io-client';

export class SocketioDeviceClient {
  constructor(address) {
    this.socket = io(address);
  }
}
