

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import LinkAuth from "@/components/LinkAuth";
import { signOut, useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

const mockedUseSession = useSession as jest.Mock;
const mockedSignOut = signOut as jest.Mock;

describe("Test du composant LinkAuth", () => {
  beforeEach(() => {
    mockedUseSession.mockClear();
    mockedSignOut.mockClear();
  });

  test("Utilisateur non connecté : affichage", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<LinkAuth />);

    expect(screen.getByText("Se connecter")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();

    expect(screen.queryByText("déconnecter")).not.toBeInTheDocument();
  });

  test("Affichage lors du chargement de la connexion", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<LinkAuth />);

    expect(screen.getByText("deconnexion...")).toBeInTheDocument();
  });

  test("Utilisateur connecté : affichage", () => {
    const session = {
      user: { name: "TestUser", role: "USER" },
    };
    mockedUseSession.mockReturnValue({
      data: session,
      status: "authenticated",
    });

    render(<LinkAuth />);

    expect(screen.getByText("TestUser (USER)")).toBeInTheDocument();
    
    expect(
      screen.getByRole("button", { name: /déconnecter/i })
    ).toBeInTheDocument();
    
    expect(screen.queryByText("Se connecter")).not.toBeInTheDocument();
    expect(screen.queryByText("S'inscrire")).not.toBeInTheDocument();
  });

  test("Clic du bouton déconnecter", () => {
    const session = {
      user: { name: "TestUser", role: "USER" },
    };
    mockedUseSession.mockReturnValue({
      data: session,
      status: "authenticated",
    });

    render(<LinkAuth />);

    const logOut = screen.getByRole("button", { name: /déconnecter/i });
    fireEvent.click(logOut);

    expect(mockedSignOut).toHaveBeenCalledTimes(1);
    expect(mockedSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});