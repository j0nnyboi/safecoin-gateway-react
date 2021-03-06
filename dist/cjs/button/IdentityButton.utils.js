"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenDescription = exports.isDisabled = exports.getButtonText = exports.getIcon = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const react_1 = __importDefault(require("react"));
const types_1 = require("../types");
const IconLogo_1 = require("./IconLogo");
const IconError_1 = require("./IconError");
const IconLoading_1 = require("./IconLoading");
const IconSuccess_1 = require("./IconSuccess");
const IconWarning_1 = require("./IconWarning");
const buttonIconStyle = {
    width: '25px',
    height: '25px',
    fill: '#3AB03E',
    position: 'absolute',
    left: '15px',
    top: '10px',
};
const Icon = {
    LOGO: react_1.default.createElement(IconLogo_1.IconLogo, { style: buttonIconStyle }),
    ERROR: react_1.default.createElement(IconError_1.IconError, { style: buttonIconStyle }),
    SPINNER: react_1.default.createElement(IconLoading_1.IconLoading, { style: buttonIconStyle }),
    SUCCESS: react_1.default.createElement(IconSuccess_1.IconSuccess, { style: buttonIconStyle }),
    WARNING: react_1.default.createElement(IconWarning_1.IconWarning, { style: buttonIconStyle }),
};
// eslint-disable-next-line import/prefer-default-export
const getIcon = (status) => {
    switch (status) {
        case types_1.GatewayStatus.IN_REVIEW:
        case types_1.GatewayStatus.CHECKING:
            return Icon.SPINNER;
        case types_1.GatewayStatus.ACTIVE:
            return Icon.LOGO;
        case types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED:
        case types_1.GatewayStatus.FROZEN:
        case types_1.GatewayStatus.REJECTED:
        case types_1.GatewayStatus.REVOKED:
        case types_1.GatewayStatus.LOCATION_NOT_SUPPORTED:
        case types_1.GatewayStatus.USER_INFORMATION_REJECTED:
            return Icon.WARNING;
        case types_1.GatewayStatus.ERROR:
            return Icon.ERROR;
        default:
            return Icon.LOGO;
    }
};
exports.getIcon = getIcon;
const getButtonText = (status) => {
    switch (status) {
        case types_1.GatewayStatus.IN_REVIEW:
            return 'Reviewing';
        case types_1.GatewayStatus.CHECKING:
            return 'Collecting';
        case types_1.GatewayStatus.ACTIVE:
            return 'Active';
        case types_1.GatewayStatus.FROZEN:
        case types_1.GatewayStatus.REJECTED:
        case types_1.GatewayStatus.REVOKED:
            return 'Attention';
        case types_1.GatewayStatus.ERROR:
            return 'Error';
        case types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP:
            return 'Confirm';
        case types_1.GatewayStatus.LOCATION_NOT_SUPPORTED:
            return 'Not supported';
        case types_1.GatewayStatus.COLLECTING_USER_INFORMATION:
        case types_1.GatewayStatus.USER_INFORMATION_VALIDATED:
            return 'Resume';
        case types_1.GatewayStatus.VALIDATING_USER_INFORMATION:
            return 'Review';
        case types_1.GatewayStatus.USER_INFORMATION_REJECTED:
            return 'Failed';
        default:
            return 'Identity';
    }
};
exports.getButtonText = getButtonText;
const isDisabled = (state) => {
    return state === types_1.GatewayStatus.CHECKING;
};
exports.isDisabled = isDisabled;
const getTokenDescription = (status) => {
    switch (status) {
        case types_1.GatewayStatus.CHECKING:
            return 'The blockchain is being queried to find an existing Civic Pass.';
        case types_1.GatewayStatus.NOT_REQUESTED:
            return 'A Civic Pass has not been requested.';
        case types_1.GatewayStatus.IN_REVIEW:
            return 'Your Civic Pass is pending review.';
        case types_1.GatewayStatus.REJECTED:
            return 'Your Civic Pass request was rejected';
        case types_1.GatewayStatus.REVOKED:
            return 'Your Civic Pass has been revoked. Please contact support.';
        case types_1.GatewayStatus.FROZEN:
            return 'Your Civic Pass has been frozen. Please contact support.';
        case types_1.GatewayStatus.ACTIVE:
            return 'Your Civic Pass is currently active.';
        case types_1.GatewayStatus.ERROR:
            return 'Something went wrong, please try again.';
        case types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP:
            return 'Please confirm wallet ownership by tapping on the button again';
        case types_1.GatewayStatus.LOCATION_NOT_SUPPORTED:
            return 'Your location is not supported at this time';
        case types_1.GatewayStatus.VALIDATING_USER_INFORMATION:
            return 'The validation process is currently being reviewed. Please be patient.';
        case types_1.GatewayStatus.USER_INFORMATION_VALIDATED:
            return 'The validation process has been reviewed and needs to be completed.';
        case types_1.GatewayStatus.COLLECTING_USER_INFORMATION:
            return 'The process is still in progess and needs to be completed.';
        case types_1.GatewayStatus.USER_INFORMATION_REJECTED:
            return 'The validation process was rejected.';
        case types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED:
            return 'Your token needs to be refreshed';
        default:
            return 'Please wait for the state to be updated.';
    }
};
exports.getTokenDescription = getTokenDescription;
