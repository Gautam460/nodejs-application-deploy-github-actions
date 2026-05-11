import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardCard from "../components/DashboardCard";
import { LineChart } from "chartist";
import "chartist/dist/index.css";
import { ShoppingBag, Truck, Store, Users, CreditCard, RotateCcw, ShoppingCart, Package, Plus, TrendingUp, ArrowRight } from "lucide-react";
import { productApi } from "../../api/product.api";
import { userApi } from "../../api/user.api";
import { orderApi } from "../../api/order.api";
import { roleApi } from "../../api/role.api";
import { dashboardApi } from "../../api/dashboard.api";

const getAdminUser = () => {
  try {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : {};
  } catch (e) { return {}; }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getAdminUser();
  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    b2cSales: 0,
    b2bSales: 0,
    totalVendors: 0,
    pendingPayments: 0,
    refundRequests: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], series: [[], []] });
  
  const lineChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  useEffect(() => {
    if (permissions.length > 0 || user.role === 'superadmin') {
      fetchDashboardData();
    }
  }, [permissions]);

  useEffect(() => {
    if (lineChartRef.current && chartData.labels.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.update(chartData);
      } else {
        chartInstance.current = new LineChart(lineChartRef.current, chartData, {
          low: 0,
          showArea: true,
          height: "300px",
          fullWidth: true,
          axisY: { onlyInteger: true },
          lineSmooth: true,
        });
      }
    }
  }, [chartData]);

  const fetchUserPermissions = async () => {
    try {
      if (user.role === 'superadmin') {
        setPermissions(['ALL']);
        return;
      }
      const response = await roleApi.getAllRoles();
      const userRole = response.data.find(r => r.name === user.role);
      if (userRole?.permissions) {
        setPermissions(userRole.permissions.map(p => p.key));
      }
    } catch (error) { console.error(error); }
  };

  const hasPermission = (key) => user.role === 'superadmin' || permissions.includes(key);

  const fetchDashboardData = async () => {
    try {
      const promises = [];
      if (hasPermission('manage_products')) promises.push(productApi.getAllProducts());
      if (hasPermission('manage_users')) promises.push(userApi.getAllUsers());
      if (hasPermission('manage_orders')) promises.push(orderApi.getAllOrders());
      if (user.role === 'superadmin') promises.push(dashboardApi.getSuperAdminStats());

      const results = await Promise.allSettled(promises);
      let products = [], users = [], orders = [], superStats = null, index = 0;

      if (hasPermission('manage_products')) products = results[index++]?.value?.data || [];
      if (hasPermission('manage_users')) users = results[index++]?.value?.data || [];
      if (hasPermission('manage_orders')) orders = results[index++]?.value?.data || [];
      if (user.role === 'superadmin') superStats = results[index++]?.value?.data;

      if (superStats) {
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((s, o) => s + parseFloat(o.totalAmount || 0), 0),
          totalProducts: products.length,
          totalCustomers: superStats.totalCustomers || 0,
          b2cSales: superStats.b2cSales || 0,
          b2bSales: superStats.b2bSales || 0,
          totalVendors: superStats.totalVendors || 0,
          pendingPayments: superStats.pendingPayments || 0,
          refundRequests: superStats.refundRequestsCount || 0
        });

        if (superStats.monthlySales) {
          const labels = [...new Set(superStats.monthlySales.map(s => s.month))];
          const b2c = labels.map(l => Number(superStats.monthlySales.find(s => s.month === l && s.type === 'retail')?.total || 0));
          const b2b = labels.map(l => Number(superStats.monthlySales.find(s => s.month === l && s.type === 'wholesale')?.total || 0));
          setChartData({ labels, series: [b2c, b2b] });
        }
      }
      setRecentProducts([...products].sort((a, b) => b.id - a.id).slice(0, 5));
    } catch (error) { console.error(error); }
  };

  return (
    <AdminLayout role={user.role} title="Dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Merchant Insights</h1>
          <p className="text-muted mb-0">Track your store performance and sales analytics.</p>
        </div>
        <button 
          className="btn d-flex align-items-center gap-2 px-4" 
          style={{ background: 'var(--accent-base)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, height: '42px' }}
          onClick={() => navigate('/admin/products')}
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <DashboardCard icon={ShoppingBag} title="Retail Sales" value={`₹${stats.b2cSales.toLocaleString()}`} color="var(--accent-base)" bgColor="var(--accent-soft)" trend={12} />
        </div>
        <div className="col-xl-3 col-md-6">
          <DashboardCard icon={Truck} title="Wholesale" value={`₹${stats.b2bSales.toLocaleString()}`} color="#10b981" bgColor="rgba(16, 185, 129, 0.1)" trend={8} />
        </div>
        <div className="col-xl-3 col-md-6">
          <DashboardCard icon={Users} title="Customers" value={stats.totalCustomers} color="#8b5cf6" bgColor="rgba(139, 92, 246, 0.1)" trend={-2} />
        </div>
        <div className="col-xl-3 col-md-6">
          <DashboardCard icon={Store} title="Vendors" value={stats.totalVendors} color="#ec4899" bgColor="rgba(236, 72, 153, 0.1)" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="dashboard-card">
            <h2 className="mb-4">Revenue Trends</h2>
            <div ref={lineChartRef}></div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Recent Items</h2>
              <button className="btn btn-link p-0 text-decoration-none" style={{ color: 'var(--accent-base)', fontSize: '14px', fontWeight: 600 }} onClick={() => navigate('/admin/products')}>View All</button>
            </div>
            <div className="d-flex flex-column gap-3">
              {recentProducts.map(p => (
                <div key={p.id} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                    <div>
                      <div className="fw-bold text-truncate" style={{ maxWidth: '140px', fontSize: '13px', color: 'var(--text-primary)' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>₹{parseFloat(p.price).toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="icon-btn" style={{ width: '32px', height: '32px' }}><ArrowRight size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
