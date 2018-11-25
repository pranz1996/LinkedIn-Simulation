var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var applicantLogin = require('./services/applicantLogin');
var updateProfile = require('./services/updateProfile');
var addExperience = require('./services/addExperience');
var addEducation = require('./services/addEducation');
var profilePhoto = require('./services/uploadProfile');
var profileDisplay = require('./services/displayProfile');
var addSkills = require('./services/addSkills');


function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("applicantLoginCheck",applicantLogin)
handleTopicRequest("profile_update",updateProfile)
handleTopicRequest("add_experience",addExperience)
handleTopicRequest("add_education",addEducation)
handleTopicRequest("profilePhoto_upload",profilePhoto)
handleTopicRequest("user_profile_display",profileDisplay)
handleTopicRequest("add_skill",addSkills)