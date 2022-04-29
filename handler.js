const serverless = require("serverless-http");
const express = require("express");
const app = express();

const users = [
    {
        id: "1",
        name: "1",
    },
    {
        id: "2",
        name: "2",
    },
    {
        id: "3",
        name: "3",
    },
];

app.get("/", (req, res) => {
    res.send(JSON.stringify("Your function executed successfully!"));
});

app.get("/users", (req, res) => {
    res.send(users);
});

app.post("/users", function (req, res) {
    const newUser = JSON.parse(req.apiGateway.event.body);
    users.push(newUser);
    res.send(users);
});

app.get("/users/:id", function (req, res) {
    const { id } = req.params;
    const user = users.find((user) => user.id === id);

    res.status(200).send(user);
});

app.put("/users/:id", function (req, res) {
    const { id } = req.params;
    const { name } = JSON.parse(req.apiGateway.event.body);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex) {
        users.splice(userIndex, 1);
        users.push({
            id,
            name,
        });
    }

    res.send(users);
});

app.delete("/users/:id", function (req, res) {
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }
    res.send(users);
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
