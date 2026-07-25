"use client";

import { useState } from "react";
import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { Button, Input } from "@/components/ui";

type DateFilterProps = {
  endDate: string;
  startDate: string;
};

export function DateFilter({ endDate, startDate }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <Button
        aria-expanded={isOpen}
        aria-controls="dashboard-date-filter"
        leftIcon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
        onClick={() => setIsOpen((current) => !current)}
        variant="secondary"
      >
        Filtrar
      </Button>

      {isOpen ? (
        <form
          className="grid gap-3 rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-3 shadow-[var(--shadow-floating)] sm:grid-cols-[150px_150px_auto]"
          id="dashboard-date-filter"
        >
          <Input label="Início" name="inicio" type="date" defaultValue={startDate} />
          <Input label="Fim" name="fim" type="date" defaultValue={endDate} />
          <Button
            className="self-end"
            leftIcon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
            type="submit"
          >
            Aplicar
          </Button>
        </form>
      ) : null}
    </div>
  );
}
