import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder } from '../api/orderApi';
import { 
  Database, Cpu, Mail, BarChart3, Package, Zap, 
  Terminal, Play, Activity, Clock, Server, ArrowRight
} from 'lucide-react';

interface LogEntry {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'system';
}

export const Architecture: React.FC = () => {
  const { events } = useSocket();
  const latestEvent = events[0];
  
  const [loading, setLoading] = useState(false);
  const [activeSimulatorStep, setSimulatorStep] = useState<number | null>(null);
  const [activeTopic, setActiveTopic] = useState<string>('Awaiting Events...');
  const [selectedProduct, setSelectedProduct] = useState<string>('Premium Laptop');
  const [quantity, setQuantity] = useState<number>(1);
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString(), msg: "Event Bus initialized. Listening for telemetry on port 5004.", type: 'system' }
  ]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'system' = 'info') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  // Monitor live socket events
  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0]!;
      addLog(`[Kafka Event Received] Topic: "${latest.topic}" | Type: "${latest.type}"`, 'success');
      
      if (latest.type === 'ORDER_CREATED') {
        addLog(`  ↳ Order Service: Registered order for "${latest.payload.product}" (Qty: ${latest.payload.quantity})`, 'info');
      } else if (latest.type === 'INVENTORY_UPDATED') {
        addLog(`  ↳ Inventory Service: Stock updated atomically for "${latest.payload.product}". New stock: ${latest.payload.newStock}`, 'info');
      } else if (latest.type === 'ANALYTICS_UPDATED') {
        addLog(`  ↳ Analytics Service: Metrics refreshed. Aggregated Sold: ${latest.payload.totalProductsSold} | Total Orders: ${latest.payload.totalOrders}`, 'info');
      } else if (latest.type === 'NOTIFICATIONS_SENT') {
        addLog(`  ↳ Notification Service: Mock email dispatched successfully (Status: ${latest.payload.status})`, 'info');
      }
    }
  }, [events]);

  const simulateOrder = async () => {
    if (loading) return;
    setLoading(true);
    setSimulatorStep(1);
    setActiveTopic('orders.created (publishing)');
    addLog(`Initiating order simulation via REST request. Product: "${selectedProduct}", Qty: ${quantity}`, 'system');
    
    try {
      addLog(`Sending POST /orders call to localhost:5001...`, 'info');
      const order = await createOrder({ product: selectedProduct, quantity });
      addLog(`Order Saved! DB ID: ${order._id.substring(18)}`, 'success');
      
      // Step 2: The event is injected into Kafka
      setTimeout(() => {
        setSimulatorStep(2);
        setActiveTopic('orders.created');
        addLog(`Kafka Broker: Enqueued event "orders.created" on partition 0`, 'success');
      }, 2000);
      
      // Step 3: Kafka broadcasts the events to the Consumer group across the cluster
      setTimeout(() => {
        setSimulatorStep(3);
        setActiveTopic('orders.created (broadcasting)');
        addLog(`Kafka Broker: Multiplexing messages to Group Consumers...`, 'system');
      }, 4000);
      
      // Step 4: Finished simulation
      setTimeout(() => {
        setSimulatorStep(4);
        setActiveTopic('System Idle');
        addLog(`Flow simulation complete. Services returned to idle listening.`, 'system');
      }, 6500);

      // Final Reset
      setTimeout(() => {
        setSimulatorStep(null);
        setLoading(false);
      }, 8000);

    } catch(e) {
      console.error(e);
      addLog(`Simulation aborted. Order Service returned a connection/validation error.`, 'warn');
      setSimulatorStep(null);
      setLoading(false);
    }
  }

  const simulateStressTest = async () => {
    if (loading) return;
    setLoading(true);
    setSimulatorStep(1);
    setActiveTopic('orders.created (batching)');
    addLog(`[STRESS-TEST] Launching 5 concurrent REST requests in parallel...`, 'warn');

    const items = ["Mechanical Keyboard", "Premium Laptop", "Wireless Headphones"];
    
    try {
      const promises = Array.from({ length: 5 }).map(async (_, idx) => {
        const prod = items[idx % items.length]!;
        const qty = Math.floor(Math.random() * 3) + 1;
        addLog(`Dispatching concurrent POST /orders for "${prod}" (Qty: ${qty})`, 'info');
        return createOrder({ product: prod, quantity: qty });
      });

      const results = await Promise.all(promises);
      addLog(`[STRESS-TEST] All 5 orders successfully processed and saved. IDs: ${results.map(r => r._id.substring(20)).join(', ')}`, 'success');

      setTimeout(() => {
        setSimulatorStep(2);
        setActiveTopic('orders.created (queueing)');
        addLog(`Kafka Broker: Partition 0 enqueued 5 new event frames. Processing queue...`, 'success');
      }, 2000);

      setTimeout(() => {
        setSimulatorStep(3);
        setActiveTopic('orders.created (batch broadcast)');
        addLog(`Kafka Broker: Broadcasting batch events to consumer group.`, 'system');
      }, 4000);

      setTimeout(() => {
        setSimulatorStep(4);
        setActiveTopic('System Idle');
        addLog(`[STRESS-TEST] Batch processing complete. In-memory safety holds.`, 'system');
      }, 6500);

      setTimeout(() => {
        setSimulatorStep(null);
        setLoading(false);
      }, 8000);

    } catch (err) {
      console.error(err);
      addLog(`[STRESS-TEST] Failed. Ensure order-service and mongo container are active.`, 'warn');
      setSimulatorStep(null);
      setLoading(false);
    }
  };

  // Descriptions for steps
  const getSimulationText = () => {
    switch (activeSimulatorStep) {
      case 1: return "Producer Tier: HTTP Request received. Order Service inserts order into Database and publishes 'orders.created' event.";
      case 2: return "Broker Tier: Event is acknowledged by the Apache Kafka Cluster and queued in partition log.";
      case 3: return "Consumer Group Tier: Consumers fetch the event stream concurrently and trigger atomic DB updates / emails.";
      case 4: return "Telemetry Sync: Socket.io relays all processing statistics back to the Client UI.";
      default: return "System Listening: Awaiting REST traffic on port 5001 or Kafka events.";
    }
  };

  const activeService = activeSimulatorStep !== null 
    ? (activeSimulatorStep === 1 ? 'Order Service' : activeSimulatorStep === 3 ? 'ALL_CONSUMERS' : null)
    : latestEvent?.service;

  const isKafkaActive = activeSimulatorStep !== null 
    ? (activeSimulatorStep === 2 || activeSimulatorStep === 3) 
    : !!latestEvent;

  const getServiceStatus = (service: string) => {
    if (activeService === 'ALL_CONSUMERS' && ['Inventory Service', 'Notification Service', 'Analytics Service'].includes(service)) {
      return 'active';
    }
    return activeService === service ? 'active' : 'idle';
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto select-none">
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
      `}</style>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/35 backdrop-blur-xl border border-neutral-800/80 p-6 rounded-2xl shadow-2xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Zap className="text-purple-500 fill-purple-500/20 w-8 h-8 animate-pulse" />
            Smart Commerce Flow
          </h1>
          <p className="text-neutral-400 mt-1.5 font-medium max-w-xl text-sm leading-relaxed">
            Real-time telemetry and microservice orchestration viewer. Monitor reactive data pipelines driven by Apache Kafka and WebSockets.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-800 px-4 py-2.5 rounded-xl font-mono text-xs text-neutral-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          WebSocket: <span className="text-emerald-400 font-bold">Connected (Port 5004)</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Architectural Diagram */}
        <div className="lg:col-span-8 bg-neutral-900/10 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-8 pb-16 flex flex-col items-center justify-start pt-12 relative min-h-[620px] shadow-2xl overflow-hidden">
          
          {/* Grid background effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

          <div className="w-full max-w-2xl flex flex-col items-center relative z-10">
            
            {/* TIER 1: PRODUCER */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className={`transition-all duration-500 w-64 p-5 rounded-2xl border-2 backdrop-blur-xl relative z-10 flex flex-col items-center ${
                getServiceStatus('Order Service') === 'active' 
                  ? 'border-emerald-500 bg-neutral-900/90 shadow-[0_0_35px_rgba(16,185,129,0.25)] text-white scale-105' 
                  : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 opacity-70'
              }`}>
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase font-mono">Tier 1: Producer</span>
                  <div className="bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] text-emerald-400 border border-emerald-500/20 font-mono font-bold">Port 5001</div>
                </div>
                <div className="text-xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
                  <Cpu className={`w-5 h-5 ${getServiceStatus('Order Service') === 'active' ? 'text-emerald-400 animate-spin-slow' : 'text-neutral-500'}`} />
                  Order Service
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                  <Database className="w-3.5 h-3.5 text-neutral-500" />
                  MongoDB: <span className="text-neutral-300">order-db</span>
                </div>
              </div>
            </div>

            {/* CONNECTION 1 (SVG flow to Kafka) */}
            <div className="w-full h-14 flex justify-center">
              <svg className="w-8 h-full" viewBox="0 0 20 56" fill="none">
                <line x1="10" y1="0" x2="10" y2="56" stroke="#404040" strokeWidth="2.5" />
                {(activeSimulatorStep === 1 || activeSimulatorStep === 2 || latestEvent?.topic === 'orders.created') && (
                  <line 
                    x1="10" y1="0" x2="10" y2="56" 
                    stroke="#a855f7" strokeWidth="3.5" 
                    strokeDasharray="6,6" 
                    className="animate-[dash_1s_linear_infinite]" 
                  />
                )}
              </svg>
            </div>

            {/* TIER 2: EVENT BUS (KAFKA) */}
            <div className="relative w-80">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25" />
              <div className={`transition-all duration-500 py-4 px-6 rounded-full border-2 backdrop-blur-xl relative z-10 flex flex-col items-center justify-center ${
                isKafkaActive 
                  ? 'border-purple-500 bg-neutral-900/90 shadow-[0_0_40px_rgba(168,85,247,0.25)] text-white' 
                  : 'border-neutral-800 bg-neutral-900/40 text-neutral-500 opacity-70'
              }`}>
                <span className="text-[9px] font-black tracking-widest text-purple-400 uppercase font-mono mb-1">Tier 2: Event Bus</span>
                <div className="text-2xl font-black text-white flex items-center gap-2 tracking-wider">
                  <Zap className={`w-5 h-5 ${isKafkaActive ? 'text-purple-400 fill-purple-400/20' : 'text-neutral-500'}`} />
                  APACHE KAFKA
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-purple-400" />
                  Topic: <span className="text-neutral-200 font-bold">{activeTopic}</span>
                </div>
              </div>
            </div>

            {/* CONNECTION 2 (Branching SVG to Consumers) */}
            <div className="w-full h-16 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 64" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="purple-pink" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="purple-orange" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Background lines */}
                <path d="M 300 0 L 300 24 L 100 24 L 100 64" stroke="#404040" strokeWidth="2.5" />
                <path d="M 300 0 L 300 64" stroke="#404040" strokeWidth="2.5" />
                <path d="M 300 0 L 300 24 L 500 24 L 500 64" stroke="#404040" strokeWidth="2.5" />

                {/* Animated active lines */}
                {(activeSimulatorStep === 3 || latestEvent) && (
                  <>
                    <path 
                      d="M 300 0 L 300 24 L 100 24 L 100 64" 
                      stroke="url(#purple-blue)" strokeWidth="3.5" 
                      strokeDasharray="6,6" 
                      className="animate-[dash_1s_linear_infinite]" 
                    />
                    <path 
                      d="M 300 0 L 300 64" 
                      stroke="url(#purple-pink)" strokeWidth="3.5" 
                      strokeDasharray="6,6" 
                      className="animate-[dash_1s_linear_infinite]" 
                    />
                    <path 
                      d="M 300 0 L 300 24 L 500 24 L 500 64" 
                      stroke="url(#purple-orange)" strokeWidth="3.5" 
                      strokeDasharray="6,6" 
                      className="animate-[dash_1s_linear_infinite]" 
                    />
                  </>
                )}
              </svg>
            </div>

            {/* TIER 3: CONSUMERS GRID */}
            <div className="w-full grid grid-cols-3 gap-4">
              
              {/* Consumer A: Inventory Service */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-blue-500 rounded-2xl blur transition duration-500 ${getServiceStatus('Inventory Service') === 'active' ? 'opacity-25' : 'opacity-0'}`} />
                <div className={`transition-all duration-500 p-4 rounded-2xl border-2 backdrop-blur-xl relative z-10 flex flex-col items-center h-full ${
                  getServiceStatus('Inventory Service') === 'active'
                    ? 'border-blue-500 bg-neutral-900/90 shadow-[0_0_25px_rgba(59,130,246,0.2)] text-white scale-105'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 opacity-70'
                }`}>
                  <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase font-mono mb-2">Consumer A</span>
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-400" />
                    Inventory Service
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono mt-auto">
                    <Database className="w-3 h-3 text-neutral-500" />
                    MongoDB: <span className="text-neutral-300 font-bold">inventory-db</span>
                  </div>
                </div>
              </div>

              {/* Consumer B: Analytics Service */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-pink-500 rounded-2xl blur transition duration-500 ${getServiceStatus('Analytics Service') === 'active' ? 'opacity-25' : 'opacity-0'}`} />
                <div className={`transition-all duration-500 p-4 rounded-2xl border-2 backdrop-blur-xl relative z-10 flex flex-col items-center h-full ${
                  getServiceStatus('Analytics Service') === 'active'
                    ? 'border-pink-500 bg-neutral-900/90 shadow-[0_0_25px_rgba(236,72,153,0.2)] text-white scale-105'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 opacity-70'
                }`}>
                  <span className="text-[9px] font-black tracking-widest text-pink-400 uppercase font-mono mb-2">Consumer B</span>
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-pink-400" />
                    Analytics Service
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono mt-auto">
                    <Server className="w-3 h-3 text-neutral-500" />
                    Websocket: <span className="text-neutral-300 font-bold">Port 5004</span>
                  </div>
                </div>
              </div>

              {/* Consumer C: Notification Service */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-amber-500 rounded-2xl blur transition duration-500 ${getServiceStatus('Notification Service') === 'active' ? 'opacity-25' : 'opacity-0'}`} />
                <div className={`transition-all duration-500 p-4 rounded-2xl border-2 backdrop-blur-xl relative z-10 flex flex-col items-center h-full ${
                  getServiceStatus('Notification Service') === 'active'
                    ? 'border-amber-500 bg-neutral-900/90 shadow-[0_0_25px_rgba(245,158,11,0.2)] text-white scale-105'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 opacity-70'
                }`}>
                  <span className="text-[9px] font-black tracking-widest text-amber-400 uppercase font-mono mb-2">Consumer C</span>
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    Notification Service
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono mt-auto">
                    <Activity className="w-3 h-3 text-neutral-500" />
                    Target: <span className="text-neutral-300 font-bold">Mock SMTP</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Status info bar */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-900/60 pt-3">
            <span>Orchestrator Mode: <strong className="text-neutral-300">Choreography</strong></span>
            <span className="font-mono text-neutral-400">{getSimulationText()}</span>
          </div>

        </div>

        {/* Right Column: Control Center & Real-Time System Log Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card: Traffic Simulator */}
          <div className="bg-neutral-900/20 backdrop-blur-xl border border-neutral-800/80 p-6 rounded-3xl shadow-xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Play className="text-purple-400 w-5 h-5" />
              <h2 className="text-lg font-black text-white">Telemetry Simulator</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500 font-mono mb-1.5 block">Select Product</label>
                <select 
                  value={selectedProduct} 
                  onChange={e => setSelectedProduct(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none transition-colors"
                >
                  <option value="Premium Laptop">💻 Premium Laptop</option>
                  <option value="Wireless Headphones">🎧 Wireless Headphones</option>
                  <option value="Mechanical Keyboard">⌨️ Mechanical Keyboard</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500 font-mono mb-1.5 block">Quantity</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setQuantity(val)}
                      disabled={loading}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        quantity === val 
                          ? 'bg-white border-white text-black font-black' 
                          : 'bg-black/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={simulateOrder}
                  disabled={loading}
                  className="w-full bg-white hover:bg-neutral-200 text-black text-xs font-black py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  {loading ? "Processing..." : "Generate Single Order"}
                </button>
                
                <button
                  onClick={simulateStressTest}
                  disabled={loading}
                  className="w-full bg-neutral-950/80 border border-neutral-805 hover:border-neutral-700 hover:bg-neutral-900 text-neutral-300 text-xs font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  Run Concurrent Stress-Test
                </button>
              </div>

            </div>
          </div>

          {/* Card: Live Telemetry Terminal Feed */}
          <div className="h-[280px] bg-black border border-neutral-900 rounded-3xl shadow-xl flex flex-col overflow-hidden">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/40 border-b border-neutral-900 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-black text-neutral-300 uppercase tracking-widest font-mono">Telemetry Feed</h3>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
              </div>
            </div>

            {/* Scrollable logs */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2.5 flex flex-col-reverse justify-end select-text">
              <AnimatePresence initial={false}>
                {logs.map((log, index) => {
                  let color = 'text-neutral-400';
                  if (log.type === 'success') color = 'text-emerald-400';
                  if (log.type === 'warn') color = 'text-amber-400';
                  if (log.type === 'system') color = 'text-purple-400';
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="flex items-start gap-2 border-l border-neutral-900 pl-2"
                    >
                      <span className="text-neutral-600 shrink-0 select-none">[{log.time}]</span>
                      <span className={`${color} break-all font-medium`}>{log.msg}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
};
