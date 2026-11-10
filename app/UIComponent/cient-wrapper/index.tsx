"use client";
import AuthProvider from "../context-provider/auth-provider";
import MemberDetailsPrompt from "../MemberDetails/MemberDetailsPrompt";
import DesignProvider from "../design/DesignProvider";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesignProvider><AuthProvider>
      {children}
      <MemberDetailsPrompt />
    </AuthProvider></DesignProvider>
  );
}
