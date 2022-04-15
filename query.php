<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>QUERY</title>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> 
</head>
<body>

	<script>

	$( document ).ready(function() {

		const container = document.querySelector(".container");

		function getNagiosServices() {

			let query = "servicelist";
			let services = {};
			let success = function(data) {

				if( query == "servicelist") {
					for( let hostname in data.data[query]) {
						let host = data.data[query][hostname];
						services[hostname] = {};
						for( let x = 0; x < host.length; x++) {
							// if( services.indexOf(host[x]) == -1) {
									services[hostname][x] = host[x];
							// }
						}
					}
				}

				// console.log(services);

				if (!$.isEmptyObject(services)) {
					let servicesInfo = {};
					let parameters;

					for( let host in services) {

						servicesInfo[host] = {};

						for( let service_index in services[host]) {

							servicesInfo[host][services[host][service_index]] = {};

							parameters = {
								query: "service",
								hostname: host,
								servicedescription: services[host][service_index],
							}
							
							function testData(data) {

								servicesInfo[host][services[host][service_index]] = {
									"status": data.data.service.status,
									"last_check": new Date(data.data.service.last_check),
									"info": data.data.service.plugin_output,
								}

							}
							
							function error() {
								console.log("get error")
							}

							function doAjax() {
								return $.get({
									url: 'curl.php',
									data: parameters,
									dataType: 'json',
									success: function(data){
										testData(data)
									},
									error: error,
								})
							}


							const stuff = doAjax();

						}

					}


					// console.log(servicesInfo);
					doAjax().then( (data) => doStuff(data) )
					// console.log(servicesInfo);


					function doStuff() {

						if (!$.isEmptyObject(servicesInfo)) {
							let host_el;
							let service_el;
							let status_el;
							let tableHost;

							for( let host in servicesInfo) {
								tableHost = document.createElement('div');
								tableHost.className = "grid_table host";

								host_el = document.createElement('div');
								host_el.className = "box hostname";
								host_el.textContent = host;
								tableHost.appendChild(host_el);

								for( let service_index in servicesInfo[host]) {

									// service name
									service_el = document.createElement('div');
									service_el.className = "box service";
									service_el.textContent = service_index;
									tableHost.appendChild(service_el);

									// status
									status_el = document.createElement('div');
									status_el.className = "box status";
									status_span = document.createElement('span');

									switch (servicesInfo[host][service_index]["status"]) {
										case 2:
											status_el.classList.add("ok");
											status_span.textContent = "ok";
										break;
										case 4:
											status_el.classList.add("warning");
											status_span.textContent = "warning";
										break;
										case 16:
											status_el.classList.add("critical");
											status_span.textContent = "critical";
										break;
									}
									status_el.appendChild(status_span);
									tableHost.appendChild(status_el);

									// last check
									lastCheck_el = document.createElement('div');
									lastCheck_el.className = "box last_check";
									lastCheck_el.textContent = servicesInfo[host][service_index]["last_check"];
									tableHost.appendChild(lastCheck_el);

									// info
									info_el = document.createElement('div');
									info_el.className = "box info";
									info_el.textContent = servicesInfo[host][service_index]["info"];
									tableHost.appendChild(info_el);


								}
								container.appendChild(tableHost);
							}
						}

					}
					

				}		


			}


			let error = function(data, textError) {
				console.log(textError);
			}

			let parameters = Object();
			parameters.query = query;
						
			$.ajax({
				url: 'curl.php',
				data: parameters,
				dataType: 'json',
				success: success,
				error: error,
			});

		}


		getNagiosServices();

		});

	</script>


	<div class="container">

		<div class="grid_table headers">

			<div class="box header">Хост</div>
			<div class="box header">Сервис</div>
			<div class="box header">Статус</div>
			<div class="box header">Последняя проверка</div>
			<div class="box header">Информация</div>

		</div>

	</div>




	<style>

	.grid_table {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
	}

	.box {
		font-size: 14px;
		padding: 10px;
		border-bottom: 1px solid #cacbcd;
	}

	.box.header {
		background-color: #d9dee4;
	}

	.box.status {
	}

	.box.status span {
		padding: 4px;
		border-radius: 4px;
		color: #fff;
		text-transform: uppercase;
	}

	.box.status.ok span {
		background-color: #499b47;
	}

	.box.status.warning span {
		background-color: orange;
	}

	.box.status.critical span {
		background-color: #d04d52;
	}

	.box.hostname {
		grid-row: 1 / span 30;
	}

		
	</style>

</body>
</html>
