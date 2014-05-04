var dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
var input = document.querySelector("#input");
var output = document.querySelector("#output");

var board = {};

/*
 * 1件のメッセージの表示に関する関数
 */

/**
 * 曜日を漢字に変換
 * @param {integer} dow - 曜日を表す番号
 */
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

var createTimestampView = function(date){
	var timestamp = document.createElement("span");
	timestamp.setAttribute("class", "timestamp");

	timestamp.textContent = formatDate(date);
	return timestamp;
};

var createDeleteFunctionOf = function(message, view){
	var func = function(){
		removeMessage(message);
		view.parentNode.removeChild(view);
	};
	return func;
};

var createDeleteButton = function(message, view){
	var button = document.createElement("button");
	button.setAttribute("type", "button");
	button.textContent = "x";
	button.addEventListener("click", createDeleteFunctionOf(message, view));
	return button;
};

var createMessageView = function(message){
	var view = document.createElement("li");

	var msg = document.createElement("span");
	msg.setAttribute("class", "message");
	msg.textContent = message.text;

	var timestamp = createTimestampView(message.timestamp);

	var deleteButton = createDeleteButton(message, view);

	view.appendChild(msg);
	view.appendChild(timestamp);
	view.appendChild(deleteButton);

	return view;
};

/*
 * メッセージオブジェクトの作成
 */
var getMessageID = function(){
	board.id = board.id + 1;
	return board.id;
};

var buildMessage = function(text){
	var product = {
		id: getMessageID(),
		text: text,
		timestamp: new Date()
	};
	return product;
};


/*
 * 掲示板全体に関する関数
 */
var addMessage = function(message){
	board.messages[message.id] = message;
	storeBoardState();
};

var removeMessage = function(message){
	delete board.messages[message.id];
	storeBoardState();
}

var registerMessage = function(){
	if(input.value.length > 0){
		var message = buildMessage(input.value);

		addMessage(message);

		var view = createMessageView(message)
		output.appendChild(view);
	}
};

var isValidBoardState = function(data){
	return data.id != null && data.messages != null;
};

var initializeBoardState = function(){
	board = {
		id: 1,
		messages:{}
	};
};

var restoreView = function(){
	var idList = Object.keys(board.messages);
	if(idList != null && idList.length > 0){
		idList.sort(function(a, b){
			return a - b;
		});
		var index = 0;
		while(index < idList.length){
			var id = idList[index];
			output.appendChild(createMessageView(board.messages[id]));
			index = index + 1;
		}
	}
};

var storeBoardState = function(){
	localforage.setItem("board", board);
};

var restoreBoardState = function(){
	localforage.getItem("board", function(data){
		if(isValidBoardState(data)){
			board = data;
			restoreView();
		}else{
			initializeBoardState();
		}
	});
};

var init = function(){
	var registerMessageButton = document.querySelector("#registerMessage");
	registerMessageButton.addEventListener("click",registerMessage);

	restoreBoardState();
};

init();
