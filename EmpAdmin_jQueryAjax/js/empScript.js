/**
 * Employee table dynamic rows with Auto refresh Mustache engine
 */

var renderEmp = '<tr class="{{id}}">'+
		      '<th scope="row">{{id}}</th>'+
		      '<td>{{first_name}}</td>'+
		      '<td>{{last_name}}</td>'+
		      '<td>{{email}}</td>'+
		      '<td>{{phone}}</td>'+
		      '<td><span class="glyphicon glyphicon-pencil" onclick="edit({{id}})"></span><span class="glyphicon glyphicon-trash" onclick="deleteEmp({{id}})"></span></td>'+
		    '</tr>';
function empMustache(emp) {
	return Mustache.render(renderEmp, emp);
}
/**
 *  Get all Employees list & Display
 */

function empList() {
	$('.noRecordsFound h3').fadeOut(300);
	$.ajax({
		type: 'GET',
		url: 'http://localhost:5000/employee',
		dataType: 'json',
		success: function (empData) {
			empData.sort(function(obj1, obj2){
					return obj1.id-obj2.id;
			});

			var options = {
                dataSource: empData,
                pageSize:10,
                callback: function (response, pagination) {
                	var eachEmpData = '<table class="table table-hover table-striped">'+
										  '<thead><tr>'+
										      '<th>ID</th>'+
										      '<th>First Name</th>'+
										      '<th>Last Name</th>'+
										      '<th>email</th>'+
										      '<th>Phone</th>'+
										      '<th>Actions</th>'+
										    '</tr></thead>'+
										  '<tbody>';
                    $.each(response, function (index, emp) {
					    eachEmpData += empMustache(emp);
                    });
                    eachEmpData += '</tbody></table>';
                    $('.mainData').prev().html(eachEmpData);
                }
            };
            $('.pagination-nav').pagination(options);
		},
		error: function(error) {
			console.log(error);
		}
	});
	$('.heading-row').css({
		top: '-720px',
		marginLeft: '200px'
	});
}

/**
 * Adding & Updating Employee record based on emp ID existance...
 */

function addEmp() {
	var emp = {
		id: $('#Id').val(),
		first_name: $('#firstName').val(),
		last_name: $('#lastName').val(),
		email: $('#email').val(),
		phone: $('#phone').val()
	}
	emp.id == '' ? 
		$.ajax({
			type: 'POST',
			url: 'http://localhost:5000/employee',
			dataType: 'json',
			data: emp,
			success: function(data){
				alert('Employee details added successfully...');
				$('#empModal').modal('toggle');
			},
			error: function(error){
				alert('Error occured while adding employee details. Please try Again');
				console.log(error);
			}

		}) :
		$.ajax({
			type: 'PUT',
			url: 'http://localhost:5000/employee/'+emp.id,
			dataType: 'json',
			data: emp,
			success: function(data){
				alert('Employee details updated successfully...');
				$('#empModal').modal('toggle');
				empList();
			},
			error: function(error){
				alert('Error occured while Updating employee details. Please try Again');
				console.log(error);
			}
		});
}

/**
 *  Searching Employee record with First Name
 */

function searchEmp() {
	var $empName = $('#emp_search').val();

	$empName != '' ?
	$.ajax({
		type: 'GET',
		url: 'http://localhost:5000/employee?first_name='+$empName,
		dataType: 'json',
		success: function (empData) {

			/* Sorting matched employees with IDs */

			empData.sort(function(obj1, obj2){
					return obj1.id-obj2.id;
			});

			if(empData.length==0) {
				$('.table').toggle('toggle');
				$('.noRecordsFound').html('<h3>No Employee records found.<h3>');
				$('.noRecordsFound h3').css({
						position: 'relative',
						top: '-670px',
						marginLeft: '43%'
					});
			}

			/* Pagination part of Employees list */
			
			var options = {
                dataSource: empData,
                pageSize:10,
                callback: function (response, pagination) {
                	var eachEmpData = '<table class="table table-hover table-striped">'+
										  '<thead><tr>'+
										      '<th>ID</th>'+
										      '<th>First Name</th>'+
										      '<th>Last Name</th>'+
										      '<th>email</th>'+
										      '<th>Phone</th>'+
										      '<th>Actions</th>'+
										    '</tr></thead>'+
										  '<tbody>';
                    $.each(response, function (index, emp) {
					    eachEmpData += empMustache(emp);
                    });
                    eachEmpData += '</tbody></table>';
                    $('.mainData').prev().html(eachEmpData);
                }
            };
            $('.pagination-nav').pagination(options);
		},
		error: function(error) {
			console.log(error);
		}
	}) : '';
}

/**
 * Deleting Employee with ID
 */

function deleteEmp(id) {
	$.ajax({
		type: 'DELETE',
		url: 'http://localhost:5000/employee/'+id,
		success: function(){
			confirm("Are you sure? Deleting Employee with ID: "+id) ? $('.'+id).remove() : '';
		},
		error: function(error){
			console.log('error');
		}

	})
}

/**
 * Editing an Employee & Displaying in Bootstrap Modal
 */

function edit(id) {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:5000/employee?id='+id,
		dataType: 'json',
		success: function (data) {
			$('#empModal').modal('toggle');
			$('#myModalLabel').text('Update Employee Details:');
			document.getElementById('Id').value = data[0].id;
			document.getElementById('firstName').value = data[0].first_name;
			document.getElementById('lastName').value = data[0].last_name;
			document.getElementById('email').value = data[0].email;
			document.getElementById('phone').value = data[0].phone;

			$('#updateEmp').text('Update Employee');
		}
	});
}