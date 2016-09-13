var $ = jQuery;

function sendRequest(relativeUrl, method, payload) {
  return new Promise(function(resolve, reject) {
    var baseUrl = '/wp-json/bhubr/v1/foos';
    $.ajax({
      method: method,
      url: baseUrl + relativeUrl,
      data: payload,
      dataType: 'json',
      headers: { "Content-Type": 'application/json' },
      success: function(data) {
        resolve(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        reject(errorThrown);
      } });
  });
}

function getTimestamp() {
  return (new Date().getTime() + Math.ceil(1000000 * Math.random())).toString(36);
}
function getPayload(timestamp) {
  return JSON.stringify({ name: 'blah@blah.com ' + timestamp, description: 'Verbose blah blah', foo_type: 'Foo', foo_number: 5, ignored_field: 'ignored' });
}

var requests = {

  create: function(payload) {
    console.log('createObject', payload);
    return sendRequest('', 'POST', payload);
  },

  update: function(id, payload) {
    console.log('updateObject', payload);
    return sendRequest('/' + id, 'POST', payload);
  },

  delete: function(id) {
    console.log('deleteObject');
    return sendRequest('/' + id, 'DELETE');
  },

  read: function(id) {
    return sendRequest('/' + id, 'GET');
  },

  readAll: function() {
    return sendRequest('', 'GET');
  }

} 

$(document).ready(function() {

  QUnit.test( "Test Object (of type Post) creation/read/update/delete by POST request", function( assert ) {
    var done = assert.async();
    var timestamp = getTimestamp();
    var payload = getPayload(timestamp);
    var postId;
    // Test CREATE
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
      postId = data.id;
      return postId;
    })
    // Test READ ONE
    .then(function(postId) {
      return requests.read(postId)
      .then(function(data) {
        assert.equal(data.id, postId);
        return data;
      })
    })
    // Test UPDATE
    .then(function(post) {
      var updated = JSON.parse(payload);
      updated.description = 'This is not a Foo but a Bar';
      updated.foo_type = 'Bar';
      updated.foo_number = 7;
      return requests.update(postId, JSON.stringify(updated))
      .then(function(data) {
        var keys = Object.keys(data);
        assert.equal(keys.length, 7);
        assert.equal(data.description, 'This is not a Foo but a Bar');
        assert.equal(data.foo_type, 'Bar');
        assert.equal(data.foo_number, 7);
        return data.id;
      });
    })
    // Test DELETE
    .then(function(postId) {
      requests.delete(postId).then(function(result) {
        assert.ok(result.success);
        done();
      });
    })
    .catch(function(error) {
      assert.ok(false, error);
      done();
    });
  });

  QUnit.test( "Test Object (of type Post) creation, read all, delete", function( assert ) {
    var done = assert.async();
    var timestamp1 = getTimestamp();
    var timestamp2 = getTimestamp();
    var id1;
    var id2;
    console.log(timestamp1, timestamp2);
    Promise.all([
      requests.create(getPayload(timestamp1)),
      requests.create(getPayload(timestamp2))
    ])
    .then(function(datas) {
      assert.equal(datas.length, 2);
      id1 = datas[0].id;
      id2 = datas[1].id;
    })
    .then(function() {
      return requests.readAll();
    })
    .then(function(datas) {
      assert.equal(datas[0].id, id1);
      assert.equal(datas[1].id, id2);
    })
    .then(function() {
      return Promise.all([
        requests.delete(id1),
        requests.delete(id2)
      ]);
    })
    .then(function(results) {
      assert.ok(results[0].success);
      assert.ok(results[1].success);
      done();
    })
    .catch(function(error) {
      assert.ok(false);
      done();
    });
  });

});
