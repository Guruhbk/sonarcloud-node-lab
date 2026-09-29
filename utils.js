// CODE SMELL:
// Function could be simplified.
function calculateDiscount(price) {
    if (price > 1000) {
        return price * 0.8;
    } else {
        return price * 0.9;
    }
}

// CODE SMELL:
// Duplicate / unnecessary variables.
function formatUser(user) {
    const firstName = user.firstName;
    const lastName = user.lastName;

    const fullName =
        firstName + " " + lastName;

    return {
        name: fullName,
        firstName: firstName,
        lastName: lastName
    };
}

module.exports = {
    calculateDiscount,
    formatUser
};
