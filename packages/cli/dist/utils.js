"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRecipientsFromCSV = loadRecipientsFromCSV;
exports.downloadDemoRecipients = downloadDemoRecipients;
exports.validateArgs = validateArgs;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sync_1 = require("csv-parse/sync");
/**
 * Load recipients from CSV file
 */
function loadRecipientsFromCSV(filePath) {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const records = (0, sync_1.parse)(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        return records.map((record) => ({
            wallet: record.wallet || record.address,
            amount: parseFloat(record.amount),
            name: record.name || undefined,
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to load CSV: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Download demo recipients from API
 */
async function downloadDemoRecipients(apiUrl = 'http://localhost:3000') {
    try {
        const response = await fetch(`${apiUrl}/api/onboarding/demo-recipients`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.recipients || [];
    }
    catch (error) {
        // Fallback to hardcoded demo recipients if API is unavailable
        console.warn('Could not reach API, using fallback demo recipients');
        return [
            {
                wallet: 'Demo1111111111111111111111111111111111111',
                amount: 10,
                name: 'Alice (Demo)',
            },
            {
                wallet: 'Demo2222222222222222222222222222222222222',
                amount: 25,
                name: 'Bob (Demo)',
            },
            {
                wallet: 'Demo3333333333333333333333333333333333333',
                amount: 15,
                name: 'Charlie (Demo)',
            },
        ];
    }
}
/**
 * Validate command arguments
 */
function validateArgs(args) {
    const errors = [];
    if (!args.wallet) {
        errors.push('--wallet is required');
    }
    if (!args.token) {
        errors.push('--token is required');
    }
    if (!args.recipients) {
        errors.push('--recipients is required');
    }
    if (errors.length > 0) {
        throw new Error(`Missing required arguments:\n  ${errors.join('\n  ')}`);
    }
}
