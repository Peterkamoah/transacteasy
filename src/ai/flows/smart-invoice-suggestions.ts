// src/ai/flows/smart-invoice-suggestions.ts
'use server';

/**
 * @fileOverview AI-powered tool for generating smart invoice suggestions.
 *
 * - smartInvoiceSuggestions - A function that generates invoice amount and payment plan suggestions.
 * - SmartInvoiceSuggestionsInput - The input type for the smartInvoiceSuggestions function.
 * - SmartInvoiceSuggestionsOutput - The return type for the smartInvoiceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartInvoiceSuggestionsInputSchema = z.object({
  historicalTransactionData: z
    .string()
    .describe(
      'Historical transaction data, including past invoice amounts, payment dates, and any payment issues.'
    ),
  currentMarketConditions: z
    .string()
    .describe('Description of current market conditions that may affect pricing.'),
  customerPaymentHistory: z
    .string()
    .describe(
      'Detailed payment history for the specific customer, including on-time payments, delays, or defaults.'
    ),
  invoiceItems: z.string().describe('A list of items to be included in the invoice.'),
});
export type SmartInvoiceSuggestionsInput = z.infer<typeof SmartInvoiceSuggestionsInputSchema>;

const SmartInvoiceSuggestionsOutputSchema = z.object({
  suggestedInvoiceAmount: z
    .number()
    .describe('The suggested invoice amount based on the provided data.'),
  suggestedPaymentPlan: z
    .string()
    .describe(
      'A suggested payment plan, including the number of installments and due dates.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI’s reasoning for the suggested invoice amount and payment plan.'
    ),
});
export type SmartInvoiceSuggestionsOutput = z.infer<typeof SmartInvoiceSuggestionsOutputSchema>;

export async function smartInvoiceSuggestions(
  input: SmartInvoiceSuggestionsInput
): Promise<SmartInvoiceSuggestionsOutput> {
  return smartInvoiceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartInvoiceSuggestionsPrompt',
  input: {schema: SmartInvoiceSuggestionsInputSchema},
  output: {schema: SmartInvoiceSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides smart invoice suggestions to suppliers.

  Based on the historical transaction data, current market conditions, customer payment history and items to be included in the invoice, suggest an appropriate invoice amount and a suitable payment plan. Provide a brief reasoning for your suggestions.

  Historical Transaction Data: {{{historicalTransactionData}}}
  Current Market Conditions: {{{currentMarketConditions}}}
  Customer Payment History: {{{customerPaymentHistory}}}
  Invoice Items: {{{invoiceItems}}}

  Consider all these data points carefully to provide the best possible suggestion.
  Ensure to output a valid JSON, according to the output schema.
  {{~#json SmartInvoiceSuggestionsOutputSchema}}{{
    suggestedInvoiceAmount: suggestedInvoiceAmount,
    suggestedPaymentPlan: suggestedPaymentPlan,
    reasoning: reasoning
  }}{{~/json}}`,
});

const smartInvoiceSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartInvoiceSuggestionsFlow',
    inputSchema: SmartInvoiceSuggestionsInputSchema,
    outputSchema: SmartInvoiceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
