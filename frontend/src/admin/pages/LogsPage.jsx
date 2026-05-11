import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { logApi } from "../../api/log.api";
import toast from "react-hot-toast";
import { RefreshCcw, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const LogsPage = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchLogs();
  }, [selectedDate]);

  useEffect(() => {
    let result = logs;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(lower) || 
        log.level.toLowerCase().includes(lower)
      );
    }
    setFilteredLogs(result);
    setCurrentPage(1);
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await logApi.getLogs(selectedDate);
      if (res.data && res.data.logs) {
         const parsedLogs = res.data.logs.map((line, index) => {
             const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
             if (match) {
                 return { id: index, level: match[1], timestamp: match[2], message: match[3], raw: line };
             }
             return { id: index, level: 'UNKNOWN', timestamp: '', message: line, raw: line };
         });
         setLogs(parsedLogs);
         setFilteredLogs(parsedLogs);
      }
    } catch (error) {
      toast.error("Failed to fetch logs");
      setLogs([]);
      setFilteredLogs([]);
    } finally {
        setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getLevelBadge = (level) => {
    switch (level) {
      case 'INFO': return 'bg-info bg-opacity-10 text-info';
      case 'ERROR': return 'bg-danger bg-opacity-10 text-danger';
      case 'WARN': return 'bg-warning bg-opacity-10 text-warning';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  return (
    <AdminLayout role={user.role} title="Audit Logs">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
               <h5 className="mb-1 fw-bold">System Logs ({filteredLogs.length})</h5>
               <p className="text-muted small mb-0">View system activities and errors by date.</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
                 <input type="date" className="form-control form-control-sm rounded-pill" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                 <button className="btn btn-outline-primary rounded-pill btn-sm px-3 d-flex align-items-center gap-1" onClick={fetchLogs}>
                    <RefreshCcw size={14} /> Refresh
                 </button>
            </div>
          </div>
        </div>

        <div className="card-body border-bottom bg-light bg-opacity-10 py-3">
             <div className="position-relative">
                <input type="text" className="form-control rounded-pill ps-5 border-0 shadow-sm" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
             </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{fontSize: '0.85rem'}}>
              <thead className="table-light">
                <tr><th className="px-4 py-2 border-0" style={{width: '200px'}}>Timestamp</th><th className="py-2 border-0" style={{width: '100px'}}>Level</th><th className="py-2 border-0">Message</th></tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan="3" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : currentLogs.length > 0 ? (
                    currentLogs.map(log => (
                        <tr key={log.id}>
                            <td className="px-4 text-muted small font-monospace">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '-'}</td>
                            <td><span className={`badge rounded-pill ${getLevelBadge(log.level)}`}>{log.level}</span></td>
                            <td className="font-monospace text-dark" style={{wordBreak: 'break-all'}}>{log.message}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center py-5 text-muted">
                            <FileText size={48} className="mb-3 opacity-20" />
                            <p className="mb-0">No logs found for this date.</p>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length > itemsPerPage && (
             <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">Page {currentPage} of {totalPages}</small>
                <div className="btn-group">
                    <button className="btn btn-outline-light text-dark btn-sm rounded-start-pill px-3 border" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                        <ChevronLeft size={16} />
                    </button>
                    <button className="btn btn-outline-light text-dark btn-sm rounded-end-pill px-3 border" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                        <ChevronRight size={16} />
                    </button>
                </div>
             </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LogsPage;
