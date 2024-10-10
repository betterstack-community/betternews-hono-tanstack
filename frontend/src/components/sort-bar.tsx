import { useNavigate } from "@tanstack/react-router";

import { ArrowUpIcon } from "lucide-react";

import { Order, SortBy } from "@/shared/types";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SortBar({ sortBy, order }: { sortBy: SortBy; order: Order }) {
  const navigate = useNavigate();
  return (
    <div className="mb-4 flex items-center justify-between">
      <Select
        value={sortBy}
        onValueChange={(sortBy: SortBy) =>
          navigate({
            to: ".",
            search: (prev) => ({
              ...prev,
              sortBy,
            }),
          })
        }
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="points">Points</SelectItem>
          <SelectItem value="recent">Recent</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          navigate({
            to: ".",
            search: (prev) => ({
              ...prev,
              order: order === "asc" ? "desc" : "asc",
            }),
          });
        }}
        aria-label={order === "asc" ? "Sort Descending" : "Sort Ascending"}
      >
        <ArrowUpIcon
          className={cn(
            "size-4 transition-transform duration-300",
            order === "desc" && "rotate-180",
          )}
        />
      </Button>
    </div>
  );
}
