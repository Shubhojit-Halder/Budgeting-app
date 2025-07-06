import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  GlobalStyle,
  Container,
  Header,
  LogoutButton,
  ThemeToggle,
  Form,
  Input,
  AddButton,
  ExpenseList,
  ExpenseItem,
  ExpenseRow,
  ExpenseDesc,
  ExpenseAmount,
  ExpenseMeta,
  CategoryBadge,
  ChartWrapper,
  PaginationWrapper,
  PageButton,
  Statstics,
  Select,
} from "./BudgetTracker.styles";
import { ThemeProvider } from "styled-components";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Theme definitions
const lightTheme = {
  background: "#ececec",
  text: "#1f2937",
  card: "#fff",
  border: "#e5e7eb",
  accent: "#3b82f6",
  danger: "#ef4444",
  muted: "#6b7280",
};
const darkTheme = {
  background: "#151519",
  text: "#e8e8e8",
  card: "#27272a",
  border: "#3f3f46",
  accent: "#6360fa",
  danger: "#ef4444",
  muted: "#83838d",
};

function categorize(description) {
  const rules = [
    { keywords: ["zomato", "swiggy", "restaurant"], category: "Food" },
    {
      keywords: ["sip", "mutual fund", "stocks", "investment"],
      category: "Investment",
    },
    { keywords: ["movie", "cinema", "theater"], category: "Entertainment" },
    {
      keywords: [
        "uber",
        "ola",
        "taxi",
        "cab",
        "auto",
        "ride",
        "bus",
        "train",
        "metro",
      ],
      category: "Transport",
    },
    {
      keywords: [
        "amazon",
        "flipkart",
        "ajio",
        "myntra",
        "westside",
        "max",
        "pantaloons",
        "zara",
        "h&m",
        "tshirt",
        "shirt",
        "pant",
        "jeans",
      ],
      category: "Shopping",
    },
    {
      keywords: [
        "bigbasket",
        "grofers",
        "dmart",
        "reliance fresh",
        "spencer",
        "more supermarket",
        "vegetables",
        "fruits",
        "grocery",
      ],
      category: "Groceries",
    },
    { keywords: ["rent"], category: "Housing" },
    {
      keywords: ["wifi", "electricity", "broadband", "bill", "recharge", "mobile", "internet", "data", "phone", "cable", "tv", "battery"],
      category: "Utilities",
    },
  ];

  const lower = description.toLowerCase();
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) return rule.category;
    }
  }
  return "Misseleneous"; // Default category if no match found
}

function BudgetTracker({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Debit Card"); // Default payment type
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(true); // <-- Set to true for default dark mode
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-based
  const itemsPerPage = 5; // Number of items per page
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error.message);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  const addExpense = async () => {
    if (!description || !amount || !date) {
      alert("All fields are required!");
      return;
    }

    const category = categorize(description);

    const { error } = await supabase.from("expenses").insert([
      {
        description,
        amount: parseFloat(amount),
        date,
        category,
        payment_type: paymentType,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding expense:", error.message);
    } else {
      setDescription("");
      setAmount("");
      setDate("");
      setPaymentType(""); // Reset payment type
      fetchExpenses();
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      navigate("/");
    }
  };

  // Get unique years from expenses for the year selector
  const years = Array.from(
    new Set(expenses.map((exp) => new Date(exp.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Pie chart data for selected month/year
  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return (
      date.getFullYear() === Number(selectedYear) &&
      date.getMonth() + 1 === Number(selectedMonth)
    );
  });

  const categoryTotals = filteredExpenses.reduce((totals, expense) => {
    const { category, amount } = expense;
    totals[category] = (totals[category] || 0) + amount;
    return totals;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#42ff55",
          "#36A2EB",
          "#FFCE56",
          "#ff3a3a",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#42ff55",
          "#36A2EB",
          "#FFCE56",
          "#ff3a3a",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Bar chart data
  const monthlyTotals = expenses.reduce((totals, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });
    totals[month] = (totals[month] || 0) + expense.amount;
    return totals;
  }, {});

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlyTotals),
        backgroundColor: "#ebe236",
        borderColor: "#ebe236",
        borderWidth: 1,
      },
    ],
  };

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Container>
        <Header>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
            <ThemeToggle
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <>
                  <span
                    aria-label="Sun"
                    style={{ fontSize: "1.5rem", borderRadius: "50px" }}
                  >
                    🌞
                  </span>
                </>
              ) : (
                <>
                  <span aria-label="Moon">🌙</span>
                </>
              )}
            </ThemeToggle>
          </div>
          <h1>
            Welcome to{" "}
            <span style={{ color: "#5729ffe4" }}>PennyWISE</span>
          </h1>
          <p>User: {user.email.split('@')[0]}</p>
        </Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            addExpense();
          }}
        >
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            placeholder="Date"
            type="date"
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{
              padding: "0.4rem",
              borderRadius: 4,
            }}
          >
            {["Credit", "Debit", "Cash"].map((typ, idx) => (
              <option key={typ} value={typ} id={`Type${idx}`}>
                {typ}
              </option>
            ))}
          </Select>
          <AddButton type="submit">Add Expense</AddButton>
        </Form>

        <h2>Expenses</h2>
        <ExpenseList>
          {paginatedExpenses.map((exp) => (
            <ExpenseItem key={exp.id}>
              <ExpenseRow>
                <ExpenseDesc>{exp.description}</ExpenseDesc>
                <ExpenseAmount>₹{exp.amount}</ExpenseAmount>
              </ExpenseRow>
              <ExpenseMeta>
                <span>{exp.date}</span>
                <CategoryBadge>{exp.category}</CategoryBadge>
              </ExpenseMeta>
            </ExpenseItem>
          ))}
        </ExpenseList>
        <PaginationWrapper>
          <PageButton
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </PageButton>
          {[...Array(totalPages)].map((_, idx) => (
            <PageButton
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </PaginationWrapper>

        <Statstics>
          {/* Year and Month Selectors */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <label>
              Year:
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  marginLeft: 8,
                  padding: "0.4rem",
                  borderRadius: 4,
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </label>
            <label>
              Month:
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  marginLeft: 8,
                  padding: "0.4rem",
                  borderRadius: 4,
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          <h3>Expense Distribution - {months[selectedMonth - 1]}</h3>
          <ChartWrapper>
            <Pie data={pieData} />
          </ChartWrapper>

          <h3>Monthly Spending</h3>
          <ChartWrapper>
            <Bar data={barData} />
          </ChartWrapper>
        </Statstics>
      </Container>
    </ThemeProvider>
  );
}

export default BudgetTracker;
