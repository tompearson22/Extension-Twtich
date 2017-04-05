$(document).ready(function(){
	var i = 0;
	var j = 0;
	var namearr = [];
	var currentarr = [];
	var oldarr = [];

	chrome.storage.sync.get('username', function(result){
    	username = result.username;
  	});

  	chrome.storage.sync.get('enableNotificationalerts', function(result){
    	enabled = result.enableNotificationalerts;
  	});


	chrome.notifications.onClicked.addListener(function(OnlineNotification){
		chrome.tabs.create({url: OnlineNotification});
		chrome.notifications.clear(OnlineNotification);
	});




	function getData5(){		
	    return $.ajax({
	      type:"GET",
	      url : "https://api.twitch.tv/kraken/users/" + username +"/follows/channels?limit=100", //using this will get all followed
	      headers:{
	        'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
	      },
	      timeout: 4000
	    });
	  }
	function handleData5(data){
		for(i = 0; i<data.follows.length; i++){
	    	var usernameGot = (data.follows[i].channel.url).split('twitch.tv/')[1];
	        namearr.push(usernameGot);
	        console.log(usernameGot);
	    } 
	}







	//have to add a delay before getting the usernames because it takes time to get the username variable from storage
	setTimeout(function(){
		getData5().done(handleData5);
	},500);


	//at this point the usernames are now in the array namearr
	var j = 0;
	setTimeout(function(){
		//initialise the old array to true, this is so when started up the program will not count streams initially online
		for (var a = 0; a < namearr.length; a++){
			oldarr[a] = true;
		}

		//this should reset the old array after the computer has been locked (sleep)
		//this is so the channels that come online during the sleep are not notified
		//not sure if this will work, locked is the right state?
		chrome.idle.onStateChanged.addListener(function(state){
			if (state == 'locked'){
				for (var a = 0; a < namearr.length; a++){
					oldarr[a] = true;
				}
			}
		});



		setInterval(function(){
			//console.log(namearr[j]);
			getData6(namearr[j]).done(handleData6);
		},2500);
	},1000);










    function getData6(username){
		return $.ajax({
  		type:"GET",
  		url : "https://api.twitch.tv/kraken/streams/" + username, //use this to get if the channel is online
  		headers:{
    		'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
  		},
  		timeout: 2400
		});
  	}
    function handleData6(data){   
    	//console.log(data);
    	if(data.stream !== null){
    		currentarr[j] = true;
    	} else{
    		currentarr[j] = false;
    	}
    	//console.log(currentarr[j]);

    	if (currentarr[j] === true && oldarr[j] === false){
    		console.log(namearr[j] + "just came online");
    		if (enabled == true){
	    		var opt = {
	    			type: "basic",
	    			title: "Online",
	   				message: namearr[j] + " just came online!",
	    			iconUrl: data.stream.channel.logo
	  			} 
	  			chrome.notifications.create(data.stream.channel.url, opt);
    		}
    	}
    	oldarr[j] = currentarr[j];
    	j++;
		if(j === namearr.length){
			j = 0;
		}
  	}
	







});