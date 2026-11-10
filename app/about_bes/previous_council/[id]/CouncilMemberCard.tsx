import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

interface CouncilMemberData {
  id: number;
  name: string;
  design: string;
  email?: string;
  img?: string;
}

interface CouncilMemberCardProps {
  item: CouncilMemberData;
  index: number;
  councilData: string;
}

export default function CouncilMemberCard({ item, index, councilData }: CouncilMemberCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <div className="flex items-center space-x-3">
          {item?.img && (
            <img
              src={`/Images/previous_council/${councilData}/${item.img}`}
              alt={item.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div className="flex-grow">
            <Typography variant="h6" className="font-bold text-[#142b45] mb-1">
              {index + 1}. {item.name}
            </Typography>
            <Typography variant="body2" className="mb-1">
              <strong>Designation:</strong> {item.design}
            </Typography>
            {item?.email && (
              <Typography variant="body2">
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${item.email}`} className="text-blue-600">
                  {item.email}
                </Link>
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
