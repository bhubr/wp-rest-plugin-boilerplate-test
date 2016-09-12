var $ = jQuery;
$(document).ready(function() {
  QUnit.test( "hello test async", function( assert ) {
    var done = assert.async();
    $.get('/wp-json/myplugin/v1/author/1', function(data) {
      assert.equal(data, 'Bonjour tout le monde&nbsp;!');
      console.log('data', data);
      done();
    });
  });

  QUnit.test( "hello test POST", function( assert ) {
    var done = assert.async();
    var timestamp = (new Date().getTime()).toString(36);
    var payload = JSON.stringify({ name: 'blah@blah.com ' + timestamp, description: 'Verbose blah blah', foo_type: 'Foo', foo_number: 5, ignored_field: 'ignored' });
    $.ajax({ method: 'POST', url: '/wp-json/myplugin/v1/foos', data: payload, success: function(data) {
      var keys = Object.keys(data);
      assert.equal(data.name, 'blah@blah.com ' + timestamp);
      assert.equal(data.slug, 'blahblah-com-' + timestamp);
      assert.equal(data.description, 'Verbose blah blah');
      assert.equal(data.foo_type, 'Foo');
      assert.equal(data.foo_number, 5);
      assert.equal(data.ignored_field, 'ignored');
      assert.equal(keys.length, 7);
      assert.deepEqual(keys, ['id', 'slug', 'name', 'description', 'foo_type', 'foo_number', 'ignored_field']);
      done();
    }, dataType: 'json', headers: { "Content-Type": 'application/json' } });
  });

});
