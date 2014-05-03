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
	date.getHours() + ":" + date.getMinutes();

	return string;
};

var getTimestamp = function(){
	var now = new Date();
	var timestamp = document.createElement("span");

	timestamp.textContent = formatDate(now);
	return timestamp;
};

var registerMessage = function(){
	var message = document.createElement("li");
	message.setAttribute("class", "message");

	if(input.value.length > 0){
		message.textContent = input.value;
		message.appendChild(getTimestamp());
		output.appendChild(message);
	}
};

var registerMessageButton = document.querySelector("#registerMessage");

registerMessageButton.addEventListener("click",registerMessage);
