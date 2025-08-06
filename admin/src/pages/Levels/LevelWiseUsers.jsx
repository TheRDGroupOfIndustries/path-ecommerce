import React, { useState, useEffect, useContext, useRef } from "react"
import { Check, Eye, EyeOff, Pencil, Printer, X, Search, Trash } from "lucide-react"
import "./LevelWiseUsers.css"
import { deleteData, fetchDataFromApi, patchData } from "../../utils/api"
import { myContext } from "../../App"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Link } from "react-router-dom"
// Format currency utility
const formatCurrency = (val) => (val !== undefined && val !== null && !isNaN(val) ? Number(val).toFixed(2) : "-")

const renderNestedLevels = (node, depth = 1) => {
  if (!node) return []
  return node.flatMap((item, index) => {
    const currentRow = (
      <tr key={`${depth}-${index}`}>
        <td className="pl-4 py-2"> {item.associates[0].level}</td>
        <td className="py-2 lwuser-commission-amount">{item.associates[0].totalCommissionInPercent}%</td>
      </tr>
    )
    // recursively go through lowerLevels (if present)
    const childRows = item.lowerLevels ? renderNestedLevels(item.lowerLevels, depth + 1) : []
    return [currentRow, ...childRows]
  })
}

// Recursive row renderer
function LevelRow({
  levelData,
  expandedRows,
  toggleExpand,
  depth = 0,
  onCommissionUpdate,
  originalLevelData, // Add this prop to maintain original structure
  onDeleteAssociate,
}) {
  const context = useContext(myContext)
  const [editingRowId, setEditingRowId] = React.useState(null)
  const [editedCommission, setEditedCommission] = React.useState("")
  const inputRef = useRef(null)

  // Function to start editing a row
  const startEditing = (rowId, currentCommission) => {
    if (editingRowId === rowId) {
      setEditingRowId(null)
    } else {
      setEditingRowId(rowId)
      setEditedCommission(currentCommission ?? "")
    }
  }

  // Call PATCH /edit API to save commission update
  const saveEdit = async (user) => {
    if (!editedCommission || isNaN(editedCommission)) {
      alert("Please enter a valid percentage.")
      return
    }

    try {
      const level = user.level
      const newPercent = Number.parseFloat(editedCommission)
      const response = await patchData("/tree/edit", {
        level,
        newPercent,
      })

      if (response.success) {
        context.setAlertBox({
          open: true,
          msg: response.message,
          error: false,
        })
        setEditingRowId(null)
        if (onCommissionUpdate) {
          onCommissionUpdate(user.id, newPercent)
        }
      } else {
        alert("Failed to update commission: " + response.message)
      }
    } catch (error) {
      alert("API request failed: " + error.message)
    }
  }

  const cancelEdit = () => {
    setEditingRowId(null)
  }

  useEffect(() => {
    if (editingRowId !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingRowId])

  const flattenUserDataForExcel = (user, lowerLevels) => {
    const rows = [
      {
        Level: user.level,
        Name: user.associaateName,
        Email: user.associaateEmail,
        "Commission (%)": user.totalCommissionInPercent,
        "Total Commission (₹)": user.totalCommissionInRupee,
        ParentLevel: "-",
      },
    ]

    const addNested = (levels, parentLevel) => {
      if (!levels) return
      levels.forEach((level) => {
        level.associates.forEach((assoc) => {
          rows.push({
            Level: assoc.level,
            Name: assoc.associaateName,
            Email: assoc.associaateEmail,
            "Commission (%)": assoc.totalCommissionInPercent,
            "Total Commission (₹)": assoc.totalCommissionInRupee, // Correct here
            ParentLevel: parentLevel,
          })
        })
        if (level.lowerLevels) {
          addNested(level.lowerLevels, level.level)
        }
      })
    }

    addNested(lowerLevels, user.level)
    return rows
  }

  const exportReportToExcel = (user, lowerLevels) => {
    const data = flattenUserDataForExcel(user, lowerLevels)
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" }) // Data starts from row 3

    // Add heading row manually
    XLSX.utils.sheet_add_aoa(worksheet, [[`${user.associaateName}'s Referral Report`]], {
      origin: "A1",
    })

    // Merge cells A1 to E1 for heading
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]

    // Add some basic styling for column widths
    worksheet["!cols"] = [
      { wch: 10 }, // Level
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Commission (%)
      { wch: 25 }, // Total Commission (₹)
      { wch: 15 }, // Parent
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report")
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    })
    saveAs(blob, `${user.associaateName}_Referral_Report.xlsx`)
  }

  if (!levelData?.associates || !levelData.associates.length) return null

  return (
    <>
      {levelData.associates.map((user) => {
        const rowId = user.id
        // Use original data to check for nested levels, not filtered data
        const originalUserData = originalLevelData?.associates?.find((assoc) => assoc.id === user.id)
        const originalNestedLevels = originalLevelData?.lowerLevels?.filter(
          (lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0,
        )

        // For display purposes, use filtered data
        const nestedLevels =
          Array.isArray(levelData.lowerLevels) &&
          levelData.lowerLevels.filter((lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0)

        // Check if user has nested levels in original data (for action buttons)
        const hasNested = originalNestedLevels && originalNestedLevels.length > 0
        const isEditing = editingRowId === rowId

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
                          saveEdit(user)
                        } else if (e.key === "Escape") {
                          cancelEdit()
                        }
                      }}
                    />
                    <button onClick={() => saveEdit(user)} className="btn-save" aria-label="Save" title="Save">
                      <Check color="#28a745" size={18} />
                    </button>
                    <button onClick={cancelEdit} className="btn-cancel" aria-label="Cancel" title="Cancel">
                      <X color="#dc3545" size={18} />
                    </button>
                  </>
                ) : (
                  <span className="lwuser-commission-amount">{formatCurrency(user.totalCommissionInPercent)} %</span>
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
                aria-label={expandedRows.includes(rowId) ? "Collapse details" : "Expand details"}
                onClick={hasNested ? () => toggleExpand(rowId) : undefined}
                onKeyDown={
                  hasNested
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          toggleExpand(rowId)
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
                        e.stopPropagation()
                        toggleExpand(rowId)
                      }}
                      aria-label={expandedRows.includes(rowId) ? "Hide nested users" : "Show nested users"}
                    >
                      {expandedRows.includes(rowId) ? <EyeOff /> : <Eye />}
                    </button>
                    {/* Edit button */}
                    <button
                      className="edit-btn"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(rowId, user.totalCommissionInPercent)
                      }}
                      aria-label={`Edit commission for ${user.associaateName}`}
                    >
                      <Pencil />
                    </button>
                    {/* Generate Report button */}
                    <button
                      className="report-btn"
                      title="Generate report"
                      onClick={(e) => {
                        e.stopPropagation()
                        const confirmed = window.confirm(
                          `Do you want to download ${user.associaateName}'s referral report as Excel?`,
                        )
                        if (confirmed) {
                          // Use original data for report generation
                          exportReportToExcel(user, originalNestedLevels)
                        }
                      }}
                      aria-label={`Generate report for ${user.associaateName}`}
                    >
                      <Printer />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        // FIX: Use user.id instead of user.associateId
                        onDeleteAssociate(user.id)
                      }}
                      aria-label={`Delete commission for ${user.associaateName}`}
                    >
                      <Trash />
                    </button>
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>
            {expandedRows.includes(rowId) && nestedLevels && nestedLevels.length > 0 && (
              <tr>
                <td colSpan={5} className="p-0">
                  <div className="lwuser-nested-table-wrapper overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Level</th>
                          <th className="px-4 py-2">Commission (%)</th>
                        </tr>
                      </thead>
                      <tbody>{renderNestedLevels(nestedLevels)}</tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

export default function LevelWiseUsers() {
  const [levels, setLevels] = useState([])
  const [originalLevels, setOriginalLevels] = useState([]) // Store original data
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const context = useContext(myContext)

  const handleDeleteAssociate = async (associateId) => {
    const confirmed = window.confirm("Are you sure you want to delete this associate and all related data?")
    if (!confirmed) return

    try {
      // const res = await deleteData(`/tree/delete/${associateId}`)
      const res = await deleteData(`/tree/delete/${associateId}`, { convertToUser: true })
      console.log("res: ", res)
      if (res.success) {
        context.setAlertBox({
          open: true,
          msg: res.message,
          error: false,
        })

        // FIX: Updated removeAssociate function to handle nested deletion properly
        const removeAssociate = (levels) => {
          return levels
            .map((level) => ({
              ...level,
              associates: level.associates.filter((assoc) => assoc.id !== associateId),
              lowerLevels: level.lowerLevels ? removeAssociate(level.lowerLevels) : [],
            }))
            .filter((level) => level.associates.length > 0 || (level.lowerLevels && level.lowerLevels.length > 0))
        }

        setLevels((prev) => removeAssociate(prev))
        setOriginalLevels((prev) => removeAssociate(prev))

        // FIX: Also remove from expandedRows if the deleted associate was expanded
        setExpandedRows((prev) => prev.filter((id) => id !== associateId))
      } else {
        alert("Failed to delete associate: " + res.message)
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("API request failed: " + error.message)
    }
  }

  // Handle search useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length === 0) {
        handleSearch() // fetch full tree
      } else if (searchQuery.trim().length > 2) {
        handleSearch() // filtered search
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = async () => {
    const trimmed = searchQuery.trim().toLowerCase()
    if (trimmed.length === 0) {
      // Show all data when search is empty
      setLevels(originalLevels)
      return
    }

    try {
      setLoading(true)
      // If we don't have original data, fetch it
      if (originalLevels.length === 0) {
        const res = await fetchDataFromApi("/tree")
        const allLevels = res.levels || []
        setOriginalLevels(allLevels)
      }

      const allLevels = originalLevels.length > 0 ? originalLevels : (await fetchDataFromApi("/tree")).levels || []

      const filterRecursive = (levels) => {
        const result = []
        for (const level of levels) {
          // Filter associates by name/email
          const matchedAssociates = level.associates.filter((assoc) => {
            const name = assoc.associaateName?.toLowerCase() || ""
            const email = assoc.associaateEmail?.toLowerCase() || ""
            return name.includes(trimmed) || email.includes(trimmed)
          })

          if (matchedAssociates.length > 0) {
            // If parent matches, keep all lowerLevels unfiltered to show full nested tree
            result.push({
              ...level,
              associates: matchedAssociates,
              lowerLevels: level.lowerLevels || [],
            })
          } else {
            // No match in parent, filter recursively children
            const filteredLowerLevels = level.lowerLevels ? filterRecursive(level.lowerLevels) : []
            if (filteredLowerLevels.length > 0) {
              result.push({
                ...level,
                associates: matchedAssociates,
                lowerLevels: filteredLowerLevels,
              })
            }
          }
        }
        return result
      }

      const finalFiltered = filterRecursive(allLevels)
      setLevels(finalFiltered)
    } catch (error) {
      console.error("Search error:", error)
      setLevels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const apiRes = await fetchDataFromApi("/tree")
        const data = apiRes.levels || []
        console.log("data: ", data)
        setLevels(data)
        setOriginalLevels(data) // Store original data
      } catch {
        setLevels([])
        setOriginalLevels([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleExpand = (rowId) => {
    setExpandedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
  }

  const updateCommissionInLevels = (levelsArr, userId, newPercent) => {
    return levelsArr.map((level) => {
      return {
        ...level,
        associates: level.associates.map((assoc) => {
          if (assoc.id === userId) {
            return { ...assoc, totalCommissionInPercent: newPercent }
          }
          return assoc
        }),
        lowerLevels: level.lowerLevels ? updateCommissionInLevels(level.lowerLevels, userId, newPercent) : undefined,
      }
    })
  }

  const handleCommissionUpdate = (userId, newPercent) => {
    setLevels((prevLevels) => updateCommissionInLevels(prevLevels, userId, newPercent))
    setOriginalLevels((prevLevels) => updateCommissionInLevels(prevLevels, userId, newPercent))
  }

  useEffect(() => {
    setExpandedRows([])
  }, [levels])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading users...</p>
        <img src="SPC.png" alt="Loading..." className="loading-logo" />
      </div>
    )
  }

  return (
    <div className="lwuser-container" role="main">
      <header className="lwuser-page-header">
        <h1>Level-wise Users</h1>
        <p>Referral network with associates and their nested referrals.</p>

      <div className="header-flex">

        <div className="search-section2">
          <div className="search-container2">
            <input
              type="text"
              placeholder="Search associate name..."
              className="search-input2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-button2" onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>
        </div>

      <div className="add-btnnn">
        <Link to="/addAssociate"><button>Add +</button></Link>
      </div>

      </div>

      </header>

      <div className="lwuser-table-container">
        <div className="lwuser-table-wrapper" tabIndex={0} aria-label="Referral network table">
          <table className="lwuser-table" role="table" aria-describedby="table-desc">
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
                levels.map((lvl) => {
                  // Find corresponding original level data
                  const originalLvl = originalLevels.find((orig) => orig.level === lvl.level)
                  return (
                    <LevelRow
                      key={lvl.level + "-top"}
                      levelData={lvl}
                      originalLevelData={originalLvl} // Pass original data
                      expandedRows={expandedRows}
                      toggleExpand={toggleExpand}
                      depth={0}
                      onCommissionUpdate={handleCommissionUpdate}
                      onDeleteAssociate={handleDeleteAssociate}
                    />
                  )
                })
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
  )
}




// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   Check,
//   Eye,
//   EyeOff,
//   Pencil,
//   Printer,
//   X,
//   Search,
//   Trash,
// } from "lucide-react";
// import "./LevelWiseUsers.css";
// import { deleteData, fetchDataFromApi, patchData } from "../../utils/api";
// import { myContext } from "../../App";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// // Format currency utility
// const formatCurrency = (val) =>
//   val !== undefined && val !== null && !isNaN(val)
//     ? Number(val).toFixed(2)
//     : "-";

// const renderNestedLevels = (node, depth = 1) => {
//   if (!node) return [];
//   return node.flatMap((item, index) => {
//     const currentRow = (
//       <tr key={`${depth}-${index}`}>
//         <td className="pl-4 py-2"> {item.associates[0].level}</td>
//         <td className="py-2 lwuser-commission-amount">
//           {item.associates[0].totalCommissionInPercent}%
//         </td>
//       </tr>
//     );
//     // recursively go through lowerLevels (if present)
//     const childRows = item.lowerLevels
//       ? renderNestedLevels(item.lowerLevels, depth + 1)
//       : [];
//     return [currentRow, ...childRows];
//   });
// };

// // Recursive row renderer
// function LevelRow({
//   levelData,
//   expandedRows,
//   toggleExpand,
//   depth = 0,
//   onCommissionUpdate,
//   originalLevelData, // Add this prop to maintain original structure
//   onDeleteAssociate,
// }) {
//   const context = useContext(myContext);
//   const [editingRowId, setEditingRowId] = React.useState(null);
//   const [editedCommission, setEditedCommission] = React.useState("");
//   const inputRef = useRef(null);

//   // Function to start editing a row
//   const startEditing = (rowId, currentCommission) => {
//     if (editingRowId === rowId) {
//       setEditingRowId(null);
//     } else {
//       setEditingRowId(rowId);
//       setEditedCommission(currentCommission ?? "");
//     }
//   };

//   // Call PATCH /edit API to save commission update
//   const saveEdit = async (user) => {
//     if (!editedCommission || isNaN(editedCommission)) {
//       alert("Please enter a valid percentage.");
//       return;
//     }

//     try {
//       const level = user.level;
//       const newPercent = Number.parseFloat(editedCommission);
//       const response = await patchData("/tree/edit", {
//         level,
//         newPercent,
//       });

//       if (response.success) {
//         context.setAlertBox({
//           open: true,
//           msg: response.message,
//           error: false,
//         });
//         setEditingRowId(null);
//         if (onCommissionUpdate) {
//           onCommissionUpdate(user.id, newPercent);
//         }
//       } else {
//         alert("Failed to update commission: " + response.message);
//       }
//     } catch (error) {
//       alert("API request failed: " + error.message);
//     }
//   };

//   const cancelEdit = () => {
//     setEditingRowId(null);
//   };

//   useEffect(() => {
//     if (editingRowId !== null && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [editingRowId]);

//   const flattenUserDataForExcel = (user, lowerLevels) => {
//   const rows = [
//     {
//       Level: user.level,
//       Name: user.associaateName,
//       Email: user.associaateEmail,
//       "Commission (%)": user.totalCommissionInPercent,
//       "Total Commission (₹)": user.totalCommissionInRupee,
//       ParentLevel: "-",
//     },
//   ];

//   const addNested = (levels, parentLevel) => {
//     if (!levels) return;
//     levels.forEach((level) => {
//       level.associates.forEach((assoc) => {
//         rows.push({
//           Level: assoc.level,
//           Name: assoc.associaateName,
//           Email: assoc.associaateEmail,
//           "Commission (%)": assoc.totalCommissionInPercent,
//           "Total Commission (₹)": assoc.totalCommissionInRupee,  // Correct here
//           ParentLevel: parentLevel,
//         });
//       });
//       if (level.lowerLevels) {
//         addNested(level.lowerLevels, level.level);
//       }
//     });
//   };

//   addNested(lowerLevels, user.level);
//   return rows;
// };

//   const exportReportToExcel = (user, lowerLevels) => {
//     const data = flattenUserDataForExcel(user, lowerLevels);
//     // Create worksheet from data
//     const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" }); // Data starts from row 3

//     // Add heading row manually
//     XLSX.utils.sheet_add_aoa(
//       worksheet,
//       [[`${user.associaateName}'s Referral Report`]],
//       {
//         origin: "A1",
//       }
//     );

//     // Merge cells A1 to E1 for heading
//     worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

//     // Add some basic styling for column widths
//     worksheet["!cols"] = [
//       { wch: 10 }, // Level
//       { wch: 25 }, // Name
//       { wch: 30 }, // Email
//       { wch: 20 }, // Commission (%)
//       { wch: 25 }, // Total Commission (₹)
//       { wch: 15 }, // Parent
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
//     });
//     saveAs(blob, `${user.associaateName}_Referral_Report.xlsx`);
//   };

//   if (!levelData?.associates || !levelData.associates.length) return null;

//   return (
//     <>
//       {levelData.associates.map((user) => {
//         const rowId = user.id;

//         // Use original data to check for nested levels, not filtered data
//         const originalUserData = originalLevelData?.associates?.find(
//           (assoc) => assoc.id === user.id
//         );
//         const originalNestedLevels = originalLevelData?.lowerLevels?.filter(
//           (lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0
//         );

//         // For display purposes, use filtered data
//         const nestedLevels =
//           Array.isArray(levelData.lowerLevels) &&
//           levelData.lowerLevels.filter(
//             (lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0
//           );

//         // Check if user has nested levels in original data (for action buttons)
//         const hasNested =
//           originalNestedLevels && originalNestedLevels.length > 0;
//         const isEditing = editingRowId === rowId;

//         return (
//           <React.Fragment key={rowId}>
//             <tr
//               className="lwuser-main-row"
//               style={{ cursor: "default" }}
//               tabIndex={undefined}
//               aria-expanded={expandedRows.includes(rowId)}
//             >
//               <td style={{ textAlign: "center" }}>{user.level}</td>
//               <td>
//                 <strong>{user.associaateName}</strong>
//               </td>
//               <td>{user.associaateEmail}</td>
//               <td style={{ textAlign: "center" }}>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="number"
//                       ref={inputRef}
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       className="commission-inputs"
//                       value={editedCommission}
//                       onChange={(e) => setEditedCommission(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           saveEdit(user);
//                         } else if (e.key === "Escape") {
//                           cancelEdit();
//                         }
//                       }}
//                     />
//                     <button
//                       onClick={() => saveEdit(user)}
//                       className="btn-save"
//                       aria-label="Save"
//                       title="Save"
//                     >
//                       <Check color="#28a745" size={18} />
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="btn-cancel"
//                       aria-label="Cancel"
//                       title="Cancel"
//                     >
//                       <X color="#dc3545" size={18} />
//                     </button>
//                   </>
//                 ) : (
//                   <span className="lwuser-commission-amount">
//                     {formatCurrency(user.totalCommissionInPercent)} %
//                   </span>
//                 )}
//               </td>
//               <td
//                 style={{
//                   textAlign: "center",
//                   cursor: hasNested ? "pointer" : "default",
//                 }}
//                 tabIndex={hasNested ? 0 : undefined}
//                 role="button"
//                 aria-pressed={expandedRows.includes(rowId)}
//                 aria-label={
//                   expandedRows.includes(rowId)
//                     ? "Collapse details"
//                     : "Expand details"
//                 }
//                 onClick={hasNested ? () => toggleExpand(rowId) : undefined}
//                 onKeyDown={
//                   hasNested
//                     ? (e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           toggleExpand(rowId);
//                         }
//                       }
//                     : undefined
//                 }
//               >
//                 {hasNested ? (
//                   <div className="action-buttonss">
//                     {/* View toggle button */}
//                     <button
//                       className="view-btn"
//                       title="View"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleExpand(rowId);
//                       }}
//                       aria-label={
//                         expandedRows.includes(rowId)
//                           ? "Hide nested users"
//                           : "Show nested users"
//                       }
//                     >
//                       {expandedRows.includes(rowId) ? <EyeOff /> : <Eye />}
//                     </button>
//                     {/* Edit button */}
//                     <button
//                       className="edit-btn"
//                       title="Edit"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         startEditing(rowId, user.totalCommissionInPercent);
//                       }}
//                       aria-label={`Edit commission for ${user.associaateName}`}
//                     >
//                       <Pencil />
//                     </button>
//                     {/* Generate Report button */}
//                     <button
//                       className="report-btn"
//                       title="Generate report"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         const confirmed = window.confirm(
//                           `Do you want to download ${user.associaateName}'s referral report as Excel?`
//                         );
//                         if (confirmed) {
//                           // Use original data for report generation
//                           exportReportToExcel(user, originalNestedLevels);
//                         }
//                       }}
//                       aria-label={`Generate report for ${user.associaateName}`}
//                     >
//                       <Printer />
//                     </button>
//                     <button
//                       className="delete-btn"
//                       title="Delete"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteAssociate(user.associateId); 
//                       }}
//                       aria-label={`Delete commission for ${user.associaateName}`}
//                     >
//                       <Trash />
//                     </button>
//                   </div>
//                 ) : (
//                   "-"
//                 )}
//               </td>
//             </tr>
//             {expandedRows.includes(rowId) &&
//               nestedLevels &&
//               nestedLevels.length > 0 && (
//                 <tr>
//                   <td colSpan={5} className="p-0">
//                     <div className="lwuser-nested-table-wrapper overflow-x-auto">
//                       <table className="min-w-full text-left">
//                         <thead>
//                           <tr>
//                             <th className="px-4 py-2">Level</th>
//                             <th className="px-4 py-2">Commission (%)</th>
//                           </tr>
//                         </thead>
//                         <tbody>{renderNestedLevels(nestedLevels)}</tbody>
//                       </table>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//           </React.Fragment>
//         );
//       })}
//     </>
//   );
// }

// export default function LevelWiseUsers() {
//   const [levels, setLevels] = useState([]);
//   const [originalLevels, setOriginalLevels] = useState([]); // Store original data
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
// const context = useContext(myContext);


// const handleDeleteAssociate = async (associateId) => {
//   const confirmed = window.confirm(
//     "Are you sure you want to delete this associate and all related data?"
//   );
//   if (!confirmed) return;

//   try {
//     const res = await deleteData(`/tree/delete/${associateId}`);
//     console.log("res: ", res);

//     if (res.success) {
//       context.setAlertBox({
//         open: true,
//         msg: res.message,
//         error: false,
//       });

//       // Remove associate from both levels and originalLevels
//       const removeAssociate = (levels) =>
//         levels
//           .map((level) => ({
//             ...level,
//             associates: level.associates.filter(
//               (assoc) => assoc.id !== associateId
//             ),
//             lowerLevels: level.lowerLevels
//               ? removeAssociate(level.lowerLevels)
//               : [],
//           }))
//           .filter((level) => level.associates.length > 0 || level.lowerLevels.length > 0);

//       setLevels((prev) => removeAssociate(prev));
//       setOriginalLevels((prev) => removeAssociate(prev));
//     } else {
//       alert("Failed to delete associate: " + res.message);
//     }
//   } catch (error) {
//     alert("API request failed: " + error.message);
//   }
// };


//   // Handle search useEffect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.trim().length === 0) {
//         handleSearch(); // fetch full tree
//       } else if (searchQuery.trim().length > 2) {
//         handleSearch(); // filtered search
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const handleSearch = async () => {
//     const trimmed = searchQuery.trim().toLowerCase();

//     if (trimmed.length === 0) {
//       // Show all data when search is empty
//       setLevels(originalLevels);
//       return;
//     }

//     try {
//       setLoading(true);

//       // If we don't have original data, fetch it
//       if (originalLevels.length === 0) {
//         const res = await fetchDataFromApi("/tree");
//         const allLevels = res.levels || [];
//         setOriginalLevels(allLevels);
//       }

//       const allLevels =
//         originalLevels.length > 0
//           ? originalLevels
//           : (await fetchDataFromApi("/tree")).levels || [];

//       const filterRecursive = (levels) => {
//   const result = [];
//   for (const level of levels) {
//     // Filter associates by name/email
//     const matchedAssociates = level.associates.filter((assoc) => {
//       const name = assoc.associaateName?.toLowerCase() || "";
//       const email = assoc.associaateEmail?.toLowerCase() || "";
//       return name.includes(trimmed) || email.includes(trimmed);
//     });

//     if (matchedAssociates.length > 0) {
//       // If parent matches, keep all lowerLevels unfiltered to show full nested tree
//       result.push({
//         ...level,
//         associates: matchedAssociates,
//         lowerLevels: level.lowerLevels || [],
//       });
//     } else {
//       // No match in parent, filter recursively children
//       const filteredLowerLevels = level.lowerLevels ? filterRecursive(level.lowerLevels) : [];
//       if (filteredLowerLevels.length > 0) {
//         result.push({
//           ...level,
//           associates: matchedAssociates,
//           lowerLevels: filteredLowerLevels,
//         });
//       }
//     }
//   }
//   return result;
// };

//       const finalFiltered = filterRecursive(allLevels);
//       setLevels(finalFiltered);
//     } catch (error) {
//       console.error("Search error:", error);
//       setLevels([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       try {
//         const apiRes = await fetchDataFromApi("/tree");
//         const data = apiRes.levels || [];
//         console.log("data: ", data);
//         setLevels(data);
//         setOriginalLevels(data); // Store original data
//       } catch {
//         setLevels([]);
//         setOriginalLevels([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const toggleExpand = (rowId) => {
//     setExpandedRows((prev) =>
//       prev.includes(rowId)
//         ? prev.filter((id) => id !== rowId)
//         : [...prev, rowId]
//     );
//   };

//   const updateCommissionInLevels = (levelsArr, userId, newPercent) => {
//     return levelsArr.map((level) => {
//       return {
//         ...level,
//         associates: level.associates.map((assoc) => {
//           if (assoc.id === userId) {
//             return { ...assoc, totalCommissionInPercent: newPercent };
//           }
//           return assoc;
//         }),
//         lowerLevels: level.lowerLevels
//           ? updateCommissionInLevels(level.lowerLevels, userId, newPercent)
//           : undefined,
//       };
//     });
//   };

//   const handleCommissionUpdate = (userId, newPercent) => {
//     setLevels((prevLevels) =>
//       updateCommissionInLevels(prevLevels, userId, newPercent)
//     );
//     setOriginalLevels((prevLevels) =>
//       updateCommissionInLevels(prevLevels, userId, newPercent)
//     );
//   };
//   useEffect(() => {
//   setExpandedRows([]);
// }, [levels]);


//   if (loading) {
//     return (
//       <div className="loading-container">
//         <p>Loading users...</p>
//         <img src="SPC.png" alt="Loading..." className="loading-logo" />
//       </div>
//     );
//   }

//   return (
//     <div className="lwuser-container" role="main">
//       <header className="lwuser-page-header">
//         <h1>Level-wise Users</h1>
//         <p>Referral network with associates and their nested referrals.</p>
//         <div className="search-section2">
//           <div className="search-container2">
//             <input
//               type="text"
//               placeholder="Search associate name..."
//               className="search-input2"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             />
//             <button className="search-button2" onClick={handleSearch}>
//               <Search size={18} />
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="lwuser-table-container">
//         <div
//           className="lwuser-table-wrapper"
//           tabIndex={0}
//           aria-label="Referral network table"
//         >
//           <table
//             className="lwuser-table"
//             role="table"
//             aria-describedby="table-desc"
//           >
//             <caption id="table-desc" className="lwuser-sr-only">
//               Referral network, all levels and their nested associates.
//             </caption>
//             <thead>
//               <tr>
//                 <th>Level</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Commission (%)</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {levels && levels.length > 0 ? (
//                 levels.map((lvl) => {
//                   // Find corresponding original level data
//                   const originalLvl = originalLevels.find(
//                     (orig) => orig.level === lvl.level
//                   );
//                   return (
//                     <LevelRow
//                       key={lvl.level + "-top"}
//                       levelData={lvl}
//                       originalLevelData={originalLvl} // Pass original data
//                       expandedRows={expandedRows}
//                       toggleExpand={toggleExpand}
//                       depth={0}
//                       onCommissionUpdate={handleCommissionUpdate}
//                       onDeleteAssociate={handleDeleteAssociate}
//                     />
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="lwuser-no-nested-users">
//                     No associates found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
