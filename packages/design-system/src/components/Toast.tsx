import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Check, AlertCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export { toast };

export const Toast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      theme="light"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastStyle={{
        backgroundColor: 'white',
        color: '#18181b',
        border: '1px solid #e4e4e7',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        fontFamily: 'inherit',
      }}
      icon={({ type }) => {
        if (type === 'success') {
          return <Check className="w-5 h-5 text-violet-500" />;
        }
        if (type === 'error') {
          return <AlertCircle className="w-5 h-5 text-red-500" />;
        }
        return true; // Use default icon for other types
      }}
    />
  );
}; 