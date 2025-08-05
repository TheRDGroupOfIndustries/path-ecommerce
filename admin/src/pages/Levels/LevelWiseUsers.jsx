import React, { useState, useEffect, useContext, useRef } from "react";
import { Check, Eye, EyeOff, Pencil, Printer, X } from "lucide-react";
import "./LevelWiseUsers.css";
import { fetchDataFromApi, patchData } from "../../utils/api";
import { myContext } from "../../App";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Format currency utility
const formatCurrency = (val) =>
  val !== undefined && val !== null && !isNaN(val)
    ? Number(val).toFixed(2)
    : "-";

const renderNestedLevels = (node, depth = 1) => {
  if (!node) return [];

  return node.flatMap((item, index) => {
    const currentRow = (
      <tr key={`${depth}-${index}`}>
        <td className="pl-4 py-2"> {item.level}</td>
        <td className="py-2 lwuser-commission-amount">{item.percent}%</td>
      </tr>
    );

    // recursively go through lowerLevels (if present)
    const childRows = item.lowerLevels
      ? renderNestedLevels(item.lowerLevels, depth + 1)
      : [];

    return [currentRow, ...childRows];
  });
};

// Recursive row renderer

function LevelRow({
  levelData,
  expandedRows,
  toggleExpand,
  depth = 0,
  onCommissionUpdate,
}) {
  const context = useContext(myContext);
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [editedCommission, setEditedCommission] = React.useState("");
  const inputRef = useRef(null);

  // Function to start editing a row
  const startEditing = (rowId, currentCommission) => {
    if (editingRowId === rowId) {
      setEditingRowId(null);
    } else {
      setEditingRowId(rowId);
      setEditedCommission(currentCommission ?? "");
    }
  };

  // Call PATCH /edit API to save commission update
  const saveEdit = async (user) => {
    if (!editedCommission || isNaN(editedCommission)) {
      alert("Please enter a valid percentage.");
      return;
    }

    try {
      const level = user.level;
      const newPercent = parseFloat(editedCommission);

      // Assuming your backend is on the same domain or handled proxy
      const response = await patchData("/tree/edit", {
        level,
        newPercent,
      });
      // console.log("res: ",response);

      if (response.success) {
        // alert(response.message);
        context.setAlertBox({
          open: true,
          msg: response.message,
          error: false,
        });
        setEditingRowId(null);
        if (onCommissionUpdate) {
          onCommissionUpdate(user.id, newPercent);
        }
      } else {
        alert("Failed to update commission: " + response.message);
      }
    } catch (error) {
      alert("API request failed: " + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingRowId(null);
  };

  useEffect(() => {
    if (editingRowId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingRowId]);

  const flattenUserDataForExcel = (user, lowerLevels) => {
    // Create flat rows: starting user first
    const rows = [
      {
        Level: user.level,
        Name: user.associaateName,
        Email: user.associaateEmail,
        "Commission (%)": user.totalCommissionInPercent,
        ParentLevel: "-",
      },
    ];

    // Recursively add child levels if any
    const addNested = (levels, parentLevel) => {
      if (!levels) return;
      levels.forEach((level) => {
        level.associates.forEach((assoc) => {
          rows.push({
            Level: assoc.level,
            Name: assoc.associaateName,
            Email: assoc.associaateEmail,
            "Commission (%)": assoc.totalCommissionInPercent,
            ParentLevel: parentLevel,
          });
        });
        if (level.lowerLevels) {
          addNested(level.lowerLevels, level.level);
        }
      });
    };

    addNested(lowerLevels, user.level);

    return rows;
  };

  const exportReportToExcel = (user, lowerLevels) => {
    const data = flattenUserDataForExcel(user, lowerLevels);

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" }); // Data starts from row 3

    // Add heading row manually
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`${user.associaateName}'s Referral Report`]],
      {
        origin: "A1",
      }
    );

    // Merge cells A1 to E1 for heading
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // Add some basic styling for column widths
    worksheet["!cols"] = [
      { wch: 10 }, // Level
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Commission
      { wch: 15 }, // Parent
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `${user.associaateName}_Referral_Report.xlsx`);
  };

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
        const isEditing = editingRowId === rowId;

        return (
          <React.Fragment key={rowId}>
            <tr
              className="lwuser-main-row"
              style={{ cursor: "default" }}
              tabIndex={undefined}
              aria-expanded={expandedRows.includes(rowId)}
            >
              <td style={{ textAlign: "center" }}>{user.level}</td>
              <td>
                <strong>{user.associaateName}</strong>
              </td>
              <td>{user.associaateEmail}</td>

              <td style={{ textAlign: "center" }}>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      ref={inputRef}
                      min="0"
                      max="100"
                      step="0.1"
                      className="commission-inputs"
                      value={editedCommission}
                      onChange={(e) => setEditedCommission(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(user);
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                    <button
                      onClick={() => saveEdit(user)}
                      className="btn-save"
                      aria-label="Save"
                      title="Save"
                    >
                      <Check color="#28a745" size={18} />
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="btn-cancel"
                      aria-label="Cancel"
                      title="Cancel"
                    >
                      <X color="#dc3545" size={18} />
                    </button>
                  </>
                ) : (
                  <span className="lwuser-commission-amount">
                    {formatCurrency(user.totalCommissionInPercent)} %
                  </span>
                )}
              </td>

              <td
                style={{
                  textAlign: "center",
                  cursor: hasNested ? "pointer" : "default",
                }}
                tabIndex={hasNested ? 0 : undefined}
                role="button"
                aria-pressed={expandedRows.includes(rowId)}
                aria-label={
                  expandedRows.includes(rowId)
                    ? "Collapse details"
                    : "Expand details"
                }
                onClick={hasNested ? () => toggleExpand(rowId) : undefined}
                onKeyDown={
                  hasNested
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(rowId);
                        }
                      }
                    : undefined
                }
              >
                {hasNested ? (
                  <div className="action-buttonss">
                    {/* View toggle button */}
                    <button
                      className="view-btn"
                      title="View"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(rowId);
                      }}
                      aria-label={
                        expandedRows.includes(rowId)
                          ? "Hide nested users"
                          : "Show nested users"
                      }
                    >
                      {expandedRows.includes(rowId) ? <EyeOff /> : <Eye />}
                    </button>

                    {/* Edit button */}
                    <button
                      className="edit-btn"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(rowId, user.totalCommissionInPercent);
                      }}
                      aria-label={`Edit commission for ${user.associaateName}`}
                    >
                      <Pencil />
                    </button>

                    {/* Generate Report button */}
                    <button
                      className="delete-btn"
                      title="Generate report"
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmed = window.confirm(
                          `Do you want to download ${user.associaateName}'s referral report as Excel?`
                        );
                        if (confirmed) {
                          exportReportToExcel(user, levelData.lowerLevels);
                        }
                      }}
                      aria-label={`Generate report for ${user.associaateName}`}
                    >
                      <Printer />
                    </button>
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>

            {expandedRows.includes(rowId) && levelData.lowerLevels && (
              <tr>
                <td colSpan={3} className="p-0">
                  <div className="lwuser-nested-table-wrapper overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Level</th>
                          <th className="px-4 py-2">Commission (%)</th>
                        </tr>
                      </thead>
                      <tbody>{renderNestedLevels(levelData.lowerLevels)}</tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
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

  const updateCommissionInLevels = (levelsArr, userId, newPercent) => {
    return levelsArr.map((level) => {
      return {
        ...level,
        associates: level.associates.map((assoc) => {
          if (assoc.id === userId) {
            return { ...assoc, totalCommissionInPercent: newPercent };
          }
          return assoc;
        }),
        lowerLevels: level.lowerLevels
          ? updateCommissionInLevels(level.lowerLevels, userId, newPercent)
          : undefined,
      };
    });
  };
  const handleCommissionUpdate = (userId, newPercent) => {
    setLevels((prevLevels) =>
      updateCommissionInLevels(prevLevels, userId, newPercent)
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading users...</p>
        <img src="SPC.png" alt="Loading..." className="loading-logo" />
      </div>
    );
  }

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
                <th>Commission (%)</th>
                <th>Action</th>
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
                    onCommissionUpdate={handleCommissionUpdate}
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
