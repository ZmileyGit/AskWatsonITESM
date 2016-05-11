var qa_endpoint = {
    url : 'https://dal09-gateway.watsonplatform.net/instance/582/deepqa/v1/question',
    username : 'udem_student9',
    password : 'p6qheMQn'
};

exports.ask = function(req, res) {
        
	qin = (req.body).question;	
        qText = qin.replace(/[^\x00-\x7F]|"|\n|\r|\n\r/g, "").trim();
        
        
	console.log('Question Asked: ' + qText);
		
	var question = "{\"question\" : { \"questionText\" : \"" + qText + "\"}}";
	console.log("question: " + question);
	require("request")({
		uri : qa_endpoint.url,
		method : "POST",
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json',
			'X-SyncTimeout' : '30'
		},
		auth : {
			user : qa_endpoint.username,
			pass : qa_endpoint.password
		},
		rejectUnauthorized: false,
		requestCert: true,
		agent: false,
		body: question
	}, function(error, response, body) {
		console.log("resp: " +JSON.stringify(body));
		res(body);
	});
};
