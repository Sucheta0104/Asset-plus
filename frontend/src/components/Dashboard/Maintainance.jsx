import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit2, Trash2 } from 'lucide-react';

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
    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl shadow-lg border border-gray-200 mb-4 sm:mb-6 md:mb-8 animate-slideIn hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <span>📋</span>
          <span>Maintenance History</span>
        </h2>
        <button
          onClick={() => setShowHistory(false)}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 hover:scale-105 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
        >
          ✕ Close
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 sm:border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading maintenance history...</p>
        </div>
      ) : maintenanceHistory.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <div className="text-4xl sm:text-6xl mb-4">🔧</div>
          <p className="text-base sm:text-lg">No maintenance records yet</p>
          <p className="text-xs sm:text-sm">
            Create your first maintenance log to see it here
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 animate-countUp">
                {summary?.totalRecords || maintenanceHistory.length}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-blue-700 font-medium">Total Maintenance Logs</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 animate-countUp">
                ₹
                {summary?.totalCost ||
                  maintenanceHistory.reduce(
                    (total, log) => total + (log.serviceCost || 0),
                    0
                  )}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-blue-700 font-medium">Total Cost</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 shadow-sm sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 animate-countUp">
                {summary?.followUpNeeded ||
                  maintenanceHistory.filter(
                    (log) => log.assetStatus === "Needs Follow-up"
                  ).length}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-blue-700 font-medium">Follow-up Needed</p>
            </div>
          </div>

          {/* Maintenance Records Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="min-w-full">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                {maintenanceHistory.map((log, index) => (
                  <div
                    key={log.id || log._id}
                    className="bg-white border-b border-gray-200 p-4 space-y-3 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{log.assetTag}</div>
                        <div className="text-xs text-gray-500">{log.assetName}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="Edit Record"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMaintenanceRecord(log.id || log._id)}
                          className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <div className="font-medium">
                          {new Date(log.maintenanceDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <div className="font-medium">{log.maintenanceTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Technician:</span>
                        <div className="font-medium">{log.technicianName}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium">{log.maintenanceType}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <div className="font-semibold">₹{log.serviceCost}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="text-gray-700 font-medium text-sm">
                          {log.assetStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="hidden sm:table w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Asset</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Date & Time</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Technician</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Type</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Cost</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.map((log, index) => (
                    <tr
                      key={log.id || log._id}
                      className="border-b hover:bg-gray-50 transition-colors duration-200 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">{log.assetTag}</div>
                        <div className="text-xs text-gray-500">
                          {log.assetName}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="font-medium text-xs sm:text-sm">
                          {new Date(log.maintenanceDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.maintenanceTime}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">{log.technicianName}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm">{log.maintenanceType}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm">₹{log.serviceCost}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 font-medium text-xs sm:text-sm">
                        {log.assetStatus}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex space-x-2 sm:space-x-3">
                          <button
                            onClick={() => handleEdit(log)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Edit Record"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteMaintenanceRecord(log.id || log._id)}
                            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="bg-blue-100 rounded-xl shadow-2xl border border-blue-100 p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8 animate-slideIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-2 flex items-center space-x-2">
                <span className="animate-bounce">🔧</span>
                <span>
                  {isEditing ? "Edit Maintenance Record" : "Maintenance"}
                </span>
              </h1>
              <p className="text-blue-700 text-sm sm:text-base md:text-lg animate-slideUp">
                {isEditing
                  ? "Update maintenance record details"
                  : "Record repair activity and maintenance logs"}
              </p>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 transform shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base w-full sm:w-auto justify-center"
            >
              <span>📋</span>
              <span>{showHistory ? "Hide History" : "View History"}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl mb-4 sm:mb-6 md:mb-8 flex items-start space-x-2 shadow-lg">
            <span className="flex-shrink-0">⚠️</span>
            <span className="flex-1 text-sm sm:text-base">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Edit Mode Alert */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 shadow-lg">
            <div className="flex items-center space-x-2">
              <span>ℹ️</span>
              <span className="text-sm sm:text-base">You are editing a maintenance record</span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              Cancel Edit
            </button>
          </div>
        )}

        {/* Show History if toggled */}
        {showHistory && <MaintenanceHistoryComponent />}

        {/* Main Card */}
        <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl shadow-lg border border-gray-200 animate-slideUp hover:shadow-xl transition-shadow duration-300">
          {/* Recording Info */}
          <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 md:p-6 rounded-xl mb-4 sm:mb-6 md:mb-8 transform hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              What to record in maintenance:
            </h3>
            <div className="text-xs sm:text-sm md:text-base text-gray-700 space-y-1 sm:space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Asset details and identification</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Date and time of service</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Type of maintenance work performed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Technician information</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Parts used and replaced</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>Service cost and next due date</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Asset Selection */}
              <div className="animate-fadeIn">
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Select Asset *
                </label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                  required
                >
                  <option value="">Choose an asset...</option>
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
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 animate-fadeIn"
                style={{ animationDelay: "100ms" }}
              >
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Maintenance Date *
                  </label>
                  <input
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={maintenanceTime}
                    onChange={(e) => setMaintenanceTime(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Maintenance Type */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Maintenance Type *
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                  required
                >
                  <option value="">Select maintenance type...</option>
                  <option value="Preventive">Preventive Maintenance</option>
                  <option value="Corrective">Corrective Maintenance</option>
                  <option value="Emergency">Emergency Repair</option>
                  <option value="Routine">Routine Check</option>
                  <option value="Upgrade">Upgrade/Replacement</option>
                </select>
              </div>

              {/* Technician Name */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "300ms" }}
              >
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Technician Name *
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                  placeholder="Enter technician name"
                  required
                />
              </div>

              {/* Service Cost and Parts Used */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 animate-fadeIn"
                style={{ animationDelay: "400ms" }}
              >
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Service Cost (₹) *
                  </label>
                  <input
                    type="number"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Parts Used
                  </label>
                  <input
                    type="text"
                    value={partsUsed}
                    onChange={(e) => setPartsUsed(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                    placeholder="Enter parts used (optional)"
                  />
                </div>
              </div>

              {/* Work Description */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "500ms" }}
              >
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Work Description *
                </label>
                <textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                  placeholder="Describe the maintenance work performed..."
                  rows="4"
                  required
                />
              </div>

              {/* Next Service Date and Asset Status */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 animate-fadeIn"
                style={{ animationDelay: "600ms" }}
              >
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    value={nextServiceDate}
                    onChange={(e) => setNextServiceDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Asset Status *
                  </label>
                  <select
                    value={assetStatus}
                    onChange={(e) => setAssetStatus(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 text-xs sm:text-sm md:text-base"
                    required
                  >
                    <option value="">Select status...</option>
                    <option value="Working">Working</option>
                    <option value="Needs Follow-up">Needs Follow-up</option>
                    <option value="Out of Service">Out of Service</option>
                    <option value="Under Warranty">Under Warranty</option>
                    <option value="Replaced">Replaced</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fadeIn"
                style={{ animationDelay: "700ms" }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform shadow-lg hover:shadow-xl disabled:hover:scale-100 text-sm sm:text-base md:text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span>
                        {isEditing ? "Updating..." : "Logging..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>
                        {isEditing ? "Update Record" : "Log Maintenance"}
                      </span>
                    </>
                  )}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
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
    </div>
  );
};

export default Maintenance;