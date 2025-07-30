import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // Make sure you have lucide-react installed
import "./LevelWiseUsers.css";
import React from "react";
const mockAssociates = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    commission: 10.5,
    nestedUsers: [
      { id: 101, name: "Alice Jr.", email: "alicejr@example.com", commission: 5.2 },
      { id: 102, name: "Alison", email: "alison@example.com", commission: 3.8 },
    ],
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    commission: 8,
    nestedUsers: [
      { id: 201, name: "Bobby", email: "bobby@example.com", commission: 2.5 },
    ],
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    commission: 7,
    nestedUsers: [],
  },
];

const LevelWiseUsers = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssociates(mockAssociates);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading...
      </div>
    );

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="associate-container" role="main">
      <header className="page-header">
        <h1>Referral Network Overview</h1>
        <p>Click on a user to see their referrals and the levels of engagement.</p>
      </header>

      <div className="table-container">
        <div
          className="table-wrapper"
          tabIndex={0}
          aria-label="Referral Network Table"
        >
          <table
            className="associate-table"
            role="table"
            aria-describedby="table-desc"
          >
            <caption id="table-desc" className="sr-only">
              Referral network with associates and their nested referrals
            </caption>
            <thead>
              <tr>
                <th scope="col" className="center-col">
                  #
                </th>
                <th scope="col" className="center-col">
                  Level
                </th>
                <th scope="col">Associate Name</th>
                <th scope="col">Email</th>
                <th scope="col" className="center-col">
                  Commission (%)
                </th>
                <th scope="col" className="center-col">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {associates.map((associate, index) => (
                <React.Fragment key={associate.id}>
                  <tr
                    className="main-row"
                    onClick={() => toggleExpand(associate.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleExpand(associate.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={expandedIds.includes(associate.id)}
                    aria-controls={`nested-users-${associate.id}`}
                  >
                    <td className="center-col">{index + 1}</td>
                    <td className="center-col">1</td>
                    <td>{associate.name}</td>
                    <td>{associate.email}</td>
                    <td className="center-col">
                      {associate.commission.toFixed(2)}
                    </td>
                    <td
                      className="center-col expand-icon"
                      aria-label={
                        expandedIds.includes(associate.id) ? "Collapse" : "Expand"
                      }
                    >
                      {expandedIds.includes(associate.id) ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </td>
                  </tr>

                  {expandedIds.includes(associate.id) &&
                    associate.nestedUsers.length > 0 && (
                      <tr className="expanded-row">
                        <td colSpan={6} style={{ padding: 0 }}>
                          <table
                            className="nested-table"
                            id={`nested-users-${associate.id}`}
                            aria-label={`Nested users of ${associate.name}`}
                          >
                            <thead>
                              <tr>
                                <th scope="col" className="center-col">
                                  #
                                </th>
                                <th scope="col" className="center-col">
                                  Level
                                </th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col" className="center-col">
                                  Commission (%)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {associate.nestedUsers.map((user, userIndex) => (
                                <tr key={user.id}>
                                  <td className="center-col">{userIndex + 1}</td>
                                  <td className="center-col">2</td>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td className="center-col">
                                    {user.commission.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                  {expandedIds.includes(associate.id) &&
                    associate.nestedUsers.length === 0 && (
                      <tr className="expanded-row">
                        <td
                          colSpan={6}
                          className="no-nested-users"
                          role="region"
                          aria-live="polite"
                        >
                          No nested users found.
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
};

export default LevelWiseUsers;
