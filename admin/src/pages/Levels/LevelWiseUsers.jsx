import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import "./LevelWiseUsers.css";

const mockAssociates = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    commission: 10.5,
    level: 8,
    nestedUsers: [
      {
        id: 101,
        name: "Alice Jr.",
        email: "alicejr@example.com",
        commission: 5.2,
        level: 6,
      },
      {
        id: 102,
        name: "Alison",
        email: "alison@example.com",
        commission: 3.8,
        level: 5,
      },
    ],
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    commission: 8,
    level: 3,
    nestedUsers: [
      {
        id: 201,
        name: "Bobby",
        email: "bobby@example.com",
        commission: 2.5,
        level: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    commission: 7,
    level: 1,
    nestedUsers: [],
  },
];

export default function LevelWiseUsers() {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    // simulate data loading delay
    const timer = setTimeout(() => {
      setAssociates(mockAssociates);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="lwuser-no-nested-users" role="status" aria-live="polite">
        Loading...
      </div>
    );

  return (
    <div className="lwuser-container" role="main">
      <header className="lwuser-page-header">
        <h1>Level-wise Users</h1>
        <p>Referral network with associates and their nested referrals.</p>
      </header>

      <div className="lwuser-table-container">
        <div className="lwuser-table-wrapper" tabIndex={0} aria-label="Referral network table">
          <table className="lwuser-table" role="table" aria-describedby="table-desc">
            <thead>
              <tr>
                <th className="lwuser-serial-number">#</th>
                <th>Level</th>
                <th>Name</th>
                <th>Email</th>
                <th>Commission (%)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {associates.map((a, idx) => (
                <React.Fragment key={a.id}>
                  <tr
                    className="lwuser-main-row"
                    onClick={() => toggleExpand(a.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleExpand(a.id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={expandedIds.includes(a.id)}
                    aria-controls={`nested-users-${a.id}`}
                  >
                    <td className="lwuser-serial-number">{idx + 1}</td>
                    <td style={{ textAlign: "center" }}>{a.level}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="lwuser-commission-amount">
                        {a.commission.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="lwuser-expand-icon" aria-label={expandedIds.includes(a.id) ? "Collapse" : "Expand"}>
                        {expandedIds.includes(a.id) ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>
                    </td>
                  </tr>

                  {expandedIds.includes(a.id) && (
                    <tr className="lwuser-expanded-row">
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div className="lwuser-details-container" id={`nested-users-${a.id}`}>
                          {a.nestedUsers.length === 0 ? (
                            <p className="lwuser-no-referrals">No nested users found.</p>
                          ) : (
                            <table className="lwuser-table" style={{ margin: 0 }}>
                              <thead>
                                <tr>
                                  <th className="lwuser-serial-number">#</th>
                                  <th>Level</th>
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Commission (%)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {a.nestedUsers.map((u, uidx) => (
                                  <tr key={u.id}>
                                    <td className="lwuser-serial-number">{uidx + 1}</td>
                                    <td style={{ textAlign: "center" }}>{u.level}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td style={{ textAlign: "center" }}>
                                      <span className="lwuser-commission-amount">
                                        {u.commission.toFixed(2)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
