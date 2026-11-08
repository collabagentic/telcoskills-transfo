import { describe, expect, it } from "vitest";
import { dateJour } from "@/lib/schema-base";

describe("socle", () => {
  it("accepte une date au jour", () => {
    expect(dateJour.safeParse("2026-11-08").success).toBe(true);
  });
  it("refuse une date mal formée", () => {
    expect(dateJour.safeParse("08/11/2026").success).toBe(false);
  });
});
