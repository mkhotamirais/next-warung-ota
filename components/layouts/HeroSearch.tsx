"use client";

import SearchPopup from "../SearchPopup";
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useEffect, useState } from "react";
import { getTotalProductsCount } from "@/actions/product";

export default function HeroSearch() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTotalProductsCount().then(setTotal);
  }, []);

  const trigger = (
    <InputGroup className="max-w-sm bg-white">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{total} Products</InputGroupAddon>
    </InputGroup>
  );
  return <SearchPopup trigger={trigger} />;
}
