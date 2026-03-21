import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "@components/Profile";

vi.mock("@components/PromptCard", () => ({
  default: ({ post, handleEdit, handleDelete }) => (
    <div data-testid="prompt-card">
      <p>{post.prompt}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  ),
}));

const mockPosts = [
  { _id: "1", prompt: "First thought", tag: "#idea" },
  { _id: "2", prompt: "Second thought", tag: "#art" },
];

describe("Profile component", () => {
  test("renders the description", () => {
    render(
      <Profile name="Alice" desc="Welcome to Alice's page" data={mockPosts} />
    );
    expect(screen.getByText("Welcome to Alice's page")).toBeInTheDocument();
  });

  test("renders a PromptCard for each post", () => {
    render(<Profile name="Alice" desc="Alice's page" data={mockPosts} />);
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);
  });

  test("renders empty state with no posts", () => {
    render(<Profile name="Alice" desc="Alice's page" data={[]} />);
    expect(screen.queryAllByTestId("prompt-card")).toHaveLength(0);
  });

  test("calls handleEdit when edit is clicked", () => {
    const handleEdit = vi.fn();
    render(
      <Profile
        name="Alice"
        desc="Alice's page"
        data={mockPosts}
        handleEdit={handleEdit}
      />
    );
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(handleEdit).toHaveBeenCalledWith(mockPosts[0]);
  });

  test("calls handleDelete when delete is clicked", () => {
    const handleDelete = vi.fn();
    render(
      <Profile
        name="Alice"
        desc="Alice's page"
        data={mockPosts}
        handleDelete={handleDelete}
      />
    );
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(handleDelete).toHaveBeenCalledWith(mockPosts[0]);
  });

  test("does not crash when handleEdit and handleDelete are not provided", () => {
    render(<Profile name="Alice" desc="Alice's page" data={mockPosts} />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    fireEvent.click(screen.getAllByText("Delete")[0]);
  });
});