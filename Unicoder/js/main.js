var textBox = document.getElementById('OriginalText');
var convertedBox = document.getElementById('ConvertedText');
var ConversionProcess = textBox.value;

var object1 = {
  transform1: lowerCase,
  transform2: upperCase,
  transform3: convertToSentenceCase
};

function ConversionTrigger(){
	
	var checked = check();
	
	checked.forEach(optId => {
		// object1['transform1']()
		console.log('optId = ', optId);
		object1[optId]();
	});
	
	document.getElementById("ConvertedText").innerHTML = ConversionProcess;
}

function check() {
    var boxCheck = document.querySelectorAll("input[type='checkbox']");
	var radioCheck = document.querySelectorAll("input[type='radio']");
	var i=0;
	var StoreCheckStatus = [];
	
	radioCheck.forEach(element => {
		if(element.checked){
			StoreCheckStatus.push(element.id);
		}
	});
	
	while (i < boxCheck.length) {
		var x = boxCheck[i];
		if(x.checked){
			StoreCheckStatus.push(x.id);
		}
		i++;
	}
	return StoreCheckStatus;

}

function lowerCase(){
	//console.log(ConversionProcess.toLowerCase());
	//alert(textBox.value);
	var x=textBox.value;
	
	document.getElementById('ConvertedText').value = x.toLowerCase();
}
function upperCase(){
	var x=textBox.value;
	
	document.getElementById('ConvertedText').value = x.toUpperCase();
}


function firstLetterUpper(valueToFormat) {
	var formattedString = valueToFormat.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){return c.toUpperCase()});
	return formattedString;
}

function convertToSentenceCase() {
  var inputTextValue = textBox.value;
  var convertedValue = firstLetterUpper(inputTextValue);
  //console.log("Converted: "+newString);
  document.getElementById('ConvertedText').value = convertedValue;
}
