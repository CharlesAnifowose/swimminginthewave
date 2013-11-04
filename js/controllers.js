'use strict';

               /* Controllers */

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    var peopleGenders = ['man','fem'];
    var peopleStates = ['clr','pos','neg'];

    var people = $scope.people = [];
    _(500).times(function(i){ 
        var person = {
              val: 100
            , gender: peopleGenders[ Math.floor(Math.random()*2) ]
            , state: peopleStates[0]
            , css: {}
        };
        person.css[person.gender] = true;
        person.css[person.state] = true;
        people.push(person)
    });

    $scope.round = 0;
    $scope.totalTraded = 0;
    $scope.totalPledged = 0;

    var tradeLoop;
    $scope.isTrading = false;
    $scope.startTrading = function(){
        $scope.isTrading = true;
        tradeLoop = setInterval(function(){
            $scope.trade();
            $scope.$digest();
        }, 200)
    }
    $scope.stopTrading = function(){
        $scope.isTrading = false;
        clearInterval(tradeLoop );
    }

    $scope.tradeUnit = 1;
    $scope.trade = function(){
        $scope.round ++;
        _.each(people, function(person,i){
            while (true) {
                var partner_i = Math.floor(Math.random()*people.length);
                if (partner_i != i){ 
                    var partner = people[partner_i];
                    break; 
                }
            } 
            var bet = $scope.tradeUnit;//Math.abs(person.val * 10/100);
            var allowedDebt = 0
            if (person.val+allowedDebt >= bet && partner.val + allowedDebt >= bet){
                if (Math.random() < 0.5){
                    person.val -= bet;
                    partner.val += bet;
                }
                else{
                    person.val += bet;
                    partner.val -= bet;
                }
                $scope.totalTraded += bet;
            }
        });
        $scope.calculateGroups();
    }
    $scope.trackPerson = function(person){
        if (person.state === 'clr'){
            person.css.clr = false;
            person.state = 'pos';
        }
        else{
            person.css.pos = false;
            person.state = 'clr';
        }
        person.css[person.state] = true;
    }
    $scope.calculateGroups = function(){
        var minInterval = 10;
        var maxGroups = 10;
        // get min and max values
        var minVal = people[0].val;
        var maxVal = minVal;
        _.each(people, function(person,i){
            minVal = Math.min(minVal, person.val);
            maxVal = Math.max(maxVal, person.val);
        });

        var rangeVal = maxVal - minVal;
        var intervalSize = minInterval;
        var numGroups = Math.ceil(rangeVal / minInterval);
        if (numGroups > maxGroups){
            intervalSize = Math.round( Math.ceil((rangeVal/maxGroups)/10)*10 );
            numGroups = Math.ceil(rangeVal / intervalSize);
        }

        minVal = Math.floor(minVal/intervalSize)*intervalSize;
        maxVal = Math.ceil(maxVal/intervalSize)*intervalSize;

        $scope.peopleOrganized = [];
        var groupRef = {};
        var topGroup = 0;
        for (var i = minVal; i <= maxVal; i+=intervalSize) {
            var median = Math.round(i);
            var refCode = Math.round((median - minVal) / intervalSize);
            topGroup = Math.max(refCode, topGroup);
            var group = {median:median, list:[]};
            groupRef[ refCode ] = group;
            $scope.peopleOrganized.push (group);
        };
        $scope.columnStyle = {width: Math.floor(100/($scope.peopleOrganized.length))+'%' };
        
        _.each(people, function(person,i){
            var refCode = Math.round((person.val - minVal) / intervalSize);
            var group = groupRef[ refCode ];
            if (group){
                group.list.push(person);
            }

            if ($scope.givingPledge && refCode > 0.7*topGroup){
                givingPledgePotential(person, people)
            }
        });

    }

    $scope.calculateGroups();
    $scope.pledgePopularity = 0.2
    function givingPledgePotential(person, people){
        $scope.pledgePopularity = Math.min( 1, Math.max(0, $scope.pledgePopularity));
        if (Math.random() < $scope.pledgePopularity){
            var gift = person.val * 0.5;
            person.val -= gift;
            $scope.totalPledged += gift;
            var giftShares = gift / people.length;
            _.each(people, function(person,i){
                person.val += giftShares;
            });                    
        }
    }

    function list(num){
        var arr = [];
        _(num).times(function(i){ 
            arr.push( Math.random() < 0.5 )
        });
        return arr;
    }

}]);
