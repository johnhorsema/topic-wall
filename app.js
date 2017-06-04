var app = angular.module("topicWall", ['ngRoute', 'firebase']);
app
    .config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/tnc', {
            templateUrl: 'tnc.html',
            controller: null
        })
        .when('/privacy', {
            templateUrl: 'privacy.html',
            controller: null
        })
        .when('/', {
            templateUrl: 'home.html',
            controller: 'counterCtrl as ctrl'
        })
        .when('/:room', {
            templateUrl: 'home.html',
            controller: 'counterCtrl as ctrl'
        });
        $locationProvider.html5Mode(true);
    }])
    .controller("counterCtrl", function($scope, $timeout, $location, $routeParams, $firebaseArray) {
        const WIDTH = 4;
        this.name = "Topic Wall";
        this.topic = $routeParams.room || 'random';
        var geopattern = GeoPattern.generate(this.topic);
        this.pattern = { 'background-image' : geopattern.toDataUrl() };
        this.patternColor = { 'background-color' : luminance(geopattern.color,0.4)};
        this.patternColorDarker = { 'background-color' : geopattern.color};
        var ref = firebase.database().ref(this.topic);
        this.featured = $firebaseArray(ref);
        this.showInput = false;
        this.newRoom = null;
        var pad = function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        var toSlug = function(text){
          return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        };

        this.userInput = {
            name: "",
            email: "",
            content: ""
        };

        this.count = [];

        this.submitted = false;

        var self = this;

        var initPackery = function(){
            var elem = document.querySelector('.grid');
            var pckry = new Packery( elem, {
              // options
              itemSelector: '.grid-item',
              gutter: 10
            });
        };

        this.switchRoom = function(){
            $location.path(toSlug(this.newRoom));
        }

        this.cancel = function(){
            this.showInput = false;
            this.newRoom = null;
        }

        this.runAnimation = function(curVal, endVal) {
            var current_value = curVal,
                end_value = endVal,
                current_speed = 20;

            if(end_value === 0) {
                return;
            }

            if (end_value - current_value < 5){
                current_speed = 200;
                current_value += 1;
            } else if(end_value - current_value < 15){
                current_speed = 50;
                current_value += 1
            } else if(end_value - current_value < 50){
                current_speed = 25;
                current_value += 3
            } else{
                current_speed = 25;
                current_value += parseInt((end_value - current_value)/48)
            }

            var raw = pad(current_value, WIDTH, "").split("");
            if(current_speed){
                $timeout(function(){
                    self.count = raw;
                    if(current_value<end_value){
                        self.runAnimation(current_value, end_value);
                    }
                },current_speed);
            } else{
                self.count = raw;
            }
        };

        this.addComment = function(){
            this.submitted = true;
            var new_item = {
                name: this.userInput.name.trim(),
                email: this.userInput.email,
                content: this.userInput.content.trim(),
                time: new Date()
            };
            this.featured.$add(new_item);
            this.userInput.name = "";
            this.userInput.email = "";
            this.userInput.content = "";
            this.submitted = false;
        };

        this.fire = function(){
            self.runAnimation(0, self.featured.length);
            $timeout(function(){
                initPackery();
            }, 0);
        };

        this.fire();
    });