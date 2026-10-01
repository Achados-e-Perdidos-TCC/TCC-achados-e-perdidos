import { useState, useEffect} from 'react'; 
import Header from './components/header/header.jsx'; 
import AuthProvider  from './contexts/authContexts/AuthContext.jsx';

// Reaproveitamento de estrutura
import { Outlet } from 'react-router';

function App() {
    
    // alternar tema 
  
const [tema, setTema] = useState(() => {
        let preferencia = localStorage.getItem('tema');
        return preferencia || 'light'; 
    });

    function alternarTema(){
        setTema(tema === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
        
    }, [tema]); // É executado toda vez que o o useState (tema) muda

    return (
        <AuthProvider>
            <div className='app'>
                    <header>
                        <Header tema={tema} aoAlternarTema={alternarTema} /> 
                    </header>

                    <main className="content">
                    <Outlet context={{tema}}/> {/* Aqui entra as paginas que estarão no roteador */}
                    </main>
            </div>
        </AuthProvider>
    )
}

export default App; 
