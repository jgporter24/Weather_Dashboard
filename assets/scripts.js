var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('L');
var searchHistoryList = [];

// function for current condition
function currentCondition(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);
        
        $("#weatherInfo").css("display", "block");
        $("#cityInfo").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        // City info card and weather

        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);

        $("#cityInfo").append(currentCity);

        // UV index
        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);

            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

            $("#cityInfo").append(uvIndexP);

            futureCondition(lat, lon);

            // UV Index
            // 0-2 green, 3-5 yellow, 6-7 orange, 8-10 red, 11+violet
            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uvColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvColor").css("background-color", "#FFF300");
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvColor").css("background-color", "#F18B00");
            } else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvColor").css("background-color", "#B567A4").css("color", "white"); 
            };  
        });
    });
}


