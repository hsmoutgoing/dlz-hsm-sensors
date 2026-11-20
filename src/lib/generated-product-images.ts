/** Illustrative scenes only; product detail pages retain their original photographs. */
const scenes: Record<string, string> = {
  HSM10: "/images/generated/hsm10.webp",
  HSM20: "/images/generated/hsm20.webp",
  HSM30: "/images/generated/hsm30.webp",
  HPS10: "/images/generated/hps10.webp",
  HPS20: "/images/generated/hps20.webp",
  PCC100: "/images/generated/pcc100.webp",
  HLS01: "/images/generated/hls01.webp",
  TPS10: "/images/generated/tps10.webp",
  "UB300-18GM45": "/images/generated/ub300.webp",
  HSM300: "/images/generated/hsm300.webp",
};

const alternateScenes: Record<string, string[]> = {
  HSM10: ["/images/reference-style/detail-flow.webp", "/images/generated/flow-detail.webp", "/images/generated/flow-pipe.webp"],
  HPS10: ["/images/reference-style/detail-level.webp", "/images/generated/level-guide.webp"],
  PCC100: ["/images/generated/pressure-detail.webp"],
  "UB300-18GM45": ["/images/generated/ultrasonic-detail.webp"],
};

export function generatedProductGallery(model: string): string[] {
  return alternateScenes[model] ?? [];
}

export function generatedProductImage(model: string): string | undefined {
  return scenes[model];
}
