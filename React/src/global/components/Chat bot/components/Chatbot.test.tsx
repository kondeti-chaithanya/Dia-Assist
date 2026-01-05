import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Chatbot from "./Chatbot";
import axios from "axios";
import { AuthContext } from "@/auth/AuthContext";

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
});

/* ======================
   MOCK AXIOS
====================== */
vi.mock("axios");
const mockedAxios = axios as any;

/* ======================
   RENDER HELPER
====================== */
const renderChatbot = ({
  isAuthenticated = true,
  loading = false,
  initialPath = "/",
}: {
  isAuthenticated?: boolean;
  loading?: boolean;
  initialPath?: string;
}) => {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        error: null,
        user: null,
        setIsAuthenticated: () => {},
        setUser: () => {},
        setError: () => {},
        logout: async () => {},
        clearError: () => {},
      }}
    >
      <MemoryRouter initialEntries={[initialPath]}>
        <Chatbot />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("Chatbot Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     BASIC RENDER
  ====================== */
  it("renders chatbot button", () => {
    renderChatbot({});

    expect(screen.getByText("🤖")).toBeInTheDocument();
  });

  /* ======================
     OPEN CHAT WINDOW
  ====================== */
  it("opens chat window when bot button is clicked", () => {
    renderChatbot({});

    fireEvent.click(screen.getByText("🤖"));

    expect(screen.getByText("Chat with us")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();
  });

  /* ======================
     TYPE MESSAGE
  ====================== */
  it("allows user to type a message", () => {
    renderChatbot({});

    fireEvent.click(screen.getByText("🤖"));

    const input = screen.getByLabelText(
      "Message input"
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "Hello Bot" },
    });

    expect(input.value).toBe("Hello Bot");
  });

  /* ======================
     SEND MESSAGE (SUCCESS)
  ====================== */
  it("sends message and shows bot response", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { answer: "Hello! I’m DiaAssist." },
    });

    renderChatbot({});

    fireEvent.click(screen.getByText("🤖"));

    fireEvent.change(screen.getByLabelText("Message input"), {
      target: { value: "Hi" },
    });

    fireEvent.click(screen.getByLabelText("Send message"));

    expect(screen.getByText("Hi")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Hello! I’m DiaAssist.")
      ).toBeInTheDocument()
    );
  });

  /* ======================
     UNAUTHENTICATED USER
  ====================== */
  it("shows login message when unauthenticated on home page", async () => {
    renderChatbot({
      isAuthenticated: false,
      loading: false,
      initialPath: "/",
    });

    fireEvent.click(screen.getByText("🤖"));

    fireEvent.change(screen.getByLabelText("Message input"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByLabelText("Send message"));

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Please login to use the chatbot");
  });

  /* ======================
     API ERROR HANDLING
  ====================== */
  it("shows error message when chatbot API fails", async () => {
  mockedAxios.post.mockRejectedValueOnce({
    message: "Network Error",
  });

  renderChatbot({});

  fireEvent.click(screen.getByText("🤖"));

  fireEvent.change(screen.getByLabelText("Message input"), {
    target: { value: "Test" },
  });

  fireEvent.click(screen.getByLabelText("Send message"));

  const alert = await screen.findByRole("alert");

  expect(alert).toHaveTextContent(
    "Network error. Please check your connection"
  );
});
});
