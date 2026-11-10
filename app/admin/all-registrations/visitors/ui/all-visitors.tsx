"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { formatPhoneWithCountry } from "../../lib/format-phone";

interface Visitor {
  _id: string;
  name: string;
  organisation: string;
  email: string;
  mobile: string;
  area_of_work: string;
  unique_reference_number: string;
  createdAt: string;
}

interface AllVisitorsProps {
  db: Visitor[];
}

export default function AllVisitors({ db }: AllVisitorsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDateIST = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredVisitors = useMemo(() => {
    if (!searchTerm) return db;
    return db.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [db, searchTerm]);

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Organisation",
      "Email",
      "Mobile",
      "Area of Work",
      "Reference No.",
      "Registration Date",
    ];

    const csvData = db.map((visitor) => [
      visitor.name,
      visitor.organisation,
      visitor.email,
      visitor.mobile,
      visitor.area_of_work,
      visitor.unique_reference_number,
      formatDateIST(visitor.createdAt),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `visitors_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          All Visitors ({filteredVisitors.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={downloadCSV}
          disabled={db.length === 0}
        >
          Download CSV
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center">
                <strong>Name</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Organisation</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Email</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Mobile</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Area of Work</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Reference No.</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Registration Date</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVisitors.map((visitor) => (
              <TableRow
                key={visitor.unique_reference_number || visitor.email}
                hover
              >
                <TableCell align="center">{visitor.name}</TableCell>
                <TableCell align="center">{visitor.organisation}</TableCell>
                <TableCell align="center">{visitor.email}</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {formatPhoneWithCountry(visitor.mobile)}
                </TableCell>
                <TableCell align="center">{visitor.area_of_work}</TableCell>
                <TableCell align="center">{visitor.unique_reference_number}</TableCell>
                <TableCell align="center">
                  {formatDateIST(visitor.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {filteredVisitors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No visitors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
