import { renderRoutes } from './routes/renderRoutes'; // Import your route renderer
import { ToastProvider } from './components/ToastContext';




function App() {
  return (
        <div>
              <ToastProvider>
          {renderRoutes()} {/* Your route renderer */}
              </ToastProvider>
        </div>
  );
}

export default App;
