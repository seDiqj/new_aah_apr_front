"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createAxiosInstance } from "@/lib/axios";
import { useParentContext } from "@/contexts/ParentContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { reqForToastAndSetMessage, axiosInstance } = useParentContext();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      reqForToastAndSetMessage("somthign");
      return;
    }

    try {
      setLoading(true);
      axiosInstance
        .post("/authentication/login", {
          email,
          password,
          remember,
        })
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400; secure; samesite=strict`;
          router.push("/");
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
      setLoading(false);
    } catch (err: any) {
      console.log(err.response.data)
      setError("Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive">{error}</div>}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                type="password"
                autoComplete="current-password"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(val) => setRemember(!!val)}
                />
                <Label htmlFor="remember" className="select-none">
                  Remember me
                </Label>
              </div>

              <a className="text-sm hover:underline" href="#">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
