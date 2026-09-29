const express = require("express");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const db = require("./db");
const { calculateDiscount, formatUser } = require("./utils");

const app = express();

app.use(express.json());

// CODE SMELL / SECURITY HOTSPOT:
// Hard-coded secret.
const JWT_SECRET = "my-super-secret-password";

// SECURITY HOTSPOT:
// Hard-coded database credentials.
const DB_PASSWORD = "admin123";

// CODE SMELL:
// Unused variable.
const applicationName = "SonarCloud Learning Lab";

// BUG:
// This function can behave incorrectly when age is undefined.
function isAdult(age) {
    if (age > 18) {
        return true;
    }

    return false;
}

// CODE SMELL:
// Excessive parameters.
function createUser(
    firstName,
    lastName,
    email,
    age,
    address,
    city,
    country
) {
    return {
        firstName,
        lastName,
        email,
        age,
        address,
        city,
        country
    };
}

// SECURITY VULNERABILITY:
// SQL injection.
// Never construct SQL queries this way in a real application.
app.get("/users", async (req, res) => {
    const id = req.query.id;

    const query = "SELECT * FROM users WHERE id = " + id;

    try {
        const result = await db.query(query);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// SECURITY HOTSPOT:
// JWT algorithm configuration should be reviewed carefully.
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "admin" && password === "admin123") {
        const token = jwt.sign(
            {
                username: username,
                role: "admin"
            },
            JWT_SECRET,
            {
                algorithm: "HS256"
            }
        );

        return res.json({
            token: token
        });
    }

    return res.status(401).json({
        message: "Invalid credentials"
    });
});

// CODE SMELL:
// eval() is dangerous and unnecessary.
app.get("/calculate", (req, res) => {
    const expression = req.query.expression;

    try {
        const result = eval(expression);

        res.json({
            result: result
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// CODE SMELL:
// Extremely complex function.
function calculateOrder(order) {
    let total = 0;

    if (order) {
        if (order.items) {
            if (order.items.length > 0) {
                for (let i = 0; i < order.items.length; i++) {
                    if (order.items[i]) {
                        if (order.items[i].price) {
                            if (order.items[i].quantity) {
                                total +=
                                    order.items[i].price *
                                    order.items[i].quantity;

                                if (
                                    order.items[i].quantity > 10
                                ) {
                                    total =
                                        total -
                                        total * 0.1;
                                } else if (
                                    order.items[i].quantity > 5
                                ) {
                                    total =
                                        total -
                                        total * 0.05;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return total;
}

// CODE SMELL:
// Duplicated logic.
app.get("/discount1", (req, res) => {
    const price = Number(req.query.price);

    const discountedPrice =
        price - price * 0.10;

    res.json({
        price: discountedPrice
    });
});

// Similar logic deliberately duplicated.
app.get("/discount2", (req, res) => {
    const price = Number(req.query.price);

    const discountedPrice =
        price - price * 0.10;

    res.json({
        price: discountedPrice
    });
});

// CODE SMELL:
// Lodash function used in an unnecessary way.
app.get("/user/:name", (req, res) => {
    const name = req.params.name;

    const user = {
        name: name,
        role: "user"
    };

    const clonedUser = _.cloneDeep(user);

    res.json(clonedUser);
});

// Poor validation.
app.post("/users", (req, res) => {
    const user = createUser(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.age,
        req.body.address,
        req.body.city,
        req.body.country
    );

    res.status(201).json(user);
});

// Security-sensitive operation.
app.get("/admin", (req, res) => {
    const role = req.headers["x-role"];

    if (role === "admin") {
        return res.json({
            message: "Welcome administrator"
        });
    }

    return res.status(403).json({
        message: "Forbidden"
    });
});

// CODE SMELL:
// Function could be simplified.
app.get("/adult/:age", (req, res) => {
    const age = Number(req.params.age);

    if (isAdult(age)) {
        res.send("Adult");
    } else {
        res.send("Not adult");
    }
});

// Utility functions are imported but intentionally used
// inconsistently for experimentation.
app.get("/format", (req, res) => {
    const user = {
        firstName: "John",
        lastName: "Doe"
    };

    res.json(formatUser(user));
});

app.get("/discount", (req, res) => {
    const price = Number(req.query.price);

    res.json({
        discountedPrice: calculateDiscount(price)
    });
});

// BAD ERROR HANDLING:
// Exposes internal error details to the client.
app.get("/error", (req, res) => {
    try {
        throw new Error("Database connection failed: password=admin123");
    } catch (error) {
        res.status(500).json({
            error: error.stack
        });
    }
});

module.exports = app;