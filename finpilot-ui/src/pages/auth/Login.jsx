import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");

      await login(data);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        <Card className="w-[420px]">

          <CardHeader>

            <CardTitle className="text-3xl font-bold text-center">
              FinPilot AI
            </CardTitle>

            <CardDescription className="text-center">
              Sign in to continue
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              <div>

                <Label>Email</Label>

                <Input
                  type="email"
                  {...register("email")}
                />

                <p className="text-red-500 text-sm mt-1">
                  {errors.email?.message}
                </p>

              </div>

              <div>

                <Label>Password</Label>

                <Input
                  type="password"
                  {...register("password")}
                />

                <p className="text-red-500 text-sm mt-1">
                  {errors.password?.message}
                </p>

              </div>

              {error && (
                <p className="text-red-500 text-center">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

            </form>

            <div className="text-center mt-6">

              <Link
                to="/register"
                className="text-sm text-orange-500 hover:underline"
              >
                Don't have an account? Register
              </Link>

            </div>

          </CardContent>

        </Card>

      </motion.div>

    </div>
  );
}
