import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s, color 0.2s;
  }
`;


export const Container = styled.div`
  padding: 1rem;
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Select = styled.select`
  padding: 1rem 2rem;
  font-size: 1rem;
  /* margin-left: -50px; */
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};

  /* &:focus {
    outline: none;
    border-color: #0077ff;
  } */
`;
export const LogoutButton = styled.button`
  background: ${({ theme }) => theme.danger};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
`;

export const ThemeToggle = styled.button`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 0.4rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
`;

export const AddButton = styled.button`
  background: ${({ theme }) => theme.accent};
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
`;

export const ExpenseList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  transition:0.2s;
`;

export const ExpenseItem = styled.li`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const ExpenseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const ExpenseDesc = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

export const ExpenseAmount = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.accent};
  margin-left: 1rem;
`;

export const ExpenseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.95em;
  color: ${({ theme }) => theme.muted};
`;

export const CategoryBadge = styled.span`
  background: ${({ theme }) => theme.accent}22;
  color: ${({ theme }) => theme.accent};
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 0.9em;
  font-weight: 500;
`;

export const Statstics = styled.div`
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
    background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const ChartWrapper = styled.div`
  margin: 2rem 0;
  width: 70%;
  @media (max-width: 600px) {
    overflow-x: auto;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const PageButton = styled.button`
  background: ${({ active, theme }) => (active ? theme.accent : theme.card)};
  color: ${({ active, theme }) => (active ? "#fff" : theme.text)};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
