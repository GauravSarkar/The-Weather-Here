function setup() {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async function (position) {
      let lat, lon, weather1, weather2, air;
      try {
        lat = position.coords.latitude.toFixed(2);
        lon = position.coords.longitude.toFixed(2);
        document.getElementById("latitude").textContent =
          position.coords.latitude;
        document.getElementById("longitude").textContent =
          position.coords.longitude;
        //console.log(position);
        const api_url = `weather/${lat},${lon}`;

        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);
        air = json.air_quality.results[0].measurements[0];
        weather1 = json.weat.weather[0].description;
        weather2 = json.weat.main.temp;
        document.getElementById("summary").textContent =
          json.weat.weather[0].description;
        document.getElementById("temperature").textContent =
          ((json.weat.main.temp)-32)/1.80;
        console.log(json);
        document.getElementById("aq_parameter").textContent = air.parameter;
        document.getElementById("aq_value").textContent = air.value;
        document.getElementById("aq_units").textContent = air.unit;
        document.getElementById("aq_date").textContent = air.lastUpdated;
      } catch (error) {
        console.error(error);
        air = { value: -1 };
        document.getElementById("aq_value").textContent = "NO READING";
      }
      const data = { lat, lon, weather1, weather2, air };
      const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-Type": "application/json",
        },
      };
      const response1 = await fetch("/api", options);
      const json1 = await response1.json();
      console.log(json1);
    });
  } else {
    console.log("geolocation not available");
  }
}
const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
window.onload = function () {
  async function getISS() {
    const response = await fetch(api_url);
    const data = await response.json();
  }

  getISS();
};
