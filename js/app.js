var dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
var input = document.querySelector("#input");
var output = document.querySelector("#output");

var getDayOfWeekLabel = function(dow){
	return dayOfWeek[dow];
};

var formatDate = function(date){
	var string = "";

	string = date.getFullYear() + "年" +
	date.getMonth() + "月" +
	date.getDate() + "日" +
	"（" + getDayOfWeekLabel(date.getDay()) + "）" +
	date.getHours() + ":";

	if(date.getMinutes() > 10){
		string = string + date.getMinutes();
	}else{
		string = string + "0" + date.getMinutes();
	}

	return string;
};

var getTimestamp = function(){
	var now = new Date();
	var timestamp = document.createElement("span");

	timestamp.textContent = formatDate(now);
	return timestamp;
};

var createMessageElement = function(message){
	var elm = document.createElement("li");
	elm.setAttribute("class", "message");
	elm.textContent = message;
	elm.appendChild(getTimestamp());
	return elm;
}

var registerMessage = function(){
	if(input.value.length > 0){
		var message = createMessageElement(input.value)
		output.appendChild(message);
	}
};

var registerMessageButton = document.querySelector("#registerMessage");

registerMessageButton.addEventListener("click",registerMessage);
