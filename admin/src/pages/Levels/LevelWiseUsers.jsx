import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Pencil,
  Printer,
  X,
  Search,
  Trash,
} from "lucide-react";
import "./LevelWiseUsers.css";
import { deleteData, fetchDataFromApi, patchData } from "../../utils/api";
import { myContext } from "../../App";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

// Helpers
const formatCurrency = (val) =>
  val !== undefined && val !== null && !isNaN(val)
    ? Number(val).toFixed(2)
    : "-";

function RenderNestedLevels({ nodes, parentAssociateId, onPercentUpdate }) {
  const [editingLevel, setEditingLevel] = useState(null);
  const [editedPercent, setEditedPercent] = useState("");
  const inputRef = useRef(null);
  const context = useContext(myContext);
  const startEditing = (level, currentPercent) => {
    setEditingLevel(level);
    setEditedPercent(currentPercent.toString());
  };

  const cancelEditing = () => {
    setEditingLevel(null);
    setEditedPercent("");
  };

  useEffect(() => {
    if (editingLevel !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingLevel]);

  const saveEdit = async (levelItem) => {
    if (editedPercent === "" || isNaN(editedPercent)) {
      alert("Please enter a valid percentage.");
      return;
    }
    try {
      const percentOverride = parseFloat(editedPercent);
      const overrideLevel = levelItem.level;
      const targetAssociateId =
        levelItem.associates && levelItem.associates.length > 0
          ? levelItem.associates[0].associaateId
          : null;

      if (!targetAssociateId) {
        alert("Target associate ID not found for this level.");
        return;
      }
      console.log("sending lowerlevel data", {
        parentAssociateId,
        targetAssociateId,
        overrideLevel,
        percentOverride,
      });

      const response = await patchData("/tree/lowerlevel", {
        parentAssociateId,
        targetAssociateId,
        overrideLevel,
        percentOverride,
      });
      console.log("response tree/lowerlevel:", response);

      if (response.success) {
        context.setAlertBox({
          open: true,
          msg: response.message,
          error: false,
        });
        onPercentUpdate(overrideLevel, percentOverride);
        setEditingLevel(null);
        setEditedPercent("");
      } else {
        alert(response.message || "Failed to update percent");
      }
    } catch (error) {
      alert("API call failed: " + error.message);
    }
  };

  return (
    <>
      {nodes.map((item) => (
        <tr key={`nested-level-${item.level}`}>
          <td className="pl-4 py-2">{item.level}</td>
          <td
            className="py-2 lwuser-commission-amount"
            style={{ textAlign: "center" }}
          >
            {editingLevel === item.level ? (
              <input
                ref={editingLevel === item.level ? inputRef : null}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editedPercent}
                onChange={(e) => setEditedPercent(e.target.value)}
                style={{ width: 80 }}
                aria-label={`Edit commission percent for level ${item.level}`}
              />
            ) : item.percent !== undefined ? (
              Number(item.percent).toFixed(2)
            ) : (
              "-"
            )}{" "}
            %
          </td>
          <td style={{ textAlign: "center" }}>
            {editingLevel === item.level ? (
              <>
                <button
                  onClick={() => saveEdit(item)}
                  title="Save"
                  aria-label="Save edited commission percent"
                  className="btn-save"
                  style={{ marginLeft: 6 }}
                >
                  <Check size={16} color="#28a745" />
                </button>
                <button
                  onClick={cancelEditing}
                  title="Cancel"
                  aria-label="Cancel editing"
                  className="btn-cancel"
                  style={{ marginLeft: 6 }}
                >
                  <X size={16} color="#dc3545" />
                </button>
              </>
            ) : (
              <button
                onClick={() => startEditing(item.level, item.percent)}
                title={`Edit commission percent for level ${item.level}`}
                aria-label={`Edit commission percent for level ${item.level}`}
                className="edit-btn"
              >
                <Pencil size={16} />
              </button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

// --- Main Row Renderer ---
function LevelRow({
  levelData,
  expandedRows,
  toggleExpand,
  onCommissionUpdate,
  onDeleteAssociate,
}) {
  const context = useContext(myContext);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedCommission, setEditedCommission] = useState("");
  const inputRef = useRef(null);

  const startEditing = (rowId, currentCommission) => {
    if (editingRowId === rowId) setEditingRowId(null);
    else {
      setEditingRowId(rowId);
      setEditedCommission(currentCommission ?? "");
    }
  };

  const saveEdit = async (user) => {
    if (!editedCommission || isNaN(editedCommission)) {
      alert("Please enter a valid percentage.");
      return;
    }
    try {
      const level = user.level;
      const newPercent = Number.parseFloat(editedCommission);
      const associateId = user.associaateId;

      const response = await patchData("/tree/edit", {
        level,
        newPercent,
        associateId,
      });

      if (response.success) {
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

  const cancelEdit = () => setEditingRowId(null);

  useEffect(() => {
    if (editingRowId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingRowId]);

  const [nestedLevels, setNestedLevels] = useState([]);

  useEffect(() => {
    // Initialize nestedLevels from user data at mount or levelData update
    if (levelData?.associates) {
      levelData.associates.forEach((user) => {
        if (user.lowerLevels) {
          setNestedLevels(user.lowerLevels);
        }
      });
    }
  }, [levelData]);

  const onPercentUpdate = (level, newPercent, userId) => {
    setNestedLevels((prevLevels) =>
      prevLevels.map((lvl) =>
        lvl.level === level ? { ...lvl, percent: newPercent } : lvl
      )
    );
  };

  const flattenUserDataForExcel = (user, lowerLevels) => {
    const rows = [
      {
        Level: user.level,
        Name: user.associaateName,
        Email: user.associaateEmail,
        "Commission (%)": user.totalCommissionInPercent,
        "Total Commission (₹)": user.totalCommissionInRupee,
        ParentLevel: "-", // Top-level user has no parent
      },
    ];

    const visitedAssociateIds = new Set();
    visitedAssociateIds.add(user.associaateId); // Mark top-level associate as visited

    const addNested = (levels, parentLevel) => {
      if (!levels) return;

      levels.forEach((level) => {
        if (Array.isArray(level.associates)) {
          level.associates.forEach((assoc) => {
            if (!visitedAssociateIds.has(assoc.associaateId)) {
              visitedAssociateIds.add(assoc.associaateId);

              rows.push({
                Level: assoc.level,
                Name: assoc.associaateName || "-",
                Email: assoc.associaateEmail || "-",
                "Commission (%)":
                  assoc.totalCommissionInPercent !== undefined
                    ? Number(assoc.totalCommissionInPercent).toFixed(2)
                    : "-",
                "Total Commission (₹)":
                  assoc.totalCommissionInRupee !== undefined
                    ? Number(assoc.totalCommissionInRupee).toFixed(2)
                    : "-",
                ParentLevel: parentLevel,
              });

              // Recurse on this associate’s nested levels if any
              if (assoc.lowerLevels) {
                addNested(assoc.lowerLevels, assoc.level);
              }
            }
          });
        }

        // Also recurse further down in the level’s lowerLevels if exists outside associates
        if (level.lowerLevels) {
          addNested(level.lowerLevels, level.level);
        }
      });
    };

    addNested(lowerLevels, user.level);

    return rows;
  };

  // Function to generate and download Excel file
  const exportReportToExcel = (user, lowerLevels) => {
    const data = flattenUserDataForExcel(user, lowerLevels);

    // Create worksheet from JSON data starting at A3
    const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" });

    // Add report title at A1 with merging cells across columns A:E (0-based indices 0 to 4)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`${user.associaateName}'s Referral Report`]],
      { origin: "A1" }
    );
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // Set column widths (adjust these values as needed)
    worksheet["!cols"] = [
      { wch: 10 }, // Level
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Commission (%)
      { wch: 25 }, // Total Commission (₹)
    ];

    // Apply styles: Bold header and alignment & wrap for columns
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let C = range.s.c; C <= range.e.c; ++C) {
      // Header row styling (at row 3 in Excel => row index 2 zero-based)
      const headerCellAddress = XLSX.utils.encode_cell({ c: C, r: 2 });
      if (worksheet[headerCellAddress]) {
        worksheet[headerCellAddress].s = {
          font: { bold: true, color: { rgb: "000000" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }

      // Apply alignment & wrap text to all data rows (starting from row 4, index 3)
      for (let R = 3; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
        if (worksheet[cellAddress]) {
          // Center align numeric columns, left align text columns
          const isNumericColumn = C === 0 || C === 3 || C === 4; // Level, Commission, Total
          worksheet[cellAddress].s = {
            alignment: {
              horizontal: isNumericColumn ? "center" : "left",
              vertical: "center",
              wrapText: true,
            },
          };
        }
      }
    }

    // Create a new workbook and append the styled worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Write workbook to binary array buffer and trigger file download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `${user.associaateName}_Referral_Report.xlsx`);
  };

  if (!levelData?.associates || levelData.associates.length === 0) return null;

  return (
    <>
      {levelData.associates.map((user) => {
        const rowId = user.id;
        const originalNestedLevels = user.lowerLevels || [];
        const hasNested = originalNestedLevels.length > 0;
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
                        if (e.key === "Enter") saveEdit(user);
                        else if (e.key === "Escape") cancelEdit();
                      }}
                      style={{ width: 60 }}
                      aria-label={`Edit commission percentage for ${user.associaateName}`}
                    />
                    <button
                      onClick={() => saveEdit(user)}
                      className="btn-save"
                      aria-label="Save main commission edit"
                      title="Save"
                    >
                      <Check color="#28a745" size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-cancel"
                      aria-label="Cancel main commission edit"
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
                role={hasNested ? "button" : undefined}
                aria-pressed={
                  hasNested ? expandedRows.includes(rowId) : undefined
                }
                aria-label={
                  hasNested
                    ? expandedRows.includes(rowId)
                      ? "Collapse details"
                      : "Expand details"
                    : undefined
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
                <div className="action-buttonss">
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
                  <button
                    className="report-btn"
                    title="Generate report"
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmed = window.confirm(
                        `Do you want to download ${user.associaateName}'s referral report as Excel?`
                      );
                      if (confirmed)
                        exportReportToExcel(user, originalNestedLevels);
                    }}
                    aria-label={`Generate report for ${user.associaateName}`}
                  >
                    <Printer />
                  </button>
                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAssociate(user.id);
                    }}
                    aria-label={`Delete commission for ${user.associaateName}`}
                  >
                    <Trash />
                  </button>
                </div>
              </td>
            </tr>

            {expandedRows.includes(rowId) &&
              originalNestedLevels.length > 0 && (
                <tr>
                  <td colSpan={3} className="p-0">
                    <div className="lwuser-nested-table-wrapper overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Level</th>
                            <th className="px-4 py-2">Percent (%)</th>
                            <th className="px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <RenderNestedLevels
                            nodes={originalNestedLevels}
                            parentAssociateId={user.associaateId}
                            onPercentUpdate={(level, percent) => {
                              // Update nested levels percent locally
                              const updatedNestedLevels =
                                originalNestedLevels.map((lvl) =>
                                  lvl.level === level
                                    ? { ...lvl, percent }
                                    : lvl
                                );
                              // Directly update user.lowerLevels for next renders
                              user.lowerLevels = updatedNestedLevels;
                              onPercentUpdate(level, percent, user.id);
                            }}
                          />
                        </tbody>
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

// --- MAIN COMPONENT ---
export default function LevelWiseUsers() {
  const [levels, setLevels] = useState([]);
  const [originalLevels, setOriginalLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(myContext);

  const handleDeleteAssociate = async (associateId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this associate and all related data?"
    );
    if (!confirmed) return;
    try {
      const res = await deleteData(`/tree/delete/${associateId}`, {
        convertToUser: true,
      });
      if (res.success) {
        context.setAlertBox({
          open: true,
          msg: res.message,
          error: false,
        });
        const removeAssociate = (levels) =>
          levels
            .map((level) => ({
              ...level,
              associates: level.associates.filter(
                (assoc) => assoc.id !== associateId
              ),
              lowerLevels: level.lowerLevels
                ? removeAssociate(level.lowerLevels)
                : [],
            }))
            .filter(
              (level) =>
                level.associates.length > 0 ||
                (level.lowerLevels && level.lowerLevels.length > 0)
            );
        setLevels((prev) => removeAssociate(prev));
        setOriginalLevels((prev) => removeAssociate(prev));
        setExpandedRows((prev) => prev.filter((id) => id !== associateId));
      } else {
        alert("Failed to delete associate: " + res.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("API request failed: " + error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length === 0 || searchQuery.trim().length > 2) {
        handleSearch();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length === 0) {
      setLevels(originalLevels);
      return;
    }
    try {
      setLoading(true);
      if (originalLevels.length === 0) {
        const res = await fetchDataFromApi("/tree");
        setOriginalLevels(res.levels || []);
      }
      const allLevels =
        originalLevels.length > 0
          ? originalLevels
          : (await fetchDataFromApi("/tree")).levels || [];
      const filterRecursive = (levels) => {
        const result = [];
        for (const level of levels) {
          const matchedAssociates = level.associates.filter((assoc) => {
            const name = assoc.associaateName?.toLowerCase() || "";
            const email = assoc.associaateEmail?.toLowerCase() || "";
            return name.includes(trimmed) || email.includes(trimmed);
          });
          if (matchedAssociates.length > 0) {
            result.push({
              ...level,
              associates: matchedAssociates,
              lowerLevels: level.lowerLevels || [],
            });
          } else {
            const filteredLowerLevels = level.lowerLevels
              ? filterRecursive(level.lowerLevels)
              : [];
            if (filteredLowerLevels.length > 0) {
              result.push({
                ...level,
                associates: [],
                lowerLevels: filteredLowerLevels,
              });
            }
          }
        }
        return result;
      };
      const finalFiltered = filterRecursive(allLevels);
      setLevels(finalFiltered);
    } catch (error) {
      console.error("Search error:", error);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const apiRes = await fetchDataFromApi("/tree");
        const data = apiRes.levels || [];
        setLevels(data);
        setOriginalLevels(data);
      } catch {
        setLevels([]);
        setOriginalLevels([]);
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

  const updateCommissionInLevels = (levelsArr, userId, newPercent) =>
    levelsArr.map((level) => ({
      ...level,
      associates: level.associates.map((assoc) =>
        assoc.id === userId
          ? { ...assoc, totalCommissionInPercent: newPercent }
          : assoc
      ),
      lowerLevels: level.lowerLevels
        ? updateCommissionInLevels(level.lowerLevels, userId, newPercent)
        : undefined,
    }));

  const handleCommissionUpdate = (userId, newPercent) => {
    setLevels((prevLevels) =>
      updateCommissionInLevels(prevLevels, userId, newPercent)
    );
    setOriginalLevels((prevLevels) =>
      updateCommissionInLevels(prevLevels, userId, newPercent)
    );
  };

  useEffect(() => {
    setExpandedRows([]);
  }, [levels]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading users...</p>
        <img src="SPC.png" alt="Loading..." className="loading-logo" />
      </div>
    );
  }

  // You can optionally extend this to update nested level data globally in `levels` and `originalLevels`
  // if deep updates are desired.

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
                aria-label="Search associate name"
              />
              <button
                className="search-button2"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="add-btnnn">
            <Link to="/addAssociate">
              <button>Add +</button>
            </Link>
          </div>
        </div>
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
                    key={`${lvl.level}-top`}
                    levelData={lvl}
                    expandedRows={expandedRows}
                    toggleExpand={toggleExpand}
                    onCommissionUpdate={handleCommissionUpdate}
                    onDeleteAssociate={handleDeleteAssociate}
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
// import { Link } from "react-router-dom";

// // Helpers
// const formatCurrency = (val) =>
//   val !== undefined && val !== null && !isNaN(val) ? Number(val).toFixed(2) : "-";

// // --- NESTED TABLE RENDERER WITH FULL EDIT SUPPORT ---
// const renderNestedLevels = (
//   nodes,
//   editingRowId,
//   editedCommission,
//   setEditingRowId,
//   setEditedCommission,
//   saveEdit,
//   cancelEdit,
//   inputRef
// ) => {
//   if (!nodes) return [];
//   return nodes.flatMap((item, index) =>
//     item.associates.map((assoc, assocIdx) => {
//       const rowId = assoc.id;
//       const isEditing = editingRowId === rowId;
//       const row = (
//         <tr key={`${item.level}-${assoc.id || assocIdx}`}>
//           <td className="pl-4 py-2">{assoc.level}</td>
//           {/* <td className="py-2">{assoc.associaateName}</td> */}
//            {/*<td className="py-2">{assoc.associaateEmail}</td> */}
//           <td className="py-2 lwuser-commission-amount" style={{ textAlign: "center" }}>
//             {isEditing ? (
//               <>
//                 <input
//                   type="number"
//                   ref={isEditing ? inputRef : null}
//                   min="0"
//                   max="100"
//                   step="0.1"
//                   className="commission-inputs"
//                   value={editedCommission}
//                   onChange={(e) => setEditedCommission(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") saveEdit(assoc);
//                     else if (e.key === "Escape") cancelEdit();
//                   }}
//                   style={{ width: 60 }}
//                 />
//                 <button onClick={() => saveEdit(assoc)} className="btn-save" aria-label="Save" title="Save">
//                   <Check color="#28a745" size={18} />
//                 </button>
//                 <button onClick={cancelEdit} className="btn-cancel" aria-label="Cancel" title="Cancel">
//                   <X color="#dc3545" size={18} />
//                 </button>
//               </>
//             ) : (
//               <span>
//                 {formatCurrency(assoc.totalCommissionInPercent)} %
//               </span>
//             )}
//           </td>
//           <td style={{ textAlign: "center" }}>
//             <button
//               className="edit-btn"
//               title="Edit"
//               onClick={() => {
//                 if (isEditing) setEditingRowId(null);
//                 else {
//                   setEditingRowId(rowId);
//                   setEditedCommission(assoc.totalCommissionInPercent);
//                 }
//               }}
//               aria-label={`Edit commission for ${assoc.associaateName}`}
//             >
//               <Pencil />
//             </button>
//           </td>
//         </tr>
//       );
//       // Recursively render any child levels
//       const nestedRows =
//         item.lowerLevels && item.lowerLevels.length > 0
//           ? renderNestedLevels(
//               item.lowerLevels,
//               editingRowId,
//               editedCommission,
//               setEditingRowId,
//               setEditedCommission,
//               saveEdit,
//               cancelEdit,
//               inputRef
//             )
//           : [];
//       return [row, ...nestedRows];
//     })
//   );
// };

// // --- MAIN ROW RENDERER ---
// function LevelRow({
//   levelData,
//   expandedRows,
//   toggleExpand,
//   onCommissionUpdate,
//   originalLevelData,
//   onDeleteAssociate,
// }) {
//   const context = useContext(myContext);
//   const [editingRowId, setEditingRowId] = useState(null);
//   const [editedCommission, setEditedCommission] = useState("");
//   const inputRef = useRef(null);

//   // Editing logic
//   const startEditing = (rowId, currentCommission) => {
//     if (editingRowId === rowId) setEditingRowId(null);
//     else {
//       setEditingRowId(rowId);
//       setEditedCommission(currentCommission ?? "");
//     }
//   };

//  const saveEdit = async (user) => {

//   if (!editedCommission || isNaN(editedCommission)) {
//     alert("Please enter a valid percentage.")
//     return
//   }

//   try {
//     const level = user.level
//     const newPercent = Number.parseFloat(editedCommission)
//     const associateId = user.associaateId; //  FIXED HERE

//     const response = await patchData("/tree/edit", {
//       level,
//       newPercent,
//       associateId,
//     })

//     if (response.success) {
//       context.setAlertBox({
//         open: true,
//         msg: response.message,
//         error: false,
//       })
//       setEditingRowId(null)
//       if (onCommissionUpdate) {
//         onCommissionUpdate(user.id, newPercent)
//       }
//     } else {
//       alert("Failed to update commission: " + response.message)
//     }
//   } catch (error) {
//     alert("API request failed: " + error.message)
//   }
// }

//   const cancelEdit = () => setEditingRowId(null);

//   useEffect(() => {
//     if (editingRowId !== null && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [editingRowId]);

//   const flattenUserDataForExcel = (user, lowerLevels) => {
//     const rows = [
//       {
//         Level: user.level,
//         Name: user.associaateName,
//         Email: user.associaateEmail,
//         "Commission (%)": user.totalCommissionInPercent,
//         "Total Commission (₹)": user.totalCommissionInRupee,
//         ParentLevel: "-",
//       },
//     ];
//     const addNested = (levels, parentLevel) => {
//       if (!levels) return;
//       levels.forEach((level) => {
//         level.associates.forEach((assoc) => {
//           rows.push({
//             Level: assoc.level,
//             Name: assoc.associaateName,
//             Email: assoc.associaateEmail,
//             "Commission (%)": assoc.totalCommissionInPercent,
//             "Total Commission (₹)": assoc.totalCommissionInRupee,
//             ParentLevel: parentLevel,
//           });
//         });
//         if (level.lowerLevels) {
//           addNested(level.lowerLevels, level.level);
//         }
//       });
//     };
//     addNested(lowerLevels, user.level);
//     return rows;
//   };

//   const exportReportToExcel = (user, lowerLevels) => {
//     const data = flattenUserDataForExcel(user, lowerLevels);
//     const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" });
//     XLSX.utils.sheet_add_aoa(
//       worksheet,
//       [[`${user.associaateName}'s Referral Report`]],
//       { origin: "A1" }
//     );
//     worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
//     worksheet["!cols"] = [
//       { wch: 10 },
//       { wch: 25 },
//       { wch: 30 },
//       { wch: 20 },
//       { wch: 25 },
//       { wch: 15 },
//     ];
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
//         const originalNestedLevels = originalLevelData?.lowerLevels?.filter(
//           (lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0
//         );
//         const nestedLevels =
//           Array.isArray(levelData.lowerLevels) &&
//           levelData.lowerLevels.filter((lvl) => Array.isArray(lvl.associates) && lvl.associates.length > 0);
//         const hasNested = originalNestedLevels && originalNestedLevels.length > 0;
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
//                         if (e.key === "Enter") saveEdit(user);
//                         else if (e.key === "Escape") cancelEdit();
//                       }}
//                     />
//                     <button onClick={() => saveEdit(user)} className="btn-save" aria-label="Save" title="Save">
//                       <Check color="#28a745" size={18} />
//                     </button>
//                     <button onClick={cancelEdit} className="btn-cancel" aria-label="Cancel" title="Cancel">
//                       <X color="#dc3545" size={18} />
//                     </button>
//                   </>
//                 ) : (
//                   <span className="lwuser-commission-amount">
//                     {formatCurrency(user.totalCommissionInPercent)} %
//                   </span>
//                 )}
//               </td>
//               <td style={{ textAlign: "center", cursor: hasNested ? "pointer" : "default" }}
//                 tabIndex={hasNested ? 0 : undefined}
//                 role="button"
//                 aria-pressed={expandedRows.includes(rowId)}
//                 aria-label={expandedRows.includes(rowId) ? "Collapse details" : "Expand details"}
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
//                     <button
//                       className="view-btn"
//                       title="View"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleExpand(rowId);
//                       }}
//                       aria-label={expandedRows.includes(rowId) ? "Hide nested users" : "Show nested users"}
//                     >
//                       {expandedRows.includes(rowId) ? <EyeOff /> : <Eye />}
//                     </button>
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
//                     <button
//                       className="report-btn"
//                       title="Generate report"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         const confirmed = window.confirm(
//                           `Do you want to download ${user.associaateName}'s referral report as Excel?`
//                         );
//                         if (confirmed) exportReportToExcel(user, originalNestedLevels);
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
//                         onDeleteAssociate(user.id);
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
//             {expandedRows.includes(rowId) && nestedLevels && nestedLevels.length > 0 && (
//               <tr>
//                 <td colSpan={3} className="p-0">
//                   <div className="lwuser-nested-table-wrapper overflow-x-auto">
//                     <table className="min-w-full text-left">
//                       <thead>
//                         <tr>
//                           <th className="px-4 py-2">Level</th>
//                           {/* <th className="px-4 py-2">Name</th> */}
//                           {/* <th className="px-4 py-2">Email</th> */}
//                           <th className="px-4 py-2">Commission (%)</th>
//                           <th className="px-4 py-2">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {renderNestedLevels(
//                           nestedLevels,
//                           editingRowId,
//                           editedCommission,
//                           setEditingRowId,
//                           setEditedCommission,
//                           saveEdit,
//                           cancelEdit,
//                           inputRef
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </>
//   );
// }

// // --- MAIN COMPONENT ---
// export default function LevelWiseUsers() {
//   const [levels, setLevels] = useState([]);
//   const [originalLevels, setOriginalLevels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const context = useContext(myContext);

//   const handleDeleteAssociate = async (associateId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this associate and all related data?"
//     );
//     if (!confirmed) return;
//     try {
//       const res = await deleteData(`/tree/delete/${associateId}`, {
//         convertToUser: true,
//       });
//       if (res.success) {
//         context.setAlertBox({
//           open: true,
//           msg: res.message,
//           error: false,
//         });
//         // remove function supports nested
//         const removeAssociate = (levels) =>
//           levels
//             .map((level) => ({
//               ...level,
//               associates: level.associates.filter(
//                 (assoc) => assoc.id !== associateId
//               ),
//               lowerLevels: level.lowerLevels
//                 ? removeAssociate(level.lowerLevels)
//                 : [],
//             }))
//             .filter(
//               (level) =>
//                 level.associates.length > 0 ||
//                 (level.lowerLevels && level.lowerLevels.length > 0)
//             );
//         setLevels((prev) => removeAssociate(prev));
//         setOriginalLevels((prev) => removeAssociate(prev));
//         setExpandedRows((prev) => prev.filter((id) => id !== associateId));
//       } else {
//         alert("Failed to delete associate: " + res.message);
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("API request failed: " + error.message);
//     }
//   };

//   // Handle searching
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.trim().length === 0) {
//         handleSearch();
//       } else if (searchQuery.trim().length > 2) {
//         handleSearch();
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const handleSearch = async () => {
//     const trimmed = searchQuery.trim().toLowerCase();
//     if (trimmed.length === 0) {
//       setLevels(originalLevels);
//       return;
//     }
//     try {
//       setLoading(true);
//       if (originalLevels.length === 0) {
//         const res = await fetchDataFromApi("/tree");
//         setOriginalLevels(res.levels || []);
//       }
//       const allLevels = originalLevels.length > 0 ? originalLevels : (await fetchDataFromApi("/tree")).levels || [];
//       // filter recursive
//       const filterRecursive = (levels) => {
//         const result = [];
//         for (const level of levels) {
//           const matchedAssociates = level.associates.filter((assoc) => {
//             const name = assoc.associaateName?.toLowerCase() || "";
//             const email = assoc.associaateEmail?.toLowerCase() || "";
//             return name.includes(trimmed) || email.includes(trimmed);
//           });
//           if (matchedAssociates.length > 0) {
//             result.push({
//               ...level,
//               associates: matchedAssociates,
//               lowerLevels: level.lowerLevels || [],
//             });
//           } else {
//             const filteredLowerLevels = level.lowerLevels ? filterRecursive(level.lowerLevels) : [];
//             if (filteredLowerLevels.length > 0) {
//               result.push({
//                 ...level,
//                 associates: matchedAssociates,
//                 lowerLevels: filteredLowerLevels,
//               });
//             }
//           }
//         }
//         return result;
//       };
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
//         console.log("data: ",data);

//         setLevels(data);
//         setOriginalLevels(data);
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
//     setExpandedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
//   };

//   const updateCommissionInLevels = (levelsArr, userId, newPercent) => {
//     return levelsArr.map((level) => ({
//       ...level,
//       associates: level.associates.map((assoc) =>
//         assoc.id === userId ? { ...assoc, totalCommissionInPercent: newPercent } : assoc
//       ),
//       lowerLevels: level.lowerLevels
//         ? updateCommissionInLevels(level.lowerLevels, userId, newPercent)
//         : undefined,
//     }));
//   };

//   const handleCommissionUpdate = (userId, newPercent) => {
//     setLevels((prevLevels) => updateCommissionInLevels(prevLevels, userId, newPercent));
//     setOriginalLevels((prevLevels) => updateCommissionInLevels(prevLevels, userId, newPercent));
//   };

//   useEffect(() => {
//     setExpandedRows([]);
//   }, [levels]);

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
//         <div className="header-flex">
//           <div className="search-section2">
//             <div className="search-container2">
//               <input
//                 type="text"
//                 placeholder="Search associate name..."
//                 className="search-input2"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               />
//               <button className="search-button2" onClick={handleSearch}>
//                 <Search size={18} />
//               </button>
//             </div>
//           </div>
//           <div className="add-btnnn">
//             <Link to="/addAssociate">
//               <button>Add +</button>
//             </Link>
//           </div>
//         </div>
//       </header>
//       <div className="lwuser-table-container">
//         <div className="lwuser-table-wrapper" tabIndex={0} aria-label="Referral network table">
//           <table className="lwuser-table" role="table" aria-describedby="table-desc">
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
//                   const originalLvl = originalLevels.find((orig) => orig.level === lvl.level);
//                   return (
//                     <LevelRow
//                       key={lvl.level + "-top"}
//                       levelData={lvl}
//                       originalLevelData={originalLvl}
//                       expandedRows={expandedRows}
//                       toggleExpand={toggleExpand}
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
