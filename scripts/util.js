String.prototype.equals = function(value) { return this == value; };
String.prototype.equalsIgnoreCase = function(value) { return this.toLowerCase() == value.toLowerCase(); };
String.prototype.contains = function(value) { return this.indexOf(value) != -1; };
String.prototype.startsWith = function(value) { return this.indexOf(value) == 0 };

Number.prototype.between = function(x,y) { return (this >= x && this <= y); };
Number.prototype.isEven = function() { return this != 0 && this % 2 == 0; };
Number.prototype.clamp = function(min,max) { return clamp(this,min,max); };
Number.isInteger = Number.isInteger || function(value) 
{
	return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

function clamp(value, min, max) { return Math.max(Math.min(value, max), min); };

function getXmlHttpObject()
{
	var xmlHttp = null;
	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	}
	catch (e)
	{
		//Internet Explorer
		try
		{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
} 

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt)
	{
		var arrlen = this.length;

		var from = (Number(arguments[1]) || 0);
		from = (from < 0 ? Math.ceil(from) : Math.floor(from));

		if (from < 0) from += arrlen;

		for (; from < arrlen; from++)
		{
			if (from in this && this[from] === elt) return from;
		}
		return -1;
	};
}
Array.prototype.contains = function(value) { return this.indexOf(value) != -1; };

if (!String.prototype.trim) 
{
	String.prototype.trim = function()
	{
		return this.replace(/^\s+|\s+$/g, '');
	};
}

var string =
{
	"format" : function()
	{
		var formatted = arguments[0];
		for (var i = 1; i < arguments.length; i++) 
		{
			var regexp = new RegExp('\\{'+ (i-1) +'\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;
	}
};

var ExportType = 
{
	CSV		: { ext : ".csv", delimit : { col : ",", line : "\\n" }, mimeType : "text/csv", encoding : "utf-8" },
	EXCEL	: { ext : ".xls", delimit : { col : "\\t", line : "\\n\\r" }, mimeType : "application/vnd.ms-excel", encoding : "utf-8" }
};
