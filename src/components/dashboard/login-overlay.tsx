"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoginOverlay() {
  const { login, loading } = useAuth();

  const handleLogin = (userType: 'Importer' | 'Supplier' | 'Admin') => {
    login(userType);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-[380px] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to TransactEasy</CardTitle>
          <CardDescription>Select a user role to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              <Button onClick={() => handleLogin('Importer')} size="lg" disabled={loading}>Sign in as Importer</Button>
              <Button onClick={() => handleLogin('Supplier')} variant="secondary" size="lg" disabled={loading}>Sign in as Supplier</Button>
              <Button onClick={() => handleLogin('Admin')} variant="outline" size="lg" disabled={loading}>Sign in as Admin</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
