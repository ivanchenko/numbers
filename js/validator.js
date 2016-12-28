"use strict";

export default class Validator {
    constructor() {
        this.isValid = true;
        this.config = {};
        this.messages = {};

        this.validators = {
            noValidation: function () {
                return true;
            },
            isNumber: function (value) {
                try {
                    value = parseFloat(value);

                    return !isNaN(value);

                } catch (ex) {
                    return false;
                }
            },
            isNonEmpty: function (value) {
                return value && value.trim() !== '';
            },
            isEmail: function (value) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    .test(value);
            },
            isArray: function (value) {
                return Array.isArray(value);
            }
        }
    }

    setConfig(config) {
        this.config = config;
    }

    validate(data) {
        var f;
        var config;
        var validator;
        this.messages = {};
        this.isValid = true;


        for (f in this.config) {
            if (!this.config.hasOwnProperty(f)) continue;

            validator = this.validators[this.config[f].type];
            if (!validator) {
                throw {
                    name: 'ValidationError',
                    message: 'No handler to validate type: ' + this.config[f].type
                }
            }

            if (!validator(data[f])) {
                this.isValid = false;
                this.messages[f] = this.config[f].message;
            }
        }

        return this.isValid;
    }
}