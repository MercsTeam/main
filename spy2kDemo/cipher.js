var curCipher = "caesar";

// Define the low-level Cipher constructor
function Cipher() 
{
	this.purify = purify;
	this.chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
}

// Define the purify method, common to all Cipher objects
function purify(rawText) 
{
	if (!rawText) return false;
	
	var cleanText = rawText.toLowerCase();
	cleanText = cleanText.replace(/\s+/g, " ");
	cleanText = cleanText.replace(/[^a-z0-9\s]/g, "");
	
	if(cleanText.length == 0 || cleanText.match(/^\s+$/) != null) return false;
	return cleanText;
}

// Define the SubstitutionCipher constructor, a more specific version of the Cipher object
function SubstitutionCipher(name, algorithm) 
{
	this.name = name;
	this.substitute = substitute;
	this.algorithm = algorithm;
}
SubstitutionCipher.prototype = new Cipher();

// Define the shift algorithm common to each SubstitutionCipher 
function substitute(baseChar, shiftIdx, action) 
{
	if (baseChar == " ") return baseChar;
	
	if(action) 
	{
		var shiftSum = shiftIdx + this.chars.indexOf(baseChar);
		return (this.chars.charAt((shiftSum < this.chars.length) ? shiftSum : (shiftSum % this.chars.length)));
	}
	else 
	{
		var shiftDiff = this.chars.indexOf(baseChar) - shiftIdx;
		return (this.chars.charAt((shiftDiff < 0) ? shiftDiff + this.chars.length : shiftDiff));
	}
}

// Define a specific shift implementation for Caesar
function caesarAlgorithm (data, action) 
{
	data = this.purify(data);
	if(!data) 
	{ 
		alert("No valid text to " + (action ? "cipher." : "decipher."));
		return false;
	}

	var shiftIdx = offset; //document.forms[0].shift.valueAsNumber;
	var cipherData = "";
	for (var i = 0; i < data.length; i++) 
	{
		cipherData += this.substitute(data.charAt(i), shiftIdx, action);
	}
	return cipherData;
}

// Define a specific shift implementation for Vigenere
function vigenereAlgorithm (data, action) 
{
	data = this.purify(data);
	if(!data) 
	{ 
		alert("No valid text to " + (action ? "cipher." : "decipher."));
		return false;
	}
	var keyword = document.forms[0].keyword.value;
	if(!keyword || keyword.match(/\^s+$/) != null) 
	{ 
		alert("No valid keyword for " + (action ? "ciphering." : "deciphering."));
		return false;
	}
	keyword = keyword.replace(/\s+/g, "");
	
	var keywordIdx = 0;
	var cipherData = '';
	for (var i = 0; i < data.length; i++) 
	{
		shiftIdx = this.chars.indexOf(keyword.charAt(keywordIdx));
		cipherData += this.substitute(data.charAt(i), shiftIdx, action);
		keywordIdx = (keywordIdx == keyword.length - 1 ? 0 : keywordIdx + 1);
	}
	return cipherData;
}

// Instantiate an object for each type of SubstitutionCipher
var cipherArray = 
[
	new SubstitutionCipher("caesar", caesarAlgorithm), 
	new SubstitutionCipher("vigenere", vigenereAlgorithm)
];

// Manage the cipher description display
function showCipher(name) 
{
	document.querySelector("#" + curCipher).hidden = true;
	document.querySelector("#" + name).hidden = false;
	curCipher = name;
}

// Define a function to encipher or decipher according to the selectedIndex of the Ciphers SELECT list
function routeCipher(action) 
{	
	var cipherIdx = 0;
	var data = cipherText;

	var response = cipherArray[cipherIdx].algorithm(data, action);
	if(response) 
	{ 
		document.querySelector("#message").innerHTML = response;
	}
}