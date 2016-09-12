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
    var payload = JSON.stringify({ name: 'Blah', description: 'Verbose blah blah' });
    $.ajax({ method: 'POST', url: '/wp-json/myplugin/v1/foos', data: payload, success: function(data) {
      // assert.ok(data.success);
      assert.equal(data.name, 'Blah');
      assert.equal(data.description, 'Verbose blah blah');
      console.log('data', data);
      done();
    }, dataType: 'json', headers: { "Content-Type": 'application/json' } });
  });

});
