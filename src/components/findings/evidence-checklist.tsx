"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EvidenceChecklistProps {
  items: string[];
  onItemToggle?: (item: string, checked: boolean) => void;
}

export function EvidenceChecklist({ items, onItemToggle }: EvidenceChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleToggle = (item: string, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(item);
      } else {
        next.delete(item);
      }
      return next;
    });
    onItemToggle?.(item, checked);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isChecked = checkedItems.has(item);
        return (
          <div
            key={item}
            className={cn(
              "flex items-start gap-2 rounded-md p-2 transition-colors",
              isChecked && "bg-muted/50"
            )}
          >
            <Checkbox
              id={`evidence-${item}`}
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleToggle(item, checked as boolean)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor={`evidence-${item}`}
              className={cn(
                "text-sm font-normal cursor-pointer",
                isChecked && "line-through text-muted-foreground"
              )}
            >
              {item}
            </Label>
          </div>
        );
      })}
      {checkedItems.size > 0 && (
        <p className="text-xs text-muted-foreground pt-1">
          已勾选 {checkedItems.size} / {items.length} 项
        </p>
      )}
    </div>
  );
}
