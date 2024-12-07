require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const args = process.argv;
const port = process.env.PORT || args[2] || 3000;
const wmo = require("./data/wmo.json");

const mongourl = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.iw8z5.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongourl)
    .then(() => console.log("connected"))
    .catch(error => console.log("did not connect: " + error));

const schema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    searches: [
        {
            loc: { type: String, required: true },
            lat: { type: String, required: true },
            lng: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
});
const Searches = mongoose.model("Searches", schema, process.env.MONGO_COLLECTION);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cookieParser());
app.use((req, res, next) => {
    // Check if the user ID cookie already exists
    if (!req.cookies.userId) {
        // Generate a random user ID
        const userId = uuidv4();

        // Set the cookie with a 30-day expiry
        res.cookie('userId', userId, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
            httpOnly: true // Prevents client-side scripts from accessing the cookie
        });

        console.log(`New user ID cookie set: ${userId}`);
    } else {
        console.log(`Existing user ID cookie: ${req.cookies.userId}`);
    }

    next();
});

async function getWeather(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        data.daily = data.daily.time.map((_, index) => {
            return Object.fromEntries(Object.keys(data.daily).map(key => [
                key, data.daily[key][index]
            ]));
        });
        data.current.weather = wmo[data.current.weather_code.toString()][data.current.is_day ? "day" : "night"];
        data.daily.forEach(day => {
            day.weather = wmo[day.weather_code.toString()]["day"];
        });
        return data;
    } catch (error) {
        console.error("Couldn't fetch weather", error);
    }
}

app.get("/location", async (req, res) => {
    let { loc } = req.query;
    if (!loc || loc.length < 3) {
        res.json([]);
    }
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${loc}&count=10&language=en&format=json`);
        let data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Couldn't fetch weather", error);
    }
});

app.get("/",
    async (req, res) => {
        let recentSearches = [];
        const { userId } = req.cookies;
        if (userId) {
            try {
                const userSearches = await Searches.findOne({ userId });
                if (userSearches) {
                    recentSearches = userSearches.searches.reverse();
                }
            } catch (error) {
                console.error("Couldn't find searches in mongo", error);
            }
        }
        res.render("home", { currentWeather: {}, recentSearches });
    }
);

app.post("/weather", express.urlencoded({ extended: true }),
    async (req, res) => {
        const { userId } = req.cookies;
        let { lat, lng, loc } = req.body;
        if (!lat || !lng) { // if submitted with no lat/lng, go look it up first
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${loc}&count=10&language=en&format=json`);
            let data = await response.json();
            lat = data.results[0].latitude;
            lng = data.results[0].longitude;
            loc = `${data.results[0].name}, ${data.results[0].admin1 || data.results[0].country}`;
        }
        Searches.findOneAndUpdate(
            { userId },
            {
                $push: {
                    searches: {
                        $each: [{ lat, lng, loc }],
                        $slice: -5
                    }
                },
                $slice: -5
            },
            {
                upsert: true,
                new: true
            }
        ).catch(error => console.error("Couldn't save search", error));
        const weather = await getWeather(lat, lng);
        res.render("weather", { weather, loc });
    }
);

app.get("/weather", async (req, res) => {
    let { lat, lng, loc, json } = req.query;
    const weather = await getWeather(lat, lng);
    if (json) {
        res.json(weather);
    } else {
        res.render("weather", { weather, loc });
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});