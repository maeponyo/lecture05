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
 * @returns {string} 曜日の漢字表現
 */
var getDayOfWeekLabel = function(dow){
	return dayOfWeek[dow];
};

/**
 * 日付をフォーマットする
 * @param {Date} date - フォーマット対象の日付
 * @returns {string} フォーマットされた日付
 */
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

/**
 * タイムスタンプをHTML要素にする
 * @param{Date} date - タイムスタンプ
 * @returns{HTMLElement} タイムスタンプのHTML要素表現
 */
var createTimestampView = function(date){
	var timestamp = document.createElement("span");
	timestamp.setAttribute("class", "timestamp");

	timestamp.textContent = formatDate(date);
	return timestamp;
};

/**
 * 削除ボタンを押したときに実行される関数を作る
 * @param{Message} message - 削除対象のメッセージオブジェクト
 * @param{HTMLElement} view - 削除するHTML要素
 * @returns{Function} 削除ボタンを押したときに実行される関数
 */
var createDeleteFunctionOf = function(message, view){
	var func = function(){
		removeMessage(message);
		view.parentNode.removeChild(view);
	};
	return func;
};

/**
 * 削除ボタンを作成する関数
 * @param{Message} message - 削除対象のメッセージオブジェクト
 * @param{HTMLElement} view - 削除するHTML要素
 * @returns{HTMLElement} 削除ボタン
 */
var createDeleteButton = function(message, view){
	var button = document.createElement("button");
	button.setAttribute("type", "button");
	button.textContent = "x";
	button.addEventListener("click", createDeleteFunctionOf(message, view));
	return button;
};

/**
 * メッセージオブジェクトを表示するためのHTML要素を作成する関数
 * @param{Message} message - 表示するメッセージオブジェクト
 * @returns{HTMLElement} メッセージのビュー
 */
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

/**
 * メッセージのシリアル番号を取得する関数
 * returns{integer} メッセージのシリアル番号
 */
var getMessageID = function(){
	board.id = board.id + 1;
	return board.id;
};

/**
 * メッセージオブジェクトを作成する関数
 * @param{string} text - メッセージ本文
 * @returns{Message} 作成されたメッセージオブジェクト
 */
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

/**
 * 掲示板にメッセージオブジェクトを追加する関数
 * @param{Message} message - 追加するメッセージオブジェクト
 */
var addMessage = function(message){
	board.messages[message.id] = message;
	storeBoardState();
};

/**
 * 掲示板からメッセージオブジェクトを削除する関数
 * @param{Message} message - 削除するメッセージオブジェクト
 */
var removeMessage = function(message){
	delete board.messages[message.id];
	storeBoardState();
}

/**
 * テキスト入力欄に入力された文字列からメッセージオブジェクトを作り、登録する関数
 */
var registerMessage = function(){
	if(input.value.length > 0){
		var message = buildMessage(input.value);

		addMessage(message);

		var view = createMessageView(message)
		output.appendChild(view);
	}
};

/**
 * 与えられたデータが掲示板の状態を正しく保存しているかどうかを確認する関数
 * @param{Object} data - 検査対象のオブジェクト
 * @returns{Boolean} 状態が正しく保存されている場合はtrue、そうでない場合はfalse
 */
var isValidBoardState = function(data){
	return data.id != null && data.messages != null;
};

/**
 * 掲示板の状態を初期化する関数
 */
var initializeBoardState = function(){
	board = {
		id: 1,
		messages:{}
	};
};

/**
 * 画面表示をもとに戻す関数
 */
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

/**
 * 掲示板の状態を保存する関数
 */
var storeBoardState = function(){
	localforage.setItem("board", board);
};

/**
 * 保存された掲示板の状態をロードし、ページの表示をもどす関数
 */
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

/**
 * アプリの初期化
 */
var init = function(){
	var registerMessageButton = document.querySelector("#registerMessage");
	registerMessageButton.addEventListener("click",registerMessage);

	restoreBoardState();
};

init();
