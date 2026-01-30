"use client";
import { Eye, EyeOff, Github, PenTool } from "lucide-react";
import { redirect } from "next/navigation";
import { type FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Logo } from "@/modules/landing/views/ui/logo";

export default function LoginOrCreateAccountPage() {
  const user = useSession();
  if (user.data?.session) return redirect("/~/");

  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingManual, setLoadingManual] = useState(false);

  const handleSocialLogin = async (method: "google" | "github") => {
    const param = new URLSearchParams(window.location.search);
    setLoadingGoogle(true);
    const { error } = await signIn.social({
      provider: method,
      callbackURL: param.get("callbackURL") || window.location.origin + "/~",
    });
    if (error) {
      toast.error(error.message);
    }
    setLoadingGoogle(false);
  };

  const handleManualLogin = async (e: FormEvent) => {
    e.preventDefault();
    const param = new URLSearchParams(window.location.search);
    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setLoadingManual(true);
    const { error } = await signUp.email({
      name: email.split("@")[0],
      email: email,
      password: password,
      callbackURL: param.get("callbackURL") || window.location.origin + "/~",
    });
    if (error) {
      if (error.code == "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        const { error } = await signIn.email({
          email: email,
          password: password,
        });
        if (error) {
          toast.error(error.message);
        }
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Check your email for verification link!");
    }
    setLoadingManual(false);
  };

  return (
    <div className="max-w-sm mx-auto py-20 px-6 sm:px-0">
      <div>
        <div className="grid gap-1 text-center">
          <div className="mx-auto mb-4 w-fit">
            <Logo />
          </div>
          <h1 className="text-lg sm:text-xl font-bold">
            Login or Create Account
          </h1>
          <p className="text-sm sm:text-base text-foreground/80">
            Use your google account or email and password to continue using the
            platform.
          </p>
        </div>
        <div className="mt-10 grid gap-10">
          <div className="grid gap-3">
            <Button
              disabled={loadingGoogle}
              onClick={() => handleSocialLogin("google")}
              className={cn(
                "w-full text-center",
                loadingManual && "pointer-events-none select-none",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z"></path>
              </svg>
              Continue with google
            </Button>
            <Button
              disabled={loadingGoogle}
              onClick={() => handleSocialLogin("github")}
              className={cn(
                "w-full text-center",
                loadingManual && "pointer-events-none select-none",
              )}
            >
              <Github className="h-4! w-4!" />
              Continue with github
            </Button>
          </div>
          <FieldSeparator>Or</FieldSeparator>
          <form onSubmit={handleManualLogin} className="grid gap-2">
            <Label>Email</Label>
            <InputGroup className="mb-3">
              <InputGroupInput name="email" placeholder="name@domail.com" />
            </InputGroup>
            <Label>Password</Label>
            <InputGroup className="mb-4">
              <InputGroupInput
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="*********"
              />
              <Button
                size="icon-sm"
                variant="ghost"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-3.5! w-3.5!" />
                ) : (
                  <EyeOff className="!h-3.5! w-3.5!" />
                )}
              </Button>
            </InputGroup>
            <Button
              type="submit"
              disabled={loadingManual}
              className={loadingGoogle ? "pointer-events-none select-none" : ""}
            >
              {loadingManual && <Loader className="size-4" />} Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
