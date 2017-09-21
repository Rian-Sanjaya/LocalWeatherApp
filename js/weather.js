var weatherData = document.getElementById("weather-data");
var lat;
var lon;

// extend Date.prototype object (adding custom functions)
(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();

getLocation();

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getPosition, showError);

	} else {
		weatherData.innerText = "Geolocation is not supported by this browser.";
	}

	function getPosition(pos) {
		lat = pos.coords.latitude;
		lon = pos.coords.longitude;

		getWeather(lat, lon);
	}

	function showError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				weatherData.innerText = "User denied the request for Geolocation.";
				break;

			case error.POSITION_UNAVAILABLE:
				weatherData.innerText = "Location information is unavailable.";
				break;

			case error.TIMEOUT:
				weatherData.innerText = "The request to get user location timed out.";
				break;

			case error.UNKNOWN_ERROR:
				weatherData.innerText = "An unknown error occurred";
				break;
		}
	}
}

function getWeather(lat, lon) {
	if (lat && lon) {
		var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + lon;

		$.ajax({
			url: url,
			success: function(response) {
				// console.log(response);
				// console.log("City: "+response.name);
				// console.log("Country: "+response.sys.country);
				// console.log("Weather: "+response.weather[0].main);
				// console.log("Icon: "+response.weather[0].icon);
				// console.log("Temperature: "+response.main.temp);
				// console.log("Temperature Min.: "+response.main.temp_min);
				// console.log("Temperature Max.: "+response.main.temp_max);
				// console.log("Humidity: "+response.main.humidity);
				// console.log("Pressure: "+response.main.pressure);
				// console.log("Wind speed: "+response.wind.speed);
				// console.log("Visibility: "+response.visibility);
				// weatherData.innerHTML = "<p>City: "+response.name+
				// 						"<br>Country: "+response.sys.country+
				// 						"<br>Weather: "+response.weather[0].main+
				// 						"<br>Temperature: "+response.main.temp+
				// 						"<br>Temperature Min.: "+response.main.temp_min+
				// 						"<br>Temperature Max.: "+response.main.temp_max+
				// 						"<br>Humidity: "+response.main.humidity+
				// 						"<br>Pressure: "+response.main.pressure+
				// 						"<br>Wind speed: "+response.wind.speed+
				// 						"<br>Visibility: "+response.visibility+
				// 						"</p>";

				var now = new Date();
				var dayname = now.getDayName();
				var day = now.getDate();
				var monthname = now.getMonthName();
				var year = now.getFullYear();
				var hours = ('0'+now.getHours()).slice(-2);
				var minutes = ('0'+now.getMinutes()).slice(-2);

				$("#city").text(response.name + ", ");
				$("#country").text(response.sys.country);
				$("#dayname").text(dayname+", "+monthname+" "+day+" "+hours+":"+minutes);
				$("#weather").text(response.weather[0].main);
				// $("#temp").text(Math.round(Number(response.main.temp) * 100) / 100);
				$("#temp").text(Math.round(Number(response.main.temp)));

				iconCheck(response.weather[0].main);

				if ($("#temp").text() !== "") {
					$("#tempunit-f").addClass("active");
				}
			}
		});

	} else {
		weatherData.innerText = "Provide the latitude and longitude first.";
	}

}

function iconCheck(temp) {
	var temp = temp.toLowerCase();

	switch (temp) {
		case "clear" :
		case "clouds" :
		case "thunderstorm" :
		case "snow" :
		case "rain" :
		case "drizzle" : 
		case "haze" :
		case "mist" :
			showIcon(temp);
			break;

		default:
			$("i.clear").removeClass("hide");
			break;
	}
}

function showIcon(temp) {
	$("div.icons i."+temp).removeClass("hide");
}

function setActiveTempUnit(event) {
	if (event.target.id === "tempunit-c" && !$("#tempunit-c").hasClass("active")) {
		return;
	} else if (event.target.id === "tempunit-f" && !$("#tempunit-f").hasClass("active")) {
		return;
	}

	var tempunit = Number($("#temp").text());

	if (event.target.id === "tempunit-f") {
		// $("#temp").text( Math.round(((((tempunit * 9) / 5) + 32) * 100)) / 100); 
		$("#temp").text( Math.round((((tempunit * 9) / 5) + 32))); 
	} else if (event.target.id === "tempunit-c") {
		// $("#temp").text( Math.round(((((tempunit - 32) * 5) / 9) * 100)) / 100);
		$("#temp").text( Math.round((((tempunit - 32) * 5) / 9)));
	}

	$("#tempunit-c").toggleClass("active");
	$("#tempunit-f").toggleClass("active");
}

$("#tempunit-c").on("click", setActiveTempUnit);
$("#tempunit-f").on("click", setActiveTempUnit);
