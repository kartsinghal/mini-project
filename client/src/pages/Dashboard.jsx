import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';
import { Activity, Clock, FileText, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getHistory } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { isDark } = useTheme();
  const { user, token, isLoggedIn } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    async function fetchUserHistory() {
      try {
        const res = await getHistory(token);
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserHistory();
  }, [token]);

  const bg = isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200';
  const mutedText = isDark ? 'text-gray-400' : 'text-gray-500';

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b.healthScore, 0) / history.length) 
    : '-';

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-32">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-teal-500 hover:text-teal-400 transition-colors mb-6">
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user.name}</h1>
          <p className={`${mutedText}`}>Here's an overview of your recent health queries and AI advisor logs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stat Cards */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500"><Activity size={20}/></div>
              <h3 className="font-semibold">Avg Health Score</h3>
            </div>
            <div className="text-4xl font-bold">{avgScore}</div>
          </motion.div>
          
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Clock size={20}/></div>
              <h3 className="font-semibold">Recent Checks</h3>
            </div>
            <div className="text-4xl font-bold">{history.length}</div>
          </motion.div>
          
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className={`p-6 rounded-2xl border ${cardBg}`}>
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><FileText size={20}/></div>
               <h3 className="font-semibold">Saved Reports</h3>
             </div>
             <div className="text-4xl font-bold">{history.length}</div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-6">Recent History & Trends</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
             <AlertCircle className={`mx-auto mb-4 ${mutedText}`} size={32} />
             <p className={`${mutedText} text-lg`}>No symptom checks found yet.\\nHead to the home page to start a new check.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record, i) => (
              <motion.div 
                initial={{opacity: 0, x: -10}} 
                animate={{opacity: 1, x: 0}} 
                transition={{delay: i * 0.05}}
                key={record._id} 
                className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border ${cardBg} hover:border-teal-500/50 transition-colors`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      record.category === 'Safe' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      record.category === 'Risk' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {record.category}
                    </span>
                    <span className={`text-sm ${mutedText}`}>{new Date(record.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium text-lg leading-tight mb-1">
                    {record.symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 text-left md:text-right">
                   <div className="text-3xl font-bold text-teal-500">{record.healthScore}</div>
                   <div className={`text-xs uppercase tracking-widest ${mutedText}`}>Score</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
