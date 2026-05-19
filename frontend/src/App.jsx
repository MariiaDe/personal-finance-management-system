import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import AppRouter from "./routes/AppRouter";
import IconSprite from "./components/IconSprite";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IconSprite />
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
