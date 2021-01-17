var apikey = "81e4f121aaa6d34ea34ebdf00038a9fd"

var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat="
var fiveQuery = "https://api.openweathermap.org/data/2.5/forecast?q="
var iconUrl = "http://openweathermap.org/img/wn/10d@2x.png"

var exSearches = JSON.parse(localStorage.getItem("searches")) || []
var opening = JSON.parse(localStorage.getItem("last search")) || "New York"
currentWeather(opening)

function createButton(search) {
    var city = search.charAt(0).toUpperCase() + search.slice(1);
    var btn = $("<button>").attr("class", "newbtn btn btn-light").text(city)

    if (exSearches.includes(city) == false) {
        exSearches.push(city);
        
        localStorage.setItem("searches", JSON.stringify(exSearches));
        $(".group-btn").prepend(btn) 
    }    
}

function uvIndex(latitude, longitude) {
    var query = uvQuery + latitude + "&lon=" + longitude + "&appid=" + apikey

    $.ajax({
        url: query,
        method: "Get",
    }).then(function(response){
        
        var uv = response.value
        $("#uv").text(" " + uv)
        if (uv >= 10) {
            $("#uv").css("background-color", "red")
            $("#uv").css("color", "white")
        }
        else if (8 <= uv && uv < 10) {
            $("#uv").css("background-color", "orangered")
            $("#uv").css("color", "white")
        }
        else if (6 <= uv && uv < 8) {
            $("#uv").css("background-color", "orange")
            $("#uv").css("color", "black")
        }   
        else if (3 <= uv && uv < 6) {
            $("#uv").css("background-color", "yellow")
            $("#uv").css("color", "black")
        }
        else if (1 <= uv && uv < 3) {
            $("#uv").css("background-color", "yellowgreen")
            $("#uv").css("color", "black")
        }
        
    })
}

function currentWeather(search) {
    var query = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + apikey
    $.ajax({
        url: query,
        method: "GET",
    }).then(function(response){
        
        var main = response.main
        var temp = main.temp
        var date = new Date(response.dt * 1000).toLocaleDateString("en-US")
    
        var newTemp = (((temp - 273.15)*1.8)+32).toFixed(1)
    
        var humidity = main.humidity
        var windSpd = (response.wind.speed).toFixed(1)
        var lat = response.coord.lat
        var long = response.coord.lon

        uvIndex(lat, long)
        fiveDayWeather(lat, long)
    
        console.log(humidity, newTemp, windSpd, date)

        $("#city").text(response.name + " " + date);
        $("#temp").text("Temperature: " + newTemp + String.fromCharCode(176) + "F");
        $("#humidity").text("Humidity: " + humidity + "%");
        $("#wind").text("Wind Speed: " + windSpd + " MPH")
        $("#current-img").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")

    })
    
}

function fiveDayWeather(latitude, longitude) {
    var query = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apikey
    $.ajax({
        url: query,
        method: "GET",
    }).then(function(response){
        console.log(response)
        j=1

        $(".day").each(function(){
           
            var date = new Date(response.daily[j].dt * 1000).toLocaleDateString("en-US")
            var img = "http://openweathermap.org/img/wn/" + response.daily[j].weather[0].icon + "@2x.png"
            var temp = (((response.daily[j].temp.max - 273.15)*1.8)+32).toFixed(1)
            var humidity = response.daily[j].humidity


            $(this).children("#next-date").text(date)
            $(this).children("img").attr("src", img)
            $(this).children("#next-temp").text("Temp: " + temp + String.fromCharCode(176) + "F")
            $(this).children("#next-humid").text("Humidity: " + humidity + "%")
            j++
            
        })
    })
}

function saveLastSearch(search) {
    localStorage.setItem("last search", JSON.stringify(search))
}

//display history from local storage if it exists
for (var i = 0; i < exSearches.length; i++) {
    var city = exSearches[i];
    var btn = $("<button>").attr("class", "newbtn btn btn-light").text(city)

    $(".group-btn").prepend(btn)    
}

$(".newbtn").click(function(){
    event.preventDefault()
    console.log(this.textContent)
    var search = this.textContent
    currentWeather(search)
    saveLastSearch(search)
})

$(".btn-primary").click(function(){
    event.preventDefault()
    var search = $("#search-box").val()
    currentWeather(search)
    createButton(search)
    saveLastSearch(search)
})