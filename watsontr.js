exports.analyzeText = function(req, res) {
    var service = require("./credentials").credentialFor("language_translation");

    var text = (req.body).text;

    var data = {
        "source": "en",
        "target": "es",
        "text": text
    };     

    var info = {
            'uri' : service.credentials.url+"/v2/translate",
            'method' : "POST",
            'auth' : {
                'user': service.credentials.username,
                'pass': service.credentials.password
            },
            'headers' : {
                'Content-Type' : 'application/json',
                'Content-Length' : JSON.stringify(data).length
            },
        'json' : data
    };

    var request = require('request');
    request(info, function(error, response, body) {
            if(error) {
                console.log("Translation Error: ", error);
            } else {
                console.log('Translation: ' + body);
                res.send(body);
            }
    });
}