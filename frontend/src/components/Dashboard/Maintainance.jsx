import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Maintenance = () => {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [maintenanceTime, setMaintenanceTime] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [partsUsed, setPartsUsed] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [assetStatus, setAssetStatus] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = "http://localhost:5000/api/maintenance";

  // Fetch maintenance history on component mount
  useEffect(() => {
    fetchMaintenanceHistory();
    fetchMaintenanceSummary();
  }, []);

  const fetchMaintenanceHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch maintenance history");
      }
      const data = await response.json();
      setMaintenanceHistory(data);
    } catch (err) {
      setError("Error fetching maintenance history: " + err.message);
      console.error("Error fetching maintenance history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaintenanceSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/summary/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch maintenance summary");
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching maintenance summary:", err);
    }
  };

  const resetForm = () => {
    setSelectedAsset("");
    setMaintenanceDate("");
    setMaintenanceTime("");
    setMaintenanceType("");
    setTechnicianName("");
    setServiceCost("");
    setPartsUsed("");
    setWorkDescription("");
    setNextServiceDate("");
    setAssetStatus("");
    setEditingRecord(null);
    setIsEditing(false);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditing(true);
    setSelectedAsset(`${record.assetTag} - ${record.assetName}`);
    setMaintenanceDate(record.maintenanceDate.split("T")[0]); // Extract date part
    setMaintenanceTime(record.maintenanceTime);
    setMaintenanceType(record.maintenanceType);
    setTechnicianName(record.technicianName);
    setServiceCost(record.serviceCost.toString());
    setPartsUsed(record.partsUsed || "");
    setWorkDescription(record.workDescription);
    setNextServiceDate(
      record.nextServiceDate ? record.nextServiceDate.split("T")[0] : ""
    );
    setAssetStatus(record.assetStatus);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !selectedAsset ||
      !maintenanceDate ||
      !maintenanceTime ||
      !maintenanceType ||
      !technicianName ||
      !serviceCost ||
      !workDescription ||
      !assetStatus
    ) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      // Create maintenance record payload
      const maintenanceData = {
        assetTag: selectedAsset.split(" - ")[0],
        assetName:
          selectedAsset.split(" - ")[1]?.split(" (")[0] || "Unknown Asset",
        maintenanceDate,
        maintenanceTime,
        technicianName,
        maintenanceType,
        serviceCost: parseFloat(serviceCost),
        partsUsed: partsUsed || null,
        workDescription,
        nextServiceDate: nextServiceDate || null,
        assetStatus,
      };

      let response;
      if (isEditing && editingRecord) {
        // Update existing record
        response = await fetch(
          `${API_BASE}/${editingRecord.id || editingRecord._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(maintenanceData),
          }
        );
      } else {
        // Create new record
        response = await fetch(API_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(maintenanceData),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "log"} maintenance`
        );
      }

      const result = await response.json();

      // Refresh the maintenance history and summary
      await fetchMaintenanceHistory();
      await fetchMaintenanceSummary();

      // Reset form
      resetForm();

      toast.success(`Maintenance ${isEditing ? "updated" : "logged"} successfully!`);
    } catch (err) {
      setError(
        `Error ${isEditing ? "updating" : "logging"} maintenance: ` +
          err.message
      );
      toast.error(`Failed to ${isEditing ? "update" : "log"} maintenance: ${err.message}`);
      console.error(
        `Error ${isEditing ? "updating" : "logging"} maintenance:`,
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMaintenanceRecord = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this maintenance record?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete maintenance record");
      }

      // Refresh the maintenance history and summary
      await fetchMaintenanceHistory();
      await fetchMaintenanceSummary();
      toast.success("Maintenance record deleted successfully!");
    } catch (err) {
      setError("Error deleting maintenance record: " + err.message);
      toast.error(`Failed to delete maintenance record: ${err.message}`);
      console.error("Error deleting maintenance record:", err);
    }
  };

  const MaintenanceHistoryComponent = () => (
    <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg border border-gray-200 mb-8 animate-slideIn hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <span>📋</span>
          <span>Maintenance History</span>
        </h2>
        <button
          onClick={() => setShowHistory(false)}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 hover:scale-105 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          ✕ Close
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance history...</p>
        </div>
      ) : maintenanceHistory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-lg">No maintenance records yet</p>
          <p className="text-sm">
            Create your first maintenance log to see it here
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 animate-countUp">
                {summary?.totalRecords || maintenanceHistory.length}
              </h3>
              <p className="text-sm sm:text-base text-blue-700 font-medium">Total Maintenance Logs</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-green-900 animate-countUp">
                ₹
                {summary?.totalCost ||
                  maintenanceHistory.reduce(
                    (total, log) => total + (log.serviceCost || 0),
                    0
                  )}
              </h3>
              <p className="text-sm sm:text-base text-green-700 font-medium">Total Cost</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-900 animate-countUp">
                {summary?.followUpNeeded ||
                  maintenanceHistory.filter(
                    (log) => log.assetStatus === "Needs Follow-up"
                  ).length}
              </h3>
              <p className="text-sm sm:text-base text-yellow-700 font-medium">Follow-up Needed</p>
            </div>
          </div>

          {/* Maintenance Records Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Asset</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Technician</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Cost</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((log, index) => (
                  <tr
                    key={log.id || log._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-200 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{log.assetTag}</div>
                      <div className="text-sm text-gray-500">
                        {log.assetName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {new Date(log.maintenanceDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.maintenanceTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{log.technicianName}</td>
                    <td className="px-6 py-4">{log.maintenanceType}</td>
                    <td className="px-6 py-4 font-semibold">₹{log.serviceCost}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          log.assetStatus === "Fully Operational"
                            ? "bg-green-100 text-green-800"
                            : log.assetStatus === "Needs Follow-up"
                            ? "bg-yellow-100 text-yellow-800"
                            : log.assetStatus === "Requires Replacement"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.assetStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(log)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                          title="Edit Record"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            deleteMaintenanceRecord(log.id || log._id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                          title="Delete Record"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200 mb-8 animate-slideDown hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <span className="animate-bounce">🔧</span>
                <span>
                  {isEditing ? "Edit Maintenance Record" : "Maintenance"}
                </span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                {isEditing
                  ? "Update maintenance record details"
                  : "Record repair activity and maintenance logs"}
              </p>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <span>📋</span>
              <span>{showHistory ? "Hide History" : "View History"}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center space-x-2 shadow-lg">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Edit Mode Alert */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-xl mb-8 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <span>ℹ️</span>
              <span>You are editing a maintenance record</span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Cancel Edit
            </button>
          </div>
        )}

        {/* Show History if toggled */}
        {showHistory && <MaintenanceHistoryComponent />}

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg border border-gray-200 animate-slideUp hover:shadow-xl transition-shadow duration-300">
          {/* Recording Info */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8 transform hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              What to record in maintenance:
            </h3>
            <div className="text-sm sm:text-base text-gray-700 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Asset details and identification</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Date and time of service</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Type of maintenance work performed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Technician information</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Parts used and replaced</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">•</span>
                <span>Service cost and next due date</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Asset Selection */}
              <div className="animate-fadeIn">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Select Asset *
                </label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                  required
                >
                  <option value="">Choose an asset...</option>
                  {/* <option value="">Choose an asset...</option> */}
                  <option value="Laptop">Laptop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Printer">Printer</option>
                </select>
              </div>

              {/* Date and Time */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn"
                style={{ animationDelay: "100ms" }}
              >
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                    Maintenance Date *
                  </label>
                  <input
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={maintenanceTime}
                    onChange={(e) => setMaintenanceTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                    required
                  />
                </div>
              </div>

              {/* Maintenance Type */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Maintenance Type *
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                  required
                >
                  <option value="">Select maintenance type...</option>
                  <option value="Routine Inspection">Routine Inspection</option>
                  <option value="Repair Work">Repair Work</option>
                  <option value="Cleaning Service">Cleaning Service</option>
                  <option value="Parts Replacement">Parts Replacement</option>
                  <option value="Software Update">Software Update</option>
                  <option value="Calibration">Calibration</option>
                </select>
              </div>

              {/* Technician and Cost */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn"
                style={{ animationDelay: "300ms" }}
              >
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                    Technician Name *
                  </label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    placeholder="Enter technician name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                    Service Cost *
                  </label>
                  <input
                    type="number"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                    required
                  />
                </div>
              </div>

              {/* Parts Used */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "400ms" }}
              >
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Parts Used
                </label>
                <textarea
                  value={partsUsed}
                  onChange={(e) => setPartsUsed(e.target.value)}
                  placeholder="List any parts that were replaced or used during maintenance..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 hover:border-orange-300 text-base"
                />
              </div>

              {/* Work Description */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "500ms" }}
              >
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Work Description *
                </label>
                <textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Describe the maintenance work performed..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 hover:border-orange-300 text-base"
                  required
                />
              </div>

              {/* Next Service Date */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "600ms" }}
              >
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Next Service Due
                </label>
                <input
                  type="date"
                  value={nextServiceDate}
                  onChange={(e) => setNextServiceDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                />
              </div>

              {/* Asset Status */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "700ms" }}
              >
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                  Asset Status After Service *
                </label>
                <select
                  value={assetStatus}
                  onChange={(e) => setAssetStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-base"
                  required
                >
                  <option value="">Select status...</option>
                  <option value="Fully Operational">Fully Operational</option>
                  <option value="Needs Follow-up">Needs Follow-up</option>
                  <option value="Requires Replacement">
                    Requires Replacement
                  </option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>

              {/* Submit Button */}
              <div
                className="pt-6 animate-fadeIn flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                style={{ animationDelay: "800ms" }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform disabled:scale-100 shadow-lg hover:shadow-xl text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>{isEditing ? "Updating..." : "Logging..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEditing ? "✏️" : "🔧"}</span>
                      <span>
                        {isEditing ? "Update Maintenance" : "Log Maintenance"}
                      </span>
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform shadow-lg hover:shadow-xl text-base"
                  >
                    <span>❌</span>
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-countUp {
          animation: countUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
