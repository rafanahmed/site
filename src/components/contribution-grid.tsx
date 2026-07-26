"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContribCalendar } from "@/lib/github-contributions";

const MONTH_NAMES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const WEEKDAY_LABELS = ["", "mon", "", "wed", "", "fri", ""];

const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const LABEL_LEFT = 26;
const LABEL_TOP = 16;

type TipState = {
  date: string;
  count: number;
  clientX: number;
  clientY: number;
} | null;

export default function ContributionGrid({ data }: { data: ContribCalendar }) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<TipState>(null);

  const weeks = data.weeks;
  const width = LABEL_LEFT + weeks.length * PITCH - GAP;
  const height = LABEL_TOP + 7 * PITCH - GAP;
  const monthLabels = buildMonthLabels(weeks);

  const showTipPointer = (
    e: React.PointerEvent<SVGRectElement>,
    date: string,
    count: number,
  ) => {
    setTip({
      date,
      count,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const moveTipPointer = (e: React.PointerEvent<SVGRectElement>) => {
    setTip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clientX: e.clientX,
        clientY: e.clientY,
      };
    });
  };

  const showTipFocus = (
    e: React.FocusEvent<SVGRectElement>,
    date: string,
    count: number,
  ) => {
    const cellRect = e.currentTarget.getBoundingClientRect();
    setTip({
      date,
      count,
      clientX: cellRect.left + cellRect.width / 2,
      clientY: cellRect.top + cellRect.height / 2,
    });
  };

  useLayoutEffect(() => {
    if (!tip || !tipRef.current) return;
    const el = tipRef.current;
    const rect = el.getBoundingClientRect();
    const half = rect.width / 2;
    const minLeft = 8 + half;
    const maxLeft = window.innerWidth - 8 - half;
    const left = Math.max(minLeft, Math.min(tip.clientX, maxLeft));
    el.style.left = `${left}px`;
    el.style.top = `${tip.clientY}px`;
  }, [tip]);

  const hideTip = () => setTip(null);

  const tipPortal =
    tip &&
    createPortal(
      <div
        ref={tipRef}
        className="contrib-tip"
        role="tooltip"
        style={{
          left: tip.clientX,
          top: tip.clientY,
        }}
      >
        <span className="contrib-tip-count">{tip.count}</span>{" "}
        contribution{tip.count === 1 ? "" : "s"}
        <span className="contrib-tip-sep"> · </span>
        <span className="contrib-tip-date">{formatTipDate(tip.date)}</span>
      </div>,
      document.body,
    );

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${data.totalContributions} GitHub contributions in the last year`}
        className="block h-auto w-full min-w-0"
        onPointerLeave={hideTip}
      >
        {monthLabels.map((ml) => (
          <text
            key={`${ml.label}-${ml.x}`}
            x={ml.x}
            y={LABEL_TOP - 5}
            className="contrib-axis-label"
          >
            {ml.label}
          </text>
        ))}

        {WEEKDAY_LABELS.map((label, i) =>
          label ? (
            <text
              key={`wd-${i}`}
              x={0}
              y={LABEL_TOP + i * PITCH + CELL - 2}
              className="contrib-axis-label"
            >
              {label}
            </text>
          ) : null,
        )}

        {weeks.map((week, wi) =>
          week.days.map((day) => {
            const x = LABEL_LEFT + wi * PITCH;
            const y = LABEL_TOP + day.weekday * PITCH;
            const aria = `${day.count} contribution${
              day.count === 1 ? "" : "s"
            } on ${day.date}`;
            return (
              <rect
                key={day.date}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={2}
                ry={2}
                tabIndex={0}
                role="button"
                aria-label={aria}
                className={`contrib-cell contrib-l${day.level}`}
                onPointerEnter={(e) =>
                  showTipPointer(e, day.date, day.count)
                }
                onPointerMove={moveTipPointer}
                onFocus={(e) => showTipFocus(e, day.date, day.count)}
                onBlur={hideTip}
              />
            );
          }),
        )}
      </svg>

      {tipPortal}
    </div>
  );
}

function formatTipDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function buildMonthLabels(
  weeks: ContribCalendar["weeks"],
): { x: number; label: string }[] {
  const out: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + "T00:00:00Z").getUTCMonth();
    if (month !== lastMonth && i > 0) {
      out.push({ x: LABEL_LEFT + i * PITCH, label: MONTH_NAMES[month] });
      lastMonth = month;
    } else if (lastMonth === -1) {
      lastMonth = month;
    }
  });
  return out;
}
