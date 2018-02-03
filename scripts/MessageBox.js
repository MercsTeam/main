var MessageType = 
{
	"ALERT":0,
	"CONFIRM":1
};

/*
	replaces native Javascript alert and confirm dialogs
	@param box - HTML container element for message box
	@param type - ALERT_TYPE or CONFIRM_TYPE
*/
function MessageBox(box, type)
{
	var mBox = this;

	mBox.type = (type || MessageType.ALERT);

	mBox.parent = box.parentElement;
	mBox.setVisibility = function(value) { this.parent.style.visibility = (value ? "visible" : "hidden"); };
	
	mBox.hide = function() { mBox.setVisibility(false); };

	mBox.btnClose = box.getElementsByTagName('button')[0];
	mBox.btnClose.onclick = function()
	{
		mBox.container.setVisibility(false);
	};
	mBox.btnClose.setVisibility = function(value) { this.style.display = (value ? "inline" : "none"); };

	mBox.btnOk = box.getElementsByTagName('button')[1];

	mBox.btnNo = box.getElementsByTagName('button')[2];
	mBox.btnNo.setVisibility = function(value) { this.style.display = (value ? "inline" : "none"); };
	
	mBox.title = box.getElementsByTagName('span')[0];

	mBox.message = box.getElementsByTagName('div')[1];
	mBox.message.set = function(text) { this.innerHTML = text; };

	mBox.show = function(text, callbackOk, callbackNo)
	{
		mBox.setVisibility(true);			
		mBox.message.set(text.replace(/\n/g, "<br />"));

		mBox.btnClose.setVisibility(mBox.type == MessageType.ALERT);		
		mBox.btnNo.setVisibility(mBox.type != MessageType.ALERT);

		mBox.btnOk.value = (mBox.type == MessageType.ALERT ? "Ok" : "Yes");
		mBox.btnOk.focus();
		
		mBox.btnOk.onclick = (typeof callbackOk == "function" ? callbackOk : mBox.hide);
		mBox.btnNo.onclick = (typeof callbackNo == "function" ? callbackNo : mBox.hide);
	};
}