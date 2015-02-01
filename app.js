var express = require('express'),
  connect = require('connect'),
  _ = require('lodash'),
  app = express();

var api = require('./server/api'),
  email = require('./server/email'),
  groupCache = require('./server/cache');
groupCache.start();

app.use('/bower_components', express.static('./bower_components'));
app.use(express.static('./app'));

app.use(connect.json());
app.use(connect.urlencoded());

app.post('/query', function(req, res) {
  var body = _.defaults(req.body || {}, {
    type: 'NONE',
    when: 'ANY',
    time: 'NONE',
    people: 'NONE',
    ages: 'ANY',
    childcare: false
  });

  var form = {};
  if (body.childcare) { form.childcare = 1; }
  if (body.type !== 'NONE') { form.udf_pulldown_1_id = body.type; }
  if (body.people !== 'NONE') { form.udf_pulldown_2_id = body.people; }
  if (body.ages !== 'ANY') { form.udf_pulldown_3_id = body.ages; }
  if (body.when !== 'ANY') { form.meet_day_id = body.when; }
  if (body.time !== 'NONE') { form.meet_time_id = body.time; }

  api.search(form, function(err, items) {
    items = items.map(function(item) {
      var cached = groupCache.fetch(item.id);
      if (cached) {
        item = _.defaults(item, cached);
      }
      return item;
    });
    return res.send({ success: !err, result: err || items });
  });
});
app.post('/contact', function(req, res) {
  var body = _.defaults(req.body || {}, {
    group_name: '',
    owner_name: '',
    owner_email_primary: '',
    name: '',
    email: '',
    phone: ''
  });
  if (!body.email) {
    return res.send({ success: false, result: 'You must provide an email and a group.' });
  }

  email({
    to: body.owner_email_primary,
    replyTo: body.email,
    subject: '[JGROUPS] ' + (body.name || 'Someone') + ' Wants to Join Your JGroup!',
    text: 'Hi ' + body.owner_name + '!\n\n'
    + (body.name || 'Someone') + ' is interested in joining your JGroup! Would you reach out to them as soon as you can to connect and start having fun together?\n\n'
    + '\tJGroup: ' + body.group_name + '\n'
    + '\tName: ' + (body.name || 'Not Provided') + '\n'
    + '\tEmail: ' + body.email + '\n'
    + '\tPhone: ' + (body.phone || 'Not Provided') + '\n'
    + '\nHave a blessed day!'
    + '\nThe JTeam'
  }, function(err) {
    return res.send({ success: !err, result: err });
  });
});

var server = app.listen(process.env.PORT || 5000, function() {
  console.log('Listening on port %d', server.address().port);
  console.log('http://localhost:' + server.address().port + '/');
});
