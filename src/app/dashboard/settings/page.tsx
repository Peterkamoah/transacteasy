"use client";

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    business_name: user?.business_name || '',
    vat_id: user?.vat_id || '',
    contact_info: user?.contact_info || '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  }

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      updateUser({ ...user, ...profileData });
      toast({
        variant: 'success',
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully. You have been logged out for security.",
    });
    // In a real app, you would call logout() here after the API call succeeds.
  };

  const handleNotificationsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     toast({
        variant: 'success',
        title: "Preferences Saved",
        description: "Your notification settings have been updated.",
     });
  }
  
  return (
    <div className="flex-1 space-y-4">
      <Header title="Settings" />
      <main className="p-4 md:p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your public profile and account details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="business_name" value={profileData.business_name} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} readOnly disabled />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="vatId">VAT ID</Label>
                    <Input id="vat_id" value={profileData.vat_id} onChange={handleProfileChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information</Label>
                    <Input id="contact_info" value={profileData.contact_info} onChange={handleProfileChange} />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
             <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password here. For security, you will be logged out after.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications from TransactEasy.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about invoices and payments via email.</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get real-time alerts on your devices.</p>
                        </div>
                        <Switch id="push-notifications" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">Receive news, feature updates, and special offers.</p>
                        </div>
                        <Switch id="marketing-emails" defaultChecked />
                    </div>
                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
