function($scope) {
  /* widget controller */
  var c = this;
	//client controler send info that button clicked to the server side
	c.onChange = function() {
		c.members = true;
		$("#tbl a").remove(); //clear table content after value of dropdown list changed
		$("#title").show(); //add titile after reload the list
		c.data.action = "addMembers";
		c.server.update().then(function() {
			c.data.action = undefined;
		})
	};
	// list-item click function get all record with the amount from particular table
	$scope.showProb = function()  {
		c.amount = c.data.problem;
		$("#tbl a").remove();
		for(var i = 0; i < c.data.problem; i++) {
					c.number = $scope.data.problems[i].number;
					c.short_description = $scope.data.problems[i].short_description
					c.sys_id = $scope.data.problems[i].sys_id;
					$("#tbl").append("<a href='?sys_id="+c.sys_id+"&view=sp&id=ticket&table=problem' class='list-group-item'>"+c.number+"<span> • </span>"+c.short_description+"</a>");
		}	
	};
	
	$scope.showReq = function()  {
		c.amount = c.data.request;
		$("#tbl a").remove();
		for(var i = 0; i < c.data.request; i++) {
					c.number = $scope.data.requests[i].number;
					c.sys_id = $scope.data.requests[i].sys_id;
					c.short_description = $scope.data.requests[i].short_description;
					$("#tbl").append("<a href='?sys_id="+c.sys_id+"&view=sp&id=ticket&table=change_request' class='list-group-item'>"+c.number+"<span> • </span>"+c.short_description+"</a>")
		}	
	};
	
	$scope.showInc = function()  {
		c.amount = c.data.incident;
		$("#tbl a").remove();
		for(var i = 0; i < c.data.incident; i++) {
					c.number = $scope.data.incidents[i].number;
					c.sys_id = $scope.data.incidents[i].sys_id;
					c.short_description = $scope.data.incidents[i].short_description;
					$("#tbl").append("<a href='?sys_id="+c.sys_id+"&view=sp&id=ticket&table=incident' class='list-group-item'>"+c.number+"<span> • </span>"+c.short_description+"</a>")
		}	
	};
	// hilight current online team member
	$scope.showActive = function() {
		for( var i = 0; i < $scope.data.usrState.length; i++) {
			c.userStatus = $scope.data.usrState[i].active;
			console.log(c.userStatus);
			c.userName = $scope.data.usrState[i].name;
			console.log(c.userName);
			if(c.userStatus == 'true') {
			 $("a:contains('"+c.userName+"')").css("background-color", "lightgreen");
			}
		}
	};

}