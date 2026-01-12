'use client'

interface DashboardStatsProps {
    stats: {
        total: number
        new: number
        completed: number
        conversionRate: number
    }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Requests</h3>
                <div className="value">{stats.total}</div>
                <div className="trend neutral">Lifetime</div>
            </div>

            <div className="stat-card">
                <h3>Pending Action</h3>
                <div className="value highlight">{stats.new}</div>
                <div className="trend warning">Requires attention</div>
            </div>

            <div className="stat-card">
                <h3>Completed Projects</h3>
                <div className="value success">{stats.completed}</div>
                <div className="trend positive">Successfully delivered</div>
            </div>

            <div className="stat-card">
                <h3>Conversion Rate</h3>
                <div className="value">{stats.conversionRate}%</div>
                <div className="trend neutral">Leads to Projects</div>
            </div>

            <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #eaeaea;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .stat-card h3 {
          font-size: 13px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }

        .value {
          font-size: 36px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .value.highlight {
          color: #2563EB;
        }

        .value.success {
          color: #10B981;
        }

        .trend {
          font-size: 12px;
          font-weight: 500;
        }

        .trend.neutral { color: #888; }
        .trend.warning { color: #F59E0B; }
        .trend.positive { color: #10B981; }
      `}</style>
        </div>
    )
}
