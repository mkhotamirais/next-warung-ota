import SearchPopup from "../SearchPopup";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

export default function NavSearch() {
  const trigger = (
    <Button variant={"secondary"} className="rounded-full">
      <SearchIcon />
    </Button>
  );
  return <SearchPopup trigger={trigger} />;
}
