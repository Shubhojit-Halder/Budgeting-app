import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import styled from "styled-components";
import { toast } from "react-toastify";

const Container = styled.div`
  width: 90%;
  max-width: 400px;
  margin: 6rem auto;
  padding: 2rem 1.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};

  @media (max-width: 480px) {
    margin: 4rem auto;
    padding: 1.5rem 1rem;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => props.theme.inputBorder};
  border-radius: 6px;
  font-size: 1rem;
  background: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.text};

  &:focus {
    outline: none;
    border-color: #0077ff;
  }

  @media (max-width: 480px) {
    width: 90% !important;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  width: 100%;
  flex: 1;
  padding: 0.75rem;
  background: ${(props) => (props.primary ? "#0077ff" : "#555")};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => (props.primary ? "#005fcc" : "#333")};
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 1rem;
`;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message, { theme: "dark" });
    } else {
      toast.success("✅ Signup successful! Check your email to confirm.", {
        theme: "dark",
      });
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message, { theme: "dark" });
    } else {
      toast.success("✅ Login successful!", { theme: "dark" });
      onLogin(data.user);
      navigate("/budget-tracker");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <Title>Login or Sign Up</Title>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ButtonContainer>
          {!isLogin ? (
            <>
              <Button primary onClick={handleSignup} disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
              <span
                style={{ color: "#ff6b6b", fontWeight: 500 }}
                onClick={() => {
                  setIsLogin(true);
                }}
              >
                Have an account? Login
              </span>
            </>
          ) : (
            <>
              <Button primary onClick={handleLogin} disabled={loading}>
                {loading ? "Logging In..." : "Log In"}
              </Button>
              <span
                style={{ color: "#ff6b6b", fontWeight: 500 }}
                onClick={() => {
                  setIsLogin(false);
                }}
              >
                Don't have an account? Sign Up
              </span>
            </>
          )}
        </ButtonContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    </div>
  );
}
