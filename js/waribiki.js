var inputOperantA = document.querySelector("#operant_c");
var inputOperantB = document.querySelector("#operant_d");
var output = document.querySelector("#output2");
var error = document.querySelector("#error2");

var showError = function(){
	error.setAttribute("class", "");
};

var hideError = function(){
	error.setAttribute("class", "hidden");
};

var showResult = function(result){
	output.value = result + "";
};

var multiply = function(a, b){
	var c = 1 - b /100;
	return a * c;
};

var isNumber = function(a){
	return !Number.isNaN(a);
};

var is0to100 = function(a){
	return isNumber(a) && a >= 0 && 100 >= a;
};

var isReady = function(a, b){
	return isNumber(a) && is0to100(b);
};

var startCalc = function(){
	var operantA = inputOperantA.value;
	var operantB = inputOperantB.value;

	operantA = Number(operantA);
	operantB = Number(operantB);

	hideError();
	if(isReady(operantA, operantB)){
		var result = multiply(operantA, operantB);
		showResult(result);
	}else{
		showError();
		output.value = "NaN";
	}
};

var initApp = function(){
	var calcButton = document.querySelector("#calcButton2");

	calcButton.addEventListener("click", startCalc)
};

initApp();