const { Schema, model } = require("mongoose");

const phoneNumberRegex = /^\+\d{1,15}$/;
const postalCodeRegex = /^[0-9]{1,6}$/;
const bankAccountRegex = /^\d{16}$/; // Updated to enforce 16 digits

const isValidPhoneNumber = (value) => phoneNumberRegex.test(value);
const isValidPostalCode = (value) => postalCodeRegex.test(value);
const isValidBankAccount = (value) => bankAccountRegex.test(value);

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: isValidPhoneNumber,
            message: "Invalid phone number format",
        },
    },
    postalCode: {
        type: String,
        required: true,
        validate: {
            validator: isValidPostalCode,
            message: "Invalid postal code format",
        },
    },
    city: {
        type: String,
        required: true,
    },
    bankAccount: {
        type: String,
        required: true,
        validate: {
            validator: isValidBankAccount,
            message: "Invalid bank account format",
        },
    },
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
