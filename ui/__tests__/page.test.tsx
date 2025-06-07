import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home", () => {
  it("renders a heading", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it("renders welcome text", () => {
    render(<HomePage />);
    const welcomeText = screen.getByText(/Ad Astra/i);

    expect(welcomeText).toBeInTheDocument();
  });
});
