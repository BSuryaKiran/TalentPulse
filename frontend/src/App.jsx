import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
