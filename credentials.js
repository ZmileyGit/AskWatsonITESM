exports.credentialFor= function(name) {
   var services = localCredentials;
   if(process.env.VCAP_SERVICES){
       services = JSON.parse(process.env.VCAP_SERVICES);
   }
    for (var service_name in services) {
       if (service_name.indexOf(name) === 0) {
          return services[service_name][0];
       }
    }
   return {};
};

var localCredentials = {};