'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestEmail = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, message: data.message });
      } else {
        setError(data.error || "Failed to send test email");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>📧 Test Email Sending</CardTitle>
          <CardDescription>
            Test if your email configuration is working properly
          </CardDescription>
        </CardHeader>
        
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="Enter email to test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleTestEmail} 
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? "Sending Test Email..." : "Send Test Email"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {result && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✅ {result.message}
            </div>
          )}

          <div className="text-xs text-slate-500 mt-4">
            <p className="font-medium mb-2">Debugging Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check Vercel environment variables are set</li>
              <li>Ensure Gmail app password is correct</li>
              <li>Verify less secure app access is enabled (if needed)</li>
              <li>Check spam/junk folders for delivered emails</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}