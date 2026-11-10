import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import Link from "next/link";

interface ChapterData {
  id: number;
  chapter: string;
  chairman?: string;
  secretary?: string;
  treasurer?: string;
  mobile?: string;
  email?: string;
}

interface ChapterTableProps {
  data: ChapterData[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => {
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
    },
  };
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ChapterTable({ data }: ChapterTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>S.No</StyledTableCell>
          <StyledTableCell>Chapter</StyledTableCell>
          <StyledTableCell>Chairperson</StyledTableCell>
          <StyledTableCell>Hon. Secretary</StyledTableCell>
          <StyledTableCell>Hon. Treasurer</StyledTableCell>
          <StyledTableCell>Mobile No.</StyledTableCell>
          <StyledTableCell>Email</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <StyledTableRow key={item.id}>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{item.chapter}</StyledTableCell>
            <StyledTableCell>{item?.chairman}</StyledTableCell>
            <StyledTableCell>{item?.secretary}</StyledTableCell>
            <StyledTableCell>{item?.treasurer}</StyledTableCell>
            <StyledTableCell>{item?.mobile}</StyledTableCell>
            <StyledTableCell>
              {item?.email ? (
                <Link href={`mailto:${item.email}`}>{item.email}</Link>
              ) : (
                ""
              )}
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}
