"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LoginOverlay() {
  const { login, loading, isConfigured } = useAuth();

  const handleLogin = (userType: 'Importer' | 'Supplier' | 'Admin') => {
    login(userType);
  }

  const renderContent = () => {
    if (!isConfigured) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Your Firebase credentials are not set. Please open the <strong>.env</strong> file, add your project credentials, and then refresh this page.
          </AlertDescription>
        </Alert>
      );
    }

    if (loading) {
      return (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
    }

    return (
      <div className="grid gap-4">
        <Button onClick={() => handleLogin('Importer')} size="lg" disabled={loading}>Sign in as Importer</Button>
        <Button onClick={() => handleLogin('Supplier')} variant="secondary" size="lg" disabled={loading}>Sign in as Supplier</Button>
        <Button onClick={() => handleLogin('Admin')} variant="outline" size="lg" disabled={loading}>Sign in as Admin</Button>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-[420px] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to TransactEasy</CardTitle>
          <CardDescription>Select a user role to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}