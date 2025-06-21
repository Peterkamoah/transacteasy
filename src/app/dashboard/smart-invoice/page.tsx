"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { smartInvoiceSuggestions } from '@/ai/flows/smart-invoice-suggestions';
import type { SmartInvoiceSuggestionsOutput } from '@/ai/flows/smart-invoice-suggestions';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, Wand2 } from 'lucide-react';

export default function SmartInvoicePage() {
  const [formData, setFormData] = useState({
    historicalTransactionData: 'Last 5 invoices averaged $8,000. All paid on time.',
    currentMarketConditions: 'Stable market, with a slight increase in material costs (approx 3%).',
    customerPaymentHistory: 'Excellent. Customer has a 2-year history of on-time payments, never delayed.',
    invoiceItems: '100 units of Component A, 50 units of Component B, 20 hours of integration service.',
  });
  const [suggestion, setSuggestion] = useState<SmartInvoiceSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await smartInvoiceSuggestions(formData);
      setSuggestion(result);
    } catch (error) {
      console.error("Error fetching invoice suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <Header title="Smart Invoice" />
      <main className="p-4 md:p-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Invoice Suggestions</CardTitle>
            <CardDescription>Let AI help you determine the optimal invoice amount and payment plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceItems">Invoice Items</Label>
                <Textarea id="invoiceItems" name="invoiceItems" value={formData.invoiceItems} onChange={handleInputChange} placeholder="List the items..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPaymentHistory">Customer Payment History</Label>
                <Textarea id="customerPaymentHistory" name="customerPaymentHistory" value={formData.customerPaymentHistory} onChange={handleInputChange} placeholder="Describe the customer's payment history..." />
              </div>
               <div className="space-y-2">
                <Label htmlFor="historicalTransactionData">Historical Transaction Data</Label>
                <Textarea id="historicalTransactionData" name="historicalTransactionData" value={formData.historicalTransactionData} onChange={handleInputChange} placeholder="Describe past transactions..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentMarketConditions">Current Market Conditions</Label>
                <Textarea id="currentMarketConditions" name="currentMarketConditions" value={formData.currentMarketConditions} onChange={handleInputChange} placeholder="Describe current market conditions..." />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating...' : 'Generate Suggestions'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>AI-Powered Suggestions</CardTitle>
                        <CardDescription>Your generated suggestions will appear here.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            {isLoading && (
              <CardContent className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              </CardContent>
            )}
            {suggestion && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Suggested Amount</Label>
                  <p className="text-2xl font-bold text-primary">${suggestion.suggestedInvoiceAmount.toFixed(2)}</p>
                </div>
                 <div>
                  <Label className="text-xs text-muted-foreground">Suggested Payment Plan</Label>
                  <p className="text-md">{suggestion.suggestedPaymentPlan}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Reasoning</Label>
                  <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border">{suggestion.reasoning}</p>
                </div>
                 <Button className="w-full">Apply Suggestion to New Invoice</Button>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
