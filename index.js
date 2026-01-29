const express = require("express");
const app = express();
const config = require("./config.js");
const request = require("request");
const fs = require("fs");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.get("/exibitions", (req, res) => {
  var url = `https://api.harvardartmuseums.org/exhibition?apikey=${config.apiKey}`;
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, response, data) => {
      if (err || response.statusCode !== 200) {
        return res.status(500).send("Error occurred while fetching data");
      }
      fs.writeFile(`exibitions.json`, JSON.stringify(data), (err) => {
        if (err) return res.status(500).send("Error writing file");

        res.redirect(`/view`);
      });
    },
  );
});

app.get("/data", (req, res) => {
  const filePath = path.join(__dirname, `exibitions.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("Data not found");
    }
    res.json(JSON.parse(data));
  });
});

app.get("/exibition=:id", (req, res) => {
  const exibitionId = req.params.id;
  var url = `https://api.harvardartmuseums.org/exhibition/${exibitionId}?apikey=${config.apiKey}`;
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, response, data) => {
      if (err || response.statusCode !== 200) {
        return res.status(500).send("Error occurred while fetching data");
      }
      fs.writeFile(`${exibitionId}.json`, JSON.stringify(data), (err) => {
        if (err) return res.status(500).send("Error writing file");

        res.redirect(`/view?exibition=${exibitionId}`);
      });
    },
  );
});

app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/data/:exibition", (req, res) => {
  const exibition = req.params.exibition;
  const filePath = path.join(__dirname, `${exibition}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("Data not found");
    }
    res.json(JSON.parse(data));
  });
});

app.listen(config.port, () => {
  console.log(
    `The Harvard Art Museums API listening at http://localhost:${config.port}`,
  );
});
