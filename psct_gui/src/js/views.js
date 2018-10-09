// Import NPM modules
import $ from 'jquery';
import 'patternfly-bootstrap-treeview';

export class BaseView {
  constructor(selector, namespace_name) {
    this.$element = $(selector);
    this.socket = io(namespace_name);

    this.socket.on('connect', function(){
      this.socket.emit('client_connected');
    });
    this.socket.on('disconnect', function(){
      this.socket.emit('client_disconnected');
    });

    // attach listeners to HTML controls
    //

  }
  show() {
    throw new Error('You must implement this method.');
  }
}

export class DeviceTreeView extends BaseView {
  constructor(selector, namespace_name, container_selector, info_window_namespace_name) {
    super(selector, namespace_name, container_selector);

    this.info_window_namespace_name = info_window_namespace_name;
    this.$container = $(container_selector);

    this.socket.on('datachange_notification', function(data){
      var formatted_data = data;

      for (var node in formatted_data){
        this.add_status_tag(node);
      }

      this.data = formatted_data;
      this.show();
    });

    // attach listeners to HTML controls
    elements.addButton.addEventListener('click',
      () => this.socket.emit('toggle_mode'));
  }

  static add_status_tag(obj)
  {
    if(obj.hasOwnProperty('device_status'))
    {
      switch(obj.device_status) {
          case 1:
              obj['tags'] = [{text:'Normal', class:'badge-success'}];
              break;
          case 2:
              obj['tags'] = [{text:'Warning', class:'badge-warning'}];
              break;
          case 3:
              obj['tags'] = [{text:'Error', class:'badge-danger'}];
              break;
      }
    }
    if (obj.nodes.length > 0)
    {
      for (var child in obj)
      {
        recurse(obj[k]);
      }
    }
  }

  show() {
    this.rebuildTree();
  }

  rebuildTree() {
    this.$element.treeview({data: this.data ,
      'levels': 1,
      'showTags': true,
      onNodeSelected: function(event, data) {
        this.socket.emit('change_selection',{'id': data.device_id});
      }
    });
  }
}

export class InfoWindowView extends BaseView {
  constructor(selector, namespace_name) {
    super(selector, namespace_name);

    this.socket.on('datachange_notification', function(data){
      var formatted_data = data;

      this.data = data;
      this.show();
    });

    // attach listeners to HTML controls
  }

  show() {
    this.rebuildWindow();
  }

  rebuildWindow() {

    // Clear existing content
    this.$element.empty();

    // Append title (Object name and type)
    var $title = $('<h3>').text(this.data.name);
    $('<small/>', {
      class: 'text-muted',
      text: this.data.object_type
    }).appendTo($title);
    $title.appendTo(this.$element);

    // Append list of properties as a table
    var $table = $('<table>',{class:"table table-sm"});

    for (var property in this.data.properties) {
      var property_name = property[0];
      var property_value = property[1];

      var $row = $('<tr/>');

      $('<td/>', {
        text: property_name
      }).appendTo($row);
      $('<td/>', {
        text: property_value
      }).appendTo($row);

      $row.appendTo($table);
    }

    $table.appendTo(this.$element);
  }
}
