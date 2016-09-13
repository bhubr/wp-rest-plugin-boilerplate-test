var $ = jQuery;

var sendRequest = function(relativeUrl, method, payload) {
  return new Promise(function(resolve, reject) {
    var baseUrl = '/wp-json/bhubr/v1/foos';
    $.ajax({
      method: method,
      url: baseUrl + relativeUrl,
      data: payload,
      dataType: 'json',
      headers: { "Content-Type": 'application/json' },
      success: function(data) {
        console.log(data);
        resolve(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        reject(errorThrown)
      } });
  });
}

var requests = {

  create: function(payload) {
    console.log('createObject', payload);
    return sendRequest('', 'POST', payload);
  },

  delete: function(id, payload) {
    console.log('deleteObject', payload);
    return sendRequest('/' + id, 'DELETE');
  }

} 

$(document).ready(function() {

  QUnit.test( "hello test POST", function( assert ) {
    var done = assert.async();
    var timestamp = (new Date().getTime()).toString(36);
    var payload = JSON.stringify({ name: 'blah@blah.com ' + timestamp, description: 'Verbose blah blah', foo_type: 'Foo', foo_number: 5, ignored_field: 'ignored' });
    // $.ajax({ method: 'POST', url: '/wp-json/bhubr/v1/foos', data: payload, success: function(data) {
    requests.create(payload).then(function(data) {
      var keys = Object.keys(data);
      assert.equal(data.name, 'blah@blah.com ' + timestamp);
      assert.equal(data.slug, 'blahblah-com-' + timestamp);
      assert.equal(data.description, 'Verbose blah blah');
      assert.equal(data.foo_type, 'Foo');
      assert.equal(data.foo_number, 5);
      assert.equal(data.ignored_field, 'ignored');
      assert.equal(keys.length, 7);
      assert.deepEqual(keys, ['id', 'slug', 'name', 'description', 'foo_type', 'foo_number', 'ignored_field']);
      requests.delete(data.id).then(done);
    });
  });

});
