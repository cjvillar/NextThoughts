
import { describe, test, expect, beforeEach, vi } from "vitest";
import { connectToDB } from "@utils/database";

const findById = vi.hoisted(() => vi.fn());
const findByIdAndDelete = vi.hoisted(() => vi.fn());

vi.mock("@utils/database", () => ({ connectToDB: vi.fn() }));
vi.mock("@models/prompt", () => ({ default: { findById, findByIdAndDelete } }));

import { GET, PATCH, DELETE } from "@/app/api/prompt/[id]/route";

const mockParams = (id) => ({ params: Promise.resolve({ id }) });

describe("GET /api/prompt/[id]", () => {
  beforeEach(() => vi.resetAllMocks());

  test("returns 200 with prompt when found", async () => {
    const mockPrompt = { _id: "deadbeefdeadbeefdeadbeef", prompt: "A thought", tag: "#idea" };
    findById.mockReturnValue({ populate: vi.fn().mockResolvedValue(mockPrompt) });

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPrompt);
  });

  test("returns 404 when prompt not found", async () => {
    findById.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Thought Not Found");
  });

  test("returns 500 on DB error", async () => {
    connectToDB.mockRejectedValue(new Error("DB error"));

    const response = await GET({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(500);
  });
});

describe("PATCH /api/prompt/[id]", () => {
  beforeEach(() => vi.resetAllMocks());

  const mockRequest = (body) => ({ json: vi.fn().mockResolvedValue(body) });

  test("returns 200 and updates prompt successfully", async () => {
    const mockPrompt = {
      _id: "deadbeefdeadbeefdeadbeef",
      prompt: "old thought",
      tag: "#old",
      save: vi.fn().mockResolvedValue(true),
    };
    findById.mockResolvedValue(mockPrompt);

    const response = await PATCH(
      mockRequest({ prompt: "updated thought", tag: "#new" }),
      mockParams("deadbeefdeadbeefdeadbeef")
    );

    expect(response.status).toBe(200);
    expect(mockPrompt.prompt).toBe("updated thought");
    expect(mockPrompt.tag).toBe("#new");
    expect(mockPrompt.save).toHaveBeenCalled();
  });

  test("returns 404 when prompt to update not found", async () => {
    findById.mockResolvedValue(null);

    const response = await PATCH(
      mockRequest({ prompt: "x", tag: "#x" }),
      mockParams("deadbeefdeadbeefdeadbeef")
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Thought not found");
  });

  test("returns 500 on DB error", async () => {
    connectToDB.mockRejectedValue(new Error("DB error"));

    const response = await PATCH(
      mockRequest({ prompt: "x", tag: "#x" }),
      mockParams("deadbeefdeadbeefdeadbeef")
    );

    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/prompt/[id]", () => {
  beforeEach(() => vi.resetAllMocks());

  test("returns 200 on successful delete", async () => {
    findByIdAndDelete.mockResolvedValue(true);

    const response = await DELETE({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Thought deleted successfully");
    expect(findByIdAndDelete).toHaveBeenCalledWith("deadbeefdeadbeefdeadbeef");
  });

  test("returns 500 on DB error", async () => {
    connectToDB.mockRejectedValue(new Error("DB error"));

    const response = await DELETE({}, mockParams("deadbeefdeadbeefdeadbeef"));

    expect(response.status).toBe(500);
  });
});
