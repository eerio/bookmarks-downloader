var list = document.querySelector('#bookmarklist');
var mylist = document.getElementById("mylist");
var move_btn = document.getElementById("move_btn");
var folder;


function sleep(milis) {
	var date = new Date();
	var curDate = null;
	do {
		curDate = new Date();
	} while (curDate - date < milis);
}


function zfill(topad, l) {
	return ('000' + topad).slice(-l);
}

move_btn.onclick = function() {
	// get time stamp and format it
	var curdate = new Date();
	var dt = zfill(curdate.getDate(), 		2) + '.'
		   + zfill(curdate.getMonth()+1,	2) + '.'
		   + zfill(curdate.getFullYear(),   4) + ' '
		   + zfill(curdate.getHours(), 		2) + ':'
		   + zfill(curdate.getMinutes(), 	2) + ':'
		   + zfill(curdate.getSeconds(), 	2);
		   
	// create new folder for backup
	chrome.bookmarks.create(
		{
			'parentId': "1",
			'title': 'Bookmarks backup ' + dt,
			'url': null,
		},
		function(newFolder) {
			folder = newFolder;
			console.log("added folder: " + newFolder.title);
	});
	
	// sleep 1 sec to ensure no name error will occur
	sleep(1000);
	
	chrome.bookmarks.getTree(function (bmTree) {
	bmTree.forEach( function (node){
		processNode(node);
	});
});
}

function processNode(node) {
	if (node.children) {
		// We won’t touch the root directory which has no parentId,
		// as well as the “BookmarkBar Folder” and the “Other Folder”
		// both of which have parentId as `0`. We’ll cover everything else here
		if (node.parentId && node.parentId != '0'){
			//console.log(node.title);
			// list.innerHTML += '<li>' + node.title + '(Folder)</li><ul id="' + node.id + '"></ul>';
		}
		node.children.forEach(function(child){
			processNode(child);
		});
	}
	
	if (node.url){
		if (node.parentId){
			var check = document.getElementById(node.parentId);
		}
		// If a folder exists with this id
		if (check) {
			// Add the children as a list entry under that folder
			//console.log(node.title);
			//check.innerHTML += '<li>' + node.title + '</li>';
		} else {
			chrome.bookmarks.move(
				node.id,
				{
					'parentId': folder.id, 
				}
			);
			// Add a list entry under the main list
			//console.log(node.title);
			mylist.innerHTML += '<li>' + node.title + '<br>'+node.url+ '</li>';
			//list.innerHTML += '<li>' + node.title + '</li>';
		}
	}
}