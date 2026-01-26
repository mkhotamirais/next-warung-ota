"use client";

import { Eye, EyeClosed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import * as React from "react";

export function InputPassword({ ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ButtonGroup className="w-full">
      <Input autoComplete="off" type={showPassword ? "text" : "password"} placeholder="********" {...props} />
      <Button type="button" variant="outline" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
        {showPassword ? <EyeClosed /> : <Eye />}
      </Button>
    </ButtonGroup>
  );
}
