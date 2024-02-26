import './App.scss';
import NavHeader from './components/Navigation/NavHeader.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter as Router, Switch, Route,
} from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import AppRoutes from './routes/AppRoutes.js';
import { Rings } from 'react-loader-spinner'
import { UserContext } from './context/UserContext';
import { Scrollbars } from 'react-custom-scrollbars';
function App() {
  const { user } = useContext(UserContext);
  const [scrollHeight, setScrollHeight] = useState(0)
  useEffect(() => {
    let windowHeight = window.innerHeight;
    setScrollHeight(windowHeight)
  }, [user])
  return (
    <>
      <Scrollbars autoHide style={{ height: scrollHeight }}>

        <Router>
          {user && user.isLoading ?
            <div className='loading-container'>
              <Rings
                height="100"
                width='100'
                color='red'
                ariaLabel='loading'
              />
              <div>Loading data...</div>
            </div>
            :
            <>
              <div className='app-header'>
                <NavHeader />
              </div>
              <div className='app-container'>
                <AppRoutes />
              </div>
            </>
          }
        </Router>

        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Scrollbars>
    </>
  );
}

export default App;
