
var labels = timeline._labels;
var text = '';
for (var label in labels) {
	text += '<button onclick="timeline.seek(\''+label+'\').pause()">'+label+'</button>';
}

document.body.innerHTML += text;