import { describe, test, expect, beforeEach, vi } from "vitest";
import { connectToDB } from "@utils/database";

const find = vi.hoisted(() => vi.fn());

vi.mock("@utils/database", () => ({ connectToDB: vi.fn() }));
vi.mock("mongoose", () => ({
  Types: {
    ObjectId: vi.fn(function(id) { return id; }), // 👈 must be regular function
  },
}));
vi.mock("@models/prompt", () => ({ default: { find } }));

import { GET } from "@/app/api/users/[id]/posts/route";

const mockParams = (id) => ({ params: Promise.resolve({ id }) });

describe("GET /api/users/[id]/posts", () => {
  beforeEach(() => vi.resetAllMocks()); // 👈 reset instead of clear

  test("returns 200 with posts for a valid user id", async () => {
    const mockPosts = [
      { _id: "post1", prompt: "Test thought", tag: "#test", creator: "deadbeefdeadbeefdeadbeef" },
    ];
    find.mockReturnValue({ populate: vi.fn().mockResolvedValue(mockPosts) });

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPosts);
    expect(connectToDB).toHaveBeenCalledTimes(1);
  });

  test("returns 200 with empty array when user has no posts", async () => {
    find.mockReturnValue({ populate: vi.fn().mockResolvedValue([]) });

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  test("returns 500 when DB connection fails", async () => {
    connectToDB.mockRejectedValue(new Error("DB connection failed"));

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Failed to fetch all thoughts");
  });

  test("returns 500 when Prompt.find throws", async () => {
    find.mockReturnValue({
      populate: vi.fn().mockRejectedValue(new Error("Query failed")),
    });

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(500);
  });
});