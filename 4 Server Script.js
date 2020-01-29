(function () {
	if (!options.maximum_entries)
		options.maximum_entries = 5;

	var tables = ["problem", "incident", "change_request"];

	data.list = [];
	data.problems = [];
	data.requests = [];
	data.incidents = [];
	data.members = [];
	data.usrState = [];

	/* e.g., data.table = $sp.getValue('table'); */
	// get all group from table	
	var gr = new GlideRecord("sys_user_grmember");
	gr.addEncodedQuery('userDYNAMIC90d1921e5f510100a9ad2572f2b477fe');
	gr.query();
	while (gr.next()) {
		data.list.push(gr.getDisplayValue('group'));
	}

	//get members of choosen group
	if (input) {
		if (input.action == "addMembers") {
			
			var grTeam = new GlideRecord("sys_user_group");
			grTeam.addQuery('name', input.team);
			grTeam.query();
			while (grTeam.next()) {
				var teamid = grTeam.getValue('sys_id');
				tables.forEach(queryTable, teamid); //get records number assigned to the team ofeach table 
				getRecords(teamid); //get records details assigned to the team for each table
				
				var usr = new GlideRecord("sys_user_grmember"); //query table to get all team memebers
				usr.addQuery('group', teamid);
				usr.query();
				while (usr.next()) {
					data.members.push(usr.getDisplayValue('user'));
					var users = {};
					var name = usr.getDisplayValue('user');
					
					var userTable = new GlideRecord('sys_user');
					userTable.addQuery('name', name);
					userTable.query();
					while(userTable.next()) {
						users.name = name;
						var userID = userTable.getDisplayValue('user_name');
						
						var isActive = new GlideRecord('sys_user_session');
						isActive.addEncodedQuery('nameISNOTEMPTY^invalidatedISEMPTY');
						isActive.addQuery('name', userID);
						isActive.query();
						if (isActive.next()) {
						users.active = 'true';
						}
					}
					data.usrState.push(users);
				}
			}
		}
	}

	function queryTable(item) {
		var id = this.valueOf();
		gr = new GlideAggregate(item); // query problem table to search all assigned record to the current team
		gr.addAggregate('COUNT');
		gr.addQuery('active', 'true');
		gr.addQuery('assignment_group', id);
		gr.query();
		if (gr.next()) {
			switch (item) {
				case 'problem':
					data.problem = gr.getAggregate('COUNT');
					break;
				case 'incident':
					data.incident = gr.getAggregate('COUNT');
					break;
				case 'change_request':
					data.request = gr.getAggregate('COUNT');
					break;
			}

		}
	}

	function getRecords(id) {
		var prb = new GlideRecord('problem');
		prb.addQuery('assignment_group', id);
		prb.addActiveQuery();
		prb.query();
		var prbIdx = 0;
		while (prb.next()) {
			if (prbIdx == options.maximum_entries)
				break;
			var prob = {};
			prob.number = prb.getDisplayValue("number");
			prob.short_description = prb.getDisplayValue("short_description");
			prob.state = prb.getDisplayValue("state");
			prob.sys_id = prb.getUniqueValue();
			data.problems.push(prob);
			prbIdx++;
		}


		var req = new GlideRecord('change_request');
		req.addQuery('assignment_group', id);
		req.addQuery('active', 'true');
		req.query();
		var reqIdx = 0;
		while (req.next()) {
			if (reqIdx == options.maximum_entries)
				break;
			var requ = {};
			requ.number = req.getDisplayValue("number");
			requ.short_description = req.getDisplayValue("short_description");
			requ.state = req.getDisplayValue("state");
			requ.sys_id = req.getUniqueValue();
			data.requests.push(requ);
			reqIdx++;

		}

		var inc = new GlideRecord('incident');
		inc.addQuery('assignment_group', id);
		inc.addQuery('active', 'true');
		inc.query();
		var incIdx = 0;
		while (inc.next()) {
			if (incIdx == options.maximum_entries)
				break;
			var inci = {};
			inci.number = inc.getDisplayValue("number");
			inci.short_description = inc.getDisplayValue("short_description");
			inci.state = inc.getDisplayValue("state");
			inci.sys_id = inc.getUniqueValue();
			data.incidents.push(inci);
			incIdx++;
		}
	}

})();