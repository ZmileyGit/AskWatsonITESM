var watson = require('watson-developer-cloud');

function textToSpeech(){
    var service = require("./credentials").credentialFor("text_to_speech");
    return watson.text_to_speech({
      version: 'v1',
      username: service.credentials.username,
      password: service.credentials.password
    });
}

exports.readText = function(req, res, next) {
  var transcript = textToSpeech().synthesize(req.query);
  transcript.on('response', function(response) {
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.on('error', function(error) {
    next(error);
  });
  transcript.pipe(res);
};