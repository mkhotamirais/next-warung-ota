import React from "react";
import Drawer from "./ui/Drawer";
import { LuArrowUpDown, LuListFilter } from "react-icons/lu";
import Button from "./ui/Button";

const TriggerFilter = (
  <Button size="sm" aria-label="filter" variant="ghost">
    <LuListFilter />
  </Button>
);

export default function HeaderFilter() {
  return (
    <Drawer trigger={TriggerFilter} position="right" classWidth="w-80">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-4">Filter and Order Products</h3>
        <div className="mb-4">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <LuListFilter />
            <span>Filter By</span>
          </h4>
          <div className="space-y-2">
            <div>
              <h5 className="font-light text-sm text-gray-600">Category</h5>
              <div>makanan | minuman | jajanan</div>
            </div>
            <div>
              <h5 className="font-light text-sm text-gray-600">Price Range</h5>
              <div>min | max</div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <LuArrowUpDown />
            <span>Order By</span>
          </h4>
          <div>asc | desc</div>
        </div>
      </div>
    </Drawer>
  );
}
