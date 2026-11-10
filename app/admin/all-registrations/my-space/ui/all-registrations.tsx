"use client";
import React, { useState, useMemo, useCallback } from "react";
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

interface Registration {
  name: string;
  organisation: string;
  email: string;
  mobile: string;
  city: string;
  country: string;
  postal_address: string;
  space_sqm: number;
  space_scheme: any;
  total_price_with_gst: number;
  tracking_id: string;
  createdAt: string;
}

interface Props {
  db: Registration[];
}

export default function AllRegistrations({ db }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  /* ======================
     Date formatter
  ====================== */
  const formatDateIST = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  /* ======================
     Search
  ====================== */
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return db;

    const term = searchTerm.toLowerCase();
    return db.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.tracking_id?.toLowerCase().includes(term)
    );
  }, [db, searchTerm]);

  /* ======================
     CSV helpers
  ====================== */
  const escapeCSV = (value: any) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Organisation",
      "Email",
      "Mobile",
      "City",
      "Country",
      "Postal Address",
      "Space (sqm)",
      "Space Scheme",
      "Total Price (GST)",
      "Tracking ID",
      "Created At",
    ];

    const rows = filteredData.map((r) => [
      escapeCSV(r.name),
      escapeCSV(r.organisation),
      escapeCSV(r.email),
      escapeCSV(r.mobile),
      escapeCSV(r.city),
      escapeCSV(r.country),
      escapeCSV(r.postal_address),
      escapeCSV(r.space_sqm),
      escapeCSV(r?.space_scheme?.name),
      escapeCSV(r.total_price_with_gst),
      escapeCSV(r.tracking_id),
      escapeCSV(formatDateIST(r.createdAt)),
    ]);

    const csv = [headers.map(escapeCSV), ...rows]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `book_my_space_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">
          Space Registrations ({filteredData.length})
        </Typography>

        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={downloadCSV}
          disabled={filteredData.length === 0}
        >
          Download CSV
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by name, email, or tracking ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "Name",
                "Organisation",
                "Email",
                "Mobile",
                "City",
                "Country",
                "Space (sqm)",
                "Scheme",
                "Total ₹ (GST)",
                "Tracking ID",
                "Created At",
              ].map((h) => (
                <TableCell key={h} align="center">
                  <strong>{h}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.tracking_id} hover>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.organisation}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  {formatPhoneWithCountry(row.mobile)}
                </TableCell>
                <TableCell align="center">{row.city}</TableCell>
                <TableCell align="center">{row.country}</TableCell>
                <TableCell align="center">{row.space_sqm}</TableCell>
                <TableCell align="center">{row?.space_scheme?.name}</TableCell>
                <TableCell align="center">₹{row.total_price_with_gst}</TableCell>
                <TableCell align="center">{row.tracking_id}</TableCell>
                <TableCell align="center">
                  {formatDateIST(row.createdAt)}
                </TableCell>
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No registrations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
