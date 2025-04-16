#!/usr/bin/env node

/**
 * PeakHive Environment Check Script
 * 
 * This script checks if all required environment variables are set before running the app.
 * Use this during deployment to verify configuration.
 * 
 * Run with: node server/scripts/env-check.js
 */

import dotenv from 'dotenv';
import process from 'process';

// Load environment variables from .env file
dotenv.config();

// Define required environment variables
const requiredVariables = [
  { name: 'MONGO_URI', description: 'MongoDB connection string' },
  { name: 'JWT_SECRET', description: 'Secret key for JWT authentication' },
  { name: 'NODE_ENV', description: 'Environment (development/production)', defaultValue: 'development' },
  { name: 'PORT', description: 'Port for the server to listen on', defaultValue: '5000' }
];

console.log('=== PeakHive Environment Check ===');
console.log('Checking for required environment variables...\n');

let missingRequired = false;

// Check required variables
requiredVariables.forEach(variable => {
  if (!process.env[variable.name]) {
    console.log(`❌ Missing required variable: ${variable.name} - ${variable.description}`);
    missingRequired = true;
  } else {
    const value = process.env[variable.name];
    const maskedValue = variable.name.includes('KEY') || variable.name.includes('SECRET') 
      ? value.substring(0, 3) + '...' + value.substring(value.length - 3)
      : value;
    console.log(`✅ ${variable.name}: ${maskedValue}`);
  }
});

// Exit with error if required variables are missing
if (missingRequired) {
  console.log('\n❌ Missing required environment variables. Please set them before starting the app.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set.');
}

// If running as main script, exit successfully
if (process.argv[1] === import.meta.url.substring(7)) {
  process.exit(0);
} 