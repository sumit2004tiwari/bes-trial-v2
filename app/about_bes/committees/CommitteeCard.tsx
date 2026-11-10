import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

interface CommitteeData {
  id: number;
  nameOfCommitees: string;
  chairman?: string;
  coChairman?: string;
  email?: string;
}

interface CommitteeCardProps {
  item: CommitteeData;
  index: number;
}

export default function CommitteeCard({ item, index }: CommitteeCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" className="font-bold text-[#142b45] mb-2">
          {index + 1}. {item.nameOfCommitees}
        </Typography>
        <div className="space-y-1">
          {item?.chairman && (
            <Typography variant="body2">
              <strong>Chairman:</strong> {item.chairman}
            </Typography>
          )}
          {item?.coChairman && (
            <Typography variant="body2">
              <strong>Co-Chairman:</strong> {item.coChairman}
            </Typography>
          )}
          {item?.email && (
            <Typography variant="body2">
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${item.email}`} className="text-blue-600">
                {item.email}
              </Link>
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
