"use client";

import React from "react";
import styles from "@/app/about_bes/content.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";

export default function Page() {
  return (
    <div
      className={`flex flex-col max-w-[800px] p-4 ${styles.content_container}`}
    >
      <h2 className="text-[26px] font-bold">Date & Venue</h2>

      <div>
        <p>
          <strong>This year BES EXPO 2027</strong> is being organized in Hall No. 12A
          Bharat Mandapam, New Delhi from 11–13 February 2027. Bharat Mandapam is the biggest exhibition
          venue in India. Centrally located, it is only 10 minutes away from
          Connaught Place, the heart of Delhi. The Inaugural and Conference session for BES Expo-2027 will be held at
          Bharat Mandapam, Pragati Maidan, Delhi. The timings of the exhibition are as
          follows:
        </p>
      </div>

      <div className="px-4">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>(a)</StyledTableCell>
              <StyledTableCell>Inauguration (by Invite)</StyledTableCell>
              <StyledTableCell>11th February 2027</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            

            <TableRow>
              <StyledTableCell>(b)</StyledTableCell>
              <StyledTableCell>Public Days</StyledTableCell>
              <StyledTableCell>
                11th to 13th February 2027 (10:00 – 18:00 hrs)
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <p>
        A company/organization/association booking the space for participation
        will be termed as an Exhibitor.
      </p>
    </div>
  );
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    textAlign: "center",
    border: "1px solid #e2e7ec",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    border: "1px solid #e2e7ec",
  },
}));
