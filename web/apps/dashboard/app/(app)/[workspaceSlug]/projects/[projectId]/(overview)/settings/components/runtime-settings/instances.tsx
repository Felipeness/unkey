"use client";

import type { EnvironmentSettings } from "@/lib/collections/deploy/environment-settings";
import { mapRegionToFlag } from "@/lib/trpc/routers/deploy/network/utils";
import { Connections3 } from "@unkey/icons";
import { RegionFlag } from "../../../../components/region-flag";
import {
  type ResourceSliderConfig,
  ResourceSliderSetting,
} from "../shared/resource-slider-setting";

const formatInstanceParts = (n: number) => ({
  value: String(n),
  unit: `instance${n !== 1 ? "s" : ""}`,
});

const RegionFlags = ({ settings }: { settings: EnvironmentSettings }) => {
  const regions = Object.keys(settings.regionConfig);
  if (regions.length === 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-1.5">
      {regions.map((r) => (
        <RegionFlag
          key={r}
          flagCode={mapRegionToFlag(r)}
          size="xs"
          shape="circle"
          className="[&_img]:size-3"
        />
      ))}
    </div>
  );
};

const instancesConfig: ResourceSliderConfig = {
  icon: <Connections3 className="text-gray-12" iconSize="xl-medium" />,
  title: "Instances",
  description: "Number of instances running in each region",
  settingDescription:
    "More instances improve availability and handle higher traffic. Changes apply on next deploy.",
  colorVar: "featureA",
  slider: { kind: "direct", min: 1, max: 10, step: 1 },
  formatValue: formatInstanceParts,
  readValue: (s) => Object.values(s.regionConfig)[0] ?? 1,
  writeValue: (draft, value) => {
    const updated: Record<string, number> = {};
    for (const region of Object.keys(draft.regionConfig)) {
      updated[region] = value;
    }
    draft.regionConfig = updated;
  },
  extraSaveChecks: (settings) => {
    const anyHasRegions = settings.some((s) => Object.keys(s.regionConfig).length > 0);
    if (!anyHasRegions) {
      return {
        status: "disabled",
        reason: "Select at least one region before setting instance count",
      };
    }
    return null;
  },
  sliderAdornment: (s) => <RegionFlags settings={s} />,
};

export const Instances = () => <ResourceSliderSetting config={instancesConfig} />;
