import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
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

interface ChapterCardProps {
  item: ChapterData;
  index: number;
}

export default function ChapterCard({ item, index }: ChapterCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" className="font-bold text-[#142b45] mb-2">
          {index + 1}. {item.chapter}
        </Typography>
        <div className="space-y-1">
          {item?.chairman && (
            <Typography variant="body2">
              <strong>Chairperson:</strong> {item.chairman}
            </Typography>
          )}
          {item?.secretary && (
            <Typography variant="body2">
              <strong>Secretary:</strong> {item.secretary}
            </Typography>
          )}
          {item?.treasurer && (
            <Typography variant="body2">
              <strong>Treasurer:</strong> {item.treasurer}
            </Typography>
          )}
          {item?.mobile && (
            <Typography variant="body2">
              <strong>Mobile:</strong> {item.mobile}
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
