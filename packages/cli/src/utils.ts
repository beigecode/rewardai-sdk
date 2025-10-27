import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import type { Recipient } from '@beigecode/pumpbuddy-sdk';

/**
 * Load recipients from CSV file
 */
export function loadRecipientsFromCSV(filePath: string): Recipient[] {
  try {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records.map((record: any) => ({
      wallet: record.wallet || record.address,
      amount: parseFloat(record.amount),
      name: record.name || undefined,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load CSV: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Download demo recipients from API
 */
export async function downloadDemoRecipients(
  apiUrl: string = 'http://localhost:3000'
): Promise<Recipient[]> {
  try {
    const response = await fetch(
      `${apiUrl}/api/onboarding/demo-recipients`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json() as { recipients?: Recipient[] };
    return data.recipients || [];
  } catch (error) {
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
export function validateArgs(args: {
  wallet?: string;
  token?: string;
  recipients?: string;
}): void {
  const errors: string[] = [];

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

