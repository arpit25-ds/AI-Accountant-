import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PieChart as PieChartIcon, 
  Settings, 
  Users, 
  LogOut, 
  Search, 
  Bell,
  TrendingUp,
  CreditCard,
  Database,
  Plus,
  History as HistoryIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';
import { cn } from '../lib/utils';
import { ReceiptUploader } from '../components/ReceiptUploader';
import { AnalysisResult } from '../components/AnalysisResult';
import { analyzeReceipt } from '../services/gemini';
import { ReceiptAnalysis } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const PIE_DATA = [
  { name: 'Education', value: 400, color: '#3b82f6' },
  { name: 'Fiction', value: 300, color: '#10b981' },
  { name: 'Science', value: 300, color: '#8b5cf6' },
  { name: 'History', value: 200, color: '#f59e0b' },
  { name: 'Others', value: 100, color: '#94a3b8' },
];

const LINE_DATA = [
  { name: 'Jan', spent: 150, budget: 200 },
  { name: 'Feb', spent: 180, budget: 200 },
  { name: 'Mar', spent: 250, budget: 250 },
  { name: 'Apr', spent: 210, budget: 250 },
  { name: 'May', spent: 300, budget: 300 },
  { name: 'Jun', spent: 280, budget: 300 },
];

const BAR_DATA = [
  { name: 'Publisher A', cost: 100 },
  { name: 'Publisher B', cost: 65 },
  { name: 'Publisher C', cost: 75 },
  { name: 'Publisher D', cost: 50 },
  { name: 'Publisher E', cost: 60 },
  { name: 'Publisher F', cost: 30 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'history' | 'reports' | 'users' | 'settings'>('dashboard');
  const [history, setHistory] = useState<ReceiptAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReceiptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('audit_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('audit_history', JSON.stringify(history));
  }, [history]);

  const handleUpload = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    try {
      const result = await analyzeReceipt(base64, mimeType);
      setCurrentAnalysis(result);
      setHistory(prev => [result, ...prev]);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Audit failed. Please ensure the image is clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-zinc-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-zinc-900 tracking-tight">LibraryLedger</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Plus className="w-5 h-5" />} 
            label="New Audit" 
            active={activeTab === 'audit'} 
            onClick={() => setActiveTab('audit')} 
          />
          <SidebarItem 
            icon={<HistoryIcon className="w-5 h-5" />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <SidebarItem 
            icon={<FileText className="w-5 h-5" />} 
            label="Reports" 
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
          <SidebarItem 
            icon={<Users className="w-5 h-5" />} 
            label="Users" 
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-zinc-900 capitalize">{activeTab}</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-zinc-100 border-none rounded-full pl-10 pr-4 py-2 text-sm text-zinc-600 focus:ring-2 focus:ring-sky-500/20 w-64"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-10 h-10 rounded-full bg-zinc-200 border border-zinc-300 overflow-hidden">
                <img src="https://picsum.photos/seed/user/100" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <KPICard 
                    label="Total Digital Assets" 
                    value="2,350,000" 
                    tag="Total" 
                    icon={<Database className="w-5 h-5 text-sky-600" />} 
                  />
                  <KPICard 
                    label="Active Subscriptions" 
                    value="42" 
                    tag="KPI" 
                    progress={65}
                    icon={<CreditCard className="w-5 h-5 text-emerald-600" />} 
                  />
                  <KPICard 
                    label="Budget Remaining" 
                    value="$1,250,000" 
                    tag="Progress" 
                    progress={80}
                    color="emerald"
                    icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} 
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Donut Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-6">Digital Book Downloads by Genre</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PIE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Line Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-6">Year-over-Year (YoY) Money Spent</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={LINE_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="spent" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-6">Cost-per-Circulation by Publisher</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={BAR_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">New Receipt Audit</h3>
                  <ReceiptUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
                </div>

                {currentAnalysis && (
                  <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                    <AnalysisResult analysis={currentAnalysis} />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {history.length === 0 ? (
                  <div className="text-center py-20 text-zinc-400 bg-white rounded-3xl border border-zinc-200">
                    <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No audit history found.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => { setCurrentAnalysis(item); setActiveTab('audit'); }}
                      className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-sky-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          item.category === 'Physical Books' ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
                        )}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 group-hover:text-sky-600 transition-colors">{item.vendorName}</h4>
                          <p className="text-sm text-zinc-500">{new Date(item.timestamp).toLocaleDateString()} • {item.items.length} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-zinc-900">{item.currency} {item.totalAmount.toLocaleString()}</p>
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full",
                          item.category === 'Physical Books' ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                        )}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div 
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Financial Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Monthly Expenditure Summary', date: 'March 2026', type: 'PDF' },
                      { title: 'Digital License Audit Log', date: 'Q1 2026', type: 'CSV' },
                      { title: 'Publisher Cost Analysis', date: 'Annual 2025', type: 'XLSX' },
                      { title: 'Tax Compliance Report', date: 'FY 2025-26', type: 'PDF' },
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900">{report.title}</p>
                            <p className="text-xs text-zinc-500">{report.date} • {report.type}</p>
                          </div>
                        </div>
                        <button className="text-sky-600 font-bold text-sm hover:underline">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold">Manage Staff</h3>
                    <button className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add User
                    </button>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-8 py-4">User</th>
                        <th className="px-8 py-4">Role</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {[
                        { name: 'Sarah Jenkins', email: 'sarah.j@library.org', role: 'Admin', status: 'Active', active: '2 mins ago', img: 'https://picsum.photos/seed/sarah/100' },
                        { name: 'Michael Chen', email: 'm.chen@library.org', role: 'Accountant', status: 'Active', active: '1 hour ago', img: 'https://picsum.photos/seed/michael/100' },
                        { name: 'Elena Rodriguez', email: 'elena.r@library.org', role: 'Librarian', status: 'Away', active: '3 hours ago', img: 'https://picsum.photos/seed/elena/100' },
                        { name: 'David Smith', email: 'd.smith@library.org', role: 'Viewer', status: 'Inactive', active: '2 days ago', img: 'https://picsum.photos/seed/david/100' },
                      ].map((user, i) => (
                        <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <img src={user.img} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-bold text-zinc-900">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm text-zinc-600">{user.role}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                              user.status === 'Active' ? "bg-emerald-100 text-emerald-700" : 
                              user.status === 'Away' ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-700"
                            )}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-sm text-zinc-500">{user.active}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold">Library Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Library Name</label>
                      <input type="text" defaultValue="Central Digital Library" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-sky-500/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Business Email</label>
                      <input type="email" defaultValue="finance@library.org" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-sky-500/20 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Currency</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-sky-500/20 outline-none">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Timezone</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-sky-500/20 outline-none">
                          <option>UTC-5 (EST)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+1 (CET)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">Save Changes</button>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold">Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Audit Completion', desc: 'Notify when AI finishes analyzing a receipt' },
                      { label: 'Budget Alerts', desc: 'Notify when spending exceeds 80% of budget' },
                      { label: 'New User Joined', desc: 'Notify when a new staff member is added' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-zinc-900">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-sky-600 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
        active ? "bg-sky-50 text-sky-600" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      <div className={cn("transition-colors", active ? "text-sky-600" : "text-zinc-400 group-hover:text-zinc-600")}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function KPICard({ label, value, tag, icon, progress, color = 'sky' }: { label: string, value: string, tag: string, icon: React.ReactNode, progress?: number, color?: 'sky' | 'emerald' }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-zinc-50 rounded-lg">
          {icon}
        </div>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
          color === 'sky' ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"
        )}>
          {tag}
        </span>
      </div>
      <p className="text-zinc-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-900 mb-4">{value}</p>
      {progress !== undefined && (
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className={cn("h-full rounded-full", color === 'sky' ? "bg-sky-500" : "bg-emerald-500")}
          />
        </div>
      )}
    </div>
  );
}
