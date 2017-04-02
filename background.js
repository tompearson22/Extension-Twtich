$(document).ready(function(){
	var current = 0;
	var old = 0;
	var flag = true;

	chrome.storage.sync.get('username', function(result){
    	username = result.username;
  	});
	
	setInterval(function() {

		var i = 0;

		function getData5(){
			if(flag == true){
				flag = false;
			} else {
				flag = true;
			}
			if ((current>old && old != 0) || (current == 1 && old == 0)){
	    		chrome.browserAction.setBadgeText({text: "!"});
	    	}	
			console.log(flag);
	    return $.ajax({
	      type:"GET",
	      //url: "https://api.twitch.tv/kraken/streams?game=Dota+2&limit=9",
	      url : "https://api.twitch.tv/kraken/users/" + username +"/follows/channels?limit=100", //using this will get all followed
	      //url : "https://api.twitch.tv/kraken/streams/pgl_dota", //use this to get if the channel is online
	      //url: "https://api.twitch.tv/kraken/channels/wagamamatv/follows?direction=asc",
	      headers:{
	        'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
	      },
	    });
	  }


	  function handleData5(data){
	    //console.log(data);
	    
	    for(var i in data.follows){
	      var usernameGot = (data.follows[i].channel.url).split('twitch.tv/')[1];
	      //console.log((data.follows[i].channel.url).split('twitch.tv/')[1]);
	      getData6(usernameGot).done(handleData6)
	      
	    }

	    
	  }


	  function getData6(username){
    	return $.ajax({
      	type:"GET",
      	//url: "https://api.twitch.tv/kraken/streams?game=Dota+2&limit=9",
      	//url : "https://api.twitch.tv/kraken/users/admiralbulldog/follows/channels?limit=100", //using this will get all followed
      	url : "https://api.twitch.tv/kraken/streams/" + username, //use this to get if the channel is online
      	//url: "https://api.twitch.tv/kraken/channels/wagamamatv/follows?direction=asc",
      	headers:{
        	'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
      	},
    	});
      }


      function handleData6(data){    
	    if(data.stream != null){
	    	console.log("stream had something in");
	    	i = i+1;
	    	checkState(i);
	    }
  	}

  	function checkState(asdf){
  		if (flag == true){
  			current = asdf;
  		} else {
	    	old = current;
  		}
	    console.log(current);
	    console.log(old);
  	}

	  	


	  getData5().done(handleData5);

  }, 60000);

});