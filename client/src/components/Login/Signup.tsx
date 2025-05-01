import type React from "react";
import { registerUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerCustomInput from "./DatePickerCustomInput";
import { subYears } from "date-fns";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [location, setLocation] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordRepeat) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        username,
        email,
        password,
        fullName,
        birthDate: birthdate ? birthdate.toISOString() : undefined,
        location,
      });
      const token = res.data.token;

      localStorage.setItem("token", token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
            <Calendar className="h-6 w-6" />
            mCal
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Choose a username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="user1234"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Choose a password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordRepeat" className="text-sm font-medium">
                  Repeat password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="passwordRepeat"
                  type={showPasswordRepeat ? "text" : "password"}
                  className="pl-10"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                >
                  {showPasswordRepeat ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPasswordRepeat ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="more-info" className="border-0">
                <AccordionTrigger className="p-0 flex items-center text-sm font-medium text-slate-700 hover:no-underline">
                  <div className="flex items-center gap-2">More about you</div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label
                        htmlFor="birthdate"
                        className="text-sm font-medium"
                      >
                        Birthdate
                      </Label>
                      <DatePicker
                        id="birthdate"
                        selected={birthdate}
                        onChange={(date) => setBirthdate(date)}
                        dateFormat="yyyy-MM-dd"
                        customInput={<DatePickerCustomInput />}
                        wrapperClassName="w-full"
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        openToDate={subYears(new Date(), 24)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="La Cañada Flintridge"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>

          {error && (
            <p className="text-sm text-center text-red-500 mt-6">{error}</p>
          )}

          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </CardFooter>
        </form>

        <div className="px-8 pb-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
        </div>
      </Card>
    </div>
  );
}
