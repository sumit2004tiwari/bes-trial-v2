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
export default function FeeDetails() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Participation Fee </h2>
      <br />
      <h4 className="font-bold text-xl">
        Participation fee for space in BES EXPO 2027 in the shell, raw-space &
        open-space schemes is as follows
      </h4>
      <br />
      <div className="flex gap-12">
        <div className="min-w-0 w-full">
          <div>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow className="border-black">
                  <StyledTableCell className="font-bold text-1xl">
                    Category
                  </StyledTableCell>
                  <StyledTableCell className="font-bold text-1xl">
                    Shell Scheme
                  </StyledTableCell>
                  <StyledTableCell className="font-bold text-1xl">
                    Raw Space
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="border-black">
                  <StyledTableCell className="font-bold text-1xl">
                    Foreign Exhibitor (US$ Per sqm)
                  </StyledTableCell>
                  <StyledTableCell>375/-</StyledTableCell>
                  <StyledTableCell>300/-</StyledTableCell>
                </TableRow>
                <TableRow className="border-black">
                  <StyledTableCell className="font-bold text-1xl">
                    Indian Exhibitor (Rs Per sqm)
                  </StyledTableCell>
                  <StyledTableCell>14500/-</StyledTableCell>
                  <StyledTableCell>13500/-</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          {/* <h5 className="font-bold text-[20px] mt-4">
            - For Booking up to 1st December 2024 to 31st January 2025
          </h5>
          <div px={2}>
            <Table border="1">
              <TableHead>
                <TableRow>
                  <StyledTableCell className="font-bold text-1xl">
                    Types of Participants
                  </StyledTableCell>
                  <StyledTableCell className="font-bold text-1xl">
                    Indoor Shell(std)
                  </StyledTableCell>
                  <StyledTableCell className="font-bold text-1xl">
                    Raw Space
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell className="font-bold text-1xl">
                    Exhibitor (in INR)
                  </StyledTableCell>
                  <StyledTableCell>25,000/-</StyledTableCell>
                  <StyledTableCell>20,000/-</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div> */}
        </div>
        {/* <div>
          <h5 className="font-bold " style={{ fontStyle: "italic" }}>
            Foreign companies
          </h5>
          <div>
            <div>
              <i> Scheme: </i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;US$
              375 per sqm <br />
              <i>Raw Space:</i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              US$ 300 per sqm <br />
              <i>Open to sky space:</i> &nbsp;US$ 165 per sqm
              <p></p>
            </div>
          </div>
        </div> */}
      </div>

      <div>
        <strong><br/>1. Minimum space: 9 Sqm (Shell Space)
        <br/>2. Minimum space: 18 Sqm (Raw Space)
        <br/>3. GST @ 18% extra is applicable in all categories of space</strong>
      </div>
    </div>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => {
  return {
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.black,
      textAlign: "center",
      fontSize: 14,
      border: "1px solid #e2e7ec",
    },
    [`&.${tableCellClasses.body}`]: {
      textAlign: "center",
      border: "1px solid #e2e7ec",
    },
  };
});
