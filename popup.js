console.log("hello");
$(document).ready(function(){
  chrome.browserAction.setBadgeText({text: ""});

  $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

  var gameToSet = "";
  var limitNumber = "";
  var languagestring = "";
  var whattodo = "";
  var usernameToSet = "";


  chrome.storage.sync.get('categoryToSelect', function(result){
    gameToSet = result.categoryToSelect;
  });

  chrome.storage.sync.get('noTilesToSelect', function(result){
    limitNumber= result.noTilesToSelect;
  });

  chrome.storage.sync.get('alanguage', function(result){
    languagestring = result.alanguage;
  });

  chrome.storage.sync.get('forp', function(result){
    whattodo = result.forp;
  });

  chrome.storage.sync.get('username', function(result){
    usernameToSet = result.username;
  });


  

  var timer = 5000;
  var viewerArray = new Array;
  var timeArray = new Array;
  var k = 0;



  function getData(){
    $('#noFollowing').remove();
    var urlToSet = "/streams";
    var gamestr = "?";
    if (gameToSet != "Most Popular"){
      gamestr = gamestr.concat("game=" + gameToSet);
      gamestr = gamestr.concat("&")
    }
    urlToSet = urlToSet.concat(gamestr);
    console.log(urlToSet);

    urlToSet = urlToSet.concat("limit="+limitNumber);
    console.log(urlToSet);

    urlToSet = urlToSet.concat(languagestring);
    console.log(urlToSet)




    return $.ajax({
      type:"GET",
      //url: "https://api.twitch.tv/kraken/streams?game=Dota+2&limit=9",
      url: "https://api.twitch.tv/kraken" + urlToSet,
      //url : "https://api.twitch.tv/kraken/users/admiralbulldog/follows/channels?limit=100", //using this will get all followed
      //url : "https://api.twitch.tv/kraken/streams/pgl_dota", //use this to get if the channel is online
      //url: "https://api.twitch.tv/kraken/channels/wagamamatv/follows?direction=asc",
      headers:{
        'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
      },
    });
  }

  function handleData(data){
    console.log(data);
    $('#container').css("min-width","340px");
    for (var stream in data.streams){
      //console.log(data.streams[stream].channel.url);
      var channelLink = data.streams[stream].channel.url;
      var imageSource = data.streams[stream].channel.logo;
      if(data.streams[stream].channel.logo === null){//if the user has not set their profile picture
        imageSource = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png'
      }
      var insideText = data.streams[stream].channel.display_name;
      var viewrsText = data.streams[stream].viewers;
      var codeStr = "<a href=\"" + channelLink + "\"><div class=\"tile\"><img src=\"" + imageSource + "\"><p class=\"text\">" + insideText + "</p></div></a>";
      $("#container").append(codeStr);
      $(".tile").hover(function(){
        $(this).css({"border-radius": "25%"});
        $(this).find('img').css({"border-radius": "25%", "opacity":"1", "z-index":"100"});
        $(this).parent().find('.text').css({"opacity":"1"});
        //console.log($(this).find(".views"));
      },function(){
        $(this).css({"border-radius": "50%"});
        $(this).find('img').css({"border-radius": "50%", "opacity":"0.75", "z-index":"0"});
        $(this).parent().find('.text').css({"opacity":"0"});
      });
    }


    $('h3').append(gameToSet.replace(/\+/g," "));
  }


  

  function getData2(){
    console.log("https://api.twitch.tv/kraken/users/" + usernameToSet + "/follows/channels?limit=100");
    if (usernameToSet == ""){
      $('#noFollowing').css("visibility","visible").html("Please right click on the extension icon and select options to input your username.");

    }
    return $.ajax({
      type:"GET",
      //url: "https://api.twitch.tv/kraken/streams?game=Dota+2&limit=9",
      url : "https://api.twitch.tv/kraken/users/" + usernameToSet + "/follows/channels?limit=100", //using this will get all followed
      //url : "https://api.twitch.tv/kraken/streams/pgl_dota", //use this to get if the channel is online
      //url: "https://api.twitch.tv/kraken/channels/wagamamatv/follows?direction=asc",
      headers:{
        'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
      },
    });
  }

  var followingArray = new Array;

  function handleData2(data){
    console.log(data);
    $('h3').append("Following");
    followingArray = [];
    for(var i in data.follows){
      var usernameGot = (data.follows[i].channel.url).split('twitch.tv/')[1];
      //console.log((data.follows[i].channel.url).split('twitch.tv/')[1]);
      followingArray.push(usernameGot);
      getData3(usernameGot).done(handleData3);
    }
  }




  function getData3(username){
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


var counter =0;
var flagasdf = true;

  function handleData3(data){    
    if(data.stream != null){
      //console.log(data);
      $('#noFollowing').remove();
      counter = counter + 1;
      if (counter==1){
        $('#container').css("min-width","110px");
      } else if (counter < 9){
        $('#container').css("min-width","220px");
      } else{
        $('#container').css("min-width","340px");
      }

      var channelLink = data.stream.channel.url;
      //console.log(data.stream.channel.url);
      var imageSource = data.stream.channel.logo;
      if(imageSource === null){
        imageSource = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png'
      }
      var insideText = data.stream.channel.display_name;
      var codeStr = "<a href=\"" + channelLink + "\"><div class=\"tile\"><img src=\"" + imageSource + "\"><p class=\"text\">" + insideText + "</p></div></a>";
      //console.log(codeStr);
      $("#container").append(codeStr);
      $(".tile").hover(function(){
        $(this).css({"border-radius": "25%"});
        $(this).find('img').css({"border-radius": "25%", "opacity":"1", "z-index":"100"});
        $(this).parent().find('.text').css({"opacity":"1"});
        //console.log($(this).find(".views"));
      },function(){
        $(this).css({"border-radius": "50%"});
        $(this).find('img').css({"border-radius": "50%", "opacity":"0.75", "z-index":"0"});
        $(this).parent().find('.text').css({"opacity":"0"});
      });

      

    }
    if (counter == 0){ // should this be -1 or not?
      $('#container').css("min-width","220px");
      $('#noFollowing').css("visibility","visible");
    }
  }

  


  setTimeout(function(){
    //console.log(whattodo);
    if(whattodo == true){
      getData2().done(handleData2);
    } else {
      getData().done(handleData);
    }
  }, 25);

});