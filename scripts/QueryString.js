var Request = 
{
	QueryString : (function()
	{
		var qs = decodeURIComponent(location.search).substring(1).split('&');
		var arr = [];

		for (var i = 0; i < qs.length; i++)
		{
			veq = qs[i].split('=');
			if(veq.length == 2) arr[veq[0]] = veq[1].replace(/\+/g, " ");
		}
		return arr;
	})()
};
