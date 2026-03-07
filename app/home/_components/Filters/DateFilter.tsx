"use client";

import { Select } from "@mantine/core";

export type RewardFilterDate = "ALL" | "PAST_WEEK" | "PAST_MONTH" | "PAST_YEAR";

interface DateFilterProps {
    value: RewardFilterDate;
    onApply: (date: RewardFilterDate) => void;
}

export function DateFilter({ value, onApply }: DateFilterProps) {
    return (
        <Select
            label="Created At"
            placeholder="Select timeframe"
            value={value}
            onChange={(val) => onApply((val as RewardFilterDate) || "ALL")}
            data={[
                { value: "ALL", label: "All time" },
                { value: "PAST_WEEK", label: "Past week" },
                { value: "PAST_MONTH", label: "Past month" },
                { value: "PAST_YEAR", label: "Past year" },
            ]}
            style={{ width: "200px" }}
        />
    );
}