import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { AppProvider } from './context/AppContext'
function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
