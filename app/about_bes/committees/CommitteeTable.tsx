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

interface CommitteeData {
  id: number;
  nameOfCommitees: string;
  chairman?: string;
  coChairman?: string;
  email?: string;
}

interface CommitteeTableProps {
  data: CommitteeData[];
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

export default function CommitteeTable({ data }: CommitteeTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>S.No</StyledTableCell>
          <StyledTableCell>Name of Committees</StyledTableCell>
          <StyledTableCell>Chairman</StyledTableCell>
          <StyledTableCell>Co-Chairman</StyledTableCell>
          <StyledTableCell>Email</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <StyledTableRow key={item.id}>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{item.nameOfCommitees}</StyledTableCell>
            <StyledTableCell>{item?.chairman}</StyledTableCell>
            <StyledTableCell>{item?.coChairman}</StyledTableCell>
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
