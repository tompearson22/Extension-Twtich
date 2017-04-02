$(document).ready(function(){
	

	var timer = 5000;
	var viewerArray = new Array;
	var timeArray = new Array;
	var k = 0;

	function getData(){
		return $.ajax({
			type:"GET",
			url: "https://api.twitch.tv/kraken/streams?game=Dota+2&limit=10",
			headers:{
				'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
			},
		});
	}
	var str;

	function handleData(data){
		console.log(data);
		//console.log(k);
		k = k + 1;
		$("div").html("");
		viewerArray.push(data.streams[0].viewers);
		timeArray.push(k*timer/1000);
		for (i=0;i<data.streams.length; i++){
			str = data.streams[i]._links.self.split("/streams/").pop();
			$("div").append("<p>" + str + " has " + data.streams[i].viewers + " viewers</p>");
		}
		if (k%10 === 0){
			for(j=0; j<viewerArray.length; j++){
				console.log(timeArray[j] + " seconds " + viewerArray[j]);
			}	
		}
	}


	window.setInterval(function(){
		getData().done(handleData);
		
		
	},timer);
});
