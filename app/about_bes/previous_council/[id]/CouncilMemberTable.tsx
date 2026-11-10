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

interface CouncilMemberData {
  id: number;
  name: string;
  design: string;
  email?: string;
  img?: string;
}

interface CouncilMemberTableProps {
  data: CouncilMemberData[];
  councilData: string;
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

export default function CouncilMemberTable({ data, councilData }: CouncilMemberTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>S.No</StyledTableCell>
          <StyledTableCell>Name</StyledTableCell>
          <StyledTableCell>Designation</StyledTableCell>
          <StyledTableCell>Email</StyledTableCell>
          <StyledTableCell>Photos</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <StyledTableRow key={item.id}>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{item.name}</StyledTableCell>
            <StyledTableCell>{item.design}</StyledTableCell>
            <StyledTableCell>
              {item?.email && (
                <Link href={`mailto:${item.email}`}>{item.email}</Link>
              )}
            </StyledTableCell>
            <StyledTableCell>
              {item?.img && (
                <img
                  src={`/Images/previous_council/${councilData}/${item.img}`}
                  alt={item.name}
                  style={{ maxWidth: 90 }}
                />
              )}
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}
