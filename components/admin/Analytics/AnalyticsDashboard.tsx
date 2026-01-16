'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AnalyticsMetrics, CRMLead, CRMFinancials, CRMStatusHistory } from '@/lib/types'
import { calculateAnalytics } from '@/lib/crm-logic'

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    const [leadsRes, finRes, histRes] = await Promise.all([
      supabase.from('crm_leads').select('*'),
      supabase.from('crm_financials').select('*'),
      supabase.from('crm_status_history').select('*')
    ])

    if (leadsRes.data) {
      const calculated = calculateAnalytics(
        leadsRes.data as CRMLead[],
        (finRes.data || []) as CRMFinancials[],
        (histRes.data || []) as CRMStatusHistory[]
      )
      setMetrics(calculated)
    }
    setLoading(false)
  }

  if (loading) return <div className="loading-state">Analyzing pipeline data...</div>
  if (!metrics) return <div className="no-data">No data available for analysis.</div>

  return (
    <div className="analytics-container">
      <h1 className="page-title">Operational & Revenue Analytics</h1>

      <div className="top-stats">
        <div className="stat-card">
          <label>Total Pipeline Value</label>
          <span className="value">USD {metrics.revenueData.totalSigned.toLocaleString()}</span>
        </div>
        <div className="stat-card highlight-green">
          <label>Revenue Received</label>
          <span className="value">USD {metrics.revenueData.totalPaid.toLocaleString()}</span>
        </div>
        <div className="stat-card highlight-red">
          <label>Outstanding Balance</label>
          <span className="value">USD {metrics.revenueData.totalOutstanding.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <label>Average Deal Size</label>
          <span className="value">USD {metrics.revenueData.averageDealSize.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <label>Win Rate</label>
          <span className="value">{metrics.revenueData.winRate}%</span>
        </div>
        <div className="stat-card">
          <label>Lead Velocity</label>
          <span className="value">{metrics.totalConsultations} Leads</span>
        </div>
      </div>

      <div className="metrics-grid">
        <section className="chart-card">
          <h3>Lead Conversion Funnel</h3>
          <div className="funnel-viz">
            {metrics.conversionFunnel.map((stage, idx) => (
              <div key={stage.status} className="funnel-stage" style={{ width: `${100 - (idx * 5)}%` }}>
                <span className="stage-label">{stage.status}</span>
                <span className="stage-count">{stage.count} ({stage.percentage}%)</span>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-card">
          <h3>Revenue by Industry</h3>
          <div className="bar-chart">
            {metrics.revenueData.byIndustry.map((item) => (
              <div key={item.industry} className="bar-row">
                <div className="bar-label">{item.industry}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${metrics.revenueData.totalSigned > 0 ? (item.value / metrics.revenueData.totalSigned) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <div className="bar-value">USD {item.value.toLocaleString()}</div>
              </div>
            ))}
            {metrics.revenueData.byIndustry.length === 0 && <p className="no-data-msg">No industry data yet.</p>}
          </div>
        </section>

        <section className="chart-card">
          <h3>Clients by Country</h3>
          <div className="bar-chart">
            {metrics.revenueData.byCountry?.map((item) => (
              <div key={item.country} className="bar-row">
                <div className="bar-label">{item.country}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${metrics.revenueData.totalSigned > 0 ? (item.value / metrics.revenueData.totalSigned) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <div className="bar-value">USD {item.value.toLocaleString()}</div>
              </div>
            ))}
            {(!metrics.revenueData.byCountry || metrics.revenueData.byCountry.length === 0) && <p className="no-data-msg">No country data yet.</p>}
          </div>
        </section>
      </div>

      {/* Trend Charts Section */}
      <div className="trends-section">
        <section className="chart-card wide-chart">
          <h3>Revenue Trend (Monthly)</h3>
          <div className="trend-chart">
            {metrics.revenueData.byMonth.length > 0 ? (
              <div className="bar-chart-horizontal">
                {metrics.revenueData.byMonth.map(item => {
                  const maxValue = Math.max(...metrics.revenueData.byMonth.map(m => m.signed))
                  return (
                    <div key={item.month} className="trend-row">
                      <div className="trend-label">{item.month}</div>
                      <div className="trend-bars">
                        <div className="stacked-bar">
                          <div
                            className="bar-signed"
                            style={{ width: `${maxValue > 0 ? (item.signed / maxValue) * 100 : 0}%` }}
                            title={`Signed: $${item.signed.toLocaleString()}`}
                          ></div>
                          <div
                            className="bar-paid"
                            style={{ width: `${maxValue > 0 ? (item.paid / maxValue) * 100 : 0}%` }}
                            title={`Paid: $${item.paid.toLocaleString()}`}
                          ></div>
                        </div>
                      </div>
                      <div className="trend-values">
                        <span className="signed-value">${item.signed.toLocaleString()}</span>
                        <span className="paid-value">${item.paid.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
                <div className="legend">
                  <span className="legend-item"><span className="dot signed"></span> Signed</span>
                  <span className="legend-item"><span className="dot paid"></span> Paid</span>
                </div>
              </div>
            ) : (
              <p className="no-data-msg">No monthly revenue data yet. Add financials to leads to see trends.</p>
            )}
          </div>
        </section>

        <section className="chart-card wide-chart">
          <h3>Lead Conversion Trend (Monthly)</h3>
          <div className="trend-chart">
            {metrics.leadsTrend.length > 0 ? (
              <div className="bar-chart-horizontal">
                {metrics.leadsTrend.map(item => {
                  const maxValue = Math.max(...metrics.leadsTrend.map(m => m.newLeads))
                  return (
                    <div key={item.month} className="trend-row">
                      <div className="trend-label">{item.month}</div>
                      <div className="trend-bars">
                        <div className="stacked-bar leads">
                          <div
                            className="bar-new"
                            style={{ width: `${maxValue > 0 ? (item.newLeads / maxValue) * 100 : 0}%` }}
                            title={`New: ${item.newLeads}`}
                          ></div>
                          <div
                            className="bar-conv"
                            style={{ width: `${maxValue > 0 ? (item.converted / maxValue) * 100 : 0}%` }}
                            title={`Converted: ${item.converted}`}
                          ></div>
                        </div>
                      </div>
                      <div className="trend-values">
                        <span className="new-value">{item.newLeads} new</span>
                        <span className="conv-value">{item.converted} conv</span>
                      </div>
                    </div>
                  )
                })}
                <div className="legend">
                  <span className="legend-item"><span className="dot new-lead"></span> New Leads</span>
                  <span className="legend-item"><span className="dot converted"></span> Converted</span>
                </div>
              </div>
            ) : (
              <p className="no-data-msg">No lead data yet. Add leads to see conversion trends.</p>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .analytics-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .top-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e4e4e7;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-card.highlight-green {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-color: #86efac;
        }

        .stat-card.highlight-green .value {
          color: #15803d;
        }

        .stat-card.highlight-red {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #fca5a5;
        }

        .stat-card.highlight-red .value {
          color: #dc2626;
        }

        .stat-card label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }

        .stat-card .value {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: #fff;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          min-height: 400px;
        }

        .chart-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 32px;
        }

        .funnel-viz {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .funnel-stage {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 12px 20px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-width: 200px;
          transition: transform 0.2s;
        }

        .funnel-stage:hover {
          transform: scale(1.02);
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .stage-label {
          font-size: 12px;
          font-weight: 500;
          color: #1e293b;
        }

        .stage-count {
          font-size: 12px;
          color: #3b82f6;
          font-weight: 600;
        }

        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 100px 1fr 80px;
          align-items: center;
          gap: 16px;
        }

        .bar-label {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bar-container {
          height: 12px;
          background: #f1f5f9;
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #0f172a;
          border-radius: 6px;
        }

        .bar-value {
          font-size: 11px;
          font-weight: 600;
          color: #334155;
          text-align: right;
        }

        .loading-state, .no-data {
          padding: 100px;
          text-align: center;
          color: #94a3b8;
        }
        
        .no-data-msg {
          color: #cbd5e1;
          font-size: 13px;
          text-align: center;
          margin-top: 40px;
        }

        .trends-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .wide-chart {
          min-height: 300px;
        }

        .trend-chart {
          padding-top: 16px;
        }

        .bar-chart-horizontal {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trend-row {
          display: grid;
          grid-template-columns: 80px 1fr 140px;
          align-items: center;
          gap: 16px;
        }

        .trend-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .trend-bars {
          height: 24px;
          position: relative;
        }

        .stacked-bar {
          height: 100%;
          position: relative;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-signed {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #0f172a, #334155);
          border-radius: 4px;
          z-index: 1;
        }

        .bar-paid {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 4px;
          z-index: 2;
        }

        .bar-new {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          border-radius: 4px;
          z-index: 1;
        }

        .bar-conv {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          border-radius: 4px;
          z-index: 2;
        }

        .trend-values {
          display: flex;
          gap: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .signed-value { color: #0f172a; }
        .paid-value { color: #22c55e; }
        .new-value { color: #3b82f6; }
        .conv-value { color: #f59e0b; }

        .legend {
          display: flex;
          gap: 24px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .dot.signed { background: #0f172a; }
        .dot.paid { background: #22c55e; }
        .dot.new-lead { background: #3b82f6; }
        .dot.converted { background: #f59e0b; }
      `}</style>
    </div>
  )
}
