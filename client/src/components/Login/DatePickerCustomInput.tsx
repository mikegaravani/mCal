import React from "react";
import { Input } from "@/components/ui/input";

const CustomInput = React.forwardRef<HTMLInputElement, any>(
  ({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      className="w-full cursor-pointer"
      placeholder="Select a date"
    />
  )
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
