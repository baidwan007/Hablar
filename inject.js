(function() {

	// just place a div at top right
	try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var noteContent = '';
var month_map={"January":"01","February":"02","March":"03","April":"04","May":"05","June":"06","July":"07","August":"08","September":"09","October":"10","November":"11","December":"12"};
/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
 
  var transcript = event.results[current][0].transcript;
  console.log(transcript)
  var arr=transcript.split(" ")
  if(arr[0]=="flights" || arr[0]=="flight"){
    var fromIndex=arr.indexOf("from");
    var toIndex=arr.indexOf("to")
    var onIndex=arr.indexOf("on")
    var retIndex=arr.indexOf("returning")
    var src=arr[fromIndex+1];
    var destination=arr[toIndex+1]
    var on=arr[onIndex+1].slice(0,2);
    var ret=arr[retIndex+1].slice(0,2);
    var onmonth=month_map[arr[onIndex+2]];
    var retmonth=month_map[arr[retIndex+2]];
    var onDate=on+"/"+onmonth+"/2018";
    var retDate=ret+"/"+retmonth+"/2018";
    console.log(src,destination,onDate,retDate)
    document.getElementById("flight-origin-flp").value=src;
    document.getElementById("flight-destination-flp").value=destination;
    document.getElementById("flight-departing-flp").value=onDate;
    document.getElementById("flight-returning-flp").value=retDate;
    document.getElementsByClassName("gcw-submit")[0].click();
  }
  if(arr[0]=="hotels"){
    var len=arr.length;
    var key=arr[len-1];
    var url="https://www.expedia.com.sg/Hotel-Search?destination="+key;
    window.location.href=url;
  }
  if(arr[0]=="switch"){
    var len=arr.length;
    var key=arr[len-1];
    var url="https://www.expedia.com.sg/Hotel-Search?destination="+key;
    console.log(url)
    window.location.href=url;
  }
  if(arr[0]=="what"){
    var inIndex=arr.indexOf("in");
    var place=arr[inIndex+1];
    var url="https://www.expedia.com.sg/things-to-do/search?location="+place;
    window.location.href=url;
  }
  if(arr[0]=="remind"){
  	var inIndex=arr.indexOf("to");
  	var len=arr.length;
  	var place=arr.slice(inIndex,len-1);
  	var str=place.toString();
  	var url="https://3254cda5.ngrok.io/sms/add/?id=10";
  	var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("success");
    }
};
var data = JSON.stringify({"str": str});
xhr.send(data);
  }
  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    console.log("in mobile bug");
  }
};

recognition.onstart = function() { 
  console.log('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  console.log('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    console.log('No speech was detected. Try again.');  
  };
}

recognition.start();







})();