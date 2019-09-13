var list = document.querySelector('#bookmarklist');
var mylist = document.getElementById("mylist");

chrome.bookmarks.getTree(function (bmTree) {
	bmTree.forEach( function (node){
		processNode(node);
	});
});

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
			// Add a list entry under the main list
			//console.log(node.title);
			mylist.innerHTML += '<li>' + node.title + '</li>';
			//list.innerHTML += '<li>' + node.title + '</li>';
		}
	}
}