'use client'

import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle, Settings, Zap, Brain, TrendingUp, Gauge } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TractionData {
  timestamp: string
  wheelSpeed: number
  slipRatio: number
  brakeForce: number
  throttlePosition: number
}

interface AgentStatus {
  id: string
  name: string
  status: 'active' | 'idle' | 'alert'
  lastAction: string
  confidence: number
}

export default function Home() {
  const [tractionData, setTractionData] = useState<TractionData[]>([])
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: '1', name: 'Slip Detection Agent', status: 'active', lastAction: 'Monitoring wheel slip', confidence: 98 },
    { id: '2', name: 'Brake Control Agent', status: 'active', lastAction: 'Optimizing brake force', confidence: 95 },
    { id: '3', name: 'Throttle Manager Agent', status: 'idle', lastAction: 'Awaiting input', confidence: 100 },
    { id: '4', name: 'Surface Analysis Agent', status: 'active', lastAction: 'Detecting road conditions', confidence: 92 },
  ])
  const [systemStatus, setSystemStatus] = useState<'normal' | 'warning' | 'critical'>('normal')
  const [aiRecommendation, setAiRecommendation] = useState<string>('All systems operating normally')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint: TractionData = {
        timestamp: new Date().toLocaleTimeString(),
        wheelSpeed: 60 + Math.random() * 40,
        slipRatio: Math.random() * 15,
        brakeForce: 30 + Math.random() * 30,
        throttlePosition: 40 + Math.random() * 20,
      }

      setTractionData(prev => {
        const updated = [...prev, newDataPoint]
        return updated.slice(-20)
      })

      // Simulate AI analysis
      const slipRatio = newDataPoint.slipRatio
      if (slipRatio > 12) {
        setSystemStatus('critical')
        setAiRecommendation('Critical slip detected! Reducing throttle and applying optimal brake force.')
        updateAgentStatus('1', 'alert', 'Detecting excessive slip', 85)
        updateAgentStatus('2', 'alert', 'Increasing brake force', 88)
      } else if (slipRatio > 8) {
        setSystemStatus('warning')
        setAiRecommendation('Moderate slip detected. Adjusting traction control parameters.')
        updateAgentStatus('1', 'active', 'Monitoring elevated slip', 90)
      } else {
        setSystemStatus('normal')
        setAiRecommendation('Optimal traction maintained. All agents functioning normally.')
        updateAgentStatus('1', 'active', 'Monitoring wheel slip', 98)
        updateAgentStatus('2', 'active', 'Optimizing brake force', 95)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const updateAgentStatus = (id: string, status: AgentStatus['status'], action: string, confidence: number) => {
    setAgents(prev => prev.map(agent =>
      agent.id === id ? { ...agent, status, lastAction: action, confidence } : agent
    ))
  }

  const handleAIAnalysis = async () => {
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const latestData = tractionData[tractionData.length - 1]
    const avgSlip = tractionData.slice(-10).reduce((acc, d) => acc + d.slipRatio, 0) / 10

    let analysis = ''
    if (avgSlip > 10) {
      analysis = 'AI Analysis: High average slip ratio detected. Recommend reducing speed and checking tire pressure. Surface conditions may be compromised.'
    } else if (avgSlip > 6) {
      analysis = 'AI Analysis: Moderate traction loss. System is compensating effectively. Consider smoother acceleration patterns.'
    } else {
      analysis = 'AI Analysis: Excellent traction control. All parameters within optimal range. Current driving conditions are ideal.'
    }

    setAiRecommendation(analysis)
    setIsProcessing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      case 'active': return 'text-blue-500'
      case 'idle': return 'text-gray-500'
      case 'alert': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 border-green-300'
      case 'warning': return 'bg-yellow-100 border-yellow-300'
      case 'critical': return 'bg-red-100 border-red-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Brain className="w-10 h-10 text-blue-400" />
                AI Traction Control System
              </h1>
              <p className="text-gray-400">Intelligent day-to-day traction management powered by multi-agent AI</p>
            </div>
            <div className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 ${getStatusBg(systemStatus)}`}>
              {systemStatus === 'normal' && <CheckCircle className={getStatusColor(systemStatus)} />}
              {systemStatus === 'warning' && <AlertTriangle className={getStatusColor(systemStatus)} />}
              {systemStatus === 'critical' && <AlertTriangle className={getStatusColor(systemStatus)} />}
              <span className={`font-semibold ${getStatusColor(systemStatus)}`}>
                {systemStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendation Panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">AI Analysis & Recommendations</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{aiRecommendation}</p>
            </div>
            <button
              onClick={handleAIAnalysis}
              disabled={isProcessing}
              className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Agent Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {agents.map(agent => (
            <div key={agent.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <Activity className={`w-5 h-5 ${getStatusColor(agent.status)}`} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  agent.status === 'active' ? 'bg-blue-900 text-blue-300' :
                  agent.status === 'alert' ? 'bg-red-900 text-red-300' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">{agent.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{agent.lastAction}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${agent.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{agent.confidence}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traction Performance Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Wheel Speed & Slip Ratio</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tractionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="wheelSpeed" stroke="#3b82f6" strokeWidth={2} name="Wheel Speed" />
                <Line type="monotone" dataKey="slipRatio" stroke="#ef4444" strokeWidth={2} name="Slip Ratio" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Control Forces Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Control Forces</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tractionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="brakeForce" stroke="#10b981" strokeWidth={2} name="Brake Force" />
                <Line type="monotone" dataKey="throttlePosition" stroke="#f59e0b" strokeWidth={2} name="Throttle" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Wheel Speed</span>
              <Gauge className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tractionData.length > 0 ? tractionData[tractionData.length - 1].wheelSpeed.toFixed(1) : '0.0'} km/h
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Slip Ratio</span>
              <Activity className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tractionData.length > 0 ? tractionData[tractionData.length - 1].slipRatio.toFixed(1) : '0.0'}%
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Brake Force</span>
              <Settings className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tractionData.length > 0 ? tractionData[tractionData.length - 1].brakeForce.toFixed(1) : '0.0'}%
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Throttle</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {tractionData.length > 0 ? tractionData[tractionData.length - 1].throttlePosition.toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>AI-powered traction control system with real-time monitoring and adaptive control</p>
        </div>
      </div>
    </main>
  )
}
