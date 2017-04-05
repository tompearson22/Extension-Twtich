$(document).ready(function(){

  function getData(){
    return $.ajax({
      type:"GET",
      url: "https://api.twitch.tv/kraken/games/top",
      headers:{
        'Client-ID': '8gfddwc3a1ybtp1htery7sr96ov8z8'
      },
    });
  }


  function handleData(data){
    console.log(data)
    for(i in data.top){
      var gamestr = data.top[i].game.name.replace(/ /g,"+");
      var optionStr = "<option value=" + gamestr + ">" + data.top[i].game.name + "</option>";
      $('#category').append(optionStr);
    }
  }

  getData().done(handleData);







  //to set the default values
  chrome.storage.sync.get({
    categoryToSelect: 'dota+2',
    noTilesToSelect: 9,
    alanguage: '',
    forp: true,
    username: '',
    enableNotificationalerts:true
  }, function(items){
    $('#category').val(items.categoryToSelect);
    $('#numberOfTiles').val(items.noTilesToSelect);
    $('#language').val(items.alanguage);
    $('#usernameField').val(items.username);
    $('#enableNotifications').prop("checked",items.enableNotificationalerts);
    $('input[name=option][value=following]').prop("checked",(items.forp));
    $('input[name=option][value=popular]').prop("checked",(!items.forp));
  });


  //to write the preferences when save is pressed
  $("#save").click(function(){
    var cat = $('#category').val();
    var num = $('#numberOfTiles').val();
    var langaugeSelected =  $('#language').val();
    if ($('input[name=option][value=following]').is(':checked')){
      var toset = true;
    } else {
      var toset = false;
    }
    //var toset = $('input[name=option]:checked').val();
    var usernameToInput = $('#usernameField').val();
    var enabled = $('#enableNotifications').is(':checked');
    //console.log(toset);
    chrome.storage.sync.set({
      categoryToSelect: cat,
      noTilesToSelect: num,
      alanguage: langaugeSelected,
      forp: toset,
      username: usernameToInput,
      enableNotificationalerts: enabled
    }, function(){
      $('#status').css({opacity: 1}).animate({opacity:0.0},1000);
    });
  });


  $('#usernameField').keypress(function(e){
    if(e.keyCode==13)
    $('#save').click();
  });


});