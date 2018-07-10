var network = function(app){
	this.app = app;

	this.get = function(url, successCallback, errorCallback){
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onload = function() {
		    if (request.status === 200) {
		    	successCallback(JSON.parse(request.responseText));
		    }
		    else {
		    	errorCallback(request.status);
		    }
		};
		request.send();
	}

	this.loadImage = function(imageUrl, successCallback, errorCallback){
		var img = new Image();
        img.onload = function(){
            successCallback(img);
        }
        img.onerror = function(){
            errorCallback();
        }
        img.src = imageUrl;
	}
}


var ui = function(app){

	this.app = app;

	var self = this;

	this.getElement = function(elementId){
		return document.getElementById(elementId);
	}

	this.show = function(elementId){
		this.getElement(elementId).style.display = 'block';
	}

	this.hide = function(elementId){
		this.getElement(elementId).style.display = 'none';
	}

	this.setScene = function(sceneName){
		// Get then hide all elements have class .scene
		var elements = document.getElementsByClassName('scene');

		[].forEach.call( elements, function(element) {
			element.style.display = 'none';
		});
		// Then show element has id screenName
		this.show(sceneName);
	}

	this.showImage = function(image){
		this.getElement('imageWrapper').innerHTML = '';
		this.getElement('imageWrapper').appendChild(image);
	}

	this.listenEvents = function(){
		this.getElement('startButton').addEventListener('click', function(){
			self.app.start();
		});
		this.getElement('image').addEventListener('click', function(){
			self.app.showQuestion();
		});
	}
}

var app = function(){
	this.ui      = new ui(this);
	this.network = new network(this);
	this.data    = [];
	this.level   = 0;

	var self = this;

	this.init = function(){
		this.ui.setScene('welcome');
		this.ui.listenEvents();
		this.loadData();
	}

	this.loadData = function(){
		this.network.get(
			'https://buivannguyen.com/girl_question_app_data.json',
			function(data){
				self.data = data;
				console.log(self.data);
				self.ui.hide('loadingText');
				self.ui.show('startButton');
			},
			function(error){
				alert(error);
			}
		)
	}

	this.loadImage = function(){
		this.ui.show('imageLoading');
		this.network.loadImage(
			'https://s0.2mdn.net/5585042/1-17_728x90TC_2017_2_2.jpg',
			function(image){
				self.ui.hide('imageLoading');
				self.ui.showImage(image);
			}
		);
	}

	this.start = function(){
		this.ui.setScene('image');
		this.loadImage();
	}

	this.showQuestion = function(){
		this.ui.setScene('question');
	}
	
}

window.onload = function(){
	var girlPuzzle = new app();
	girlPuzzle.init();
}