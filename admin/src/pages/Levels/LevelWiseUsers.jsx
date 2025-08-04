import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import "./LevelWiseUsers.css";
import { fetchDataFromApi } from "../../utils/api";

// Format currency utility
const formatCurrency = (val) =>
  val !== undefined && val !== null && !isNaN(val)
    ? Number(val).toFixed(2)
    : "-";

// Recursive row renderer
function LevelRow({ levelData, expandedRows, toggleExpand, depth = 0 }) {
  if (!levelData?.associates || !levelData.associates.length) return null;
  return (
    <>
      {levelData.associates.map((user) => {
        const rowId = user.id;
        const nestedLevels =
          Array.isArray(levelData.lowerLevels) &&
          levelData.lowerLevels.filter(
            (lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0
          );
        const hasNested = nestedLevels && nestedLevels.length > 0;

        return (
          <React.Fragment key={rowId}>
            <tr
              className="lwuser-main-row"
              style={{ cursor: hasNested ? "pointer" : "default" }}
              tabIndex={hasNested ? 0 : undefined}
              aria-expanded={expandedRows.includes(rowId)}
              onClick={hasNested ? () => toggleExpand(rowId) : undefined}
              onKeyDown={
                hasNested
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ")
                        toggleExpand(rowId);
                    }
                  : undefined
              }
            >
              <td style={{ textAlign: "center" }}>{user.level}</td>
              <td>
                <strong>{user.associaateName}</strong>
              </td>
              <td>{user.associaateEmail}</td>
              <td style={{ textAlign: "center" }}>
                <span className="lwuser-commission-amount">
                  ₹{formatCurrency(user.totalCommission)}
                </span>
              </td>
              <td style={{ textAlign: "center" }}>
                {hasNested ? (
                  <span className="lwuser-expand-icon">
                    {expandedRows.includes(rowId) ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </td>
            </tr>
            {hasNested &&
              nestedLevels.map((nestedLevel, i) => (
                <tr className="lwuser-expanded-row" key={rowId + "_lvl_" + i}>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <div
                      className={`lwuser-details-wrapper ${
                        expandedRows.includes(rowId) ? "expanded" : ""
                      }`}
                    >
                      {expandedRows.includes(rowId) && (
                        <div className="lwuser-details-container">
                          <div className="lwuser-nested-heading">
                            <strong>
                              Nested Users under: {user.associaateName} (Level{" "}
                              {user.level})
                            </strong>
                          </div>
                          <table className="lwuser-table" style={{ margin: 0 }}>
                            <thead>
                              <tr>
                                <th>Level</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Commission (₹)</th>
                                <th>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nestedLevel.associates.map((nestedUser) => (
                                <tr key={nestedUser.id}>
                                  <td style={{ textAlign: "center" }}>
                                    {nestedUser.level}
                                  </td>
                                  <td>
                                    <strong>{nestedUser.associaateName}</strong>
                                  </td>
                                  <td>{nestedUser.associaateEmail}</td>
                                  <td style={{ textAlign: "center" }}>
                                    <span className="lwuser-commission-amount">
                                      ₹
                                      {formatCurrency(
                                        nestedUser.totalCommission
                                      )}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: "center" }}>-</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default function LevelWiseUsers() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const apiRes = await fetchDataFromApi("/tree");
        const data = apiRes.levels;
        console.log("data: ", data);

        setLevels(data || []);
      } catch {
        setLevels([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleExpand = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  if (loading)
    return (
       <div className="loading-container">
        <p>Loading Level-wise Users...</p>
         <img src="SPC.png" alt="Loading..." className="loading-logo" />
      </div>
    );

  return (
    <div className="lwuser-container" role="main">
      <header className="lwuser-page-header">
        <h1>Level-wise Users</h1>
        <p>Referral network with associates and their nested referrals.</p>
      </header>
      <div className="lwuser-table-container">
        <div
          className="lwuser-table-wrapper"
          tabIndex={0}
          aria-label="Referral network table"
        >
          <table
            className="lwuser-table"
            role="table"
            aria-describedby="table-desc"
          >
            <caption id="table-desc" className="lwuser-sr-only">
              Referral network, all levels and their nested associates.
            </caption>
            <thead>
              <tr>
                <th>Level</th>
                <th>Name</th>
                <th>Email</th>
                <th>Commission (₹)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {levels && levels.length > 0 ? (
                levels.map((lvl) => (
                  <LevelRow
                    key={lvl.level + "-top"}
                    levelData={lvl}
                    expandedRows={expandedRows}
                    toggleExpand={toggleExpand}
                    depth={0}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="lwuser-no-nested-users">
                    No associates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import "./LevelWiseUsers.css";

// const mockAssociates = [
//   {
//     id: 1,
//     name: "Alice Smith",
//     email: "alice@example.com",
//     commission: 10.5,
//     level: 8,
//     nestedUsers: [
//       {
//         id: 101,
//         name: "Alice Jr.",
//         email: "alicejr@example.com",
//         commission: 5.2,
//         level: 6,
//       },
//       {
//         id: 102,
//         name: "Alison",
//         email: "alison@example.com",
//         commission: 3.8,
//         level: 5,
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Bob Johnson",
//     email: "bob@example.com",
//     commission: 8,
//     level: 3,
//     nestedUsers: [
//       {
//         id: 201,
//         name: "Bobby",
//         email: "bobby@example.com",
//         commission: 2.5,
//         level: 2,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Carol Williams",
//     email: "carol@example.com",
//     commission: 7,
//     level: 1,
//     nestedUsers: [],
//   },
// ];

// export default function LevelWiseUsers() {
//   const [associates, setAssociates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedIds, setExpandedIds] = useState([]);

//   useEffect(() => {
//     // simulate data loading delay
//     const timer = setTimeout(() => {
//       setAssociates(mockAssociates);
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const toggleExpand = (id) => {
//     setExpandedIds((prev) =>
//       prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
//     );
//   };

//   if (loading)
//     return (
//       <div className="lwuser-no-nested-users" role="status" aria-live="polite">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="lwuser-container" role="main">
//       <header className="lwuser-page-header">
//         <h1>Level-wise Users</h1>
//         <p>Referral network with associates and their nested referrals.</p>
//       </header>

//       <div className="lwuser-table-container">
//         <div className="lwuser-table-wrapper" tabIndex={0} aria-label="Referral network table">
//           <table className="lwuser-table" role="table" aria-describedby="table-desc">
//             <thead>
//               <tr>
//                 <th className="lwuser-serial-number">#</th>
//                 <th>Level</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Commission (%)</th>
//                 <th>Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {associates.map((a, idx) => (
//                 <React.Fragment key={a.id}>
//                   <tr
//                     className="lwuser-main-row"
//                     onClick={() => toggleExpand(a.id)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") {
//                         e.preventDefault();
//                         toggleExpand(a.id);
//                       }
//                     }}
//                     style={{ cursor: "pointer" }}
//                     tabIndex={0}
//                     role="button"
//                     aria-expanded={expandedIds.includes(a.id)}
//                     aria-controls={`nested-users-${a.id}`}
//                   >
//                     <td className="lwuser-serial-number">{idx + 1}</td>
//                     <td style={{ textAlign: "center" }}>{a.level}</td>
//                     <td>{a.name}</td>
//                     <td>{a.email}</td>
//                     <td style={{ textAlign: "center" }}>
//                       <span className="lwuser-commission-amount">
//                         {a.commission.toFixed(2)}
//                       </span>
//                     </td>
//                     <td style={{ textAlign: "center" }}>
//                       <span className="lwuser-expand-icon" aria-label={expandedIds.includes(a.id) ? "Collapse" : "Expand"}>
//                         {expandedIds.includes(a.id) ? (
//                           <ChevronDown size={18} />
//                         ) : (
//                           <ChevronRight size={18} />
//                         )}
//                       </span>
//                     </td>
//                   </tr>

//                   {expandedIds.includes(a.id) && (
//                     <tr className="lwuser-expanded-row">
//                       <td colSpan={6} style={{ padding: 0 }}>
//                         <div className="lwuser-details-container" id={`nested-users-${a.id}`}>
//                           {a.nestedUsers.length === 0 ? (
//                             <p className="lwuser-no-referrals">No nested users found.</p>
//                           ) : (
//                             <table className="lwuser-table" style={{ margin: 0 }}>
//                               <thead>
//                                 <tr>
//                                   <th className="lwuser-serial-number">#</th>
//                                   <th>Level</th>
//                                   <th>Name</th>
//                                   <th>Email</th>
//                                   <th>Commission (%)</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {a.nestedUsers.map((u, uidx) => (
//                                   <tr key={u.id}>
//                                     <td className="lwuser-serial-number">{uidx + 1}</td>
//                                     <td style={{ textAlign: "center" }}>{u.level}</td>
//                                     <td>{u.name}</td>
//                                     <td>{u.email}</td>
//                                     <td style={{ textAlign: "center" }}>
//                                       <span className="lwuser-commission-amount">
//                                         {u.commission.toFixed(2)}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }